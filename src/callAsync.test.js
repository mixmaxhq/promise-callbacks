const callAsync = require('../src/callAsync');

describe('callAsync', () => {
  it('lets you handle callback results using promises', async () =>
    expect(callAsync((done) => process.nextTick(done, null, 'hello'))).resolves.toBe('hello'));
});
