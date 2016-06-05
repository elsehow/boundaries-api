'use strict'
const test = require('tape')
const request = require('request-json');
const timestamp = require('unix-timestamp')
const randomstr = require('random-string')

const config = {
  port: 8889,
  table: 'testing',
  db: {
    db: 'test',
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

  let client = request.createClient('http://localhost:' + config.port + '/')

  test('should be able to add a table', t => {

    // PUT add an observation to that table, expect 200
    let now = timestamp.now()

    function addAndGet (cb) {
      let observation = randomstr()

      client.get(`add/${observation}`, {}, (err, res, body) => {
        let status = res.statusCode
        console.log(body)
        t.equal(status, 200,
                'got a 200 back from server on GET add/ observation')
        // POST the observation we made, expect 200 + observation back
        var queryStr = `query/${observation}?t0=${now}&t1=${timestamp.now()}`
        client.get(queryStr, {}, (err, res, body) => {
          let status = res.statusCode
          console.log(body)
          t.deepEqual(body.type, observation,
                      'we got the correct observation back')
          t.equal(status, 200,
                  'got a 200 back from server on GET query/ observation')
          cb()
        })
      })
    }

    addAndGet(() => {
      addAndGet(() => {
        t.end()
      })
    })

  })
})

