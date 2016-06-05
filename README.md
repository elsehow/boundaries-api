# boundaries-api

> In order to generate a data set, collections of observations that can be compared with each other, scientists use coding schemes to circumscribe and delineate the world they examine. When disparate events are viewed through a single coding scheme, equivalent observations become possible.

\- Charles Goodwin, *Professional Vision*.

`boundaries-api` is a tool for making observations that are identical withinclasses, differing only in where in time they were observed.  You may `create` a class of observation, `add` observations to that class, and `get` observations of a given class between two times. No metadata can be attached to observations.

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
  port: 9998,
  table: 'yo-production',
  db: {
    db: 'test',
    host: 'localhost',
    port: 28015,
  },
}

let serverS = boundaries(config)
serverS.onValue(server => {
  console.log('server running! request away')
})
```

## HTTP API

### GET '/add/yourObservationClass'

Add an observation to a class.

*I know, why is this a GET, instead of a PUT request? Well, I wanted to use Yo to hit this route, and that can only make GET requests. Looking for better solutions.*

### GET '/query/yourObservationClass?t0=1464804227.762&t1=1464804235.249'

Get observations in the given class added between two given times, where `t0` and `t1` are two [unix epochs](https://en.wikipedia.org/wiki/Unix_time). You can use [unix-timestamp](https://www.npmjs.com/package/unix-timestamp) to generate these in javascript.

## License

BSD

