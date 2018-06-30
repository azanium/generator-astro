const sinon = require('sinon');
const MockRequest = require('mock-express-request');
const MockResponse = require('mock-express-response');

const { describe, it } = require('mocha');
const { loggerMiddleware } = require('./logger.middleware');

const sandbox = sinon.createSandbox();
const response = new MockResponse();
const request = new MockRequest();

describe('Middleware - logger', () => {
  beforeEach(() => { });

  afterEach(() => {
    sandbox.restore();
  });

  it('should write log for success response', () => {
    response.statusCode = 200;
    const nextStub = sandbox.stub();
    const streamStub = { write: sandbox.stub() };

    loggerMiddleware({
      skip: (req, res) => res.statusCode >= 400,
      stream: streamStub
    })(request, response, nextStub);

    sinon.assert.calledOnce(streamStub.write);
  });

  it('should skip write log for error response', () => {
    response.statusCode = 404;
    const nextStub = sandbox.stub();
    const streamStub = { write: sandbox.stub() };

    loggerMiddleware({
      skip: (req, res) => res.statusCode >= 400,
      stream: streamStub
    })(request, response, nextStub);

    sinon.assert.notCalled(streamStub.write);
  });

  it('should pass using blank stream options', () => {
    response.statusCode = 404;
    const nextStub = sandbox.stub();

    loggerMiddleware()(request, response, nextStub);

    sinon.assert.calledOnce(nextStub);
  });
});
