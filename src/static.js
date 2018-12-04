'use strict';

const staticProperties = require('./statics');

function patchPromise() {
  const props = {};
  for (const [fnName, fn] of Object.entries(staticProperties)) {
    if (Promise[fnName] && Promise[fnName] !== fn) {
      throw new Error(`Promise already defines ${fnName}.`);
    }
    props[fnName] = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: fn
    };
  }
  Object.defineProperties(Promise, props);
}

function unpatchPromise() {
  for (const [fnName, fn] of Object.entries(staticProperties)) {
    if (Promise[fnName] === fn) {
      delete Promise[fnName];
    }
  }
}

module.exports = {
  patchPromise,
  unpatchPromise,
  statics: {}
};

Object.assign(module.exports.statics, staticProperties);
