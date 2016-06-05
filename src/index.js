'use strict'
// returns a stream of servers (an object with a close() function)
module.exports = (config) => {
  const connS = require('./db')(config.db)
  const apiS = require('./api')(config.table)
  const server = require('./server')
  const listen = app => app.listen(config.port)

  return connS.flatMap(apiS).map(server).map(listen)
}
