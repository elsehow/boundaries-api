'use strict'
const test = require('tape')
const config = {
  host: '192.168.99.100',
  port: 32802,
}
const connS = require('../src/db')(config)
const api = require('../src/api')
const server = require('../src/server')

let apiS = connS.map(api)
// apiS.onValue(testAPI) // HACK

function testAPI (a) {
  test('create() add() and get() work - can fetch things betewen unix timestamps', t => {
    t.plan(2)
    a.create('authors').log('create table')
    let timestamp = require('unix-timestamp')
    let now = timestamp.now()
    let later = timestamp.add(now, 20)
    a.add('authors',  { name: "Irving Goffmann" }).onValue(_ => {
      a.add('authors',  { name: "Mark Twain" }).onValue(_ => {
        a.get('authors', now, later).onValue(v => {
          t.ok(v.name)
        })
      })
    })
  })
}

// TODO map API into a server
// test that too, with post requests
apiS.map(server).onValue(app => {
  let port = 8885
  let server = app.listen(port)
  testServer(server, port)
})


function testServer (server, port) {
  test('testing server with post requests', t => {
    server.close()
    console.log('server closed')
  })
}
