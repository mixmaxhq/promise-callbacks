const hasOwn = Object.prototype.hasOwnProperty;

const staticProperties = [withTimeout, delay, nextTick, immediate];

function patchPromiseStatic() {
  const props = {};
  for (let fn of staticProperties) {
    if (hasOwn.call(Promise, fn.name) && Promise[fn.name] !== fn) {
      throw new Error(`Promise already defines ${fn.name}.`);
    }
    props[fn.name] = {
      configurable: true,
      writable: true,
      value: fn
    };
  }
  Object.defineProperties(Promise, props);
}

function unpatchPromiseStatic() {
  for (let fn of staticProperties) {
    if (Promise[fn.name] === fn) {
      delete Promise[fn.name];
    }
  }
}

function withTimeout(promise, delay, message='Operation timed out.') {
  let timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    // Instantiate the error here to capture a more useful stack trace.
    const error = message instanceof Error ? message : new Error(message);
    timeout = setTimeout(() => reject(error), delay);
  });
  return Promise.race([promise, timeoutPromise]).then((value) => {
    clearTimeout(timeout);
    return value;
  }, (err) => {
    clearTimeout(timeout);
    throw err;
  });
}

function delay(time, value) {
  return new Promise((resolve) => setTimeout(resolve, time, value));
}

function nextTick(value) {
  return new Promise((resolve) => process.nextTick(resolve, value));
}

function immediate(value) {
  return new Promise((resolve) => setImmediate(resolve, value));
}

module.exports = {
  patchPromiseStatic,
  unpatchPromiseStatic,
  statics: {}
};

for (let fn of staticProperties) {
  module.exports.statics[fn.name] = fn;
}
