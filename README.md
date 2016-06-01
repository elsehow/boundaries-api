# boundaries-api

> Central to the cognitive processes that constitute science are both material objects — tools and machines of many different types — and writing practices quite unlike those typically studied by anthropologists investigating literacy. In order to generate a data set, collections of observations that can be compared with each other, scientists use coding schemes to circumscribe and delineate the world they examine. When disparate events are viewed through a single coding scheme, equivalent observations become possible.

\- Charles Goodwin, *Professional Vision*.

`boundaries-api` is a tool for making observations in time. Observations are described *only* by their type, and by the time at which they were observed. You may `create` a class of observation, `add` observations to that class, and `get` observations of a given class between two times. No metadata can be attached to observations.

This project is under active development. See [contributing.md](contributing.md).

## Install

First, you'll need to install an instance of [RethinkDB](https://www.rethinkdb.com/) on your machine. Docker is a good way to do this - [Kitematic](http://kitematic.com/) has an easy one-click install / UI management if you're on Windows or OS X.

Once you've done that,

```
npm install boundaries-api
```

## Use

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

## HTTP API

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

## License

BSD

