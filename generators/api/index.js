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
  }

  prompting() {
    var done = this.async();

    this.prompt([
      {
        type:     'input',
        name:     'name',
        message:  'What is your project name?',
        default:  this.projectname
      },
      {
        type:     'input',
        name:     'version',
        message:  'Version number',
        default:  '1.0.0'
      },
      {
        type:     'input',
        name:     'description',
        message:  'Description',
        default:  ''
      },
      {
        type:     'input',
        name:     'author',
        message:  `Author's name`,
        default:  ''
      },
      {
        type:     'input',
        name:     'license',
        message:  `License`,
        default:  'MIT'
      }
    ]).then(answers => {
      this.props = answers;
      done();
    }) 
  }

}