import objectAll from '../../src/statics/objectAll';
import nextTick from '../../src/statics/nextTick';

describe('objectAll', () => {
  it('should reject non-object parameters', () => expect(objectAll()).rejects.toThrow(/object/));

  it('should work with an empty object', () => expect(objectAll({})).resolves.toEqual({}));

  it('should work with non-promise entries', () =>
    expect(objectAll({ a: 'value', b: ['noot'] })).resolves.toEqual({ a: 'value', b: ['noot'] }));

  it('should work with promise entries', () =>
    expect(objectAll({ a: Promise.resolve('value'), b: nextTick(['noot']) })).resolves.toEqual({
      a: 'value',
      b: ['noot'],
    }));
});
