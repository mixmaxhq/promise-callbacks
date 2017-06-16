const deferred = require('../src/deferred');

// The functions below use `await` just to provide complete examples of how `sync`
// is intended to be used. But we're not testing how `await` works per se--we could
// test the promise directly.
describe('deferred', function() {
  function ret(done) {
    process.nextTick(done, null, 'hello');
  }

  function thr(done) {
    process.nextTick(done, new Error('boo'));
  }

  it('lets you handle callback errors using promises', async function() {
    let err;
    const promise = deferred();

    // We can't use `expect...toThrowError` because `expect` takes a function there, which will have
    // to be an `async` function to use `await`, which means it won't synchronously throw.
    try {
      thr(promise.defer());
      await promise;
    } catch(e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err.message).toBe('boo');
  });

  it('lets you handle callback results using promises', async function() {
    const promise = deferred();
    ret(promise.defer());
    expect(await promise).toBe('hello');
  });

  it('throws if you call `defer` twice', function() {
    const promise = deferred();
    promise.defer();
    expect(() => {
      promise.defer();
    }).toThrow();
  });

  it('throws if you call the callback twice', function() {
    const promise = deferred();
    const callback = promise.defer();
    expect(() => {
      callback(null, 'value1');
      callback(null, 'value2');
    }).toThrow();
  });
});
