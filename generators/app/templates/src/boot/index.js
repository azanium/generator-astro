const { startupBoot } = require('./startup');
const { serverBoot } = require('./server');

module.exports = [
  startupBoot,
  serverBoot
];
