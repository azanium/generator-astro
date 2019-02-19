/**
 * ClientRoutes Middleware
 *
 */

import * as middlewares from '@routes';

const routeMatcher = require('path-match')({
  sensitive: false,
  strict: false,
  end: false,
});
const { parse } = require('url');
const clientRoutes = require('@ducks/routes');

const clientRoutesMiddleware = (req, res, next) => {
  const middlewareKeys = Object.keys(middlewares);

  let middleware;
  let params;
  Object.keys(clientRoutes).forEach((routeKey) => {
    const route = clientRoutes[routeKey];
    if (typeof route === 'object') {
      const matcher = routeMatcher(route.path);
      params = matcher(parse(req.url).pathname);

      // If we found the params from the route and the middleware is exists for this route, then use the middleware
      if (typeof params === 'object' && middlewareKeys.indexOf(routeKey) > -1) {
        middleware = middlewares[routeKey];
      }
    }
  });

  // We found it, use the middleware
  if (middleware) {
    middleware(params)(req, res, next);
  } else {
    next();
  }
};

module.exports = clientRoutesMiddleware;
