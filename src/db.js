'use strict'
const r = require('rethinkdb')
const Kefir = require('kefir')
module.exports = (config) => {
  return Kefir.fromNodeCallback(cb => {
    r.connect(config, cb)
  })
}
