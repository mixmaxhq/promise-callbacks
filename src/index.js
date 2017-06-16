const { asCallback, patchPromise, unpatchPromise } = require('./asCallback');
const deferred = require('./deferred');
const promisify = require('./promisify');

module.exports = {
  asCallback,
  patchPromise,
  unpatchPromise,
  deferred,
  promisify,
  promisifyMethods: promisify.methods,
  promisifyAll: promisify.all
};
