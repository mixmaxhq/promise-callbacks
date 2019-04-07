'use strict';

const deferred = require('./deferred');

/**
 * Calls the given function and returns a promise that fulfills according to the formers result.
 * A convenience function that make the 'promise = deferred(), fn(promise.defer()), await promise' pattern a one-liner.
 *
 * @param {function(callback)} fn A function that takes a Node style callback as its argument.
 * @return {Promise}
 */
async function callAsync(fn) {
  const promise = deferred();
  fn(promise.defer());
  return promise;
}

module.exports = callAsync;
