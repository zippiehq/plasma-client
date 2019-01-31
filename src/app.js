const PlasmaCore = require('plasma-core')
const PlasmaClient = require('plasma-js-lib')
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
    this.client = new PlasmaClient(new PlasmaClient.providers.HttpProvider(`http://localhost:${options.port}`))
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

  /**
   * Logs a message using the current logger.
   * @param {string} message Message to be logged.
   */
  log (message) {
    this.core.logger.log(message)
  }

  /**
   * Sets the plasma chain contract's address.
   * @param {string} address New contract address.
   */
  setContractAddress (address) {
    this.core.services.contract.contract.options.address = address
  }
}

module.exports = PlasmaNode
