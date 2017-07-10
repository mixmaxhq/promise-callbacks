'use strict';

/**
 * Return a promise that resolves to the same value as the given promise. If it takes more than the
 * specified delay to do so, the returned promise instead rejects with a timeout error.
 *
 * @param {Promise<*>} promise The promise to resolve.
 * @param {Number} delay The millisecond delay before a timeout occurs.
 * @param {String|Error=} message The error message or Error object to reject with if the operation
 *   times out.
 * @return {Promise<*>} The promise that times out.
 */
function withTimeout(promise, delay, message) {
  let timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    // Instantiate the error here to capture a more useful stack trace.
    const error = message instanceof Error ? message : new Error(message || 'Operation timed out.');
    timeout = setTimeout(reject, delay, error);
  });
  return Promise.race([promise, timeoutPromise]).then((value) => {
    clearTimeout(timeout);
    return value;
  }, (err) => {
    clearTimeout(timeout);
    throw err;
  });
}

module.exports = withTimeout;
