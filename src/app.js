const PlasmaCore = require('plasma-core')
const Plasma = require('plasma-js-lib')
const RPCServerService = require('./services/rpc-server-service')

const defaultOptions = {
  port: '9898'
}

/**
 * Class that houses the whole node.
 */
class PlasmaNode {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options)

    this.core = new PlasmaCore(options)
    this.core.registerService(RPCServerService, {
      port: options.port
    })
    this.client = new Plasma(
      new Plasma.providers.HttpProvider(`http://localhost:${options.port}`)
    )
  }

  /**
   * Starts the node.
   */
  async start () {
    this.started = true
    return this.core.start()
  }

  /**
   * Stops the node.
   */
  async stop () {
    this.started = false
    return this.core.stop()
  }
}

module.exports = PlasmaNode
