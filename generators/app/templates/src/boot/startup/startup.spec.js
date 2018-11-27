/* eslint-disable arrow-body-style */
const { startupBoot } = require('./startup.boot');

describe('Boot - startupBoot', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('should run startupBoot and pass sequence to next boot task', (done) => {
    const app = {};

    startupBoot(app, (err) => {
      expect(err).toBe(undefined);
      done();
    });
  });
});
