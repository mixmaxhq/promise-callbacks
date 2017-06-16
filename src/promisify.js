/***************************************************************************************************

The promisify implementation found in this file is derived from the implementation in Node.js. Its
license (https://github.com/nodejs/node/blob/master/LICENSE) is as follows:

Copyright Joyent, Inc. and other Node contributors. All rights reserved. Permission is hereby
granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

***************************************************************************************************/


const kCustomPromisifiedSymbol = Symbol.for('util.promisify.custom');

/**
 * Promisify the given function.
 *
 * @param {Function} orig The function to promisify.
 * @param {Boolean|String[]} options.varadic The varadic option informs how promisify will handle
 *   more than one value - by default, promisify will only resolve the promise with the first value.
 *     false    - only resolve the promise with the first value, default behavior
 *     true     - resolve the promise with an array containing the varadic arguments
 *     String[] - the names of the arguments, which will be used to create an object of values.
 * @return {Function: Promise} The promisified function.
 */
function promisify(orig, {varadic} = {}) {
  if (typeof orig !== 'function') {
    throw new TypeError('promisify requires a function');
  }

  if (orig[kCustomPromisifiedSymbol]) {
    const fn = orig[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The [util.promisify.custom] property must be a function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn(...args) {
    return new Promise((resolve, reject) => {
      try {
        orig.call(this, ...args, (err, ...values) => {
          if (err) {
            reject(err);
          } else if (Array.isArray(varadic)) {
            const obj = {};
            for (let i = 0; i < varadic.length; i++) {
              obj[varadic[i]] = values[i];
            }
            resolve(obj);
          } else {
            resolve(varadic ? values : values[0]);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(orig));

  Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(orig));
}

/**
 * Promisify the given names on the given object, and create a copy of the object.
 *
 * @param {*} obj A value that can have properties.
 * @param {String[]} methodNames The methods to promisify.
 * @param {Boolean|String[]} options.varadic See the documentation for promisify.
 * @return {Object} The promisified object.
 */
function promisifyMethods(obj, methodNames, options = {}) {
  if (!obj) {
    // This object could be anything, including a function, a real object, or an array.
    throw new TypeError('promisify.methods requires a truthy value');
  }

  const out = {};

  for (let methodName of methodNames) {
    out[methodName] = promisify(obj[methodName].bind(obj), options);
  }

  return out;
}

/**
 * Promisify all functions on the given object.
 *
 * @param {*} obj A value that can have properties.
 * @param {Boolean} options.copyAll Whether to copy the iterable, non-method properties to the new
 *   object.
 * @param {Boolean|String[]} options.varadic See the documentation for promisify.
 * @return {Object} The promisified object.
 */
function promisifyAll(obj, options = {}) {
  if (!obj) {
    // This object could be anything, including a function, a real object, or an array.
    throw new TypeError('promisify.all requires a truthy value');
  }

  const out = {};

  for (var name in obj) {
    if (typeof obj[name] === 'function') {
      out[name] = promisify(obj[name].bind(obj), options);
    } else if (options.copyAll) {
      out[name] = obj[name];
    }
  }

  return out;
}

promisify.custom = kCustomPromisifiedSymbol;

promisify.all = promisifyAll;
promisify.methods = promisifyMethods;
promisify.promisifyAll = promisifyAll;
promisify.promisifyMethods = promisifyMethods;

module.exports = promisify;
