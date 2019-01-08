const Plasma = require('plasma-core')
const RPCServerService = require('./services/rpc-server-service')

class PlasmaApp {
  constructor () {
    this.plasma = new Plasma({
      contract: {
        abi: '',
        address: '0x0'
      },
    })

    this.plasma.registerService(RPCServerService, {
      port: '9898'
    })
  }

  start () {
    this.plasma.startServices()
  }
}

module.exports = PlasmaApp
