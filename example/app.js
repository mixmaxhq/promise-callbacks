const express = require('express');
const app = express();
const { patchPromise, deferred } = require('..');


// Adds Promise#asCallback.
patchPromise();


// Test functions.
function respond(subject, done) {
  setTimeout(() => done(null, `hello ${subject}`), 2000);
}

function respondWithPromise(subject) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`hello ${subject}`), 2000);
  });
}

async function asyncRespondWithPromise(subject) {
  return await respondWithPromise(subject);
}


// API handlers.

// The ideal world.
app.get('/', async function(req, res) {
  res.send(await respondWithPromise('world'));
});

// Using old APIs that can't be refactored to return promises for some reason.
app.get('/sync', async function(req, res) {
  const promise = deferred();
  respond('from new world', promise.defer());
  res.send(await promise);
});

// Use new (promise-using) APIs with callbacks for some reason.
app.get('/asCallback', function(req, res) {
  respondWithPromise('from new world but still using callbacks?').asCallback((err, val) => {
    res.send(val);
  });
});

// Make sure that we can call asCallback on async functions.
app.get('/async-asCallback', function(req, res) {
  asyncRespondWithPromise('just testing').asCallback((err, val) => res.send(val));
});

app.listen(9999);
