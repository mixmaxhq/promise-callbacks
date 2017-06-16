/**
 * Build a callback for the given promise resolve/reject functions.
 *
 * @param {Boolean|String[]} options.varadic See the documentation for promisify.
 */
function callbackBuilder(resolve, reject, {varadic}) {
  let called = false;

  return function callback(err, ...values) {
    if (called) {
      if (err) throw err;
      return;
    }

    called = true;

    if (err) {
      reject(err);
    } else if (Array.isArray(varadic)) {
      const obj = {};
      for (let i = 0; i < varadic.length; i++) {
        obj[varadic[i]] = values[i];
      }
      resolve(obj);
    } else {
      resolve(varadic ? values : values[0]);
    }
  };
}

module.exports = callbackBuilder;
