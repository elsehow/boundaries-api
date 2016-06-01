var express = require('express')
var app = express()

function handle (response, stream) {
  s.onError(e => res.status(500).send(e))
  s.onValue(v => res.status(200).send(v))
  return
}

module.exports = (api) => {

  app.put('/create', function (req, res) {
    handle(res, api.create(req.table))
  })

  app.put('/add', function (req, res) {
    handle(res, api.add(req.table, req.observation))
  })

  app.get('/get', function (req, res) {
    handle(res, api.get(req.table, req.epoch1, req.epoch2))
  })

  return app
}
