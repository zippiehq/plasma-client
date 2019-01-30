const program = require('commander')
const PlasmaCore = require('plasma-core')
const PlasmaNode = require('./index')

program
  .version('0.0.1')
  .option('-o, --operator <endpoint>', 'Endpoint of the operator to connect to.', 'http://localhost:3000')
  .option('-e, --ethereum <endpoint>', 'Endpoint of the Ethereum node to connect to.', 'http://localhost:8545')
  .option('-p, --port <port>', 'Port to run the node on.', '9898')
  .parse(process.argv)

const options = {
  port: program.port,
  ethereumEndpoint: program.ethereum,
  contractProvider: new PlasmaCore.providers.ContractProviders.HttpContractProvider(),
  walletProvider: new PlasmaCore.providers.WalletProviders.Web3WalletProvider(),
  operatorProvider: new PlasmaCore.providers.OperatorProviders.HttpOperatorProvider({ url: program.endpoint })
}

const node = new PlasmaNode(options)
node.start()
