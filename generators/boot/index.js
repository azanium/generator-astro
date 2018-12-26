'user strict';

const Generator = require('yeoman-generator');
const camelize = require('underscore.string/camelize');
const underscored = require('underscore.string/underscored');
const capitalize = require('underscore.string/capitalize');
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
        message: 'Boot task name?',
        default: this.config.get('last_boot') || 'boot'
      }
    ]).then((answers) => {
      that.props = answers;
      const originalName = `${that.props.name}`;
      that.props.name = camelize(that.props.name, true);
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.capitalizedName = capitalize(originalName);
      that.props.author = that.config.get('author');
      that.props.date = new Date().toString();

      if (!that.projectname || !that.apiversion) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', () => {
        this.config.set('last_boot', originalName);
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

    const bootName = `${props.filename}.boot.js`;
    const testName = `${props.filename}.spec.js`;
    const indexName = `index.js`;
    const targetName = `src/boot/${props.filename}`;

    /**
     * Index
     */
    if (!this.fs.exists(dPath(`${targetName}/${indexName}`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${targetName}/${indexName}`), props);
    }

    /**
     * Middleware
     */
    if (!this.fs.exists(dPath(`${targetName}/${bootName}`))) {
      copyTpl(tPath('_boot.ejs'), dPath(`${targetName}/${bootName}`), props);
    }

    /**
     * Unit Test
     */
    if (!this.fs.exists(dPath(`${targetName}/${testName}`))) {
      copyTpl(tPath('_spec.ejs'), dPath(`${targetName}/${testName}`), props);
    }

    done();
  }

  injectExport() {
    const { props } = this;
    const dPath = this.destinationPath.bind(this);

    const indexFile = dPath(`src/boot/index.js`);

    /**
     * Inject codes
     */

    if (this.fs.exists(indexFile)) {
      let ast = recast.parse(this.fs.read(indexFile));
      let { body } = ast.program;

      let injectRequire = true;
      const injectExports = true;

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
            if (arg && arg.trim() === `./${props.name}`) {
              injectRequire = false;
              return injectRequire;
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
        const importString = ['const { ', props.name, 'Boot } = require(\'./', props.filename, '\');'].join('');

        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 1, importString);
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 0, actualImportCode);
      }

      ast = recast.parse(recast.print(ast).code);
      body = ast.program.body; // eslint-disable-line

      /**
       * Inject router.use() expression
       */
      if (injectExports) {
        let elements = [];
        const lastExportIndex = _.findLastIndex(body, (statement) => { // eslint-disable-line
          if (statement.type === 'ExpressionStatement' && statement.expression && statement.expression.right.type === 'ArrayExpression') {
            elements = statement.expression.right.elements; // eslint-disable-line
            return true;
          }
        });

        // We first create the declaration
        let exportString = 'module.exports = [\n';

        const bootName = `${props.name}Boot`;

        // Add our boot name into the array
        exportString += `\t${bootName}`;
        if (elements.length > 0) {
          exportString += ',\n';
        }

        // Readd current boot array
        elements.forEach((el) => {
          if (el.name !== `${bootName}`) {
            exportString += `\t${el.name}`;
            if (elements.indexOf(el) < elements.length - 1) {
              exportString += ',\n';
            }
          }
        });

        // Close our array
        exportString += '\n];';

        if (lastExportIndex === -1) {
          const exportRouterIndex = _.findIndex(body, statement => statement.type === 'ExpressionStatement' && statement.expression.right.type === 'ArrayExpression');
          body.splice(exportRouterIndex < 0 ? lastImportIndex : exportRouterIndex, 0, exportString);
        } else {
          // Delete the current array
          body.splice(lastExportIndex, 1);

          // Add the new array
          body.splice(lastExportIndex < 0 ? lastImportIndex : lastExportIndex, 0, exportString);
        }
      }

      if (injectExports || injectRequire) {
        rimraf(indexFile, () => {
          this.fs.write(indexFile, recast.print(ast).code);
        });
      }
    }
  }
};
