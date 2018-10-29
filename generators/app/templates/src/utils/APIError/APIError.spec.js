const httpStatus = require('http-status');
const { APIError, generateError } = require('./APIError');

describe('Utils - APIError', () => {
  const message = 'message';
  const errors = [];
  const route = 'test';
  const stack = {};
  const status = httpStatus.INTERNAL_SERVER_ERROR;
  const isPublic = true;
  const errCode = 'ERR';
  const errTitle = 'title';
  const errDesc = 'desc';
  const errDebugDesc = 'debugDesc';
  const errAttributes = [];

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a valid default APIError', () => {
    const sut = new APIError({
      message,
      errors,
      stack
    });
    expect(sut).toHaveProperty('message');
    expect(sut).toHaveProperty('errors');
    expect(sut).toHaveProperty('route');
    expect(sut).toHaveProperty('stack');
    expect(sut).toHaveProperty('status');
    expect(sut).toHaveProperty('isPublic');
    expect(sut.message).toBe(message);
    expect(sut.errors).toEqual([]);
    expect(sut.route).toBe('default');
    expect(sut.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(sut.isPublic).toBe(false);
  });

  it('should create a valid default APIError without custom message', () => {
    const sut = new APIError({
      errors,
      stack
    });
    expect(sut).toHaveProperty('message');
    expect(sut).toHaveProperty('errors');
    expect(sut).toHaveProperty('route');
    expect(sut).toHaveProperty('stack');
    expect(sut).toHaveProperty('status');
    expect(sut).toHaveProperty('isPublic');
    expect(sut.message).toBe('Oops! Something is wrong');
    expect(sut.errors).toEqual([]);
    expect(sut.route).toBe('default');
    expect(sut.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(sut.isPublic).toBe(false);
  });

  it('should create a valid custom APIError', () => {
    const sut = new APIError({
      message,
      errors,
      route,
      stack,
      status,
      isPublic
    });
    expect(sut).toHaveProperty('message');
    expect(sut).toHaveProperty('errors');
    expect(sut).toHaveProperty('route');
    expect(sut).toHaveProperty('stack');
    expect(sut).toHaveProperty('status');
    expect(sut).toHaveProperty('isPublic');
    expect(sut.message).toBe(message);
    expect(sut.errors).toEqual([]); // eslint-disable-line
    expect(sut.route).toBe(route);
    expect(sut.status).toBe(status);
    expect(sut.isPublic).toBe(isPublic);
  });

  it('should generate error', () => {
    const error = generateError(errCode, errTitle, errDesc, errDebugDesc, errAttributes);

    expect(error).toHaveProperty('errorCode');
    expect(error).toHaveProperty('errorTitle');
    expect(error).toHaveProperty('errorDescription');
    expect(error).toHaveProperty('errorDebugDescription');
    expect(error).toHaveProperty('errorAttributes');
    expect(error.errorCode).toEqual(errCode);
    expect(error.errorTitle).toEqual(errTitle);
    expect(error.errorDescription).toEqual(errDesc);
    expect(error.errorDebugDescription).toEqual(errDebugDesc);
    expect(error.errorAttributes).toEqual(errAttributes);
  });

  it('should generate not found error', () => {
    const sut = APIError.notFound();

    expect(sut).toHaveProperty('message');
    expect(sut).toHaveProperty('errors');
    expect(sut).toHaveProperty('route');
    expect(sut).toHaveProperty('stack');
    expect(sut).toHaveProperty('status');
    expect(sut).toHaveProperty('isPublic');
    expect(sut.message).toEqual(expect.any(String));
    expect(sut.route).toEqual(expect.any(String));
    expect(sut.status).toEqual(httpStatus.NOT_FOUND);
    expect(sut.isPublic).toEqual(expect.any(Boolean));
  });

  it('should generate forbidden error', () => {
    const sut = APIError.forbidden();

    expect(sut).toHaveProperty('message');
    expect(sut).toHaveProperty('errors');
    expect(sut).toHaveProperty('route');
    expect(sut).toHaveProperty('stack');
    expect(sut).toHaveProperty('status');
    expect(sut).toHaveProperty('isPublic');
    expect(sut.message).toEqual(expect.any(String));
    expect(sut.route).toEqual(expect.any(String));
    expect(sut.status).toEqual(httpStatus.FORBIDDEN);
    expect(sut.isPublic).toEqual(expect.any(Boolean));
  });
});
