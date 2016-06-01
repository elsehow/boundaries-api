'use strict'
const test = require('tape')
//const config = {
//  host: '192.168.99.100',
//  port: 32769,
//}
//const connS = require('../src/db')(config)
//const api = require('../src/api')
//const server = require('../src/server')
//
//let apiS = connS.map(api)
//// apiS.onValue(testAPI) // HACK
//
//function testAPI (a) {
//  test('create() add() and get() work - can fetch things betewen unix timestamps', t => {
//    t.plan(2)
//    a.create('authors').log('create table')
//    let timestamp = require('unix-timestamp')
//    let now = timestamp.now()
//    let later = timestamp.add(now, 20)
//    a.add('authors',  { name: "Irving Goffmann" }).onValue(_ => {
//      a.add('authors',  { name: "Mark Twain" }).onValue(_ => {
//        a.get('authors', now, later).onValue(v => {
//          t.ok(v.name)
//        })
//      })
//    })
//  })
//}

const config = {
  port: 8889,
  db: {
    host: '192.168.99.100',
    port: 32769,
  },
}

const serverS = require('..')(config)

serverS.onValue(server => {
  console.log('server running, doing HTTP tests')
  test('testing server with post requests', t => {

    // POST create a table, accept either 200 or 500 resp
    // (we don't know/care if the table has already been created)

    // POST add an observation to that table, expect 200

    // GET the observation we made, expect 200 + observation back

    // POST add an observation to a not-existing table, expect 500

    // GET observation with various bad tables, times, missing fields
    // all should result in 500 requests

    server.close()
    console.log('server closed')
  })
})
