'use strict';

/**
 * Like Promise.all, but without examining or collecting the resolved values from the Promises.
 */
function voidAll(iter) {
  return new Promise((resolve, reject) => {
    let n = 0,
      total = 0,
      ready = false;

    try {
      for (const value of iter) {
        Promise.resolve(value).then(() => {
          ++n;
          if (ready && n === total) resolve();
        }, reject);
        ++total;
      }
      ready = true;
      // n === 0 here because Promise.resolve(...).then(...) will only evaluate the then'd functions
      // after at least one turn of the microtask queue. Thus the only case where we can resolve is
      // if the iterable was empty.
      if (!total) resolve();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = voidAll;
