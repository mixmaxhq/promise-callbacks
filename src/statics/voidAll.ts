/**
 * Like Promise.all, but without examining or collecting the resolved values from the Promises.
 */
export default function voidAll(iter) {
  return new Promise<void>((resolve, reject) => {
    let n = 0,
      total = 0,
      ready = false;

    try {
      for (const value of iter) {
        Promise.resolve(value).then(() => {
          ++n;
          if (ready && n === total) resolve(undefined);
        }, reject);
        ++total;
      }
      ready = true;
      // n === 0 here because Promise.resolve(...).then(...) will only evaluate the then'd functions
      // after at least one turn of the microtask queue. Thus the only case where we can resolve is
      // if the iterable was empty.
      if (!total) resolve(undefined);
    } catch (err) {
      reject(err);
    }
  });
}
