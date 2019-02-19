/* eslint-disable arrow-body-style */
const MockRequest = require('mock-express-request');
const MockResponse = require('mock-express-response');

jest.mock('@ducks/routes', () => ({
  esModule: true,
  login: {
    path: '/login',
    component: () => ({})
  }
}));

describe('Middleware - clientRoutesMiddleware', () => {
  const req = new MockRequest({
    url: '/login/:id'
  });
  const res = new MockResponse();

  beforeEach(() => {
    jest.resetModules();
  });

  it('should not found middleware for the client route', (done) => {
    const clientRoutesMiddleware = require('./client-routes.middleware'); // eslint-disable-line
    jest.mock('@routes', () => ({ esModule: true }));

    clientRoutesMiddleware(req, res, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });

  it('should found middleware for the client route', (done) => {
    const clientRoutesMiddleware = require('./client-routes.middleware'); // eslint-disable-line
    jest.mock('@routes', () => ({ esModule: true, login: () => (req, res, next) => next() }));  // eslint-disable-line

    clientRoutesMiddleware(req, res, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });
});
