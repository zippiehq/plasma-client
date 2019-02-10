#!/usr/bin/env node

const Plasma = require('plasma-js-lib')
const colors = require('colors')
const program = require('commander')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const web3Utils = require('web3-utils')
const dbPaths = require('../src/db-paths')

program
  .version('0.0.1')
  .option('-h, --hostname <hostname>', 'Host the node is running on. Defaults to 127.0.0.1.', '127.0.0.1')
  .option('-p, --port <port>', 'Port the node is running on. Defaults to 9898.', '9898')

const client = () => new Plasma(`http://${program.hostname}:${program.port}`)

/**
 * Converts an account index into an address.
 * @param {number} account Account index.
 * @return {string} Account address.
 */
const parseAccount = async (account) => {
  if (!web3Utils.isAddress(account)) {
    const accounts = await client().getAccounts()
    account = accounts[account]
  }
  return account
}

program
  .command('listaccounts')
  .description('lists all available accounts')
  .action(async () => {
    const accounts = await client().getAccounts()

    if (accounts.length === 0) {
      console.log(`You haven't created any accounts yet.`)
      console.log(`Create one now by running:`)
      console.log(colors.green(`plasma-cli createaccount`))
    }

    accounts.forEach((account, i) => {
      const maxDigits = (accounts.length - 1).toString().length
      const accountNumber = i.toString().padStart(maxDigits, '0')
      console.log(`(${accountNumber}) ${account}`)
    })
  })

program
  .command('getaccount <index>')
  .description('returns the address of the account with the given index')
  .action(async (index) => {
    const account = await parseAccount(index)
    if (account) {
      console.log(account)
    } else {
      console.log(`That account doesn't exist.`)
    }
  })

program
  .command('createaccount')
  .description('creates a new account')
  .action(async () => {
    const address = await client().createAccount()
    console.log(`Created new account: ${address}`)
  })

program
  .command('getbalance <account>')
  .description('returns the balance of an account')
  .action(async (account) => {
    account = await parseAccount(account)
    const balances = await client().getBalances(account)

    if (Object.keys(balances).length === 0) {
      console.log('Account has no balance')
      return
    }

    console.log('Balances:')
    for (let token in balances) {
      const balance = balances[token]
      console.log(`${token}: ${balance.toString()}`)
    }
  })

program
  .command('deposit <account> <token> <amount>')
  .description('submits a deposit for an account')
  .action(async (account, token, amount) => {
    account = await parseAccount(account)
    console.log(`Sending deposit transaction...`)
    const result = await client().deposit(token, amount, account)
    console.log('Deposit successful!')
    console.log(`View deposit on Etherscan: https://rinkeby.etherscan.io/tx/${result.transactionHash}`)
  })

program
  .command('send <from> <to> <token> <amount>')
  .description('sends tokens from one account to another')
  .action(async (from, to, token, amount) => {
    from = await parseAccount(from)
    to = await parseAccount(to)
    const receipt = await client().sendTransaction(from, to, token, amount)
    console.log(`Transaction receipt: ${receipt}`)
  })

program
  .command('exit <account> <token> <amount>')
  .description('starts a withdrawal for an account')
  .action(async (account, token, amount) => {
    account = await parseAccount(account)
    console.log(`Sending exit transaction(s)...`)
    const result = await client().startExit(account, token, amount)

    if (result.length === 0) return
    console.log(`Exited in ${result.length} transaction(s)`)
    console.log(`View exit(s) on Etherscan:`)
    result.forEach((hash, i) => {
      const maxDigits = (result.length - 1).toString().length
      const exitNumber = i.toString().padStart(maxDigits, '0')
      console.log(`(${exitNumber}) https://rinkeby.etherscan.io/tx/${hash}`)
    })
  })

program
  .command('finalizeexits <account>')
  .description('finalizes any pending withdrawals for an account')
  .action(async (account) => {
    account = await parseAccount(account)
    console.log(`Sending exit finalization transaction(s)...`)
    const result = await client().finalizeExits(account)
    console.log(`Finalized ${result.length} exit(s)`)

    if (result.length === 0) return
    console.log(`View finalization(s) on Etherscan:`)
    result.forEach((hash, i) => {
      const maxDigits = (result.length - 1).toString().length
      const exitNumber = i.toString().padStart(maxDigits, '0')
      console.log(`(${exitNumber}) https://rinkeby.etherscan.io/tx/${hash}`)
    })
  })

program
  .command('getexits <account>')
  .description('returns a list of pending withdrawals for an account')
  .action(async (account) => {
    account = await parseAccount(account)
    const exits = await client().getExits(account)
    exits.forEach((exit, i) => {
      const maxDigits = (exits.length - 1).toString().length
      const exitNumber = i.toString().padStart(maxDigits, '0')
      const status = exit.completed ? 'READY TO BE FINALIZED' : 'IN CHALLENGE PERIOD'
      console.log(`(${exitNumber}) Exit #${exit.id}: ${status}`)
    })
  })

program
  .command('submitblock')
  .description('asks the operator to submit a block, used for testing')
  .action(async () => {
    const block = await client().submitBlock()
    console.log(`Submitted block #${block}`)
  })

program
  .command('killdb')
  .description('removes all stored chain data but does not remove private keys')
  .action(async () => {
    const response = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: colors.yellow('WARNING: ') + 'All local chain data will be deleted. Are you sure you want to do this?'
      }
    ])
    if (response.confirm) {
      console.log('Deleting local chain data...')
      rimraf.sync(dbPaths.CHAIN_DB_PATH)
      console.log('Local chain data deleted.')
    }
  })

if (!process.argv.slice(2).length) {
  program.outputHelp((text) => {
    return colors.red(text)
  })
}

program.parse(process.argv)
