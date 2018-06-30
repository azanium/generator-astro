const { describe, it } = require('mocha');
const { expect } = require('chai');
const httpStatus = require('http-status');
const sinon = require('sinon');
const APIError = require('./APIError');

const sandbox = sinon.createSandbox();

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
    sandbox.restore();
  });

  it('should create a valid default APIError', () => {
    const sut = new APIError({
      message,
      errors,
      stack
    });
    expect(sut).to.have.property('message');
    expect(sut).to.have.property('errors');
    expect(sut).to.have.property('route');
    expect(sut).to.have.property('stack');
    expect(sut).to.have.property('status');
    expect(sut).to.have.property('isPublic');
    expect(sut.message).equal(message);
    expect(sut.errors).to.be.empty; // eslint-disable-line
    expect(sut.route).equal('default');
    expect(sut.status).equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(sut.isPublic).equal(false);
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
    expect(sut).to.have.property('message');
    expect(sut).to.have.property('errors');
    expect(sut).to.have.property('route');
    expect(sut).to.have.property('stack');
    expect(sut).to.have.property('status');
    expect(sut).to.have.property('isPublic');
    expect(sut.message).equal(message);
    expect(sut.errors).to.be.empty; // eslint-disable-line
    expect(sut.route).equal(route);
    expect(sut.status).equal(status);
    expect(sut.isPublic).equal(isPublic);
  });
});
