'user strict';

const Generator = require('yeoman-generator');
var pascalize = require('underscore.string/camelize');
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
        message:  'Boot task name?',
        default:  this.config.get('last_boot') || 'boot'
      }
    ]).then(answers => {
      that.props = answers;

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_boot', that.props.name);
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

    const name = props.name.toLowerCase();
    
    const bootName = `${name}.boot.js`;
    const testName = `${name}.spec.js`;
    const indexName = `index.js`;

    const targetName = `src/boot/${name}`;
    props.pascalizedeName = pascalize(name);
    props.name = name;


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
    // var done = this.async();

    var props = this.props;
    var dPath = this.destinationPath.bind(this);

    const name = props.name.toLowerCase();
    const routeName = `${name}`;
    
    const indexFile = dPath(`src/boot/index.js`);

    /**
     * Inject codes
     */
    
    if (this.fs.exists(indexFile)) {

      var ast = recast.parse(this.fs.read(indexFile));
      var body = ast.program.body;

      var injectRequire = true;
      var injectExports = true;

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
            if (arg && arg.trim() === `./${name}`) {
              injectRequire = false;
              return injectRequire;
            }
          }          
          this.traverse(path);
        },

        /* visitMemberExpression: (path) => {
          const { node } = path;
          const isModuleExport = node.object.name === 'module' && node.property.name === 'exports';

          this.traverse(path);
        }*/
      });

      // Inject const = require()
      let lastImportIndex;
      if (injectRequire) {
        lastImportIndex = _.findLastIndex(body, function(statement) {
          return statement.type === 'VariableDeclaration';
        });
        var actualImportCode = recast.print(body[lastImportIndex]).code;
        var importString = ['const { ', name, 'Boot } = require(\'./', routeName, '\');'].join('');
        
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 1, importString);
        body.splice(lastImportIndex < 0 ? 0 : lastImportIndex, 0, actualImportCode);
      }
      
      ast = recast.parse(recast.print(ast).code);
      body = ast.program.body;

      /**
       * Inject router.use() expression
       */
      if (injectExports) {
        let elements = [];
        var lastExportIndex = _.findLastIndex(body, function (statement) {
          if (
            statement.type === 'ExpressionStatement' 
            && statement.expression && statement.expression.right.type === 'ArrayExpression'
          ) {
            elements = statement.expression.right.elements;  
            return true;
          }
        });

        // We first create the declaration
        let exportString = 'module.exports = [\n';

        const bootName = `${name}Boot`

        // Add our boot name into the array 
        exportString += `\t${bootName}`;
        if (elements.length > 0) {
          exportString += ',\n';
        }

        // Readd current boot array
        elements.forEach((el) => {
          if (el.name !== `${bootName}`) {
            exportString += `\t${el.name}`
            if (elements.indexOf(el) < elements.length - 1) {
              exportString += ',\n';
            }
          }
        });

        // Close our array
        exportString += '\n];';

        if (lastExportIndex === -1) {
          var exportRouterIndex = _.findIndex(body, function (statement) {
            return (statement.type === 'ExpressionStatement' && statement.expression.right.type === 'ArrayExpression');
          });
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
        })
      }
    }
  }

}