# promise-callbacks

This package helps you work with a codebase that uses promises vs. callbacks in most-but-not-all
places. _It differs from all the other callback-to-promise libraries out there_ by not providing any sort of ["promisify[All]"](http://bluebirdjs.com/docs/api/promisification.html) APIs to convert
and/or patch callback-using APIs to become promise-returning APIs. Rather, this function makes it
easy to convert APIs to/from promises _at the call site_.

It also uses native promises not Bluebird etc.

This is because it's 2017, and this package assumes that you'll convert all your own code to use
native promises (especially now that recent versions of Chrome and Node 7.6.0 natively support `
async`/`await`) and the API calls left over will be 3rd-party libraries that you really don't want
to patch, due to not having access to library classes and/or the general hackiness of
monkey-patching ([trace this](https://github.com/petkaantonov/bluebird/blob/3746b7eca90dd8b11af73db5d30cf46d7dd90f9b/src/promisify.js#L295)).

Hopefully these 3rd-party libraries will get [their](https://github.com/nodejs/node/pull/5020)
[acts](https://github.com/request/request/issues/1935#issuecomment-287660358)
[together](https://github.com/mafintosh/mongojs/issues/324#issuecomment-287591550)
in the relatively near future. In the meantime, there's `promise-callbacks` to keep it simple.

## Installation

```sh
yarn add promise-callbacks
```
or
```sh
npm install promise-callbacks --save
```

The minimum requirement is a native `Promise` implementation, though you'll get the most out of
this if you're using Chrome minus 2 or Node 7.6.0 or higher for `async`/`await`.

## Usage

### Converting a callback to a promise

```js
const { sync } = require('promise-callbacks');

function respondWithDelay(done) {
  setTimeout(() => done(null, 'hi'), 2000);
}

async function foo() {
  console.log(await sync.get(respondWithDelay(sync.set())));
}
```

What happened there is that `sync.set()` stored a promise and returned a Node errback, which when
called resolved that promise. `sync.get()` retrieved the promise so that you could `await` it.

`sync.get` doesn't take any arguments&mdash;putting the call to `respondWithDelay` "inside" it
is just syntax sugar that works because JS interpreters evaluate the arguments to functions
(i.e. `respondWithDelay(sync.set()))`) before the function calls themselves (`sync.get()`). It
would be equivalent to do

```js
async function foo() {
  respondWithDelay(sync.set());
  console.log(await sync.get());
}
```

The calls MUST be paired, i.e.:

1. Make sure you call `set` before `get`
2. Make sure to call `get` before calling `set` again

The library will helpfully throw exceptions if you violate those guidelines.

## Converting a promise to a callback

```js
const { asCallback } = require('promise-callbacks');

asCallback(Promise.resolve(true), (err, res) => {
  console.log(res); // true
});
```

Straightforward. Or, if you don't mind just a little bit of monkey-patching:

```js
const { patchPromise } = require('promise-callbacks');

// Call this once, when your application starts up,
// to add `asCallback` to `Promise.prototype`.
patchPromise();

// Thereafter:
Promise.resolve(true).asCallback((err, res) => {
  console.log(res); // true
});
```

## Real-world example

`example/app.js` demonstrate these APIs' use in the context of a web server. Do `yarn run example`
to start it.

## Shout-outs

`sync` is inspired by / named after [`synchronize.js`](http://alexeypetrushin.github.io/synchronize/docs/index.html), a wonderful library that was [Mixmax](https://mixmax.com/)'s [coroutine of choice](https://mixmax.com/blog/node-fibers-using-synchronize-js)
prior to Node adding support for `async`/`await`.

`asCallback` is inspired by [Bluebird](http://bluebirdjs.com/docs/api/ascallback.html).
