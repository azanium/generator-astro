const httpStatus = require('http-status');

/**
 * auth
 * @public
 */
exports.auth = async (req, res, next) => {
  try {
    res.status(httpStatus.OK);
    return res.json({ message: 'OK' });
  } catch (error) {
    return next(error);
  }
};
