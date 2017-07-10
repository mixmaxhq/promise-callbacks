'use strict';

const wrapAsync = require('../../src/statics/wrapAsync');

describe('helpers', function () {
  describe('wrapAsync', function () {
    it('should handle the callback with synchronous errors', function () {
      const fn = wrapAsync(function poorlyDesigned(done) {
        process.nextTick(() => done(null, true));
        throw new Error('tada');
      }, {catchExceptions: false});

      expect(fn).toThrowError(Error, 'tada');
    });

    it('should handle the callback with caught synchronous errors', function () {
      const fn = wrapAsync(function poorlyDesigned(done) {
        process.nextTick(() => done(null, true));
        throw new Error('tada');
      });

      return fn().then(() => {
        throw new Error('expected rejection');
      }, (err) => {
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('tada');
      });
    });

    it('should ignore synchronous errors', function () {
      const fn = wrapAsync(function throwsError() {
        throw new Error('data');
      }, {catchExceptions: false});

      expect(fn).toThrowError('data');
    });
  });
});
