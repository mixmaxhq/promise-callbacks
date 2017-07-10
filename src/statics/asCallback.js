'use strict';

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

module.exports = asCallback;
