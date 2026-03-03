import callbackBuilder from './callbackBuilder';

/**
 * Calls the given function and returns a promise that fulfills according to the formers result.
 * A convenience function that make the 'promise = deferred(), fn(promise.defer()), await promise' pattern a one-liner.
 *
 * @param {function(callback)} fn A function that takes a Node style callback as its argument.
 * @return {Promise}
 */
type NodeStyleCallback<T> = (err: unknown, value?: T, ...rest: unknown[]) => void;
type AsyncFunction<T> = (cb: NodeStyleCallback<T>) => void;

export default function callAsync<T = unknown>(fn: AsyncFunction<T>): Promise<T> {
  return new Promise((resolve, reject) => fn(callbackBuilder(resolve, reject)));
}
