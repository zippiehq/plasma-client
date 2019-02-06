#!/usr/bin/env node

const Plasma = require('plasma-js-lib')
const colors = require('colors')
const program = require('commander')
const web3Utils = require('web3-utils')

const parseAccount = async (account) => {
  if (!web3Utils.isAddress(account)) {
    const accounts = await client.getAccounts()
    account = accounts[account]
  }
  return account
}

program
  .version('0.0.1')
  .option('-h, --hostname <hostname>', 'Host the node is running on. Defaults to 127.0.0.1.', '127.0.0.1')
  .option('-p, --port <port>', 'Port the node is running on. Defaults to 9898.', '9898')

const client = new Plasma(
  new Plasma.providers.HttpProvider(`http://${program.hostname}:${program.port}`)
)

program.command('listaccounts').action(async () => {
  const accounts = await client.getAccounts()
  accounts.forEach((account, i) => {
    const maxDigits = (accounts.length - 1).toString().length
    const accountNumber = i.toString().padStart(maxDigits, '0')
    console.log(`(${accountNumber}) ${account}`)
  })
})

program.command('getaccount <account>').action(async (account) => {
  account = await parseAccount(account)
  console.log(account)
})

program.command('createaccount').action(async () => {
  const address = await client.createAccount()
  console.log(`Created new account: ${address}`)
})

program.command('getbalance <account>').action(async (account) => {
  account = await parseAccount(account)
  const balances = await client.getBalances(account)

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
  .action(async (account, token, amount) => {
    account = await parseAccount(account)
    console.log(`Sending deposit transaction...`)
    const result = await client.deposit(token, amount, account)
    console.log('Deposit successful!')
    console.log(`View deposit on Etherscan: https://rinkeby.etherscan.io/tx/${result.transactionHash}`)
  })

program
  .command('send <from> <to> <token> <amount>')
  .action(async (from, to, token, amount) => {
    from = await parseAccount(from)
    to = await parseAccount(to)
    const receipt = await client.sendTransaction(from, to, token, amount)
    console.log(`Transaction receipt: ${receipt}`)
  })

program
  .command('exit <account> <token> <amount>')
  .action(async (account, token, amount) => {
    account = await parseAccount(account)
    console.log(`Sending exit transaction(s)...`)
    const result = await client.startExit(account, token, amount)

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
  .action(async (account) => {
    account = await parseAccount(account)
    console.log(`Sending exit finalization transaction(s)...`)
    const result = await client.finalizeExits(account)
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
  .action(async (account) => {
    account = await parseAccount(account)
    const exits = await client.getExits(account)
    exits.forEach((exit, i) => {
      const maxDigits = (exits.length - 1).toString().length
      const exitNumber = i.toString().padStart(maxDigits, '0')
      const status = exit.completed ? 'READY TO BE FINALIZED' : 'IN CHALLENGE PERIOD'
      console.log(`(${exitNumber}) Exit #${exit.id}: ${status}`)
    })
  })

program
  .command('submitblock')
  .action(async () => {
    await client.operator.submitBlock()
  })

if (!process.argv.slice(2).length) {
  program.outputHelp((text) => {
    return colors.red(text)
  })
}

program.parse(process.argv)
