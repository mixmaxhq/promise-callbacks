import withTimeout from '../statics/withTimeout';

/**
 * The same promise, but with a timeout.
 *
 * @param {Promise<*>} promise The promise to resolve.
 * @param {Number} delay The millisecond delay before a timeout occurs.
 * @param {String|Error=} message The error message or Error object to reject with if the operation
 *   times out.
 * @return {Promise<*>} The promise that times out.
 */
export default function timeout(delay, message) {
  return withTimeout(this, delay, message);
}
