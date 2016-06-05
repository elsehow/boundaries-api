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
serverS.onError(e => console.warn(e))
serverS.onValue(server => {

  console.log('server running, doing HTTP tests')
  // setup test cleanup
  test.onFinish(() => {
    server.close()
    process.exit(0)
  })

  let client = request.createClient('http://localhost:' + config.port + '/')

  let queryStr = (obs, t0, t1) => `query/${obs}?t0=${t0}&t1=${t1}`


  function addAndGet (t, cb) {

    function query (obs, t0, t1, cb) {
      client.get(queryStr(obs, t0, t1), {}, (err, res, body) => {
        let status = res.statusCode
        console.log(body)
        t.deepEqual(body[0].type, obs,
                    'we got the correct observation back')
        t.equal(status, 200,
                'got a 200 back from server on GET query/ observation')
        cb()
      })
    }

    let observation = randomstr()
    let now = timestamp.now()
    client.get(`add/${observation}`, {}, (err, res, body) => {
      let status = res.statusCode
      console.log(body)
      t.equal(status, 200,
              'got a 200 back from server on GET add/ observation')
      query(observation, now, timestamp.now(), () => {
        query(observation, now, timestamp.now(), () => {
          cb()
        })
      })
    })
  }

  test('get something that doesnt exist', t => {
    let earlier = timestamp.now()-5
    client.get(queryStr('coffee', earlier, timestamp.now()), {}, (err, res, body) => {
      let status = res.statusCode
      t.deepEquals(body, [], "got an empty array")
      t.end()
    })
  })

  test('should be able to add a table', t => {
    addAndGet(t, () => {
      addAndGet(t, () => {
        t.end()
      })
    })
  })
})

