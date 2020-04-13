import * as static_ from './static';
import * as method from './method';

export function patchPromise() {
  static_.patchPromise();
  method.patchPromise();
}

export function unpatchPromise() {
  static_.unpatchPromise();
  method.unpatchPromise();
}

export * from './statics/index';
export { default as callAsync } from './callAsync';
export { default as defer } from './defer';
export { default as deferred } from './deferred';
export { default as promisify } from './promisify';
export { promisifyAll, promisifyMethods, method as promisifyMethod } from './promisify';
