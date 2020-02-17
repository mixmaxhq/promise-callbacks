const promisify = require('../src/promisify');

describe('promisify', () => {
  it('should handle values', async () => {
    const value = await promisify((done) => process.nextTick(() => done(null, 'value')))();
    expect(value).toBe('value');
  });

  it('should ignore extra values', async () => {
    const value = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')))();
    expect(value).toBe('v1');
  });

  it('should handle multiple values as an array', async () => {
    const values = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {
      variadic: true,
    })();
    expect(values).toEqual(['v1', 'v2', 'v3']);
  });

  it('should handle multiple values as an object', async () => {
    const values = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {
      variadic: ['v1', 'v2', 'v3'],
    })();
    expect(values).toEqual({ v1: 'v1', v2: 'v2', v3: 'v3' });
  });

  it('should handle synchronous errors', async () =>
    expect(
      promisify(() => {
        throw new Error('oops!');
      })()
    ).rejects.toThrow(new Error('oops!')));

  it('should handle errors', async () =>
    expect(promisify((done) => process.nextTick(() => done(new Error('hallo'))))()).rejects.toThrow(
      new Error('hallo')
    ));

  it('should support custom promise functions', async () => {
    function ex(done) {
      process.nextTick(() => done(null, 'hello'));
    }

    ex[promisify.custom] = async () => 'surprise!';

    return expect(promisify(ex)()).resolves.toBe('surprise!');
  });

  describe('method', () => {
    it('should promisify the given method', async () => {
      const api = {
        beepSound: 'boop',
        beep(done) {
          process.nextTick(() => done(null, this.beepSound));
        },
      };

      const newBeepSound = 'beep';
      api.beepSound = newBeepSound;
      const origBeep = api.beep;
      const beepPromiseAPI = promisify.method(api, 'beep');

      expect(api.beep).toBe(origBeep);
      return expect(beepPromiseAPI()).resolves.toBe(newBeepSound);
    });
  });

  describe('methods', () => {
    it('should promisify the given methods', async () => {
      const api = {
        beepSound: 'boop',
        beep(done) {
          process.nextTick(() => done(null, this.beepSound));
        },
        noot() {
          return 7;
        },
      };

      const newBeepSound = 'beep';
      api.beepSound = newBeepSound;
      const origBeep = api.beep;
      const promiseAPI = promisify.methods(api, ['beep']);

      expect(api.noot()).toBe(7);
      expect(api.beep).toBe(origBeep);

      expect(promiseAPI.noot).toBeUndefined();
      return expect(promiseAPI.beep()).resolves.toBe(newBeepSound);
    });
  });

  describe('all', () => {
    it('should promisify all methods', async () => {
      const api = {
        beep(done) {
          process.nextTick(() => done(null, 8));
        },
        nooter(done) {
          process.nextTick(() => done(null, 7));
        },
        value: 'hello',
      };

      const orig = { ...api };

      const promiseAPI = promisify.all(api);

      expect(api).toEqual(orig);

      expect(promiseAPI.value).toBeUndefined();
      return expect(Promise.all([promiseAPI.beep(), promiseAPI.nooter()])).resolves.toEqual([8, 7]);
    });
  });
});
