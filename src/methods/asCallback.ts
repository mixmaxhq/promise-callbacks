import asCb from '../statics/asCallback';

/**
 * Calls the specified callback with the result of the promise.
 *
 * Note that if the callback throws a synchronous error, then we will trigger an unhandled
 * rejection.
 *
 * @param {Promise} promise
 * @param {Function<Err, Any>} cb - An errback.
 */
export default function asCallback(cb) {
  asCb(this, cb);
}
