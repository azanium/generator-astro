'user strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const shelljs = require('shelljs');
const path = require('path');
var humanize = require('underscore.string/humanize');
var slugify = require('underscore.string/slugify');
var camelize = require('underscore.string/camelize');
var mkdirp = require('mkdirp');
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
        name:     'apigroup',
        message:  'What is your API group name?',
        default:  this.config.get('last_apigroup') || 'apigroup'
      },
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

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_apigroup', that.props.apigroup);
        this.config.set('last_endpoint', that.props.name);
        this.config.set('last_apidewsc', that.props.apidesc);
        this.config.set('last_method', that.props.method);
      });  

      done();
    }) 
  }

  writing() {
    var that = this;
    var done = this.async();
    var props = this.props;
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    const name = props.name.toLowerCase();
    const apigroup = props.apigroup.toLowerCase();
    const controllerName = `${apigroup}.controller.js`;
    const routeName = `${apigroup}.route.js`;
    const validationName = `${apigroup}.validation.js`;
    const testName = `${apigroup}.test.js`;

    /**
     * Controller
     */
    if (!this.fs.exists(dPath(`src/api/controllers/${controllerName}`))) {
      copyTpl(tPath('_controller.js'), dPath(`src/api/controllers/${controllerName}`), props);
    }

    /**
     * Route
     */
    if (!this.fs.exists(dPath(`src/api/routes/${this.apiversion}/${routeName}`))) {
      copyTpl(tPath('_route.js'), dPath(`src/api/routes/${this.apiversion}/${routeName}`), props);
    }
    
    /**
     * Validation
     */
    if (!this.fs.exists(dPath(`src/api/validations/${validationName}`))) {
      copyTpl(tPath('_validation.js'), dPath(`src/api/validations/${validationName}`), props);
    }

    /**
     * Integration Test
     */
    if (!this.fs.exists(dPath(`src/api/tests/integration/${testName}`))) {
      copyTpl(tPath('_test.js'), dPath(`src/api/tests/integration/${testName}`), props);
    }

    done();
  }

  injectApiRoutes() {
    // var done = this.async();

    var props = this.props;
    var dPath = this.destinationPath.bind(this);

    const name = props.name.toLowerCase();
    const apigroup = props.apigroup.toLowerCase();
    const routeName = `${apigroup}.route`;
    const controllerName = `${apigroup}.controller`;
    
    // Files
    const routesFile = dPath(`src/api/routes/${this.apiversion}/index.js`);
    const apiRouteFile = dPath(`src/api/routes/${this.apiversion}/${routeName}.js`);
    const apiControllerFile = dPath(`src/api/controllers/${controllerName}.js`);

    /**
     * Inject codes
     */
    
    if (this.fs.exists(routesFile)) {

      // console.log('Building route...');

      var ast = recast.parse(this.fs.read(routesFile));
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

            if (decl.id.name.trim() === `${apigroup}Routes` && arg.trim() === `./${routeName}`) {
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
            const validFirstArgument = args.length > 0 && args[0].type === 'Literal' && args[0].value === `/${apigroup}`;
            const validSecondArgument = args.length > 1 && args[1].type === 'Identifier' && args[1].name === `${apigroup}Routes`;
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
      if (injectRequire) {
        var lastImportIndex = _.findLastIndex(body, function(statement) {
          return statement.type === 'VariableDeclaration';
        });
        var actualImportCode = recast.print(body[lastImportIndex]).code;
        var importString = ['const ', apigroup, 'Routes = require(\'./', routeName, '\');'].join('');
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 1, importString);
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 0, actualImportCode);
      }
      
      /**
       * Inject router.use() expression
       */
      if (injectRouterUse) {
        var middlewareString = ['router.use(\'/', apigroup, '\', ', apigroup, 'Routes);'].join('');
        var lastMiddlewareIndex = _.findLastIndex(body, function (statement) {
          if (!statement.expression || !statement.expression.callee) {
            return false;
          }
          var callee = statement.expression.callee;
          return callee.object.name === 'router' && callee.property.name === 'use';
        });

        
        if (lastMiddlewareIndex === -1) {
          var exportRouterIndex = _.findIndex(body, function (statement) {
            return statement.type === 'ExportDefaultDeclaration';
          });
          body.splice(exportRouterIndex < 0 ? 0 : exportRouterIndex, 0, middlewareString);
        } else {
          var actualMiddlewareCode = recast.print(body[lastMiddlewareIndex]).code;
          body.splice(lastMiddlewareIndex < 0 ? 0 : lastMiddlewareIndex, 1, middlewareString);
          body.splice(lastMiddlewareIndex < 0 ? 0 : lastMiddlewareIndex, 0, actualMiddlewareCode);
        }
      }

      /**
       * xxx.route.js router injection
       */
      
      if (this.fs.exists(apiRouteFile)) {
        var routeAst = recast.parse(this.fs.read(apiRouteFile));
        var routeBody = routeAst.program.body;
        var injectApiRoute = true;

        recast.visit(routeAst, {
          visitCallExpression: function(path) {
            const callee = path.node.callee;
            if (callee.type === 'MemberExpression') {
              const args = path.node.arguments;
              const validFirstArgument = args.length > 0 && args[0].type === 'Literal' && args[0].value === `/${name}`;
              const isValid = callee.object.name === 'router' && callee.property.name === 'route' && validFirstArgument;
              if (isValid) {
                injectApiRoute = !isValid;
                return false;
              }
            }
            this.traverse(path);
          }
        });

        if (injectApiRoute) {
          var middlewareString = ['router.route(\'/', name, '\')\n', '\t.', props.method, '(validate(validation.', name, '), ', 'controller.', name, ');'].join('');
          var lastMiddlewareIndex = _.findLastIndex(body, function (statement) {
            if (!statement.expression || !statement.expression.callee) {
              return false;
            }
            var callee = statement.expression.callee;
            return callee.object.name === 'router' && callee.property.name === 'use';
          });
          
          if (lastMiddlewareIndex === -1) {
            var exportRouterIndex = _.findIndex(body, function (statement) {
              return statement.type === 'ExportDefaultDeclaration';
            });
            routeBody.splice(exportRouterIndex < 0 ? 0 : exportRouterIndex, 0, middlewareString);
          } else {
            var actualMiddlewareCode = recast.print(body[lastMiddlewareIndex]).code;
            routeBody.splice(lastMiddlewareIndex < 0 ? 0 : lastMiddlewareIndex, 0, middlewareString);
          }
        }
      }

      /**
       * API Controller File Injection
       */
      if (this.fs.exists(apiControllerFile)) {
        var controllerAst = recast.parse(this.fs.read(apiControllerFile));
        var controllerBody = controllerAst.program.body;
        var injectApiController = true;

        recast.visit(controllerAst, {
          visitAssignmentExpression: function(path) {          
            let left = path.node.left;
            if (left.object.name === 'exports' && left.property.name === name) {
              injectApiController = true;
              return false;
            }
            this.traverse(path);
          },

        });

        if (injectApiController) {
          var lastExportIndex = _.findLastIndex(controllerBody, function (statement) {
            const expr = statement.expression;
            return expr && expr.type === 'AssignmentExpression'
          });
          
          const exportString = `/**\n * ${name}\n * @public\n */\nexports.${name} = async (req, res, next) => {\n\ttry {\n\t\tres.status(httpStatus.OK);\n\t\treturn res.json({ message: 'OK' });\n\t} catch (error) {\n\t\treturn next(error);\n\t}\n};\n`
          controllerBody.splice(lastExportIndex < 0 ? 0 : lastExportIndex, 0, exportString);
        }
      }

      /**
       * Flush the ASTs
       */

      if (injectRouterUse || injectRequire) {
        rimraf(routesFile, () => {
          this.fs.write(routesFile, recast.print(ast).code);
        })
      }

      if (injectApiRoute) {
        rimraf(apiRouteFile, () => {  
          this.fs.write(apiRouteFile, recast.print(routeAst).code);
        });
      }

      if (injectApiController) {
        rimraf(apiControllerFile, () => {
          this.fs.write(apiControllerFile, recast.print(controllerAst).code);
        })
      }
    }
  }


}