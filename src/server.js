'use strict'
const express = require('express')
const bodyParser = require('body-parser')

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
    handle(res, api.get(req.params.table, req.body.epoch1, req.body.epoch2))
  }

  let app = express()
  app.use(bodyParser.json())

  app.put('/create/:table', handleCreate)

  //app.put('/add/:table', handleAdd)
  app.get('/add/:table', handleAdd)

  app.post('/query/:table', handleQuery)

  return app
}
