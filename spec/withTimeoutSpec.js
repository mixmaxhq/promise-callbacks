const withTimeout = require('../src/statics/withTimeout');
const TimeoutError = require('../src/statics/TimeoutError');

describe('withTimeout', () => {
  it('should reject the promise with a Timeout Error if the promise does not resolve quickly', async () => {
    const slowResolve = new Promise((resolve) => setTimeout(resolve, 1000));
    let result;

    try {
      await withTimeout(slowResolve, 1, 'The promise never resolved');
    } catch (error) {
      result = error;
    }
    expect(result.message).toEqual('The promise never resolved');
    expect(result).toEqual(jasmine.any(TimeoutError));
  });

  it('should resolve if with the result of the promise if it is in time', async () => {
    const fastResolve = new Promise((resolve) => {
      setTimeout(() => {
        resolve('result');
      }, 1);
    });
    const result = await withTimeout(fastResolve, 1000, 'The promise never resolved');
    expect(result).toEqual('result');
  });

  it('should reject if the promise rejects', async () => {
    let result;
    const fastReject = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('result'));
      }, 1);
    });
    try {
      await withTimeout(fastReject, 1000, 'The promise never resolved');
    } catch (error) {
      result = error;
    }

    expect(result).not.toEqual(jasmine.any(TimeoutError));
    expect(result.message).toEqual('result');
  });
});
