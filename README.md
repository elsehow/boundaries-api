# boundaries-api

short description

## install

First, you'll need to install an instance of [RethinkDB](https://www.rethinkdb.com/) on your machine. Docker is a good way to do this - [Kitematic](http://kitematic.com/) has an easy one-click install / UI management if you're on Windows or OS X.

Once you've done that,

```
npm install boundaries-api
```

## use

```javascript
let boundaries = require('boundaries-api')

const config = {
  port: 8889,
  db: {
    host: '192.168.99.100',
    port: 32769,
  },
}

let serverS = require('..')(config)
serverS.onValue(server => {
  console.log('server running! request away')
})
```

## HTTP api

### PUT '/create/yourObservationClass'

Create a new class of observations, with the given name (here `yourObservationClass`)

### PUT '/add/yourObservationClass'

Add an observation to an existing class, here `yourObservationClass`)

### POST '/query/yourObservationClass'

This route queries observations in the given class that were added between two given times.
It requires a JSON requst body of the form:

```javascript
{
  epoch1: 1464804227.762,
  epoch2: 1464804235.249,
}
```

Where `epoch1` and `epoch2` are two [unix epochs](https://en.wikipedia.org/wiki/Unix_time). You can use [unix-timestamp](https://www.npmjs.com/package/unix-timestamp) to generate these in javascript.

## license

BSD

## TODOs
- PUT add an observation to a not-existing table, expect 500
- PUT get with bad tables, times, missing fields - all should 422
- split out erroring tests and passing tests; randomize the order / number of times those tests get run
