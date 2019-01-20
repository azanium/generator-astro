/* istanbul ignore file */
/**
 * Http Service
 *
 */
const axios = require('axios');
const axiosRetry = require('axios-retry');
const { logger } = require('@utils/logger');
const { http } = require('@config/vars');

const instance = axios.create({
  timeout: http.timeout,
  responseType: http.responseType,
  responseEncoding: http.responseEncoding
});

instance.interceptors.request.use((request) => {
  logger.info('HTTP External API Request', request);
  return request;
});

instance.interceptors.response.use((response) => {
  logger.info('HTTP External API Response', response);
  return response;
});

axiosRetry(instance, {
  retries: http.retries,
  retryDelay: axiosRetry.exponentialDelay
});

module.exports = instance;
