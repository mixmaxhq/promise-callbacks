const defer = require('./defer');
const handleErrorsFrom = require('./handleErrorsFrom');
const Emitter = require('events').EventEmitter;

const dummy = new Emitter();

describe('handleErrorsFrom', () => {
  it('should forward values', async () => {
    await expect(handleErrorsFrom(Promise.resolve(12), dummy)).resolves.toBe(12);
  });

  it('should forward rejections', async () => {
    await expect(handleErrorsFrom(Promise.reject(new Error('expected')), dummy)).rejects.toThrow(
      new Error('expected')
    );
  });

  it('should forward errors', async () => {
    const d = defer();
    const p = Promise.resolve().then(() => {
      dummy.emit('error', new Error('handled'));
      d.resolve('unexpected');
    });
    await expect(handleErrorsFrom(d.promise, dummy)).rejects.toThrow(new Error('handled'));
    // Just asserting that this hasn't rejected.
    return p;
  });

  it('should not forward errors that happen after settlement', async () => {
    const d = defer(),
      p = d.promise.catch((err) => dummy.emit('error', err));

    const finalAssertion = expect(p).rejects.toThrow('unhandled');
    await expect(handleErrorsFrom(Promise.resolve('expected'), dummy)).resolves.toBe('expected');
    d.reject(new Error('unhandled'));

    return finalAssertion;
  });
});
