const httpStatus = require('http-status');
const { routes } = require('./../ErrorCode');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({
    message, errors, route, status, isPublic, stack
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
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
}

module.exports = APIError;
