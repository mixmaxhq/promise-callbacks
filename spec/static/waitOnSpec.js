'use strict';

const Emitter = require('events').EventEmitter;

const waitOn = require('../../src/statics/waitOn');

describe('helpers', function () {
  describe('waitOn', function () {
    beforeEach(function () {
      this.emitter = new Emitter();
    });

    it('should wait for the given event', function () {
      const promise = waitOn(this.emitter, 'special');
      this.emitter.emit('special');
      return promise;
    });

    it('should not resolve sooner', function () {
      const promise = waitOn(this.emitter, 'special');
      let called = false;
      promise.then(() => called = true, () => called = true);
      expect(called).toBe(false);
    });

    it('should handle errors', function () {
      const promise = waitOn(this.emitter, 'special', true);
      this.emitter.emit('error', new Error('bad'));
      return promise.then(() => {
        throw new Error('expected rejection');
      }, (err) => {
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('bad');
      });
    });

    it('should unregister after error', function () {
      const promise = waitOn(this.emitter, 'special', true);
      this.emitter.emit('error', new Error('bad'));
      return promise.catch((err) => {
        expect(err.constructor).toBe(Error);
        expect(err.message).toBe('bad');
        // Node 4
        if (this.emitter.eventNames) {
          expect(this.emitter.eventNames().length).toBe(0);
        }
        expect(this.emitter.listeners('special').length).toBe(0);
        expect(this.emitter.listeners('error').length).toBe(0);
      });
    });

    it('should unregister after event', function () {
      const promise = waitOn(this.emitter, 'special', true);
      this.emitter.emit('special', true);
      return promise.then((value) => {
        expect(value).toBe(true);
        // Node 4
        if (this.emitter.eventNames) {
          expect(this.emitter.eventNames().length).toBe(0);
        }
        expect(this.emitter.listeners('special').length).toBe(0);
        expect(this.emitter.listeners('error').length).toBe(0);
      });
    });
  });
});
