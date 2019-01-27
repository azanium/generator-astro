/**
 * Server Boot
 *
 */

const { logger } = require('@utils/logger');
const { port, env } = require('@config/vars');

const serverBoot = (app, next) => {
  logger.info('Starting server...');
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      logger.info(`Server started on port ${port} (${env})`);
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  serverBoot
};
