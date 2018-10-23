const { Request } = require('jest-express/lib/request');
const util = require('./logger');


const request = new Request('/api/status', {
  method: 'PUT'
});

describe('Utility - logger', () => {
  const req = request;
  let infoSpy;
  let errorSpy;
  let debugSpy;
  let warnSpy;

  beforeEach(() => {
    infoSpy = jest.spyOn(util.logger, 'info');
    errorSpy = jest.spyOn(util.logger, 'error');
    debugSpy = jest.spyOn(util.logger, 'debug');
    warnSpy = jest.spyOn(util.logger, 'warn');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should write info log stream', () => {
    util.logger.stream.write(req);

    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it('should write error log stream', () => {
    util.logger.streamError.write(req);

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should write debug log', () => {
    util.debug('method', 'message', { data: 1 });

    expect(debugSpy).toHaveBeenCalledTimes(1);
  });

  it('should write warn log', () => {
    util.warn('method', 'message', {}, {});

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('should capture error', () => {
    util.captureError('title', { message: 'error' }, 'method');

    expect(errorSpy).toHaveBeenCalledTimes(1);
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

    expect(errorSpy).toHaveBeenCalledTimes(1);
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

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
