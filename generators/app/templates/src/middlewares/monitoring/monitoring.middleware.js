/**
 * Monitoring Middleware
 *
 */

const responseTime = require('response-time');
const { logger } = require('@utils/logger');
const { serviceName } = require('@config/vars');

const monitoringMiddleware = responseTime((req, res, time) => {
  const now = Date.now();
  const logData = {
    url: req.originalUrl,
    serviceName,
    client: {
      ipAddress: req.ip
    },
    methodName: req.methodName,
    request: {
      header: req.headers,
      body: req.body,
      params: req.query
    },
    response: {
      header: res.header()._headers,
      body: req.responseBody
    },
    requestTime: Math.round((now - time) * 10) / 10,
    requestEnd: now,
    responseTime: time,
    statusCode: res.statusCode
  };
  logger.info(`API Request`, logData);
});


module.exports = monitoringMiddleware;
