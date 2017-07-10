'use strict';

const callbackBuilder = require('./callbackBuilder');

/**
 * Create a capture context, similar to sync but without the global state.
 *
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 */
function deferred(options) {
  let args = null;
  const promise = new Promise((resolve, reject) => args = [resolve, reject, options]);
  promise.defer = function defer() {
    if (!args) throw new Error('defer has already been called');
    const callback = callbackBuilder.apply(undefined, args);
    args = null;
    return callback;
  };
  return promise;
}

module.exports = deferred;
