const httpStatus = require('http-status');
const APIError = require('./APIError');

describe('Utils - APIError', () => {
  const message = 'message';
  const errors = [];
  const route = 'test';
  const stack = {};
  const status = httpStatus.INTERNAL_SERVER_ERROR;
  const isPublic = true;

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
});
