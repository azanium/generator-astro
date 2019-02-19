const path = require('path');
const mkdirp = require('mkdirp');
const urlJoin = require('url-join');
const Generator = require('yeoman-generator');
const capitalize = require('underscore.string/capitalize');
const underscored = require('underscore.string/underscored');
const recast = require('recast');
const _ = require('lodash');
const rimraf = require('rimraf');

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
        type: 'list',
        name: 'stateless',
        message: 'Select component type?',
        validate: value => value !== undefined && value !== '',
        choices: [
          { name: 'stateless', value: 'y' },
          { name: 'stateful', value: 'n' }
        ]
      },
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
        message: 'Component route path? (eg: /astro)',
        default: this.config.get('last_component_path') || '/hello',
        validate: value => value !== undefined && value !== '' && value.indexOf('/') === 0
      },
      {
        type: 'list',
        name: 'middleware',
        message: 'Do you to generate client route middleware?',
        default: 'n',
        choices: [
          { name: 'yes', value: 'y' },
          { name: 'no', value: 'n' }
        ]
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
    props.componentsPath = componentsPath;
    props._name_ = props.name.toLowerCase();

    // Sync the components path directory
    mkdirp.sync(path.join(this.destinationPath(), componentsPath));

    const paths = {
      index: {
        source: '_index.ejs',
        target: urlJoin(componentsPath, `index.js`),
        stateless: true
      },
      style: {
        source: '_style.scss.ejs',
        target: urlJoin(componentsPath, `style.scss`),
        stateless: true
      },
      component: {
        source: '_component.ejs',
        target: urlJoin(componentsPath, `${props.filename}.component.js`),
        stateless: true
      },
      route: {
        source: '_route.ejs',
        target: urlJoin(componentsPath, `${props.filename}.route.js`),
        stateless: true
      },
      action: {
        source: '_action.ejs',
        target: urlJoin(componentsPath, `${props.filename}.action.js`)
      },
      actionType: {
        source: '_actionType.ejs',
        target: urlJoin(componentsPath, `${props.filename}.actionType.js`)
      },
      epic: {
        source: '_epic.ejs',
        target: urlJoin(componentsPath, `${props.filename}.epic.js`)
      },
      reducer: {
        source: '_reducer.ejs',
        target: urlJoin(componentsPath, `${props.filename}.reducer.js`)
      },
      actionSpec: {
        source: urlJoin('__test__', 'action.spec.ejs'),
        target: urlJoin(componentsPath, '__test__', 'action.spec.js')
      },
      componentSpec: {
        source: urlJoin('__test__', 'component.spec.ejs'),
        target: urlJoin(componentsPath, '__test__', 'component.spec.js'),
        stateless: true
      },
      epicSpec: {
        source: urlJoin('__test__', 'epic.spec.ejs'),
        target: urlJoin(componentsPath, '__test__', 'epic.spec.js')
      },
      reducerSpec: {
        source: urlJoin('__test__', 'reducer.spec.ejs'),
        target: urlJoin(componentsPath, '__test__', 'reducer.spec.js')
      }
    };

    Object.keys(paths).forEach((fileKey) => {
      const file = paths[fileKey];
      const sourcePath = tPath(file.source);
      const destinationPath = dPath(file.target);
      let copyFile = true;
      if (props.stateless === 'y') {
        copyFile = file.stateless;
      }
      if (!this.fs.exists(destinationPath) && copyFile) {
        copyTpl(sourcePath, destinationPath, props);
      }
    });

    done();
  }

  inject() {
    const { props } = this;
    props.src = this.config.get('src') || 'src';
    const _name_ = props.name.toLowerCase();
    props._name_ = _name_;
    const buildExportCode = componentType => `export { default as ${_name_} } from '@components/${props.dirname}/${props.filename}.${componentType}';`;
    const buildInlineExportCode = componentType => `export { default as ${_name_} } from './${props.dirname}/${props.filename}.${componentType}';`;

    const paths = {
      routes: {
        target: urlJoin(props.client, 'ducks', 'routes.js'),
        code: buildExportCode('route'),
        stateless: true
      },
      reducers: {
        target: urlJoin(props.client, 'ducks', 'reducers.js'),
        code: buildExportCode('reducer')
      },
      epics: {
        target: urlJoin(props.client, 'ducks', 'epics.js'),
        code: buildExportCode('epic')
      }
    };

    if (props.middleware === 'y') {
      paths.clientRoute = {
        target: urlJoin(props.src, 'routes', 'index.js'),
        code: buildInlineExportCode('middleware')
      };
    }

    Object.keys(paths).forEach((fileKey) => {
      const file = paths[fileKey];
      let injectFile = true;
      if (props.stateless === 'y') {
        injectFile = file.stateless;
      }
      if (injectFile) {
        this._injectExport(file.target, file.code);
      }
    });
  }

  _injectExport(jsFile, exportString) {
    const dPath = this.destinationPath.bind(this);
    const targetFile = dPath(jsFile);

    if (!this.fs.exists(targetFile)) {
      return;
    }

    const ast = recast.parse(this.fs.read(targetFile));
    const { body } = ast.program;

    /* recast.visit(ast, {
      visitExportSpecifier(path) { // eslint-disable-line
        this.traverse(path);
      }
    }); */

    const lastExportIndex = _.findLastIndex(body, statement => statement.type === 'ExportNamedDeclaration');

    /**
     * Inject codes
     */
    body.splice(lastExportIndex + 1, 0, exportString);

    rimraf(targetFile, () => {
      this.fs.write(targetFile, recast.print(ast).code);
    });
  }
};
