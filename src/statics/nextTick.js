'use strict';

module.exports =
  typeof process === 'object'
    ? function nextTick(value) {
        return new Promise((resolve) => process.nextTick(resolve, value));
      }
    : async function nextTick(value) {
        // Evaluating `await` on an arbitrary non-Promise value will cause the delay of one turn of
        // the microtick loop. This is not exactly the same as process.nextTick uses a different
        // mechanism, but it still ensures the code runs before I/O happens.
        await 'tick';
        return value;
      };
