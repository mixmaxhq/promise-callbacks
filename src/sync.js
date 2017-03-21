let pendingPromise = null;

/**
 * Gets the promise corresponding to a previous invocation of `set`.
 *
 * @return {Promise}
 *
 * @throws {Error} If you call `get` before calling `set`.
 */
function get() {
  if (!pendingPromise) throw new Error('`get` called before calling `set`');

  let promise = pendingPromise;
  pendingPromise = null;
  return promise;
}

/**
 * Stores a promise and returns a Node errback that, when called, will resolve or reject the promise.
 *
 * The promise can be retrieved using `get`.
 *
 * @return {Function} An errback.
 *
 * @throws {Error} If you call `set` twice before calling `get`.
 */
function set() {
  if (pendingPromise) throw new Error('`set` called twice before calling `get`');

  let resolve, reject;
  pendingPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return function(err, res) {
    if (err) reject(err);
    else resolve(res);
  };
}

function _flush() {
  pendingPromise = null;
}

module.exports = {
  get,
  set,
  _flush // Exposed for unit tests.
};
