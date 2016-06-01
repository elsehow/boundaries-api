# Contributing 

## Developing

Clone this repository, then

    npm install
    npm run watch

Now you can edit any js files - tests will automatically re-run

## Validating inputs
- PUT add an observation to a not-existing table, expect 500
- PUT get with bad tables, times, missing fields - all should 422
- split out erroring tests and passing tests; randomize the order / number of times those tests get run

## Adding features

Since we're using RethinkDB, there should be an API for subscribing to updates to a table. This could open a websocket connection, maybe using [websocket-stream](https://github.com/maxogden/websocket-stream) (or socket.io if that's too minimal).

We should add support for authentication, both with the database and between the clients and HTTP servers. Any research or suggestions on this front would be much appreciated. I would prefer to avoid SaSS solutions, but would consider e.g. Google auth as an intermediate solution, if it really made life easy.
