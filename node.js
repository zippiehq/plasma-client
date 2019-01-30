#!/usr/bin/env node

const program = require('commander')
const PlasmaCore = require('plasma-core')
const PlasmaNode = require('./index')
const pkg = require('./package.json')

program
  .version('0.0.1')
  .option('-o, --operator <endpoint>', 'Endpoint of the operator to connect to.', 'http://localhost:3000')
  .option('-e, --ethereum <endpoint>', 'Endpoint of the Ethereum node to connect to.', 'http://localhost:8545')
  .option('-h, --hostname <hostname>', 'Host to run the node on.', 'localhost')
  .option('-p, --port <port>', 'Port to run the node on.', '9898')
  .parse(process.argv)

const options = {
  logger: { log: () => { return true } },
  port: program.port,
  ethereumEndpoint: program.ethereum,
  contractProvider: new PlasmaCore.providers.ContractProviders.HttpContractProvider(),
  walletProvider: new PlasmaCore.providers.WalletProviders.Web3WalletProvider(),
  operatorProvider: new PlasmaCore.providers.OperatorProviders.HttpOperatorProvider({ url: program.operator })
}

const node = new PlasmaNode(options)
const client = node.client

const getSectionTitle = (title) => {
  return '\n' + title + '\n' + '='.repeat(title.length)
}

const start = async () => {
  await node.start()
  console.log('Plasma Node v' + pkg.version)

  console.log(getSectionTitle('Available Accounts'))
  const accounts = await client.getAccounts()
  accounts.forEach((account, i) => {
    console.log(`(${i}) ${account}`)
  })

  console.log(getSectionTitle('Node Information'))
  console.log(`Operator: ${program.operator}`)

  console.log(getSectionTitle('Logs'))
  console.log('Node started successfully')
  console.log(`Node listening on http://${program.hostname}:${program.port}`)
}
start()
