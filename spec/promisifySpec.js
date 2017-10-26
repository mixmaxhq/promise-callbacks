const promisify = require('../src/promisify');

describe('promisify', function() {
  it('should handle values', async function() {
    const value = await promisify((done) => process.nextTick(() => done(null, 'value')))();
    expect(value).toBe('value');
  });

  it('should ignore extra values', async function() {
    const value = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')))();
    expect(value).toBe('v1');
  });

  it('should handle multiple values as an array', async function() {
    const values = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {variadic: true})();
    expect(values).toEqual(['v1', 'v2', 'v3']);
  });

  it('should handle multiple values as an object', async function() {
    const values = await promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {variadic: ['v1', 'v2', 'v3']})();
    expect(values).toEqual({v1: 'v1', v2: 'v2', v3: 'v3'});
  });

  it('should handle synchronous errors', async function() {
    let err;
    try {
      await promisify(() => {
        throw new Error('oops!');
      })();

      fail();
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err.constructor).toBe(Error);
    expect(err.message).toBe('oops!');
  });

  it('should handle errors', async function() {
    let err;
    try {
      await promisify((done) => process.nextTick(() => done(new Error('hallo'))))();

      fail();
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err.constructor).toBe(Error);
    expect(err.message).toBe('hallo');
  });

  it('should support custom promise functions', async function() {
    function ex(done) {
      process.nextTick(() => done(null, 'hello'));
    }

    ex[promisify.custom] = async () => 'surprise!';

    expect(await promisify(ex)()).toBe('surprise!');
  });

  describe('method', function() {
    it('should promisify the given method', async function() {
      const api = {
        beepSound: 'boop',
        beep(done) {
          process.nextTick(() => done(null, this.beepSound));
        }
      };

      const newBeepSound = 'beep';
      api.beepSound = newBeepSound;
      const origBeep = api.beep;
      const beepPromiseAPI = promisify.method(api, 'beep');

      expect(api.beep).toBe(origBeep);
      expect(await beepPromiseAPI()).toBe(newBeepSound);
    });
  });

  describe('methods', function() {
    it('should promisify the given methods', async function() {
      const api = {
        beepSound: 'boop',
        beep(done) {
          process.nextTick(() => done(null, this.beepSound));
        },
        noot() {
          return 7;
        }
      };

      const newBeepSound = 'beep';
      api.beepSound = newBeepSound;
      const origBeep = api.beep;
      const promiseAPI = promisify.methods(api, ['beep']);

      expect(api.noot()).toBe(7);
      expect(api.beep).toBe(origBeep);

      expect(promiseAPI.noot).toBeUndefined();
      expect(await promiseAPI.beep()).toBe(newBeepSound);
    });
  });

  describe('all', function() {
    it('should promisify all methods', async function() {
      const api = {
        beep(done) {
          process.nextTick(() => done(null, 8));
        },
        nooter(done) {
          process.nextTick(() => done(null, 7));
        },
        value: 'hello'
      };

      const orig = Object.assign({}, api);

      const promiseAPI = promisify.all(api);

      expect(api).toEqual(orig);

      expect(promiseAPI.value).toBeUndefined();
      expect(await Promise.all([promiseAPI.beep(), promiseAPI.nooter()])).toEqual([8, 7]);
    });
  });
});
