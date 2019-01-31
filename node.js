#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const PlasmaCore = require('plasma-core')
const PlasmaNode = require('./index')
const pkg = require('./package.json')

program
  .version('0.0.1')
  .option('-o, --operator <endpoint>', 'Endpoint of the operator to connect to.', 'http://107.22.13.89/api')
  .option('-e, --ethereum <endpoint>', 'Endpoint of the Ethereum node to connect to.', 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5')
  .option('-h, --hostname <hostname>', 'Host to run the node on.', 'localhost')
  .option('-p, --port <port>', 'Port to run the node on.', '9898')
  .parse(process.argv)

const dbPath = path.join(__dirname, '/chaindb/')

const options = {
  finalityDepth: 0,
  port: program.port,
  ethereumEndpoint: program.ethereum,
  operatorEndpoint: program.operator,
  dbPath: dbPath,
  debug: 'service:*',
  contractProvider: PlasmaCore.providers.ContractProviders.HttpContractProvider,
  walletProvider: PlasmaCore.providers.WalletProviders.LocalWalletProvider,
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider,
  dbProvider: PlasmaCore.providers.DBProviders.LevelDBProvider
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
    const maxDigits = (accounts.length - 1).toString().length
    const accountNumber = i.toString().padStart(maxDigits, '0')
    console.log(`(${accountNumber}) ${account}`)
  })

  console.log(getSectionTitle('Node Information'))
  console.log(`Operator: ${program.operator}`)
  console.log(`Ethereum Node: ${program.ethereum}`)
  console.log(`Listening on: http://${program.hostname}:${program.port}`)

  console.log(getSectionTitle('Logs'))
}
start()
