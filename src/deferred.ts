import callbackBuilder from './callbackBuilder';

type CallbackOptions = Parameters<typeof callbackBuilder>[2];

/**
 * Create a capture context, similar to sync but without the global state.
 *
 * @param {Boolean|String[]} options.variadic See the documentation for promisify.
 */
type DeferredCallback = (err: unknown, value?: unknown, ...rest: unknown[]) => void;

export interface DeferredPromise<T = unknown> extends Promise<T> {
  defer: () => DeferredCallback;
}

export default function deferred<T = unknown>(options?: CallbackOptions): DeferredPromise<T> {
  let args:
    | [(value: unknown) => void, (reason?: unknown) => void, CallbackOptions | undefined]
    | null = null;
  const promise = new Promise(
    (resolve, reject) => (args = [resolve, reject, options])
  ) as DeferredPromise<T>;
  promise.defer = function defer() {
    if (!args) throw new Error('defer has already been called');
    const callback = callbackBuilder(args[0], args[1], args[2]);
    args = null;
    return callback;
  };
  return promise;
}
