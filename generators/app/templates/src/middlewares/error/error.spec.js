/* eslint-disable arrow-body-style */

const httpStatus = require('http-status');
const sinon = require('sinon');
const MockRequest = require('mock-express-request');
const MockResponse = require('mock-express-response');

const { describe, it } = require('mocha');
const { expect } = require('chai');
const { ValidationError } = require('express-validation');
const {
  converter,
  generateNotFoundError,
  convertGenericError,
  convertValidationError,
  notFound,
  handler
} = require('./error');


const sandbox = sinon.createSandbox();
const response = new MockResponse();
const request = new MockRequest({
  method: 'PUT',
  url: '/api/v1/auth/login'
});

describe('Middleware - error', () => {
  const req = request;
  const res = response;
  const validationError = new ValidationError([{
    location: 'body',
    messages: ['"nonce" is required'],
    types: ['any.required']
  }], {
    flatten: true,
    status: 400,
    statusText: 'validation error'
  });

  beforeEach(() => {
    this.statusStub = sandbox.stub(res, 'status');
    this.jsonStub = sandbox.stub(res, 'json');
    this.endStub = sandbox.stub(res, 'end');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should convert validation error into API error with custom route', () => {
    req.path = '/idp/v1/auth/invalid';
    const route = 'root';
    validationError.route = route;
    const apiError = convertValidationError(validationError, req);

    expect(apiError).to.have.a.property('name');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('status');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('isPublic');
    expect(apiError).to.have.a.property('route');
    expect(apiError).to.have.a.property('isOperational');
    expect(apiError.name).equal('APIError');
    expect(apiError.status).equal(httpStatus.BAD_REQUEST);
    expect(apiError.errors).to.be.an('array').that.is.not.empty;  // eslint-disable-line
    expect(apiError.errors[0]).to.have.property('errorCode');
    expect(apiError.errors[0].errorCode).equal('api:v1:auth:login:validationError');
    expect(apiError.errors[0]).to.have.property('errorTitle');
    expect(apiError.errors[0].errorTitle).equal('We seems to have a problem!');
    expect(apiError.errors[0]).to.have.property('errorDescription');
    expect(apiError.errors[0].errorDescription).equal('We have some trouble validating your data - please contact our customer support');
    expect(apiError.errors[0]).to.have.property('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).equal('"nonce" is required');
    expect(apiError.route).equal(route);
  });

  it('should convert validation error into API error with default route', () => {
    req.path = '/idp/v1/auth/invalid';

    delete validationError.route;
    const apiError = convertValidationError(validationError, req);

    expect(apiError).to.have.a.property('name');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('status');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('isPublic');
    expect(apiError).to.have.a.property('route');
    expect(apiError).to.have.a.property('isOperational');
    expect(apiError.name).equal('APIError');
    expect(apiError.status).equal(httpStatus.BAD_REQUEST);
    expect(apiError.errors).to.be.an('array').that.is.not.empty;  // eslint-disable-line
    expect(apiError.errors[0]).to.have.property('errorCode');
    expect(apiError.errors[0].errorCode).equal('api:v1:auth:login:validationError');
    expect(apiError.errors[0]).to.have.property('errorTitle');
    expect(apiError.errors[0].errorTitle).equal('We seems to have a problem!');
    expect(apiError.errors[0]).to.have.property('errorDescription');
    expect(apiError.errors[0].errorDescription).equal('We have some trouble validating your data - please contact our customer support');
    expect(apiError.errors[0]).to.have.property('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).equal('"nonce" is required');
    expect(apiError.route).equal('default');
  });

  it('should convert generic error into API error', () => {
    const error = new Error('Something went wrong');

    const apiError = convertGenericError(error, req);
    expect(apiError).to.have.a.property('name');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('status');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('isPublic');
    expect(apiError).to.have.a.property('route');
    expect(apiError).to.have.a.property('isOperational');
    expect(apiError.name).equal('APIError');
    expect(apiError.status).equal(httpStatus.INTERNAL_SERVER_ERROR);
    expect(apiError.errors).to.be.an('array').that.is.not.empty;  // eslint-disable-line
    expect(apiError.errors[0]).to.have.property('errorCode');
    expect(apiError.errors[0].errorCode).equal('api:v1:auth:login:unknown');
    expect(apiError.errors[0]).to.have.property('errorTitle');
    expect(apiError.errors[0].errorTitle).equal('We seems to have a problem!');
    expect(apiError.errors[0]).to.have.property('errorDescription');
    expect(apiError.errors[0].errorDescription).equal('Our internal system is having problem, please contact our administrator!');
    expect(apiError.errors[0]).to.have.property('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).equal('Something went wrong');
  });

  it('should generate Not Found API error', () => {
    const apiError = generateNotFoundError();
    expect(apiError).to.have.a.property('name');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('status');
    expect(apiError).to.have.a.property('errors');
    expect(apiError).to.have.a.property('isPublic');
    expect(apiError).to.have.a.property('route');
    expect(apiError).to.have.a.property('isOperational');
    expect(apiError.name).equal('APIError');
    expect(apiError.status).equal(httpStatus.NOT_FOUND);
    expect(apiError.errors).to.be.an('array').that.is.not.empty;  // eslint-disable-line
    expect(apiError.errors[0]).to.have.property('errorCode');
    expect(apiError.errors[0].errorCode).to.be.not.empty; // eslint-disable-line
    expect(apiError.errors[0]).to.have.property('errorTitle');
    expect(apiError.errors[0].errorTitle).equal('Oops! We have a problem.');
    expect(apiError.errors[0]).to.have.property('errorDescription');
    expect(apiError.errors[0].errorDescription).equal('We couldn\'t find what you\'re looking for - please contact our administrator!');
    expect(apiError.errors[0]).to.have.property('errorDebugDescription');
    expect(apiError.errors[0].errorDebugDescription).equal('Invalid API route');
  });

  it('error converter should convert validation error', () => {
    converter(validationError, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.BAD_REQUEST);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('error converter should convert generic error', () => {
    const error = new Error('Something went wrongasdasdasddsa');
    converter(error, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.INTERNAL_SERVER_ERROR);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('error converter should convert APIError', () => {
    const error = convertValidationError(validationError, req);
    converter(error, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.BAD_REQUEST);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('notFound middleware should generate not found error', () => {
    notFound(req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.NOT_FOUND);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('handler middleware should return http status message for error without message', () => {
    const err = new Error();
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    handler(err, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.INTERNAL_SERVER_ERROR);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('handler middleware should return error with error stack', () => {
    const err = new Error();
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    process.env.NODE_ENV = 'development';
    handler(err, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.INTERNAL_SERVER_ERROR);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('handler middleware should return error without error stack', () => {
    const err = new Error();
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    process.env.NODE_ENV = 'development';
    handler(err, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.INTERNAL_SERVER_ERROR);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });

  it('handler middleware should convert error with http status = 0, into internal server error', () => {
    const err = new Error();
    err.status = 0;
    handler(err, req, res);

    sinon.assert.calledWith(this.statusStub, httpStatus.INTERNAL_SERVER_ERROR);
    sinon.assert.calledOnce(this.jsonStub);
    sinon.assert.calledOnce(this.endStub);
  });
});
