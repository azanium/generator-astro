const path = require('path');
const mkdirp = require('mkdirp');
const urlJoin = require('url-join');
const Generator = require('yeoman-generator');
const camelize = require('underscore.string/camelize');
const underscored = require('underscore.string/underscored');
const recast = require('recast');
const _ = require('lodash');
const rimraf = require('rimraf');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.projectname = this.config.get('name');
    this.apiversion = this.config.get('apiversion');
  }

  prompting() {
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your API endpoint name?',
        default: this.config.get('last_endpoint') || 'endpoint',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'apidesc',
        message: 'Please give API description for documentation!',
        default: this.config.get('last_apidesc') || 'description'
      },
      {
        type: 'list',
        name: 'method',
        message: 'API Method?',
        default: this.config.get('last_method') || 'post',
        choices: ['get', 'post', 'put', 'delete']
      }
    ]).then((answers) => {
      that.props = answers;
      that.props.injectRoute = false;
      that.props.apibase = that.config.get('apibase') || 'api';
      that.props.apiversion = that.config.get('apiversion') || 'v1';
      that.props.endpoint = `${that.props.name}`;
      that.props.upperMethod = that.props.method.toUpperCase();
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.src = that.config.get('src') || 'src';
      that.props.apiPath = urlJoin(that.props.src, that.props.apibase);

      // Handle nested api path
      let { name } = that.props;

      // Dirname by default is the filename
      let dirname = that.props.filename;
      if (name.indexOf('/') > -1) {
        // Create dirname
        dirname = underscored(path.dirname(name)).replace('_', '-');
        mkdirp.sync(path.join(this.destinationPath(), dirname));
        name = path.basename(name);

        // now filename only store the basename
        that.props.filename = underscored(name).replace('_', '-');

        // dirname should be full path
        dirname = urlJoin(dirname, that.props.filename);
      }
      that.props.dirname = dirname;
      that.props.name = camelize(name, true);

      if (!that.projectname || !that.apiversion) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', () => {
        this.config.set('last_endpoint', that.props.endpoint);
        this.config.set('last_apidesc', that.props.apidesc);
        this.config.set('last_method', that.props.method);
        this.config.set('apibase', that.props.apibase);
        this.config.set('apiversion', that.props.apiversion);
      });

      done();
    });
  }

  writing() {
    const done = this.async();
    const { props } = this;
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);
    const controllerName = `${props.filename}.controller.js`;
    const validationName = `${props.filename}.validator.js`;
    const integrationName = `${props.filename}.integration.test.js`;
    const testName = `${props.filename}.spec.js`;
    const apiRootPath = urlJoin(props.apiPath, this.apiversion);
    const apiPath = `${apiRootPath}/${props.dirname}`;
    props.indexfilename = props.dirname ? `${props.name}` : `${props.filename}`;

    /**
     * Controller
     */
    if (!this.fs.exists(dPath(`${apiPath}/${controllerName}`))) {
      copyTpl(tPath('_controller.ejs'), dPath(`${apiPath}/${controllerName}`), props);
    }

    /**
     * Route
     */
    if (!this.fs.exists(dPath(`${apiPath}/index.js`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${apiPath}/index.js`), props);
    }

    /**
     * Validation
     */
    if (!this.fs.exists(dPath(`${apiPath}/${validationName}`))) {
      // As of v3.0.1 We no longer use validation
      // copyTpl(tPath('_validation.ejs'), dPath(`${apiPath}/${validationName}`), props);
      copyTpl(tPath('_validator.ejs'), dPath(`${apiPath}/${validationName}`), props);
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
    const { props } = this;
    const dPath = this.destinationPath.bind(this);

    const routeName = `${props.dirname}`;
    const routeFile = dPath(urlJoin(props.apiPath, this.apiversion, 'index.js'));

    /**
     * Inject codes
     */

    if (this.fs.exists(routeFile)) {
      let ast = recast.parse(this.fs.read(routeFile));
      let { body } = ast.program;

      let injectRequire = true;
      let injectRouterUse = true;

      /**
       * Route require injection to index.js
       */
      recast.visit(ast, {
        visitVariableDeclaration(path) {  // eslint-disable-line
          const { declarations } = path.node;

          // Check for const = require variable declaration
          if (declarations.length > 0) {
            const decl = declarations[0];
            const arg = decl.init.arguments.length > 0 ? decl.init.arguments[0].value : '';

            // console.log('==>', decl.id.name);
            if (decl.id.name === `${props.name}Route` && arg.trim() === `./${routeName}`) {
              // We found that const route = require('') already exist, so prevent from re-injecting
              injectRequire = false;
              return false;
            }
          }
          this.traverse(path);
        },

        visitCallExpression(path) { // eslint-disable-line
          const { callee } = path.node;
          if (callee.type === 'MemberExpression') {
            const args = path.node.arguments;
            const validFirstArgument = args.length > 0 && args[0].type === 'Literal' && args[0].value === `/${props.name}`;
            const validSecondArgument = args.length > 1 && args[1].type === 'Identifier' && args[1].name === `${props.name}Route`;
            const isValid = callee.object.name === 'router' && callee.property.name === 'use' && validFirstArgument && validSecondArgument;
            if (isValid) {
              injectRouterUse = !isValid;
              return false;
            }
          }
          this.traverse(path);
        }
      });

      // Inject const = require()
      let lastImportIndex;
      if (injectRequire) {
        lastImportIndex = _.findLastIndex(body, statement => statement.type === 'VariableDeclaration');
        const actualImportCode = recast.print(body[lastImportIndex]).code;
        const importString = ['const ', props.name, 'Route = require(\'./', routeName, '\');'].join('');

        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 1, importString);
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 0, actualImportCode);
      }

      ast = recast.parse(recast.print(ast).code);
      body = ast.program.body;  // eslint-disable-line

      /**
       * Inject router.use() expression
       */
      if (injectRouterUse) {
        const middlewareString = ['router.use(\'/', props.endpoint, '\', ', props.name, 'Route);'].join('');
        const lastMiddlewareIndex = _.findLastIndex(body, (statement) => {
          if (!statement.expression || !statement.expression.callee) {
            return false;
          }
          const { callee } = statement.expression;
          return callee.object.name === 'router' && callee.property.name === 'use';
        });

        if (lastMiddlewareIndex === -1) {
          const exportRouterIndex = _.findIndex(body, statement => statement.type === 'ExpressionStatement' && statement.expression.right.name === 'router');
          body.splice(exportRouterIndex < 0 ? lastImportIndex : exportRouterIndex, 0, middlewareString);
        } else {
          const actualMiddlewareCode = recast.print(body[lastMiddlewareIndex]).code;
          body.splice(lastMiddlewareIndex < 0 ? lastImportIndex : lastMiddlewareIndex, 1, middlewareString);
          body.splice(lastMiddlewareIndex < 0 ? lastImportIndex : lastMiddlewareIndex, 0, actualMiddlewareCode);
        }
      }

      if (injectRouterUse || injectRequire) {
        rimraf(routeFile, () => {
          this.fs.write(routeFile, recast.print(ast).code);
        });
      }
    }
  }
};
