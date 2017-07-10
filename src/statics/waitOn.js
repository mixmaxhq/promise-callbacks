'use strict';

/**
 * Wait for the given EventEmitter to emit the given event. Optionally reject the promise if an
 * error event occurs while waiting.
 *
 * @param {EventEmitter} emitter The emitter to wait on.
 * @param {String} event The event to wait for.
 * @param {Boolean=} waitError Whether to reject if an error occurs, defaults to false.
 * @return {Promise<*>} A promise that resolves or rejects based on events emitted by the emitter.
 */
function waitOn(emitter, event, waitError) {
  if (waitError) {
    return new Promise((resolve, reject) => {
      function unbind() {
        emitter.removeListener('error', onError);
        emitter.removeListener(event, onEvent);
      }

      function onEvent(value) {
        unbind();
        resolve(value);
      }

      function onError(err) {
        unbind();
        reject(err);
      }

      emitter.on('error', onError);
      emitter.on(event, onEvent);
    });
  }
  return new Promise((resolve) => emitter.once(event, resolve));
}

module.exports = waitOn;
