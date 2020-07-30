### [3.8.2](https://github.com/mixmaxhq/promise-callbacks/compare/v3.8.1...v3.8.2) (2020-07-30)


### Bug Fixes

* throw error when no callback provided ([#155](https://github.com/mixmaxhq/promise-callbacks/issues/155)) ([20bfc77](https://github.com/mixmaxhq/promise-callbacks/commit/20bfc77668939668103af674d1199f3fb1c1a3dc))

### [3.8.1](https://github.com/mixmaxhq/promise-callbacks/compare/v3.8.0...v3.8.1) (2020-04-13)


### Bug Fixes

* support Node 4.0 environments ([#57](https://github.com/mixmaxhq/promise-callbacks/issues/57)) ([4b298f8](https://github.com/mixmaxhq/promise-callbacks/commit/4b298f83fb10ac94c264adf4367ede11d0399a25))

## [3.8.0](https://github.com/mixmaxhq/promise-callbacks/compare/v3.7.1...v3.8.0) (2020-04-07)


### Features

* add Promise.voidAll ([a7a7cc1](https://github.com/mixmaxhq/promise-callbacks/commit/a7a7cc13fee464b51e3f34f083eea76af072d9b2))

### [3.7.1](https://github.com/mixmaxhq/promise-callbacks/compare/v3.7.0...v3.7.1) (2020-04-07)


### Performance Improvements

* avoid deoptimized arguments passing ([44f54d1](https://github.com/mixmaxhq/promise-callbacks/commit/44f54d19e995f75fbd0b9c4cd36b35a58df8ec0b)), closes [/github.com/petkaantonov/bluebird/wiki/Optimization-killers#3](https://github.com/mixmaxhq//github.com/petkaantonov/bluebird/wiki/Optimization-killers/issues/3)

## [3.7.0](https://github.com/mixmaxhq/promise-callbacks/compare/v3.6.0...v3.7.0) (2020-04-03)


### Features

* use callbackBuilder directly from callAsync ([2b3068f](https://github.com/mixmaxhq/promise-callbacks/commit/2b3068f06ea96a0eaa8f536b094f3d5e6ca48e04))

## [3.6.0](https://github.com/mixmaxhq/promise-callbacks/compare/v3.5.0...v3.6.0) (2020-02-28)


### Features

* expose objectAll without patching Promise ([3e45be3](https://github.com/mixmaxhq/promise-callbacks/commit/3e45be377dc299797c0e572bbcc643a3cd1701a7))

## [3.5.0](https://github.com/mixmaxhq/promise-callbacks/compare/v3.4.0...v3.5.0) (2020-02-17)


### Features

* implement Promise.objectAll ([693012e](https://github.com/mixmaxhq/promise-callbacks/commit/693012ef99b737963a5c9c627920294fd6c7dfe3))

## [3.4.0](https://github.com/mixmaxhq/promise-callbacks/compare/v3.3.1...v3.4.0) (2020-01-29)


### Features

* support nextTick in browsers ([d5e6fe3](https://github.com/mixmaxhq/promise-callbacks/commit/d5e6fe39d80620182f0307b9523fdf37b4f3fdee))


### Bug Fixes

* expose callback exceptions as uncaught ([2c8cb0f](https://github.com/mixmaxhq/promise-callbacks/commit/2c8cb0fa07454c9d726feac24b83ac167f1ab007))

## Release History

* 3.3.1 With timeout now throws a TimeoutError derived from Error

* 3.3.0 Add callAsync function

* 3.2.2 Actually use explicit exports per #16.
* 3.2.1 Use explicit exports per #16.
* 3.2.0 Add `defer` function, similar to `$.Deferred`
* 3.1.0 Add `promisify.method` convenience method
* 3.0.0 Add waitOn, wrapAsync
        Remove copyAll option from promisifyAll
        Fix support for Node 4
* 2.1.3 Fix delay, static exports, accept resolve value for async primitives
* 2.1.2 Fix for Node < 7
* 2.0.0 Replace sync with deferred, add promisify, fix asCallback
* 1.0.0 Initial release
