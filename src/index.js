const { asCallback, patchPromise, unpatchPromise } = require('./asCallback');
const deferred = require('./deferred');
const promisify = require('./promisify');
const static = require('./static');

module.exports = {
  asCallback,
  patchPromise,
  unpatchPromise,
  deferred,
  promisify,
  promisifyMethods: promisify.methods,
  promisifyAll: promisify.all,
  withTimeout: static.withTimeout,
  delay: static.delay
};
