'use strict'
const r = require('rethinkdb')
const Kefir = require('kefir')
const timestamp = require('unix-timestamp')

module.exports = (connection) => {

  function streamFrom (rql) {
    return Kefir.fromNodeCallback(cb => {
      rql.run(connection, cb)
    })
  }

  // creates a table in the db
  function create (table) {
    return streamFrom(
      r.tableCreate(table)
    ).flatMap(() => {
      return streamFrom(
        r.table(table).indexCreate('timestamp')
      )
    })
  }

  // adds an observation to table
  // returns a stream
  function add (table) {
    let observation = {
      timestamp: r.epochTime(timestamp.now())
    }
    return streamFrom(
      r.table(table).insert(observation)
    )
  }

  // gets an observation between two unix times (epoch1, epoch2)
  // returns a stream
  function get (table, epoch1, epoch2) {
    return streamFrom(
      r.table(table).between(
        r.epochTime(epoch1),
        r.epochTime(epoch2),
        {index: 'timestamp'}
      )
    ).flatMap(cursor => {
      return Kefir.stream(emitter => {
        cursor.on('error', emitter.error)
        cursor.on('data', emitter.emit)
      })
    })
  }

  return {
    create: create,
    add: add,
    get: get,
  }
}
