'use strict';

const fromEntries =
  Object.fromEntries ||
  function fromEntries(entries) {
    const obj = {};
    for (const [key, value] of entries) {
      obj[key] = value;
    }
    return obj;
  };

module.exports = {
  fromEntries,
};
