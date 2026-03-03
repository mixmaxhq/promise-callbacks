import withTimeout from '../src/statics/withTimeout';
import TimeoutError from '../src/statics/TimeoutError';

describe('withTimeout', () => {
  it('should reject the promise with a Timeout Error if the promise does not resolve quickly', async () => {
    let timer;
    const slowResolve = new Promise((resolve) => (timer = setTimeout(resolve, 1000)));

    try {
      await expect(withTimeout(slowResolve, 1, 'The promise never resolved')).rejects.toThrow(
        new TimeoutError('The promise never resolved')
      );
    } finally {
      clearTimeout(timer);
    }
  });

  it('should resolve if with the result of the promise if it is in time', async () => {
    const fastResolve = new Promise((resolve) => {
      setTimeout(() => {
        resolve('result');
      }, 1);
    });
    await expect(withTimeout(fastResolve, 1000, 'The promise never resolved')).resolves.toEqual(
      'result'
    );
  });

  it('should reject if the promise rejects', async () => {
    const fastReject = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('result'));
      }, 1);
    });
    await expect(withTimeout(fastReject, 1000, 'The promise never resolved')).rejects.toThrow(
      new Error('result')
    );
  });
});
