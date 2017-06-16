const { asCallback, patchPromise, unpatchPromise } = require('../src/asCallback');

/**
 * Wrap the asCallback function with a check that ensures the callback is never called twice.
 */
function asCheckedCallback(promise, cb) {
  let called = false;
  asCallback(promise, function(...args) {
    expect(called).toBeFalsy();
    called = true;
    return cb.apply(this, args);
  });
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
      // Don't use `unpatchPromise` to clean up for both `patchPromise` and
      // the other function attached in `'refuses to overwrite existing method'`.
      delete Promise.prototype.asCallback;
    });

    it('lets you handle errors using callbacks', function(done) {
      Promise.reject(new Error('boo')).asCallback(function(err, res) {
        expect(err).toBeTruthy();
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('boo');

        expect(res).toBeFalsy();

        done();
      });
    });

    it('lets you handle results using callbacks', function(done) {
      Promise.resolve(true).asCallback(function(err, res) {
        expect(err).toBeFalsy();
        expect(res).toBe(true);
        done();
      });
    });

    // The callback should terminate the promise chain if any.
    it('does not return the promise', function() {
      expect(Promise.resolve(true).asCallback(function() {})).toBeUndefined();
    });

    it('is no-op when binding multiple times', function(done) {
      expect(patchPromise).not.toThrow();

      Promise.resolve(true).asCallback(function(err, res) {
        expect(err).toBeFalsy();
        expect(res).toBe(true);
        done();
      });
    });

    it('can be unbound', function() {
      expect(Promise.prototype.asCallback).toBeDefined();
      unpatchPromise();
      expect(Promise.prototype.asCallback).not.toBeDefined();
    });

    it('refuses to overwrite existing method', function() {
      unpatchPromise();

      let fn = function() {};
      Promise.prototype.asCallback = fn;
      expect(patchPromise).toThrow();

      expect(unpatchPromise).not.toThrow();
      expect(Promise.prototype.asCallback).toBe(fn);
    });
  });
});
