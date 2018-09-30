const sinon = require('sinon');
const httpStatus = require('http-status');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const rewire = require('rewire');

const monitoringMiddleware = rewire('./monitoring.middleware');

describe('Middleware - monitoringMiddleware', () => {
  let sandbox;
  let app;
  let loggerStub;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    app = express();
    const logger = monitoringMiddleware.__get__('logger');
    loggerStub = sandbox.stub(logger, 'info');
  });

  afterEach(() => sandbox.restore());

  it('should pass request', () => {
    app.use((req, res, next) => {
      req.useragent = {
        browser: 'mocha',
        platform: 'node',
        os: 'OS X'
      };
      next();
    });
    app.use(monitoringMiddleware);
    const router = express.Router();
    app.use('/', router);

    router.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    return request(app)
      .get('/health')
      .set('useragent', 'Something')
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.text).equal('OK');
        sinon.assert.calledOnce(loggerStub);
      });
  });
});
