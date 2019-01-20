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
        name: 'service',
        message: 'Service name?',
        default: this.config.get('last_service') || 'service'
      }
    ]).then((answers) => {
      that.props = answers;
      const originalService = `${that.props.service}`;
      that.props.service = camelize(that.props.service, true);
      that.props.filename = underscored(that.props.service).replace('_', '-');
      that.props.capitalizedService = capitalize(originalService);

      if (!that.projectname || !that.apiversion) {
        console.log('Invalid Astro project!, exiting');
        process.exit();
      }

      this.on('end', () => {
        this.config.set('last_service', originalService);
      });

      done();
    });
  }

  writing() {
    const done = this.async();
    const { props } = this;
    props.src = this.config.get('src');
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);

    const serviceName = `${props.filename}.service.js`;
    const testName = `${props.filename}.spec.js`;
    const indexName = `index.js`;
    const targetName = urlJoin(props.src, 'services', props.filename);

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
};
