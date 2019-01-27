const path = require('path');

module.exports = {
  modify: (config) => {
    config.resolve.alias = {  // eslint-disable-line
      '@app': path.resolve('<%= src %>/server'),
      '@config': path.resolve('<%= src %>/config'),
      '@api': path.resolve('<%= src %>/api'),
      '@middlewares': path.resolve('<%= src %>/middlewares'),
      '@models': path.resolve('<%= src %>/models'),
      '@services': path.resolve('<%= src %>/services'),
      '@utils': path.resolve('<%= src %>/utils'),
      '@client': path.resolve('<%= client %>'),
      '@components': path.resolve('<%= client %>/components')
    };
    return config;
  }
};
