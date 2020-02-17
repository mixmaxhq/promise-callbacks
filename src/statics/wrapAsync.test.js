'use strict';

const wrapAsync = require('../../src/statics/wrapAsync');

describe('wrapAsync', () => {
  it('should handle the callback with synchronous errors', () => {
    const fn = wrapAsync(
      function poorlyDesigned(done) {
        process.nextTick(() => done(null, true));
        throw new Error('tada');
      },
      { catchExceptions: false }
    );

    expect(fn).toThrowError(Error, 'tada');
  });

  it('should handle the callback with caught synchronous errors', () => {
    const fn = wrapAsync(function poorlyDesigned(done) {
      process.nextTick(() => done(null, true));
      throw new Error('tada');
    });

    return expect(fn()).rejects.toThrow(new Error('tada'));
  });

  it('should ignore synchronous errors', () => {
    const fn = wrapAsync(
      function throwsError() {
        throw new Error('data');
      },
      { catchExceptions: false }
    );

    expect(fn).toThrowError('data');
  });
});
