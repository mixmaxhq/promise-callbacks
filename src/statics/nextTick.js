'use strict';

function nextTick(value) {
  return new Promise((resolve) => process.nextTick(resolve, value));
}

module.exports = nextTick;
