const { asCallback, patchPromise, unpatchPromise } = require('./asCallback');
const sync = require('./sync');
const promisify = require('./promisify');

module.exports = {
  asCallback,
  patchPromise,
  unpatchPromise,
  sync,
  promisify,
  promisifyMethods: promisify.methods,
  promisifyAll: promisify.all
};
