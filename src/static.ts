import * as staticProperties from './statics/index';

export function patchPromise() {
  const props = {};
  for (const entry of Object.entries(staticProperties)) {
    const fnName = entry[0],
      fn = entry[1];
    if (Promise[fnName] && Promise[fnName] !== fn) {
      throw new Error(`Promise already defines ${fnName}.`);
    }
    props[fnName] = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: fn,
    };
  }
  Object.defineProperties(Promise, props);
}

export function unpatchPromise() {
  for (const entry of Object.entries(staticProperties)) {
    const fnName = entry[0],
      fn = entry[1];
    if (Promise[fnName] === fn) {
      delete Promise[fnName];
    }
  }
}

export const statics = { ...staticProperties };
