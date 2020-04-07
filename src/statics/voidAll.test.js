'use strict';

const voidAll = require('../../src/statics/voidAll'),
  immediate = require('../../src/statics/immediate');

describe('voidAll', () => {
  it('should reject non-iterable parameters', () =>
    expect(voidAll({})).rejects.toThrow(/iterable/));

  it('should work with an empty iterable', () => expect(voidAll([])).resolves.toBeUndefined());

  it('should work with non-promise entries', () =>
    expect(voidAll(['value', ['noot']])).resolves.toBeUndefined());

  it('should work with promise entries', async () => {
    let ok = false;
    process.nextTick(() => (ok = true));
    const nooted = immediate(['noot']);
    await expect(voidAll([Promise.resolve('value'), nooted])).resolves.toBeUndefined();
    // Assert that we didn't resolve too soon.
    expect(ok).toBe(true);
  });

  it('should reject for rejected promises', () =>
    expect(voidAll([Promise.resolve('value'), Promise.reject(new Error('dead'))])).rejects.toThrow(
      new Error('dead')
    ));

  it('should support iterables', async () => {
    await expect(
      voidAll(
        (function* produce() {
          yield Promise.resolve('abc');
          yield Promise.resolve('def');
        })()
      )
    ).resolves.toBeUndefined();

    await expect(
      voidAll(
        (function* produce() {
          yield Promise.resolve('abc');
          yield Promise.resolve('def');
          yield Promise.reject(new Error('dead'));
        })()
      )
    ).rejects.toThrow(new Error('dead'));
  });

  it('should reject iterable errors', async () => {
    await expect(
      voidAll(
        (function* produce() {
          yield Promise.resolve('abc');
          yield Promise.resolve('def');
          throw new Error('dead');
        })()
      )
    ).rejects.toThrow(new Error('dead'));
  });
});
