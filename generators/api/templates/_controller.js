const httpStatus = require('http-status');

/**
 * <%= name %>
 * @public
 */
exports.<%= name %> = async (req, res, next) => {
  try {
    res.status(httpStatus.OK);
    return res.json({ message: 'OK' });
  } catch (error) {
    return next(error);
  }
};
