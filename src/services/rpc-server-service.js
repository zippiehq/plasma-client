const express = require('express')
const bodyParser = require('body-parser')

/**
 * Runs a JSON-RPC server and handles incoming requests.
 */
class RPCServerService {
  constructor (options) {
    this.app = options.app
    this.port = options.port

    this.server = express()
    this.server.use(bodyParser.urlencoded({ extended: true }))
    this.server.use(bodyParser.json())

    this.server.post('/', async (req, res) => {
      const response = await this.app.services.jsonrpc.handle(req.body)
      res.json(response)
    })
  }

  get name () {
    return 'rpcserver'
  }

  async start () {
    this.server.listen(this.port)
    this.started = true
  }

  async stop () {
    this.server.close()
    this.started = false
  }
}

module.exports = RPCServerService
