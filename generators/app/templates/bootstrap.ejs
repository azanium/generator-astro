const http = require('http');
const { port, env } = require('@config/vars');
const { logger } = require('@utils/logger');
const app = require('./server');

const server = http.createServer(app);
let currentApp = app;

server.listen(port || 3000, (error) => {
  if (error) {
    logger.error(error);
  }
  logger.info(`🚀 Server started on port ${port} (${env})`);
});

if (module.hot) {
  logger.info('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    logger.info('🔁  HMR Reloading `./server`...');

    try {
      const newApp = require('./server'); // eslint-disable-line
      server.removeListener('request', currentApp);
      server.on('request', newApp);
      currentApp = newApp;
    } catch (error) {
      console.error(error);
    }
  });
}

module.exports = app;
