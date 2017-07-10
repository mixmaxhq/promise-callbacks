'use strict';

const staticProperties = require('./statics');

function patchPromise() {
  const props = {};
  for (let fn of staticProperties) {
    if (Promise[fn.name] && Promise[fn.name] !== fn) {
      throw new Error(`Promise already defines ${fn.name}.`);
    }
    props[fn.name] = {
      configurable: true,
      enumerable: false,
      writable: true,
      value: fn
    };
  }
  Object.defineProperties(Promise, props);
}

function unpatchPromise() {
  for (let fn of staticProperties) {
    if (Promise[fn.name] === fn) {
      delete Promise[fn.name];
    }
  }
}

module.exports = {
  patchPromise,
  unpatchPromise,
  statics: {}
};

for (let fn of staticProperties) {
  module.exports.statics[fn.name] = fn;
}
