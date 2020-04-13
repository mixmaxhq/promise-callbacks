import asCallback from './methods/asCallback';
import timeout from './methods/timeout';

const methods = { asCallback, timeout };

/**
 * Patches the global `Promise` built-in to define `asCallback` and others as instance methods,
 * so you can do e.g. `Promise.resolve(true).asCallback(cb)`.
 *
 * Idempotent.
 *
 * @throws {Error} If `Promise` already defines one or more of the instance methods.
 */
export function patchPromise() {
  const props = {};
  for (const [name, method] of Object.entries(methods)) {
    if (Promise.prototype[name] && Promise.prototype[name] !== method) {
      throw new Error(`\`Promise\` already defines method \`${name}\``);
    }
    props[name] = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: method,
    };
  }
  Object.defineProperties(Promise.prototype, props);
}

/**
 * Undoes `patchPromise`.
 *
 * A no-op if `patchPromise` had not been called.
 */
export function unpatchPromise() {
  for (const [name, method] of Object.entries(methods)) {
    if (Promise.prototype[name] === method) {
      delete Promise.prototype[name];
    }
  }
}
