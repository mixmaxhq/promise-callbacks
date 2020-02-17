const deferred = require('../src/deferred');

// The functions below use `await` just to provide complete examples of how `sync`
// is intended to be used. But we're not testing how `await` works per se--we could
// test the promise directly.
describe('deferred', () => {
  it('lets you handle callback errors using promises', async () => {
    const promise = deferred();

    // We can't use `expect...toThrowError` because `expect` takes a function there, which will have
    // to be an `async` function to use `await`, which means it won't synchronously throw.
    process.nextTick(promise.defer(), new Error('boo'));

    await expect(promise).rejects.toThrow(new Error('boo'));
  });

  it('lets you handle callback results using promises', async function() {
    const promise = deferred();
    process.nextTick(promise.defer(), null, 'hello');
    await expect(promise).resolves.toBe('hello');
  });

  it('should ignore extra values', async function() {
    const promise = deferred();
    process.nextTick(promise.defer(), null, 'v1', 'v2', 'v3');
    await expect(promise).resolves.toBe('v1');
  });

  it('should handle multiple values as an array', async function() {
    const promise = deferred({ variadic: true });
    process.nextTick(promise.defer(), null, 'v1', 'v2', 'v3');
    await expect(promise).resolves.toEqual(['v1', 'v2', 'v3']);
  });

  it('should handle multiple values as an object', async function() {
    const promise = deferred({ variadic: ['v1', 'v2', 'v3'] });
    process.nextTick(promise.defer(), null, 'v1', 'v2', 'v3');
    await expect(promise).resolves.toEqual({ v1: 'v1', v2: 'v2', v3: 'v3' });
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
