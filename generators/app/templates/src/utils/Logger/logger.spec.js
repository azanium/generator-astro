const { describe, it } = require('mocha');
const sinon = require('sinon');
const MockRequest = require('mock-express-request');
const { logger } = require('./logger');

const sandbox = sinon.createSandbox();

const request = new MockRequest({
  method: 'PUT',
  url: '/api/status'
});

describe('Utils - logger', () => {
  const req = request;

  beforeEach(() => {
  });

  afterEach(() => sandbox.restore());

  it('should write info log stream', () => {
    const infoStub = sandbox.stub(logger, 'info');
    logger.stream.write(req);

    sinon.assert.calledOnce(infoStub);
  });

  it('should write error log stream', () => {
    const errorStub = sandbox.stub(logger, 'error');
    logger.streamError.write(req);

    sinon.assert.calledOnce(errorStub);
  });
});
