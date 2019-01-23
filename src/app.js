const PlasmaCore = require('plasma-core')
const RPCServerService = require('./services/rpc-server-service')

const defaultOptions = {
  port: '9898'
}

class PlasmaNode {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options)

    this.core = new PlasmaCore(options)
    this.core.registerService(RPCServerService, {
      port: options.port
    })
  }

  async start () {
    this.started = true
    return this.core.startServices()
  }

  async stop () {
    this.started = false
    return this.core.stopServices()
  }
}

module.exports = PlasmaNode
