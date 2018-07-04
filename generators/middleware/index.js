'user strict';

const Generator = require('yeoman-generator');
const camelize = require('underscore.string/camelize');
const underscored = require('underscore.string/underscored');
const capitalize = require('underscore.string/capitalize');

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
        message:  'Middleware name?',
        default:  this.config.get('last_middleware') || 'middleware'
      }
    ]).then(answers => {
      that.props = answers;
      const originalName = `${that.props.name}`;
      that.props.name = camelize(that.props.name, true);
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.capitalizedName = capitalize(that.props.name);

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_middleware', originalName);
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

    const middlewareName = `${props.filename}.middleware.js`;
    const testName = `${props.filename}.spec.js`;
    const indexName = `index.js`;
    const targetName = `src/middlewares/${props.filename}`;

    /**
     * Index
     */
    if (!this.fs.exists(dPath(`${targetName}/${indexName}`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${targetName}/${indexName}`), props);
    }

    /**
     * Middleware
     */
    if (!this.fs.exists(dPath(`${targetName}/${middlewareName}`))) {
      copyTpl(tPath('_middleware.ejs'), dPath(`${targetName}/${middlewareName}`), props);
    }
    
    /**
     * Unit Test
     */
    if (!this.fs.exists(dPath(`${targetName}/${testName}`))) {
      copyTpl(tPath('_spec.ejs'), dPath(`${targetName}/${testName}`), props);
    }

    done();
  } 
}