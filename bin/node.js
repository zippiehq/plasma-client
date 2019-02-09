#!/usr/bin/env node

const program = require('commander')
const colors = require('colors')
const PlasmaCore = require('plasma-core')
const PlasmaNode = require('../index')
const latestVersion = require('latest-version')
const pkg = require('../package.json')

program
  .version('0.0.1')
  .option('-r, --registry <address>', 'Plasma chain registry address', '0x18d8BD44a01fb8D5f295a2B3Ab15789F26385df7')
  .option('-c, --chain <name>', 'Name of the plasma chain to connect to.', 'PG-beta.10')
  .option('-e, --ethereum <endpoint>', 'Endpoint of the Ethereum node to connect to.', 'https://rinkeby.infura.io/v3/fce31f1fb2d54caa9b31ed7d28437fa5')
  .option('-h, --hostname <hostname>', 'Host to run the client on.', 'localhost')
  .option('-p, --port <port>', 'Port to run the client on.', '9898')
  .option('-w, --wallet <mode>', 'Which wallet mode to use. Either "remote" or "local".', 'local')
  .option('-d, --debug', 'Runs the node in debug mode.')
  .option('-f, --finality <blocks>', 'Number of blocks to wait before considering events final.', parseInt, 0)
  .parse(process.argv)

const wallets = {
  'local': PlasmaCore.providers.WalletProviders.LocalWalletProvider,
  'remote': PlasmaCore.providers.WalletProviders.Web3WalletProvider
}

const debug = program.debug ? 'debug:*' : ''

const options = {
  finalityDepth: program.finality,
  port: program.port,
  ethereumEndpoint: program.ethereum,
  debug: `service:*,${debug}`,
  contractProvider: PlasmaCore.providers.ContractProviders.ContractProvider,
  walletProvider: wallets[program.wallet],
  operatorProvider: PlasmaCore.providers.OperatorProviders.HttpOperatorProvider,
  dbProvider: PlasmaCore.providers.DBProviders.LevelDBProvider,
  plasmaChainName: program.chain,
  registryAddress: program.registry
}

const node = new PlasmaNode(options)
const client = node.client

const getSectionTitle = (title) => {
  return '\n' + title + '\n' + '='.repeat(title.length)
}

(async () => {
  const latest = await latestVersion(pkg.name)
  if (pkg.version !== latest) {
    console.log(colors.red('ERROR: ') + 'Your plasma-client is out of date.')
    console.log('Please update to the latest version by running:')
    console.log(colors.green('npm install -g --upgrade plasma-client'))
    console.log()
    console.log(`You might also want to reset your database (this won't delete your accounts):`)
    console.log(colors.green('plasma-cli killdb'))
    return
  }

  await node.start()
  console.log('Plasma Client v' + pkg.version + ' 🎉 🎉 🎉 ')

  console.log(getSectionTitle('DISCLAIMER'))
  console.log('Plasma Client is alpha software and will probably break.')
  console.log(`Please do NOT use this application with real money (unless you're willing to lose it).`)

  console.log(getSectionTitle('Available Accounts'))
  const accounts = await client.getAccounts()
  accounts.forEach((account, i) => {
    const maxDigits = (accounts.length - 1).toString().length
    const accountNumber = i.toString().padStart(maxDigits, '0')
    console.log(`(${accountNumber}) ${account}`)
  })

  console.log(getSectionTitle('Client Information'))
  console.log(`Plasma Chain: ${program.chain}`)
  console.log(`Ethereum Node: ${program.ethereum}`)
  console.log(`Listening on: http://${program.hostname}:${program.port}`)

  console.log(getSectionTitle('Logs'))
})()
