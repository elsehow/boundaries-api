'use strict'
const express = require('express')
const bodyParser = require('body-parser')

function handle (response, stream) {
  stream.onError(e => response.status(500).send(e))
  stream.onValue(v => response.status(200).send(v))
  return
}

module.exports = (api) => {

  let app = express()
  app.use(bodyParser.json())

  app.put('/create/:table', function (req, res) {
    handle(res, api.create(req.params.table))
  })

  app.put('/add/:table', function (req, res) {
    handle(res, api.add(req.params.table))
  })

  app.post('/query/:table', function (req, res) {
    handle(res, api.get(req.params.table, req.body.epoch1, req.body.epoch2))
  })

  return app
}
