/* istanbul ignore file */
const { serviceName } = require('@config/vars');

exports.routes = {
  root: 'default'
};

exports.services = {
  input: 'input',
  route: 'route'
};

exports.codes = {
  userNotFound: 'userNotFound',
  validationError: 'validationError',
  notFound: 'notFound',
  unknown: 'unknown',
  recordNotFound: 'recordNotFound'
};

exports.getErrorCode = (route, service, code) => {
  const result = [serviceName, route, service, code].join(':');
  return result;
};
