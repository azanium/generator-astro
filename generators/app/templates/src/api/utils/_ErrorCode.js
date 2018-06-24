exports.routes = {
  root: 'default',
};

exports.services = {
  dynamoDB: 'dynamoDB',
  input: 'input',
  route: 'route',
};

exports.codes = {
  userNotFound: 'userNotFound',
  validationError: 'validationError',
  notFound: 'notFound',
  unknown: 'unknown',
  recordNotFound: 'recordNotFound',
};

exports.getErrorCode = (route, service, code) => {
  const result = ['<%= name %>', route, service, code].join(':');
  return result;
};

exports.wrapError = (errCode, errTitle, errDesc, errDebugDesc, errAttributes) => {
  const result = {
    errorCode: errCode,
    errorTitle: errTitle,
    errorDescription: errDesc,
    errorDebugDescription: errDebugDesc,
    errorAttributes: errAttributes,
  };
  return result;
};
