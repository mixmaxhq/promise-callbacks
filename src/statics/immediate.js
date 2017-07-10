'use strict';

function immediate(value) {
  return new Promise((resolve) => setImmediate(resolve, value));
}

module.exports = immediate;
