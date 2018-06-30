const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const sanitizer = require('node-sanitizer');
const { serviceName, sanitizedFields } = require('../../config/vars');

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true
  }
};

const transports = [
  new winston.transports.Console(options.console)
];

// Only create cloudwatch log for production
/* istanbul ignore else  */
/* istanbul ignore if  */
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new WinstonCloudWatch({
      logGroupName: serviceName,
      logStreamName: process.env.NODE_ENV,
      createLogGroup: true,
      createLogStream: true,
      handleExceptions: true,
      jsonMessage: true,
      awsRegion: process.env.AWS_REGION
    })
  );
}

// instantiate a new Winston Logger with the settings defined above
const logger = winston.loggers.add(process.env.NODE_ENV, {
  transports
});

// create a stream object with a 'write' function that will be used by `loggerMiddleware`
logger.stream = {
  write: (req) => {
    logger.info(`${req.method} request to ${req.url}`, {
      body: sanitizer(req.body, sanitizedFields),
      query: sanitizer(req.query, sanitizedFields)
    });
  }
};

logger.streamError = {
  write: (req) => {
    logger.error(`${req.method} request to ${req.url}`, {
      body: sanitizer(req.body, sanitizedFields),
      query: sanitizer(req.query, sanitizedFields)
    });
  }
};

module.exports = {
  logger
};
