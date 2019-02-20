const PlasmaCore = require('plasma-core')
const Plasma = require('plasma-js-lib')

// -e  wss://kovan.query.zippie.org -r 0xC9122f6FE9E9a5E614Cd74647D854Be83991cd32 -c 998 -d

const options = {
  finalityDepth: 0,
  ethereumEndpoint: 'wss://kovan.query.zippie.org',
  debug: '*',
  singleAccountPrivateKey: '0x27ca15d4f88b0d51150da3c967e3ae6cce6e0ea9f6c97beaf4f90eb8ee4a2ff4',
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  walletProvider: PlasmaCore.providers.WalletProviders.SingleWalletProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider,
  dbProvider: PlasmaCore.providers.DBProviders.EphemDBProvider,
  plasmaChainName: 'Zippie Kovan Plasma 2',
  registryAddress: '0xC9122f6FE9E9a5E614Cd74647D854Be83991cd32'
}

const defaultOptions = {
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider
}

class BrowserPlasmaClient {

  constructor (options) {
    options = Object.assign({}, defaultOptions, options)

    this.core = new PlasmaCore(options)
    this.plasma = new Plasma(this.core.services.jsonrpc)
  }

  /**
   * Starts the node.
   */
  async start () {
    if (this.started) return
    this.started = true

    // Start core services.
    await this.core.start()

  }

  /**
   * Stops the node.
   */
  async stop () {
    this.started = false

    // Stop core services.
    await this.core.stop()

  }

  /**
   * Checks if the client needs to be upgraded.
   * Wipes the entire IndexedDB database.
   * Account is stored in localStorage, so it's not wiped.
   */
  async handleUpgrade () {
    // Check if the app version is the current version.
    if (versionManager.isUsingLatestVersion()) return

    // Wipe the database.
    const db = new IndexedDBProvider()
    await db._deleteDb()

    // Update the current version.
    const latest = versionManager.getLatestPublishedVersion()
    versionManager.setCurrentVersion(latest)
  }
}

window.plasmaclient = new BrowserPlasmaClient(options)
console.log('hello world')

/* const repl = require('repl');
const r = repl.start({ prompt: '> '}).context.client = client

*/