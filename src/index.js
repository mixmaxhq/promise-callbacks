'use strict';

const method = require('./method');
const static_ = require('./static');
const deferred = require('./deferred');
const defer = require('./defer');
const promisify = require('./promisify');

function patchPromise() {
  static_.patchPromise();
  method.patchPromise();
}

function unpatchPromise() {
  static_.unpatchPromise();
  method.unpatchPromise();
}

module.exports = Object.assign({
  patchPromise,
  unpatchPromise,
  deferred,
  defer,
  promisify,
  promisifyMethod: promisify.method,
  promisifyMethods: promisify.methods,
  promisifyAll: promisify.all,
}, require('./statics'));
