'use strict';

const toArray = require('../utils').toArray;
const callbackBuilder = require('../callbackBuilder');

const sentinel = Object.create(null);

/**
 * Wrap a function that may return a promise or call a callback, making it always return a promise.
 * If catchExceptions is true, synchronous exceptions from the function will reject that promise.
 *
 * @param {Function} fn The asynchronous function.
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 * @param {Boolean=} options.catchExceptions Whether to catch synchronous exceptions, defaults to true.
 * @return {Function: Promise} A promise-returning variant of the function.
 */
function wrapAsync(fn, options) {
  let catchExceptions = options && options.catchExceptions;
  if (typeof catchExceptions !== 'boolean') {
    catchExceptions = true;
  }

  /**
   * @param {...args} var_args The arguments to the wrapped function.
   * @return {Promise<*>} A promise that resolves to the result of the computation.
   */
  return function asyncWrapper() {
    let syncErr = sentinel;
    const promise = new Promise((resolve, reject) => {
      const cb = callbackBuilder(resolve, reject, options), args = toArray(arguments);
      args.push(cb);
      let res;
      try {
        res = fn.apply(this, args);
      } catch (e) {
        if (catchExceptions) {
          reject(e);
        } else {
          syncErr = e;

          // Resolve to avoid an unhandled rejection if the function called the callback before
          // throwing the synchronous exception.
          resolve();
        }
        return;
      }
      if (res && typeof res.then === 'function') {
        resolve(res);
      }
    });
    // Throw the synchronous error here instead of inside the Promise callback so that it actually
    // throws outside.
    if (syncErr !== sentinel) throw syncErr;
    return promise;
  };
}

module.exports = wrapAsync;
