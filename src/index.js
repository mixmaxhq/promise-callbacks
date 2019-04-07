'use strict';

const method = require('./method');
const static_ = require('./static');
const callAsync = require('./callAsync');
const deferred = require('./deferred');
const defer = require('./defer');
const promisify = require('./promisify');
const statics = require('./statics');

function patchPromise() {
  static_.patchPromise();
  method.patchPromise();
}

function unpatchPromise() {
  static_.unpatchPromise();
  method.unpatchPromise();
}

// For some reason, rollup-plugin-commonjs wants this form instead of one embedded in the
// module.exports object definition.
exports.patchPromise = patchPromise;
exports.unpatchPromise = unpatchPromise;
exports.callAsync = callAsync;
exports.deferred = deferred;
exports.defer = defer;
exports.promisify = promisify;
exports.promisifyMethod = promisify.method,
exports.promisifyMethods = promisify.methods,
exports.promisifyAll = promisify.all,
exports.asCallback = statics.asCallback;
exports.delay = statics.delay;
exports.immediate = statics.immediate;
exports.nextTick = statics.nextTick;
exports.waitOn = statics.waitOn;
exports.withTimeout = statics.withTimeout;
exports.wrapAsync = statics.wrapAsync;
