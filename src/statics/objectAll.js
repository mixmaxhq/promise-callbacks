'use strict';

const { fromEntries } = require('../utils');

/**
 * Promise.all but for objects instead of arrays.
 *
 * @param {Object<string, * | Promise<*>>} object
 * @return {Promise<Object<string, *>>} The object, with its values resolved.
 */
function objectAll(object) {
  if (!object || typeof object !== 'object') {
    return Promise.reject(new TypeError('objectAll requires an object'));
  }
  const entries = [];
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      entries.push(Promise.resolve(object[key]).then((resolved) => [key, resolved]));
    }
  }
  return Promise.all(entries).then(fromEntries);
}

module.exports = objectAll;
