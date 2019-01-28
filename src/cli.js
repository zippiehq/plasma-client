#!/usr/bin/env node

const Plasma = require('plasma-js-lib')
const program = require('commander')

const client = new Plasma(
  new Plasma.providers.HttpProvider('http://localhost:9898')
)

const parseAccount = async (account) => {
  if (!isNaN(account)) {
    const accounts = await client.getAccounts()
    account = accounts[account]
  }
  return account
}

program.version('0.0.1')

program.command('listaccounts').action(async () => {
  const accounts = await client.getAccounts()
  accounts.forEach((account) => console.log(account))
})

program.command('getbalance <account>').action(async (account) => {
  account = await parseAccount(account)
  const balances = await client.getBalances(account)

  for (let token in balances) {
    const balance = balances[token]
    console.log(`${token}: ${balance.toString()}`)
  }
})

program
  .command('deposit <account> <token> <amount>')
  .action(async (account, token, amount) => {
    account = await parseAccount(account)
    const result = await client.deposit(token, amount, account)
    console.log(`Deposit transaction hash: ${result.transactionHash}`)
  })

program
  .command('send <from> <to> <token> <amount>')
  .action(async (from, to, token, amount) => {
    from = await parseAccount(from)
    const receipt = await client.sendTransactionAuto(from, to, token, amount)
    console.log(`Transaction receipt: ${receipt}`)
  })

program.parse(process.argv)
