'user strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.log('Initializing...');
  }

  start() {
    this.prompt([
      {
        type:     'input',
        name:     'name',
        message:  'What is your project name?'  
      }
    ]).then(answers => {
      this.props = answers;
      
      this.destinationRoot(answers.name);
      
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), 
        {
          name: this.props.name
        }
      );
    })
  }
}