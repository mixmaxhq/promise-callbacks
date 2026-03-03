export default typeof process === 'object'
  ? function nextTick(value) {
      return new Promise((resolve) => process.nextTick(resolve, value));
    }
  : function nextTick(value) {
      return Promise.resolve(value).then((value) => value);
    };
