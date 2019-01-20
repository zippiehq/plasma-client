const PlasmaCore = require('plasma-core')
const RPCServerService = require('./services/rpc-server-service')

class PlasmaApp {
  constructor () {
    this.core = new PlasmaCore({
      contract: {
        abi: '',
        address: '0x0'
      },
    })

    this.core.registerService(RPCServerService, {
      port: '9898'
    })
  }

  async start () {
    return this.core.startServices()
  }

  async stop () {
    return this.core.stopServices()
  }
}

module.exports = PlasmaApp
