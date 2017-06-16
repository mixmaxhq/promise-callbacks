const callbackBuilder = require('./callbackBuilder');

/**
 * Create a capture context, similar to sync but without the global state.
 *
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 */
function deferred(options = {}) {
  let handlers = null;
  const promise = new Promise((resolve, reject) => handlers = [resolve, reject]);
  promise.defer = function defer() {
    if (!handlers) throw new Error('defer has already been called');
    const callback = callbackBuilder(...handlers, options);
    handlers = null;
    return callback;
  };
  return promise;
}

module.exports = deferred;
