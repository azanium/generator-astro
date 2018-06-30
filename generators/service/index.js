'user strict';

const Generator = require('yeoman-generator');
var pascalize = require('underscore.string/capitalize');
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
        name:     'service',
        message:  'Service name?',
        default:  this.config.get('last_service') || 'service'
      }
    ]).then(answers => {
      that.props = answers;

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_service', that.props.service);
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

    const service = props.service.toLowerCase();
    const loweredService = service.toLowerCase();

    const serviceName = `${service}.service.js`;
    const testName = `${service}.spec.js`;
    const indexName = `index.js`;

    const targetName = `src/services/${loweredService}`;
    props.pascalizedService = pascalize(service);


    /**
     * Index
     */
    if (!this.fs.exists(dPath(`${targetName}/${indexName}`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${targetName}/${indexName}`), props);
    }

    /**
     * Service
     */
    if (!this.fs.exists(dPath(`${targetName}/${serviceName}`))) {
      copyTpl(tPath('_service.ejs'), dPath(`${targetName}/${serviceName}`), props);
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