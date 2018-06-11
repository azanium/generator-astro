'user strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const shelljs = require('shelljs');
const path = require('path');
var humanize = require('underscore.string/humanize');
var slugify = require('underscore.string/slugify');
var camelize = require('underscore.string/camelize');
var mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.projectname = this.config.get('projectname');
  }

  prompting() {
    var done = this.async();

    this.prompt([
      {
        type:     'input',
        name:     'name',
        message:  'What is your api endpoint name?',
        default:  'something'
      }
    ]).then(answers => {
      this.props = answers;
      done();
    }) 
  }

  writing() {
    var props = this.props;
    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    const name = props.name.toLowerCase();

    /**
     * Controller
     */
    copyTpl(tPath('_controller.js'), dPath(`src/api/controllers/${name}.controller.js`), props);

    /**
     * Route
     */
    copyTpl(tPath('_route.js'), dPath(`src/api/routes/${this.apiversion}/${name}.route.js`), props);

    /**
     * Validation
     */
    copyTpl(tPath('_validation.js'), dPath(`src/api/validations/${name}.validation.js`), props);

    /**
     * Integration Test
     */
    copyTpl(tPath('_test.js'), dPath(`src/api/tests/${name}.validation.js`), props);
  }

}