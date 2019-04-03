const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(process.cwd(), '.env'),
  sample: path.join(process.cwd(), '.env.example')
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  serviceName: '<%= name %>',
  http: {
    timeout: 5000,
    responseType: 'json',
    responseEncoding: 'utf8',
    retries: 3
  },
  sanitizedFields: []
};
