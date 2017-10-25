'use strict';

const method = require('./method');
const static_ = require('./static');
const deferred = require('./deferred');
const promisify = require('./promisify');

function patchPromise() {
  static_.patchPromise();
  method.patchPromise();
}

function unpatchPromise() {
  static_.unpatchPromise();
  method.unpatchPromise();
}

module.exports = {
  patchPromise,
  unpatchPromise,
  deferred,
  promisify,
  promisifyMethod: promisify.method,
  promisifyMethods: promisify.methods,
  promisifyAll: promisify.all,
};

for (let method of require('./statics')) {
  module.exports[method.name] = method;
}
