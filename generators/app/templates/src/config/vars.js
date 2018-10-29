module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  serviceName: '<%= name %>',
  http: {
    timeout: 5000,
    responseType: 'json',
    responseEncoding: 'utf8',
    retries: 3
  }
};
