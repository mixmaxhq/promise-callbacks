process.on('unhandledRejection', (reason, promise) => {
  promise.catch((err) => {
    /* eslint-disable no-console */
    console.dir(err);
    /* eslint-enable no-console */
    fail();
  });
});
