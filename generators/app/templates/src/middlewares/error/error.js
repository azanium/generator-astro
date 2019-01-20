const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const _ = require('lodash');

const { APIError, generateError } = require('@utils/APIError');
const {
  getErrorCode, routes, services, codes
} = require('@utils/ErrorCode');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    responseCode: err.status,
    responseMessage: err.message || httpStatus[err.status],
    response: {
      errors: err.errors,
      stack: err.stack
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    delete response.response.stack;
  }

  if (err.status >= 100 && err.status < 600) {
    res.status(err.status);
  } else {
    res.status(500);
  }

  res.json(response);
  res.end();
};
exports.handler = handler;


/**
 * Convert Validaton error into APIError
 *
 * @param  {Object} err   Error object
 * @param  {Object} req   Request object
 */
const convertValidationError = (err, req) => {
  const formattedErrors = [];
  err.errors.forEach((error) => {
    formattedErrors.push(generateError(
      [req.path.replace('/', '').split('/').join(':'), codes.validationError].join(':'),
      'We seems to have a problem!',
      'We have some trouble validating your data - please contact our customer support',
      error.messages[0],
      _.omit(error, ['messages'])
    ));
  });

  return new APIError({
    message: 'Validation error',
    errors: formattedErrors,
    route: err.route ? err.route : routes.root,
    status: err.status,
    stack: err.stack
  });
};

exports.convertValidationError = convertValidationError;

/**
 * Convert generic error into APIError
 *
 * @param  {Object} err   Error object
 * @param  {Object} req   Request object
 * @oublic
 */
const convertGenericError = (err, req) => {
  const wrappedError = generateError(
    err.code || [req.path.replace('/', '').split('/').join(':'), codes.unknown].join(':'),
    'We seems to have a problem!',
    'Our internal system is having problem, please contact our administrator!',
    err.message, []
  );

  return new APIError({
    message: 'Internal server error',
    errors: [wrappedError],
    route: routes.root,
    status: httpStatus.INTERNAL_SERVER_ERROR,
    stack: err.stack
  });
};

exports.convertGenericError = convertGenericError;

/**
 * Generate not found error for APIError
 *
 * @param  {Object} err   Error object
 * @param  {Object} req   Request object
 * @oublic
 */
const generateNotFoundError = () => {
  const errors = [
    {
      errorCode: getErrorCode(routes.root, services.route, codes.notFound),
      errorTitle: 'Oops! We have a problem.',
      errorDescription: `We couldn't find what you're looking for - please contact our administrator!`,
      errorDebugDescription: 'Invalid API route',
      errorAttributes: {}
    }
  ];

  return new APIError({
    message: 'Not found',
    errors,
    route: routes.root,
    status: httpStatus.NOT_FOUND
  });
};

exports.generateNotFoundError = generateNotFoundError;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;
  if (err instanceof expressValidation.ValidationError) {
    convertedError = convertValidationError(err, req);
  } else if (!(err instanceof APIError)) {
    convertedError = convertGenericError(err, req);
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => handler(generateNotFoundError(), req, res);
