'user strict';

const Generator = require('yeoman-generator');
var pascalize = require('underscore.string/capitalize');

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
        name:     'util',
        message:  'Utility name?',
        default:  this.config.get('last_util') || 'util'
      }
    ]).then(answers => {
      that.props = answers;

      if (that.projectname == undefined || that.apiversion == undefined) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', function() {
        this.config.set('last_util', that.props.util);
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

    const util = props.util.toLowerCase();
    const loweredUtil = util.toLowerCase();

    const utilName = `${util}.util.js`;
    const testName = `${util}.spec.js`;
    const indexName = `index.js`;

    const targetName = `src/utils/${loweredUtil}`;
    props.pascalizedeUtil = pascalize(utilName);


    /**
     * Index
     */
    if (!this.fs.exists(dPath(`${targetName}/${indexName}`))) {
      copyTpl(tPath('_index.ejs'), dPath(`${targetName}/${indexName}`), props);
    }

    /**
     * Util
     */
    if (!this.fs.exists(dPath(`${targetName}/${utilName}`))) {
      copyTpl(tPath('_util.ejs'), dPath(`${targetName}/${utilName}`), props);
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