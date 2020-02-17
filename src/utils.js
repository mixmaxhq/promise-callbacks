'use strict';

const arraySlice = Array.prototype.slice;

function slice(arrayLike, offset) {
  return arraySlice.call(arrayLike, offset);
}

module.exports = {
  slice,
};
