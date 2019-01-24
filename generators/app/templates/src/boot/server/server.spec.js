/* eslint-disable arrow-body-style */
const { serverBoot } = require('./server.boot');

describe('Boot - serverBoot', () => {
  beforeEach(() => {});

  afterEach(() => {});

  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should not run server during test', (done) => {
    const app = {};

    serverBoot(app, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });

  it('should run task and pass sequence to next boot task', (done) => {
    const app = {
      listen: jest.fn().mockImplementation((port, cb) => cb())
    };

    process.env.NODE_ENV = 'development';

    serverBoot(app, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });
});
