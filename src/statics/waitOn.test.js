'use strict';

const Emitter = require('events').EventEmitter;

const waitOn = require('../../src/statics/waitOn');

describe('waitOn', () => {
  let emitter;
  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should wait for the given event', () => {
    const promise = waitOn(emitter, 'special');
    emitter.emit('special');
    return promise;
  });

  it('should not resolve sooner', () => {
    const promise = waitOn(emitter, 'special');
    let called = false;
    const setCalled = () => (called = true);
    promise.then(setCalled, setCalled);
    expect(called).toBe(false);
  });

  it('should handle errors', () => {
    const promise = waitOn(emitter, 'special', true);
    emitter.emit('error', new Error('bad'));
    return expect(promise).rejects.toThrow(new Error('bad'));
  });

  it('should unregister after error', async () => {
    const promise = waitOn(emitter, 'special', true);
    emitter.emit('error', new Error('bad'));
    await expect(promise).rejects.toThrow(new Error('bad'));
    // Node 4
    if (emitter.eventNames) {
      expect(emitter.eventNames()).toHaveLength(0);
    }
    expect(emitter.listeners('special')).toHaveLength(0);
    expect(emitter.listeners('error')).toHaveLength(0);
  });

  it('should unregister after event', async () => {
    const promise = waitOn(emitter, 'special', true);
    emitter.emit('special', true);
    await expect(promise).resolves.toBe(true);
    // Node 4
    if (emitter.eventNames) {
      expect(emitter.eventNames().length).toBe(0);
    }
    expect(emitter.listeners('special').length).toBe(0);
    expect(emitter.listeners('error').length).toBe(0);
  });
});
