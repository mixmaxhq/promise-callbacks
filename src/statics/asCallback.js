'use strict';

const tick = typeof process === 'object' ? process.nextTick : (fn) => setTimeout(() => fn(), 0);

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
  const callback = (...args) => tick(() => cb(...args));
  promise.then((res) => callback(null, res), callback);
}

module.exports = asCallback;
