'use strict';

function handleErrorsFrom(promise, emitter) {
  return new Promise((resolve, reject) => {
    emitter.once('error', reject);
    promise.then((value) => {
      emitter.removeListener('error', reject);
      resolve(value);
    }, reject);
  });
}

module.exports = handleErrorsFrom;
