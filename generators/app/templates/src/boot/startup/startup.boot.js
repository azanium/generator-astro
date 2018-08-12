const { logger } = require('../../utils/logger');

const startupBoot = (app, next) => {
  logger.info('Starting up booting tasks...');
  next();
};

module.exports = {
  startupBoot
};
