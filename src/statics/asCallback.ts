const tick = typeof process === 'object' ? process.nextTick : (fn) => setTimeout(() => fn(), 0);

/**
 * Calls the specified callback with the result of the promise.
 *
 * Note that if the callback throws a synchronous error, it will trigger an unhandled exception.
 *
 * @param {Promise} promise
 * @param {Function<Err, Any>} cb - An errback.
 */
export default function asCallback(promise, cb) {
  if (typeof cb !== 'function') {
    throw new TypeError('callback must be a function');
  }
  const callback = (...args) => tick(() => cb(...args));
  promise.then((res) => callback(null, res), callback);
}
