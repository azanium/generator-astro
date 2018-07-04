'user strict';

const Generator = require('yeoman-generator');
var camelize = require('underscore.string/camelize');
var underscored = require('underscore.string/underscored');
var recast = require('recast');
var _ = require('lodash');
var rimraf = require('rimraf');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.projectname = this.config.get('name');
    this.apiversion = this.config.get('apiversion');
  }

  prompting() {
    var done = this.async();
    var that = this;

    this.prompt([
      {
        type:     'input',
        name:     'name',
        message:  'What is your API endpoint name?',
        default:  this.config.get('last_endpoint') || 'endpoint'
      },
      {
        type:     'input',
        name:     'apidesc',
        message:  'Please give API description for documentation!',
        default:  this.config.get('last_apidesc') || 'description'
      },
      {
        type:     'list',
        name:     'method',
        message:  'API Method?',
        default:  this.config.get('last_method') || 'post',
        choices:  ['get', 'post', 'put', 'delete']
      }
    ]).then(answers => {
      that.props = answers;
      that.props.injectRoute = false;
      that.props.apibase = that.config.get('apibase');
      that.props.apiversion = that.config.get('apiversion');
      that.props.endpoint = `${that.props.name}`;
      that.props.name = camelize(that.props.name, true);
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.upperMethod = that.props.method.toUpperCase();
  

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_endpoint', that.props.endpoint);
        this.config.set('last_apidesc', that.props.apidesc);
        this.config.set('last_method', that.props.method);
        this.config.set('apibase', that.props.apibase);
        this.config.set('apiversion', that.props.apiversion);
      });  

      done();
    }) 
  }

  writing() {
    var done = this.async();
    var props = this.props;
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    const controllerName = `${props.filename}.controller.js`;
    const validationName = `${props.filename}.validation.js`;
    const integrationName = `${props.filename}.integration.test.js`;
    const testName = `${props.filename}.spec.js`;
    const apiPath = `src/api/${this.apiversion}/${props.filename}`;
    
    /**
     * Controller
     */
    if (!this.fs.exists(dPath(`${apiPath}/${controllerName}`))) {
      copyTpl(tPath('_controller.ejs'), dPath(`${apiPath}/${controllerName}`), props);
    }

    /**
     * Route
     */
    if (!this.fs.exists(dPath(`${apiPath}/index.hs`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${apiPath}/index.js`), props);
    }
    
    /**
     * Validation
     */
    if (!this.fs.exists(dPath(`${apiPath}/${validationName}`))) {
      copyTpl(tPath('_validation.ejs'), dPath(`${apiPath}/${validationName}`), props);
    }

    /**
     * Unit Test
     */
    if (!this.fs.exists(dPath(`${apiPath}/${testName}`))) {
      copyTpl(tPath('_spec.ejs'), dPath(`${apiPath}/${testName}`), props);
    }

    /**
     * Integration Test
     */
    if (!this.fs.exists(dPath(`${apiPath}/${integrationName}`))) {
      copyTpl(tPath('_integration.ejs'), dPath(`${apiPath}/${integrationName}`), props);
    }

    done();
  } 

  injectApiRoutes() {
    // var done = this.async();

    var props = this.props;
    var dPath = this.destinationPath.bind(this);

    const routeName = `${props.filename}`;
    const routeFile = dPath(`src/api/${this.apiversion}/index.js`);

    /**
     * Inject codes
     */
    
    if (this.fs.exists(routeFile)) {

      var ast = recast.parse(this.fs.read(routeFile));
      var body = ast.program.body;

      var injectRequire = true;
      var injectRouterUse = true;

      /**
       * Route require injection to index.js
       */
      recast.visit(ast, {
        visitVariableDeclaration: function(path) {
          
          const declarations = path.node.declarations

          // Check for const = require variable declaration
          if (declarations.length > 0) {
            let decl = declarations[0]
            var arg = decl.init.arguments.length > 0 ? decl.init.arguments[0].value : '';

            if (decl.id.name.trim() === `${props.name}Route` && arg.trim() === `./${routeName}`) {
              // We found that const route = require('') already exist, so prevent from re-injecting
              injectRequire = false;
              return false;
            }
          }          
          this.traverse(path);
        },

        visitCallExpression: function(path) {
          const callee = path.node.callee;
          if (callee.type === 'MemberExpression') {
            const args = path.node.arguments;
            const validFirstArgument = args.length > 0 && args[0].type === 'Literal' && args[0].value === `/${props.name}`;
            const validSecondArgument = args.length > 1 && args[1].type === 'Identifier' && args[1].name === `${props.name}Route`;
            const isValid = callee.object.name === 'router' && callee.property.name === 'use' && validFirstArgument && validSecondArgument;
            if (isValid) {
              injectRouterUse = !isValid
              return false;
            }
          }
          this.traverse(path);
        }
      });

      // Inject const = require()
      let lastImportIndex;
      if (injectRequire) {
        lastImportIndex = _.findLastIndex(body, function(statement) {
          return statement.type === 'VariableDeclaration';
        });
        var actualImportCode = recast.print(body[lastImportIndex]).code;
        var importString = ['const ', props.name, 'Route = require(\'./', routeName, '\');'].join('');
        
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 1, importString);
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 0, actualImportCode);
      }

      ast = recast.parse(recast.print(ast).code);
      body = ast.program.body;

      /**
       * Inject router.use() expression
       */
      if (injectRouterUse) {
        var middlewareString = ['router.use(\'/', props.endpoint, '\', ', props.name, 'Route);'].join('');
        var lastMiddlewareIndex = _.findLastIndex(body, function (statement) {
          if (!statement.expression || !statement.expression.callee) {
            return false;
          }
          var callee = statement.expression.callee;
          return callee.object.name === 'router' && callee.property.name === 'use';
        });

        if (lastMiddlewareIndex === -1) {
          var exportRouterIndex = _.findIndex(body, function (statement) {
            return statement.type === 'ExpressionStatement' && statement.expression.right.name === 'router';
          });
          body.splice(exportRouterIndex < 0 ? lastImportIndex : exportRouterIndex, 0, middlewareString);
        } else {
          var actualMiddlewareCode = recast.print(body[lastMiddlewareIndex]).code;
          body.splice(lastMiddlewareIndex < 0 ? lastImportIndex : lastMiddlewareIndex, 1, middlewareString);
          body.splice(lastMiddlewareIndex < 0 ? lastImportIndex : lastMiddlewareIndex, 0, actualMiddlewareCode);
        }
      }

      if (injectRouterUse || injectRequire) {
        rimraf(routeFile, () => {
          this.fs.write(routeFile, recast.print(ast).code);
        })
      }
    }
  }
}