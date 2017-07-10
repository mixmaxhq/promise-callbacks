'use strict';

const pc = require('..');
const asCallback = pc.asCallback;
const patchPromise = pc.patchPromise;
const unpatchPromise = pc.unpatchPromise;

/**
 * Wrap the asCallback function with a check that ensures the callback is never called twice.
 */
function asCheckedCallback(promise, cb, useOwnMethod) {
  let called = false;
  if (useOwnMethod) {
    promise.asCallback(after);
  } else {
    asCallback(promise, after);
  }

  function after() {
    expect(called).toBeFalsy();
    called = true;
    return cb.apply(this, arguments);
  }
}

describe('asCallback', function() {
  it('lets you handle promise errors using callbacks', function(done) {
    asCheckedCallback(Promise.reject(new Error('boo')), function(err, res) {
      expect(err).toBeTruthy();
      expect(err.constructor).toBe(Error);
      expect(err.message).toBe('boo');

      expect(res).toBeFalsy();

      done();
    });
  });

  it('lets you handle promise results using callbacks', function(done) {
    asCheckedCallback(Promise.resolve(true), function(err, res) {
      expect(err).toBeFalsy();
      expect(res).toBe(true);
      done();
    });
  });

  describe('as `Promise` method', function() {
    beforeEach(function() {
      patchPromise();
    });

    afterEach(function() {
      unpatchPromise();
    });

    it('lets you handle errors using callbacks', function(done) {
      asCheckedCallback(Promise.reject(new Error('boo')), function(err, res) {
        expect(err).toBeTruthy();
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('boo');

        expect(res).toBeFalsy();

        done();
      }, true);
    });

    it('lets you handle results using callbacks', function(done) {
      asCheckedCallback(Promise.resolve(true), function(err, res) {
        expect(err).toBeFalsy();
        expect(res).toBe(true);
        done();
      }, true);
    });

    // The callback should terminate the promise chain if any.
    it('does not return the promise', function() {
      expect(Promise.resolve(true).asCallback(function() {})).toBeUndefined();
    });

    it('is no-op when binding multiple times', function(done) {
      expect(patchPromise).not.toThrow();

      asCheckedCallback(Promise.resolve(true), function(err, res) {
        expect(err).toBeFalsy();
        expect(res).toBe(true);
        done();
      }, true);
    });

    it('can be unbound', function() {
      expect(Promise.prototype.asCallback).toBeDefined();
      unpatchPromise();
      expect(Promise.prototype.asCallback).not.toBeDefined();
    });

    it('refuses to overwrite existing method', function() {
      unpatchPromise();

      function fn() {}
      Promise.prototype.asCallback = fn;
      expect(patchPromise).toThrow();

      expect(unpatchPromise).not.toThrow();
      expect(Promise.prototype.asCallback).toBe(fn);
    });
  });
});
