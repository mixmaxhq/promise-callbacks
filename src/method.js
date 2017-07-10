'use strict';

const methods = require('./methods');

/**
 * Patches the global `Promise` built-in to define `asCallback` and others as instance methods,
 * so you can do e.g. `Promise.resolve(true).asCallback(cb)`.
 *
 * Idempotent.
 *
 * @throws {Error} If `Promise` already defines one or more of the instance methods.
 */
function patchPromise() {
  const props = {};
  for (let method of methods) {
    if (Promise.prototype[method.name] && Promise.prototype[method.name] !== method) {
      throw new Error('`Promise` already defines method `' + method.name + '`');
    }
    props[method.name] = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: method
    };
  }
  Object.defineProperties(Promise.prototype, props);
}

/**
 * Undoes `patchPromise`.
 *
 * A no-op if `patchPromise` had not been called.
 */
function unpatchPromise() {
  for (let method of methods) {
    if (Promise.prototype[method.name] === method) {
      delete Promise.prototype[method.name];
    }
  }
}

module.exports = {
  patchPromise,
  unpatchPromise
};
