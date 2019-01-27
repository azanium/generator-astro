const Generator = require('yeoman-generator');
const urlJoin = require('url-join');
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
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Utility name?',
        default: this.config.get('last_util') || 'util'
      }
    ]).then((answers) => {
      that.props = answers;
      const originalName = `${that.props.name}`;
      that.props.name = camelize(that.props.name, true);
      that.props.filename = underscored(that.props.name).replace('_', '-');
      that.props.capitalizedName = capitalize(that.props.name);

      if (!that.projectname || !that.apiversion) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', () => {
        this.config.set('last_util', originalName);
      });

      done();
    });
  }

  writing() {
    const done = this.async();
    const { props } = this;
    props.src = this.config.get('src') || 'src';
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);

    const utilName = `${props.filename}.util.js`;
    const testName = `${props.filename}.spec.js`;
    const indexName = `index.js`;
    const targetName = urlJoin(props.src, 'utils', props.filename);

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
};
