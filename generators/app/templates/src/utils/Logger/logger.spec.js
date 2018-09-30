const { describe, it } = require('mocha');
const sinon = require('sinon');
const MockRequest = require('mock-express-request');
const rewire = require('rewire');

const util = rewire('./logger');

const sandbox = sinon.createSandbox();

const request = new MockRequest({
  method: 'PUT',
  url: '/api/status'
});

describe('Utility - logger', () => {
  const req = request;
  let infoSpy;
  let errorSpy;
  let debugSpy;
  let warnSpy;

  beforeEach(() => {
    infoSpy = sandbox.spy(util.logger, 'info');
    errorSpy = sandbox.spy(util.logger, 'error');
    debugSpy = sandbox.spy(util.logger, 'debug');
    warnSpy = sandbox.spy(util.logger, 'warn');
  });

  afterEach(() => sandbox.restore());

  it('should write info log stream', () => {
    util.logger.stream.write(req);

    sinon.assert.calledOnce(infoSpy);
  });

  it('should write error log stream', () => {
    util.logger.streamError.write(req);

    sinon.assert.calledOnce(errorSpy);
  });

  it('should write debug log', () => {
    util.debug('method', 'message', { data: 1 });

    sinon.assert.calledOnce(debugSpy);
  });

  it('should write warn log', () => {
    util.warn('method', 'message', {}, {});

    sinon.assert.calledOnce(warnSpy);
  });

  it('should capture error', () => {
    util.captureError('title', { message: 'error' }, 'method');

    sinon.assert.calledOnce(errorSpy);
  });

  it('should capture error response', () => {
    const methodName = 'method';
    const errorMessage = 'error';
    const response = 'stupid';

    const error = {
      message: errorMessage,
      response: {
        data: response
      }
    };
    util.captureError('title', error, methodName);

    sinon.assert.calledOnce(errorSpy);
  });

  it('should capture error response with stack', () => {
    const methodName = 'method';
    const errorMessage = 'error';
    const response = 'stupid';
    const stack = 'stack';

    const error = {
      message: errorMessage,
      response: {
        data: response
      },
      stack
    };
    util.captureError('title', error, methodName);

    sinon.assert.calledOnce(errorSpy);
  });
});
