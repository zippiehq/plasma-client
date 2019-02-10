const PlasmaCore = require('plasma-core')
const Plasma = require('plasma-js-lib')
const LevelDBProvider = require('./services/level-db-provider')
const RPCServerService = require('./services/rpc-server-service')
const dbPaths = require('../src/db-paths')

const defaultOptions = {
  port: '9898',
  dbProvider: LevelDBProvider,
  dbPath: dbPaths.CHAIN_DB_PATH
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
