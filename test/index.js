'use strict'
const test = require('tape')
const request = require('request-json');
const timestamp = require('unix-timestamp')

const testTable = "cool_observation_type"

const config = {
  port: 8889,
  db: {
    host: '192.168.99.100',
    port: 32769,
  },
}

let serverS = require('..')(config)
serverS.onValue(server => {

  console.log('server running, doing HTTP tests')

  // setup test cleanup
  test.onFinish(() => server.close())

  test('testing server with post requests', t => {

    t.plan(3)

    let client = request.createClient('http://localhost:' + config.port + '/')

    // PUT create a table, accept either 200 or 500 resp
    // (we don't know/care if the table has already been created)
    client.put(`create/${testTable}`, {}, (err, res, body) => {
      let status = res.statusCode
      console.log(body)
      if (status == 200 || status == 500)
        t.ok('got a 200 or 500 response back from server on PUT table', status)
      else
        t.notOk(res.statusCode)

      // PUT add an observation to that table, expect 200
      let now = timestamp.now()
      let later = timestamp.add(now, 20)
      client.put(`add/${testTable}`, {}, (err, res, body) => {
        let status = res.statusCode
        console.log(body)
        t.equal(status, 200, 'got a 200 back from server on PUT observation')

        // POST the observation we made, expect 200 + observation back
        client.post(`query/${testTable}`, {
          epoch1: now,
          epoch2: later,
        }, (err, res, body) => {
          let status = res.statusCode
          console.log(body)
          t.equal(status, 200, 'got a 200 back from server on GET observation')
        })
      })
    })
  })
})

