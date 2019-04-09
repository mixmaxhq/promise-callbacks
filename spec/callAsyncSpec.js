const callAsync = require('../src/callAsync');

describe('callAsync', function() {
  it('lets you handle callback results using promises', async function() {
    expect(await callAsync((done) => process.nextTick(done, null, 'hello'))).toBe('hello');
  });
});
