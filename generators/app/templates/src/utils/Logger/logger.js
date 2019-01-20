const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const sanitizer = require('node-sanitizer');
// Uncomment the following line if you use elastic APM
// const apm = require('elastic-apm-node');
const { serviceName, sanitizedFields } = require('@config/vars');

const {
  combine,
  colorize,
  simple
} = winston.format;

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
    format: combine(
      colorize(),
      simple()
    )
  }
};

const transports = [
  new winston.transports.Console(options.console),
  new WinstonCloudWatch({
    logGroupName: serviceName,
    logStreamName: process.env.NODE_ENV,
    createLogGroup: true,
    createLogStream: true,
    handleExceptions: true,
    jsonMessage: true,
    awsRegion: process.env.AWS_DEFAULT_REGION
  })
];

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

/**
 * Debug Log
 * @param {String} methodName Method's name
 * @param {String} message    Debug message
 * @param {Object} data       Debug data
 */
const debug = (methodName, message, data) => {
  const logData = {
    serviceName,
    methodName,
    data,
    message
  };
  logger.debug(message, logData);
};

/**
 * Warn Log
 * @param {String} methodName   Method's name
 * @param {String} message      Warn message
 * @param {Object} data         Warn data
 * @param {Object} error        Error
 */
const warn = (methodName, message, data, error) => {
  const logData = {
    serviceName,
    methodName,
    data,
    message,
    error
  };
  logger.warn(message, logData);
};

/**
 * Capture Error
 * @param {String} title        Error's title
 * @param {Object} error        Error's data
 * @param {String} methodName   Method's name
 */
const captureError = (title, error, methodName) => {
  // Uncomment the following line if you use elastic APM
  // apm.captureError(error);

  const logData = {
    serviceName,
    methodName,
    error: error.message
  };

  if (error.stack) {
    logData.stack = error.stack;
  }

  if (error.response && error.response.data) {
    logData.response = error.response.data;
  }
  logger.error(title, logData);
};


module.exports = {
  logger,
  debug,
  warn,
  captureError
};
