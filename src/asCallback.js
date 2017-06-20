const { patchPromiseStatic, unpatchPromiseStatic } = require('./static');

/**
 * Calls the specified callback with the result of the promise.
 *
 * Note that if the callback throws a synchronous error, then we will trigger an unhandled
 * rejection.
 *
 * @param {Promise} promise
 * @param {Function<Err, Any>} cb - An errback.
 */
function asCallback(promise, cb) {
  promise.then((res) => cb(null, res), cb);
}

/**
 * Patches the global `Promise` built-in to define `asCallback` as an instance method,
 * so you can do e.g. `Promise.resolve(true).asCallback(cb)`.
 *
 * Idempotent.
 *
 * @throws {Error} If `Promise` already defines `asCallback`.
 */
function patchPromise() {
  if (Promise.prototype.asCallback !== promiseAsCallback) {
    if (Promise.prototype.asCallback) throw new Error('`Promise` already defines `asCallback`.');
    Object.defineProperty(Promise.prototype, 'asCallback', {
      writable: true,
      configurable: true,
      value: promiseAsCallback
    });
  }
  patchPromiseStatic();
}

/**
 * Undoes `patchPromise`.
 *
 * A no-op if `patchPromise` had not been called.
 */
function unpatchPromise() {
  if (Promise.prototype.asCallback === promiseAsCallback) {
    delete Promise.prototype.asCallback;
  }
  unpatchPromiseStatic();
}

function promiseAsCallback(cb) {
  asCallback(this, cb);
}

module.exports = {
  asCallback,
  patchPromise,
  unpatchPromise
};
