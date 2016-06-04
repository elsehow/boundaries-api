'use strict'
const test = require('tape')
const request = require('request-json');
const timestamp = require('unix-timestamp')

const testTable = "cool_observation_type"

const config = {
  port: 8889,
  db: {
    host: 'localhost',
    port: 28015,
  },
}

let serverS = require('..')(config)
serverS.onValue(server => {

  console.log('server running, doing HTTP tests')
  // setup test cleanup
  test.onFinish(() => {
    server.close()
    process.exit(0)
  })
  // make an http client
  let client = request.createClient('http://localhost:' + config.port + '/')

  test('should be able to add a table', t => {

    t.plan(2)

    // PUT create a table, accept either 200 or 500 resp
    // (we don't know/care if the table has already been created)
    client.put(`create/${testTable}`, {}, (err, res, body) => {
      let status = res.statusCode
      console.log(body)
      if (status == 200)
        t.ok('got a 200 back from server on PUT table', status)
      else
        t.notOk(res.statusCode)

      client.put(`create/${testTable}`, {}, (err, res, body) => {
        let status = res.statusCode
        console.log(body)
        if (status == 200)
          t.ok('got a 200 back on PUT table, even though we already added this same table', status)
        else
          t.notOk(res.statusCode)
      })
    })


  })

  test('PUT an observation, then GET with a query', t => {

    t.plan(2)

    // PUT add an observation to that table, expect 200
    let now = timestamp.now()
    let later = timestamp.add(now, 20)

    client.get(`add/${testTable}`, {}, (err, res, body) => {
      let status = res.statusCode
      console.log(body)
      t.equal(status, 200, 'got a 200 back from server on GET observation')
      // POST the observation we made, expect 200 + observation back
      client.post(`query/${testTable}`, {
        epoch1: now,
        epoch2: later,
      }, (err, res, body) => {
        let status = res.statusCode
        console.log(body)
        t.equal(status, 200, 'got a 200 back from server on POST observation')
      })
    })
  })
})

