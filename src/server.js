'use strict'
const express = require('express')

function handle (response, stream) {
  stream.onError(e => response.status(500).send(e))
  stream.onValue(v => response.status(200).send(v))
  return
}

module.exports = (api) => {

  function handleCreate (req, res) {
    handle(res, api.create(req.params.table))
  }

  function handleAdd (req, res) {
    handle(res, api.add(req.params.table))
  }

  function handleQuery (req, res) {
    handle(res, api.get(req.params.table, Number(req.query.t0), Number(req.query.t1)))
  }

  let app = express()

  app.put('/create/:table', handleCreate)

  //app.put('/add/:table', handleAdd)
  app.get('/add/:table', handleAdd)

  app.get('/query/:table', handleQuery)

  return app
}
