const path = require('path');

module.exports = {
  modify: (config) => {
    config.resolve.alias = {  // eslint-disable-line
      '@app': path.resolve('src/server'),
      '@config': path.resolve('src/server/config'),
      '@api': path.resolve('src/server/api'),
      '@middlewares': path.resolve('src/server/middlewares'),
      '@models': path.resolve('src/server/models'),
      '@services': path.resolve('src/server/services'),
      '@utils': path.resolve('src/server/utils')
    };
    return config;
  }
};
