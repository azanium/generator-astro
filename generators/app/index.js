const Generator = require('yeoman-generator');
const urlJoin = require('url-join');
const yosay = require('yosay');
const path = require('path');
const slugify = require('underscore.string/slugify');
const decamelize = require('decamelize');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Process argument
    this.argument('projectname', { type: String, required: false });
    this.projectname = this.projectname || 'astro-service';
    this.projectname = decamelize(slugify(this.projectname), '-');
    this.props = {};

    console.log(yosay('Welcome to Astro RESTful API generator!'));
  }

  propmting() {
    const done = this.async();
    const that = this;

    this.prompt([
      {
        type: 'list',
        name: 'kind',
        message: 'What kinf of project do you want to create?',
        choices: [
          { name: 'ExpressJS', value: 'service' },
          { name: 'React + ExpressJS (alpha)', value: 'fullstack' }
        ],
        default: that.config.get('service') || 'service'
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your project name?',
        default: that.config.get('name') || this.projectname,
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'list',
        name: 'sequelize',
        message: 'You want to use sequelize?',
        choices: [
          { name: 'yes', value: 'y' },
          { name: 'no', value: 'n' }
        ],
        default: that.config.get('sequelize') || 'n'
      },
      {
        type: 'input',
        name: 'apibase',
        message: 'Your API base path?',
        default: that.config.get('apibase') || 'api',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'apiversion',
        message: 'Your API version?',
        default: that.config.get('apiversion') || 'v1',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'port',
        message: 'Your service port?',
        default: that.config.get('port') || '5000',
        validate: (value) => {
          const regex = new RegExp(/[0-9]/g);
          return regex.test(value);
        }
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version number',
        default: that.config.get('version') || '0.1.0',
        validate: value => value !== undefined && value !== ''
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        default: that.config.get('description') || 'This project generated using Astro Generator'
      },
      {
        type: 'input',
        name: 'author',
        message: `Author's name`,
        default: that.config.get('author') || 'Suhendra Ahmad'
      },
      {
        type: 'input',
        name: 'license',
        message: `License`,
        default: 'MIT'
      }
    ]).then((answers) => {
      this.props = answers;
      done();
    });
  }

  writing() {
    const { props } = this;
    const copy = this.fs.copy.bind(this.fs);
    const copyTpl = this.fs.copyTpl.bind(this.fs);
    const tPath = this.templatePath.bind(this);
    const dPath = this.destinationPath.bind(this);

    this.destinationRoot(props.name);
    props.src = props.kind === 'fullstack' ? 'src/server' : 'src';
    props.client = props.kind === 'fullstack' ? 'src/client' : undefined;
    props.apiPath = urlJoin(props.src, props.apibase);

    /**
     * Etc
     */
    copy(tPath('_.gitignore'), dPath('.gitignore'));
    copyTpl(tPath('_.eslintrc.ejs'), dPath('.eslintrc'), props);
    copyTpl(tPath('_README.md'), dPath('README.md'), props);
    copyTpl(tPath('_.env.example'), dPath('.env.example'), props);
    copyTpl(tPath('_.env.example'), dPath('.env'), props);
    copyTpl(tPath('jest.json'), dPath('jest.json'), props);
    copyTpl(tPath('jsconfig.json'), dPath('jsconfig.json'), props);

    /**
     * License
     */
    if (props.license === 'MIT') {
      copyTpl(tPath('_LICENSE'), dPath('LICENSE'), props);
    }

    /**
     * index.js
     */
    copyTpl(tPath('src/index.ejs'), dPath(urlJoin(props.src, 'index.js')), props);

    /**
     * boot folder
     */
    copy(tPath('src/boot/startup'), dPath(urlJoin(props.src, 'boot/startup')));
    copy(tPath('src/boot/server'), dPath(urlJoin(props.src, 'boot/server')));
    copyTpl(tPath('src/boot/index.ejs'), dPath(urlJoin(props.src, 'boot/index.js')), props);

    /**
     * api folder
     */
    mkdirp.sync(path.join(this.destinationPath(), urlJoin(props.src, props.apibase)));
    copyTpl(tPath(`src/api/_index.ejs`), dPath(urlJoin(props.apiPath, 'index.js')), props);
    copy(tPath(`src/api/apiversion/index.js`), dPath(urlJoin(props.apiPath, props.apiversion, 'index.js')));

    /**
     * config folder
     */
    copyTpl(tPath('src/config/_express.ejs'), dPath(urlJoin(props.src, 'config', 'express.js')), props);
    copyTpl(tPath('src/config/vars.js'), dPath(urlJoin(props.src, 'config', 'vars.js')), props);


    /**
     * utils
     */
    copy(tPath('src/utils/APIError'), dPath(urlJoin(props.src, 'utils', 'APIError')));
    mkdirp.sync(path.join(this.destinationPath(), urlJoin(props.src, 'utils', 'ErrorCode')));
    copy(tPath('src/utils/ErrorCode/index.js'), dPath(urlJoin(props.src, 'utils', 'ErrorCode', 'index.js')));
    copyTpl(tPath('src/utils/ErrorCode/ErrorCode.js'), dPath(urlJoin(props.src, 'utils', 'ErrorCode', 'ErrorCode.js')), props);
    copy(tPath('src/utils/logger'), dPath(urlJoin(props.src, 'utils', 'logger')));

    /**
     * middlewares
     */
    copy(tPath('src/middlewares'), dPath(urlJoin(props.src, 'middlewares')));


    /**
     * services
     */
    copy(tPath('src/services'), dPath(urlJoin(props.src, 'services')));

    copyTpl(tPath('_package.json.ejs'), dPath('package.json'), props);

    /**
     * Docker
     */
    copyTpl(tPath('Dockerfile'), dPath('Dockerfile'), props);
    copyTpl(tPath('_docker-compose.yml'), dPath('docker-compose.yml'), props);
    copyTpl(tPath('_docker-compose.dev.yml'), dPath('docker-compose.dev.yml'), props);
    copyTpl(tPath('_docker-compose.test.yml'), dPath('docker-compose.test.yml'), props);
    copyTpl(tPath('_docker-compose.prod.yml'), dPath('docker-compose.prod.yml'), props);

    if (props.sequelize === 'y') {
      mkdirp.sync(path.join(this.destinationPath(), urlJoin(props.src, 'database', 'migrations')));
      mkdirp.sync(path.join(this.destinationPath(), urlJoin(props.src, 'database', 'seeders')));
      copyTpl(tPath('.sequelizerc'), dPath('.sequelizerc'), props);
      copyTpl(tPath('src/config/database.js'), dPath(urlJoin(props.src, 'config', 'database.js')), props);
      copyTpl(tPath('src/models/index.js'), dPath(urlJoin(props.src, 'models', 'index.js')), props);
    }

    /**
     * CLIENT SIDE
     */
    if (props.kind === 'fullstack') {
      const srcRoot = path.dirname(props.src).split(path.sep).pop();
      copy(tPath('public/favicon.ico'), dPath('public/favicon.ico'), props);
      copyTpl(tPath('reza.config.js'), dPath('reza.config.js'), props);
      copyTpl(tPath('bootstrap.ejs'), dPath(urlJoin(srcRoot, 'index.js')), props);
      copyTpl(tPath('src/config/_react.ejs'), dPath(urlJoin(props.src, 'config', 'react.js')), props);
      copy(tPath('client'), dPath(props.client));
    }

    this.config.save();

    this.on('end', () => {
      this.config.set('name', props.name);
      this.config.set('apibase', props.apibase);
      this.config.set('apiversion', props.apiversion);
      this.config.set('version', props.version);
      this.config.set('description', props.description);
      this.config.set('author', props.author);
      this.config.set('src', props.src);
      this.config.set('client', props.client);
      this.config.set('kind', props.kind);
    });
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
