'use strict';

const arraySlice = Array.prototype.slice;

const fromEntries =
  Object.fromEntries ||
  function fromEntries(entries) {
    const obj = {};
    for (const [key, value] of entries) {
      obj[key] = value;
    }
    return obj;
  };

function slice(arrayLike, offset) {
  return arraySlice.call(arrayLike, offset);
}

module.exports = {
  fromEntries,
  slice,
};
