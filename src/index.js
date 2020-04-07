'use strict';

const static_ = require('./static');
const callAsync = require('./callAsync');
const defer = require('./defer');
const deferred = require('./deferred');
const method = require('./method');
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
exports.asCallback = statics.asCallback;
exports.callAsync = callAsync;
exports.defer = defer;
exports.deferred = deferred;
exports.delay = statics.delay;
exports.immediate = statics.immediate;
exports.nextTick = statics.nextTick;
exports.objectAll = statics.objectAll;
exports.promisify = promisify;
exports.promisifyAll = promisify.all;
exports.promisifyMethod = promisify.method;
exports.promisifyMethods = promisify.methods;
exports.TimeoutError = statics.TimeoutError;
exports.voidAll = statics.voidAll;
exports.waitOn = statics.waitOn;
exports.withTimeout = statics.withTimeout;
exports.wrapAsync = statics.wrapAsync;
