'use strict';

function delay(time, value) {
  return new Promise((resolve) => setTimeout(resolve, time, value));
}

module.exports = delay;
