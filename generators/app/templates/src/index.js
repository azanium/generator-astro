require('module-alias/register');
const async = require('async');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const app = require('./config/express');
const startupBoot = require('./boot');
const { port, env } = require('./config/vars');
const { logger } = require('./utils/logger');

// listen to requests
const serverStartup = (next) => {
  app.listen(port, () => {
    next();
  });
};

startupBoot.push(serverStartup);

async.waterfall(startupBoot, (err) => {
  if (err) {
    logger.error('Unable to start server - please restart the service', err);
  } else {
    logger.info(`Server started on port ${port} (${env})`);
  }
});

/**
* Exports express
* @public
*/
module.exports = app;
