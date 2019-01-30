const path = require('path');
const mkdirp = require('mkdirp');
const urlJoin = require('url-join');
const Generator = require('yeoman-generator');
const camelize = require('underscore.string/camelize');
const underscored = require('underscore.string/underscored');
// const recast = require('recast');
// const _ = require('lodash');
// const rimraf = require('rimraf');

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
        message: 'What is your component name?',
        default: this.config.get('last_component_name') || 'Hello',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'route',
        message: 'Your component route path?',
        default: this.config.get('last_component_path') || '/hello',
        validate: value => value !== undefined && value !== '' && value.indexOf('/') === 0
      }
    ]).then((answers) => {
      that.props = answers;
      const { name } = that.props;

      that.props.NAME = name.toUpperCase();
      that.props.apiversion = that.config.get('apiversion') || 'v1';
      that.props.filename = underscored(name).replace('_', '-');
      that.props.client = that.config.get('client') || 'src/client';

      that.props.dirname = underscored(name).replace('_', '-');
      that.props.name = camelize(name);

      this.on('end', () => {
        this.config.set('last_component_path', that.props.last_component_path);
        this.config.set('last_component_name', that.props.last_component_name);
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
    const clientPath = props.client;
    const componentsPath = urlJoin(clientPath, 'components', props.dirname);

    // Sync the components path directory
    mkdirp.sync(path.join(this.destinationPath(), componentsPath));

    const paths = {
      index: {
        source: '_index.ejs',
        target: `index.js`
      },
      style: {
        source: '_style.css.ejs',
        target: `style.css`
      },
      action: {
        source: '_action.ejs',
        target: `${props.filename}.action.js`
      },
      actionType: {
        source: '_actionType.ejs',
        target: `${props.filename}.actionType.js`
      },
      component: {
        source: '_component.ejs',
        target: `${props.filename}.component.js`
      },
      epic: {
        source: '_epic.ejs',
        target: `${props.filename}.epic.js`
      },
      reducer: {
        source: '_reducer.ejs',
        target: `${props.filename}.reducer.js`
      },
      route: {
        source: '_route.ejs',
        target: `${props.filename}.route.js`
      },
      actionSpec: {
        source: urlJoin('__test__', 'action.spec.ejs'),
        target: urlJoin('__test__', 'action.spec.js')
      },
      componentSpec: {
        source: urlJoin('__test__', 'component.spec.ejs'),
        target: urlJoin('__test__', 'component.spec.js')
      },
      epicSpec: {
        source: urlJoin('__test__', 'epic.spec.ejs'),
        target: urlJoin('__test__', 'epic.spec.js')
      },
      reducerSpec: {
        source: urlJoin('__test__', 'reducer.spec.ejs'),
        target: urlJoin('__test__', 'reducer.spec.js')
      }
    };

    Object.keys(paths).forEach((fileKey) => {
      const file = paths[fileKey];
      const sourcePath = tPath(file.source);
      const destinationPath = dPath(urlJoin(componentsPath, file.target));
      if (!this.fs.exists(destinationPath)) {
        copyTpl(sourcePath, destinationPath, props);
      }
    });

    done();
  }
};
