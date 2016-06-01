'use strict'
// returns a stream of servers (an object with a close() function)
module.exports = (config) => {
  const connS = require('./db')(config.db)
  const api = require('./api')
  const server = require('./server')
  const listen = app => app.listen(config.port)

  return connS.map(api).map(server).map(listen)
}
