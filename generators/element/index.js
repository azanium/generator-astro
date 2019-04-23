const path = require('path');
const mkdirp = require('mkdirp');
const urlJoin = require('url-join');
const Generator = require('yeoman-generator');
const capitalize = require('underscore.string/capitalize');
const underscored = require('underscore.string/underscored');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.projectname = this.config.get('name');
    this.apiversion = this.config.get('apiversion');
    this.kind = this.config.get('kind');

    if (!this.projectname || !this.apiversion) {
      console.log('Invalid Astro project!, exiting');
      process.exit(1);
    }

    if (this.kind !== 'fullstack') {
      console.log('astro:component only available for fullstack project!');
      process.exit(1);
    }
  }

  prompting() {
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your element name?',
        default: this.config.get('last_element_name') || 'NewElement',
        validate: value => value !== undefined && value !== ''
      }
    ]).then((answers) => {
      that.props = answers;
      const { name } = that.props;

      that.props.NAME = name.toUpperCase();
      that.props.apiversion = that.config.get('apiversion') || 'v1';
      that.props.filename = underscored(name).replace('_', '-');
      that.props.client = that.config.get('client') || 'src/client';

      that.props.dirname = underscored(name).replace('_', '-');
      that.props.name = capitalize(name);

      this.on('end', () => {
        this.config.set('last_element_name', that.props.last_element_name);
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
    props._name_ = props.name.toLowerCase();
    const elementsPath = urlJoin(props.client, 'elements', props.dirname);

    // Sync the components path directory
    mkdirp.sync(path.join(this.destinationPath(), elementsPath));

    const paths = {
      index: {
        source: '_index.ejs',
        target: urlJoin(elementsPath, `index.js`)
      },
      style: {
        source: '_style.scss.ejs',
        target: urlJoin(elementsPath, `style.scss`)
      },
      component: {
        source: '_component.ejs',
        target: urlJoin(elementsPath, `${props.filename}.component.js`)
      }
    };

    Object.keys(paths).forEach((fileKey) => {
      const file = paths[fileKey];
      const sourcePath = tPath(file.source);
      const destinationPath = dPath(file.target);
      copyTpl(sourcePath, destinationPath, props);
    });

    done();
  }
};
