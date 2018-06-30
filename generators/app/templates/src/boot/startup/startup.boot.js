const { logger } = require('../../utils/logger');

const startupBoot = (next) => {
  logger.info('Starting up booting tasks...');
  next();
};

module.exports = {
  startupBoot
};
