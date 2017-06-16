process.on('unhandledRejection', (reason, promise) => {
  promise.catch((err) => {
    console.dir(err);
    fail();
  });
});
