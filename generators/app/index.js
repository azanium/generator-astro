'user strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const shelljs = require('shelljs');
const path = require('path');
var humanize = require('underscore.string/humanize');
var slugify = require('underscore.string/slugify');
var decamelize = require('decamelize');
var mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Process argument
    this.argument('projectname', { type: String, required: false });
    this.projectname = this.projectname || 'astro-service';
    this.projectname = decamelize(slugify(this.projectname), '-');
    this.props = {}

    console.log(yosay('Welcome to Astro RESTful API generator!'))
  }

  propmting() {
    var done = this.async();
    var that = this;

    this.prompt([
      {
        type:     'input',
        name:     'name',
        message:  'What is your project name?',
        default:  this.projectname
      }, 
      {
        type:     'input',
        name:     'apibase',
        message:  'Your API base path?',
        default:  'api',
      },
      {
        type:     'input',
        name:     'apiversion',
        message:  'Your API version?',
        default:  'v1',
      },
      {
        type:     'input',
        name:     'version',
        message:  'Version number',
        default:  that.config.get('version') || '0.1.0',
      },
      {
        type:     'input',
        name:     'description',
        message:  'Description',
        default:  '',
      },
      {
        type:     'input',
        name:     'author',
        message:  `Author's name`,
        default:  that.config.get('author') || 'Suhendra Ahmad',
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

  writing() {
    
    var props = this.props;
    var copy = this.fs.copy.bind(this.fs);
    var copyTpl = this.fs.copyTpl.bind(this.fs);
    var tPath = this.templatePath.bind(this);
    var dPath = this.destinationPath.bind(this);

    this.destinationRoot(props.name);

    /**
     * package.json
     */
    copyTpl(tPath('_package.json'), dPath('package.json'), props);

    /**
     * Etc
     */
    copy(tPath('_.gitignore'), dPath('.gitignore'));
    copy(tPath('_.eslintrc'), dPath('.eslintrc'));
    copyTpl(tPath('_README.md'), dPath('README.md'), props);
    copyTpl(tPath('_.env.example'), dPath('.env.example'), props);
    copyTpl(tPath('_.env.example'), dPath('.env'), props);

    /**
     * License
     */
    if (props.license === 'MIT') {
      copyTpl(tPath('_LICENSE'), dPath('LICENSE'), props);
    }
    
    /**
     * Docker
     */
    copy(tPath('Dockerfile'), dPath('Dockerfile'));
    copyTpl(tPath('_docker-compose.yml'), dPath('docker-compose.yml'), props);
    copyTpl(tPath('_docker-compose.dev.yml'), dPath('docker-compose.dev.yml'), props);
    copyTpl(tPath('_docker-compose.test.yml'), dPath('docker-compose.test.yml'), props);
    copyTpl(tPath('_docker-compose.prod.yml'), dPath('docker-compose.prod.yml'), props);

    /**
     * index.js
     */
    copy(tPath('src/index.js'), dPath('src/index.js'));

    /**
     * boot folder
     */
    copy(tPath('src/boot'), dPath('src/boot'));

    /**
     * api folder
     */
    mkdirp.sync(path.join(this.destinationPath(), 'src/api'));
    copyTpl(tPath(`src/api/_index.ejs`), dPath(`src/api/index.js`), props);
    copy(tPath(`src/api/apiversion/index.js`), dPath(`src/api/${props.apiversion}/index.js`));

    /**
     * config folder
     */
    copyTpl(tPath('src/config/_express.ejs'), dPath('src/config/express.js'), props);
    copy(tPath('src/config/vars.js'), dPath('src/config/vars.js'));
    
    /**
     * utils
     */
    copy(tPath('src/utils/APIError'), dPath('src/utils/APIError'));
    mkdirp.sync(path.join(this.destinationPath(), `src/utils/ErrorCode`));
    copy(tPath('src/utils/ErrorCode/index.js'), dPath('src/utils/ErrorCode/index.js'));
    copyTpl(tPath('src/utils/ErrorCode/_ErrorCode.js'), dPath('src/utils/ErrorCode/ErrorCode.js'), props);
    copy(tPath('src/utils/logger'), dPath('src/utils/logger'));

    /**
     * middlewares
     */
    copy(tPath('src/middlewares'), dPath('src/middlewares'));

    /**
     * models
     */
    mkdirp.sync(path.join(this.destinationPath(), 'src/models'));
    
    /**
     * services
     */
    mkdirp.sync(path.join(this.destinationPath(), 'src/services'));

    
    this.config.save();

    this.on('end', function() {
      this.config.set('name', props.name);
      this.config.set('apibase', props.apibase);
      this.config.set('apiversion', props.apiversion);
      this.config.set('version', props.version);
      this.config.set('description', props.description);
      this.config.set('author', props.author);
    })
  }

  install() {
    this.installDependencies({bower: false});
  }
}