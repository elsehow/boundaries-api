'use strict'
const r = require('rethinkdb')
const Kefir = require('kefir')
const timestamp = require('unix-timestamp')

module.exports = (tableName) => {

  return function (connection) {

    function streamFrom (rql) {
      return Kefir.fromNodeCallback(cb => {
        rql.run(connection, cb)
      })
    }

    // creates a table in the db
    function idempotentCreate (table) {

      var createIfExistsRql = r.tableList()
          .contains(table)
          .do(exists => r.branch(exists, null, r.tableCreate(table)))

      return streamFrom(createIfExistsRql)
        .flatMap(x => {
          if (!x)
            return Kefir.constant(null)
          return streamFrom(r.table(table).indexCreate('timestamp'))
        })
    }

    // adds an observation to table
    // returns a stream
    function add (observation) {
      let obs = {
        timestamp: r.epochTime(timestamp.now()),
        type: observation,
      }
      return streamFrom(
        r.table(tableName).insert(obs)
      )
    }

    // gets an observation between two unix times (epoch1, epoch2)
    // returns a stream
    function get (observation, epoch1, epoch2) {
      var cursorS = streamFrom(
        r.table(tableName)
          .between(
            r.epochTime(epoch1),
            r.epochTime(epoch2),
            {index: 'timestamp'}
          )
          .filter({type: observation})
      )

      return cursorS.flatMap(cursor => {
        return Kefir.fromNodeCallback(cb => {
          cursor.toArray(cb)
        })
      })
    }


    return idempotentCreate(tableName).map(() => {
      return {
        add: add,
        get: get,
      }
    })
  }
}
