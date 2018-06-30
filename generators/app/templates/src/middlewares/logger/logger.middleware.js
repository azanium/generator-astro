const loggerMiddleware = (options) => { // eslint-disable-line
  const opts = options || { skip: () => false };
  return (req, res, next) => {
    const skip = opts.skip(req, res);
    if (!skip) {
      if (opts && opts.stream && opts.stream.write) {
        opts.stream.write(req, res);
      }
    }
    next();
  };
};

module.exports = {
  loggerMiddleware
};
