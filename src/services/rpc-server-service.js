const express = require('express')
const bodyParser = require('body-parser')
const core = require('plasma-core')
const BaseService = core.providers.BaseService

/**
 * Runs a JSON-RPC server and handles incoming requests.
 */
class RPCServerService extends BaseService {
  constructor (options) {
    super(options)

    this.port = options.port

    this.expressApp = express()
    this.expressApp.use(bodyParser.urlencoded({ extended: true }))
    this.expressApp.use(bodyParser.json())

    this.expressApp.post('/', async (req, res) => {
      const response = await this.app.services.jsonrpc.handle(req.body)
      res.json(response)
    })
  }

  get name () {
    return 'rpcserver'
  }

  async _onStart () {
    this.server = this.expressApp.listen(this.port)
  }

  async _onStop () {
    this.server.close()
  }
}

module.exports = RPCServerService
