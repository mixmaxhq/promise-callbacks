# promise-callbacks

This package helps you work with a codebase that uses promises instead of callbacks in
most-but-not-all places. _It differs from most other callback-to-promise libraries out there_ by
preferring a deferred variant of a `Promise` with a Node callback-compliant `defer` method.
As such, it is most different in that it focuses on interoperating with callbacks _at the call
site_.

It also uses native promises not Bluebird etc.

This is because it's 2017, and this package assumes that you'll convert all your own code to use
native promises (especially now that recent versions of Chrome and Node 7.6.0 natively support
`async`/`await`) and the API calls left over will be 3rd-party libraries that you really don't want
to patch, due to not having access to library classes and/or the general hackiness of
monkey-patching (just try to
[trace this](https://github.com/petkaantonov/bluebird/blob/3746b7eca90dd8b11af73db5d30cf46d7dd90f9b/src/promisify.js#L295)).

Hopefully these 3rd-party libraries will get [their](https://github.com/nodejs/node/pull/5020)
[acts](https://github.com/request/request/issues/1935#issuecomment-287660358)
[together](https://github.com/mafintosh/mongojs/issues/324#issuecomment-287591550) in the relatively
near future. In the meantime, there's `promise-callbacks` to keep it simple.

## Installation

```sh
npm install promise-callbacks
```

or

```sh
npm install promise-callbacks --save
```

The minimum requirement is a native `Promise` implementation, though you'll get the most out of this
if you're using Chrome minus 2 or Node 7.6.0 or higher for `async`/`await`.

## Usage

## Converting a callback to a promise

```js
const { deferred } = require('promise-callbacks');

function respondWithDelay(done) {
  setTimeout(() => done(null, 'hi'), 2000);
}

async function foo() {
  const promise = deferred();
  respondWithDelay(promise.defer());
  console.log(await promise);
}
```

What happened there is that `promise.defer()` took the result of `respondWithDelay`, as a
callback, and `resolved`/`rejected` the associated `Promise`.

It's also possible to achieve the above more succinctly using the `callAsync` function, as follows:

```js
const { callAsync } = require('promise-callbacks');

async function foo() {
  console.log(await callAsync(respondWithDelay));  
}
``` 

### Variadic arguments

To support callbacks that provide several values, you have two options: as an array - where you can
[destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
into your own variables, or as an object, with a similar outcome.

```js
const { deferred } = require('promise-callbacks');

function manyValues(done) {
  setTimeout(() => {
    done(null, 'several', 'values', 'here');
  }, 2000);
}

async function asArray() {
  const promise = deferred({variadic: true});
  respondWithDelay(promise.defer());
  const [first, second, third] = await promise;
  console.log(`${first} ${second} ${third}`);
}

async function asObject() {
  const promise = deferred({variadic: ['first', 'second', 'third']});
  respondWithDelay(promise.defer());
  const {first, second, third} = await promise;
  console.log(`${first} ${second} ${third}`);
}
```

## Converting a callback API to a promise API

The `promisify` function is based off of Node 8's `util.promisify`. It works on versions of Node
prior to 8, and has special support for callbacks with multiple values, and has utilities to create
a copy of an object with promise-returning methods.

### For a function

```js
const { promisify } = require('promise-callbacks');

function respondWithDelay(done) {
  setTimeout(() => done(null, 'hi'), 2000);
}

const respondWithDelayPromised = promisify(respondWithDelay);

async function foo() {
  console.log(await respondWithDelayPromised());
}
```

### Variadic callbacks

Much like `deferred`, you can receive multiple callback arguments by passing the `variadic` option to promisify. This also works with `promisify.methods` and `promisify.all`.

```js
const { promisify } = require('promise-callbacks');

function respondWithDelay(done) {
  setTimeout(() => done(null, 3, 2, 1, 4), 2000);
}

const respondWithDelayPromised = promisify(respondWithDelay, {variadic: true});

async function foo() {
  console.log(await respondWithDelayPromised());
  // => [3, 2, 1, 4]
}
```

## For an object

```js
const { promisify } = require('promise-callbacks');
const fs = require('fs');

// Note that readFile and writeFile are internally bound to fs, so they can interact with the
// original context object as they expect.
const { readFile, writeFile } = promisify.methods(fs, ['readFile', 'writeFile']);

readFile('input')
  .then((content) => writeFile('output', content))
  .catch((err) => console.error('err', err));

// If you just care about one method, a less verbose option you can use is promisify.method:
const readFileAsync = promisify.method(fs, 'readFile');

readFileAsync('input')
	.then((content) => writeFile('output', content))
	.catch((err) => console.error('err', err));

// If you know all the methods of the object are asynchronous, use promisify.all:
const api = {
  respondWithDelay
};

const promiseAPI = promisify.all(api);

async function foo() {
  console.log(await promiseAPI.respondWithDelay());
}
```

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
// to add `asCallback` to `Promise.prototype`, as
// well as several utility functions to `Promise`
// itself (see below).
patchPromise();

// Thereafter:
Promise.resolve(true).asCallback((err, res) => {
  console.log(res); // true
});
```

## Creating a `Defer` object

```js
const { defer } = require('promise-callbacks');

const def = defer();
// => Hello, world!
def.promise.then((message) => console.log(message));
def.resolve('Hello, world!');
```

## `Promise` utilities

These utilities are exposed if `patchPromise` is invoked. They are also accessible on the
`promise-callbacks` module itself.

### `Promise.delay(timeout)`

Returns a promise that will resolve after the specified timeout.

### `Promise.immediate()`

Returns a promise that will resolve after the event loop has processed - analogous to `setImmediate`.

### `Promise.nextTick()`

Returns a promise that will resolve after the next process tick - analogous to `process.nextTick`.

### `Promise.withTimeout(promise, timeout, [message])`

Returns a promise that will reject after the specified timeout, unless the given promise resolves or
rejects before that timeout.

## Real-world example

`example/app.js` demonstrate these APIs' use in the context of a web server. Do `yarn run example`
to start it.

## Shout-outs

`asCallback` is inspired by [Bluebird](http://bluebirdjs.com/docs/api/ascallback.html).
