const httpStatus = require('http-status');
const { routes } = require('@utils/ErrorCode');

/**
 * Wrap Error
 * @param {String} errCode        Code
 * @param {String} errTitle       Title
 * @param {String} errDesc        Description
 * @param {String} errDebugDesc   Debug Description
 * @param {Object} errAttributes  Attributes
 */
const generateError = (errCode, errTitle, errDesc, errDebugDesc, errAttributes) => {
  const result = {
    errorCode: errCode,
    errorTitle: errTitle,
    errorDescription: errDesc,
    errorDebugDescription: errDebugDesc,
    errorAttributes: errAttributes
  };
  return result;
};

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({
    message, errors, route, status, isPublic, stack
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || 'Oops! Something is wrong';
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.route = route;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    this.stack = stack;
    // Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message,
    errors,
    route = routes.root,
    stack,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false
  }) {
    super({
      message, errors, route, status, isPublic, stack
    });
  }

  static notFound() {
    return new APIError({
      message: 'Resource not found!',
      status: httpStatus.NOT_FOUND,
      errors: [
        generateError(
          'NOT_FOUND',
          'Oops! Something is wrong',
          'The resource you are looking for does not exist!',
          'Client with that name is not exist'
        )
      ]
    });
  }

  static forbidden() {
    return new APIError({
      message: 'Request forbidden!',
      status: httpStatus.FORBIDDEN,
      errors: [
        generateError(
          'FORBIDDEN',
          'Oops! Something is wrong',
          'This name already exist, please choose another name',
          'Client with that name is already exist'
        )
      ]
    });
  }
}

module.exports = {
  APIError,
  generateError
};
