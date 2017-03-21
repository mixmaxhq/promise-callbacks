const sync = require('../src/sync');

// Handles the promises returned by the async functions.
require('jasmine-promises');

// The functions below use `await` just to provide complete examples of how `sync`
// is intended to be used. But we're not testing how `await` works per se--we could
// test the promise directly.
describe('sync', function() {
  function ret(done) {
    process.nextTick(done, null, 'hello');
  }

  function thr(done) {
    process.nextTick(done, new Error('boo'));
  }

  beforeEach(function() {
    sync._flush();
  });

  it('lets you handle callback errors using promises', async function() {
    let err;

    // We can't use `expect...toThrowError` because `expect` takes a function there…
    // which will have to be an `async` function to use `await`… which means it
    // won't synchronously throw.
    try {
      await sync.get(thr(sync.set()));
    } catch(e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.message).toBe('boo');
  });

  it('lets you handle callback results using promises', async function() {
    expect(await sync.get(ret(sync.set()))).toBe('hello');
  });

  it('throws if you call `set` twice before calling `get`', function() {
    expect(() => {
      ret(sync.set());
      ret(sync.set());
    }).toThrow();
  });

  it('throws if you call `get` before calling `set`', function() {
    expect(() => {
      sync.get();
    }).toThrow();
  });
});
