const httpStatus = require('http-status');

/**
 * <%= name %>
 * @public
 */
exports.<%= name %> = async (req, res, next) => {
  try {
    res.status(httpStatus.OK);
    return res.json({ 
      responseCode: 200,
      responseMessage: 'OK',
      response: {}
    });
  } catch (error) {
    return next(error);
  }
};
