const httpStatus = require('http-status');
const request = require('supertest');
const express = require('express');
const middleware = require('./monitoring.middleware');

jest.mock('../../utils/logger');
const { logger } = require('../../utils/logger');


describe('Middleware - monitoringMiddleware', () => {
  let app;

  beforeEach(async () => {
    app = express();
  });

  afterEach(() => {});

  it('should pass request', () => {
    app.use((req, res, next) => {
      req.useragent = {
        browser: 'mocha',
        platform: 'node',
        os: 'OS X'
      };
      next();
    });
    app.use(middleware);
    const router = express.Router();
    app.use('/', router);

    router.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    return request(app)
      .get('/health')
      .set('useragent', 'Something')
      .expect(httpStatus.OK)
      .then(() => {
        expect(logger.info).toBeCalledTimes(1);
      });
  });
});
