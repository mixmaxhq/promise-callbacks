/**
 * Build a callback for the given promise resolve/reject functions.
 *
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 */
function callbackBuilder(resolve, reject, {variadic}) {
  let called = false;

  return function callback(err, ...values) {
    if (called) {
      throw new Error('the deferred callback has already been called');
    }

    called = true;

    if (err) {
      reject(err);
    } else if (Array.isArray(variadic)) {
      const obj = {};
      for (let i = 0; i < variadic.length; i++) {
        obj[variadic[i]] = values[i];
      }
      resolve(obj);
    } else {
      resolve(variadic ? values : values[0]);
    }
  };
}

module.exports = callbackBuilder;
