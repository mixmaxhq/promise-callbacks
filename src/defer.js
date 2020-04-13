/**
 * Create a Defer object that supports the resolve and reject methods that would otherwise be
 * provided to the function given to Promise. Also hosts the promise field which contains the
 * corresponding Promise object.
 */
class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export default function defer() {
  return new Defer();
}

