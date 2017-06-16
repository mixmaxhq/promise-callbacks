const promisify = require('../src/promisify');

describe('promisify', function() {
  it('should handle values', function(done) {
    promisify((done) => process.nextTick(() => done(null, 'value')))()
      .then((value) => {
        expect(value).toBe('value');
        done();
      })
      .catch((err) => done.fail(err));
  });

  it('should ignore extra values', function(done) {
    promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')))()
      .then((value) => {
        expect(value).toBe('v1');
        done();
      })
      .catch((err) => done.fail(err));
  });

  it('should handle multiple values as an array', function(done) {
    promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {varadic: true})()
      .then((values) => {
        expect(values).toEqual(['v1', 'v2', 'v3']);
        done();
      })
      .catch((err) => done.fail(err));
  });

  it('should handle multiple values as an object', function(done) {
    promisify((done) => process.nextTick(() => done(null, 'v1', 'v2', 'v3')), {varadic: ['v1', 'v2', 'v3']})()
      .then((values) => {
        expect(values).toEqual({v1: 'v1', v2: 'v2', v3: 'v3'});
        done();
      })
      .catch((err) => done.fail(err));
  });

  it('should handle synchronous errors', function(done) {
    promisify((done) => {
      throw new Error('oops!');
    })()
      .then(() => done.fail())
      .catch((err) => {
        expect(err).toBeTruthy();
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('oops!');

        done();
      });
  });

  it('should handle errors', function(done) {
    promisify((done) => process.nextTick(() => done(new Error('hallo'))))()
      .then(() => done.fail())
      .catch((err) => {
        expect(err).toBeTruthy();
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('hallo');

        done();
      });
  });

  it('should support custom promise functions', function(done) {
    function ex(done) {
      process.nextTick(() => done(null, 'hello'));
    }

    ex[promisify.custom] = () => Promise.resolve('surprise!');

    promisify(ex)()
      .then((value) => {
        expect(value).toBe('surprise!');
        done();
      })
      .catch((err) => done.fail(err));
  });

  describe('methods', function() {
    it('should promisify the given methods', function(done) {
      const api = {
        beep(done) {
          process.nextTick(() => done(null, 8));
        },
        noot() {
          return 7;
        }
      };

      const origBeep = api.beep;

      const promiseAPI = promisify.methods(api, ['beep'], {createCopy: true});

      expect(api.noot()).toBe(7);
      expect(api.beep).toBe(origBeep);

      expect(promiseAPI.noot).toBeUndefined();
      promiseAPI.beep()
        .then((value) => {
          expect(value).toBe(8);
          done();
        })
        .catch((err) => done.fail(err));
    });
  });

  describe('all', function() {
    it('should promisify all methods', function(done) {
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

      const promiseAPI = promisify.all(api, {createCopy: true});

      expect(api).toEqual(orig);

      expect(promiseAPI.value).toBeUndefined();
      Promise.all([promiseAPI.beep(), promiseAPI.nooter()])
        .then((values) => {
          expect(values).toEqual([8, 7]);
          done();
        })
        .catch((err) => done.fail(err));
    });

    it('should copy all the properties', function(done) {
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

      const promiseAPI = promisify.all(api, {copyAll: true});

      expect(api).toEqual(orig);

      expect(promiseAPI.value).toBe('hello');
      Promise.all([promiseAPI.beep(), promiseAPI.nooter()])
        .then((values) => {
          expect(values).toEqual([8, 7]);
          done();
        })
        .catch((err) => done.fail(err));
    });
  });
});
