'use strict';

const arraySlice = Array.prototype.slice;

function toArray(arrayLike, offset) {
  return arraySlice.call(arrayLike, offset);
}

module.exports = {
  toArray,
};
