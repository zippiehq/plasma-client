#!/usr/bin/env node

const Plasma = require('plasma-js-lib')
const program = require('commander')

program
  .arguments('<method> [params...]')
  .option('-p', '--port', 'Port on which the Plasma Node is listening', 9898)
  .option(
    '-h',
    '--host',
    'Host on which the Plasma Node is listening',
    '127.0.0.1'
  )
  .action(async (method, params, cmd) => {
    const endpoint = `http://${cmd.host}:${cmd.port}`
    const client = new Plasma(new Plasma.providers.HttpProvider(endpoint))
    const result = await client[method](...params)
    console.log(result)
  })

program.parse(process.argv)
