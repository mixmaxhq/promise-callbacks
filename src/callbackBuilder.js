'use strict';

/**
 * Build a callback for the given promise resolve/reject functions.
 *
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 */
function callbackBuilder(resolve, reject, options) {
  let variadic;
  if (options) {
    variadic = options.variadic;
  }

  let called = false;

  return function callback(err, value) {
    if (called) {
      throw new Error('the deferred callback has already been called');
    }

    called = true;

    if (err) {
      reject(err);
    } else if (Array.isArray(variadic)) {
      const obj = {};
      for (let i = 0; i < variadic.length; i++) {
        obj[variadic[i]] = arguments[i + 1];
      }
      resolve(obj);
    } else if (variadic) {
      const args = new Array(arguments.length - 1);
      for (let i = 0; i < args.length; ++i) {
        args[i] = arguments[i + 1];
      }
      resolve(args);
    } else {
      resolve(value);
    }
  };
}

module.exports = callbackBuilder;
