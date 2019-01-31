# plasma-node
`plasma-node` is a lightweight plasma chain client that allows you to make transactions on a plasma chain. You can think of it like the equivalent of [parity](https://www.parity.io/ethereum/) or [geth](https://github.com/ethereum/go-ethereum/wiki/geth) for Ethereum.

## Getting Started
Running `plasma-node` is pretty simple. Here we'll take you through the steps to get started with `plasma-node` and make your first plasma transactions!

### Running a Terminal
Before you keep going, it's probably good to become familiar with using the terminal on your computer. Here are some resources for getting started:

- [Windows: Command Prompt: What It Is and How to Use It](https://www.lifewire.com/command-prompt-2625840)
- [MacOS: Introduction to the Mac OS X Command Line](https://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line)
- [Linux: How to Start Using the Linux Terminal](https://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/)

### Installing Node.js
Most of the Plasma Group apps are built in JavaScript and make use of a tool called [Node.js](https://nodejs.org/en/). In order to run our tools, including `plasma-node`, you'll need to make sure that you’ve got `Node.js` installed.

Here's a list of ways to install `Node.js` on different operating systems:

#### Windows
If you're on a windows computer, you can download the latest Long-term Support (LTS) version of `Node.js` [here](https://nodejs.org/en/download/). You'll just need to install the `.msi` file that `Node.js` provides and restart your computer.

#### MacOS
You have some options if you want to install `Node.js` on a Mac. The simplest way is to download the `.pkg` file from the `Node.js` [downloads page](ps://nodejs.org/en/download/). Once you've installed the `.pkg` file, run this command on your terminal to make sure everything is working properly:

```
node -v
```

If everything is working, you should see a version number pop up that looks something like this:

```
v10.15.1
```

##### Homebrew
You can also install `Node.js` using [Homebrew](https://brew.sh/). First, make sure Homebrew is up to date:

```
brew update
```

Now just install `Node.js`:

```
brew install node
```

#### Linux
There are different ways to install `Node.js` depending on your Linux distribution. [Here's an article](https://nodejs.org/en/download/package-manager/) that goes through installing `Node.js` on different distributions.

### Installing `plasma-node`

Once you've got `Node.js` installed, installing `plasma-node` is as simple as running this command in your terminal:

```
npm install -g plasma-node 
```

This command will install two programs, `plasma-node` and `plasma-cli`, that you can access from your command line. `plasma-node` is the actual software that allows you to make transactions and see your balances. `plasma-cli` is a [command-line interface](https://en.wikipedia.org/wiki/Command-line_interface) that talks to `plasma-node` and makes it easy to quickly start sending transactions using your terminal. 

Now that you've installed `plasma-node`, it’s easy to connect to a plasma chain and send your first transaction! If you’re looking to quickly get started, you just run the following command in your terminal:

```
plasma-node
```

This will connect you to the [Plasma Group plasma chain](http://plasma-testnet.surge.sh) by default. You can also connect to another plasma chain by running this command instead:

```
plasma-node —-operator https://link.to.operator
```

If everything goes to plan, you should see something like this:

```
Plasma Node v0.0.4-beta.4

Available Accounts
==================
(0) 0x20a229b0677D7fe42214c15942B6c40cD1340249
(1) 0x5322286C8bb78F4F8ee21452ed68c6f610D7A4AD
(2) 0x6bD7B1466beC0e8dc6E9b9099fAb75635a06CA9e
(3) 0x847B9EB499e332cC92f6B9649b9419FD0A2Abf53
(4) 0xd42b2b067cD2B2EDA3F7D3AdC9d3b400665CE814

Node Information
================
Operator: http://107.22.13.89/api

Listening on: http://localhost:9898

Logs
====
  service:operator Successfully connected to operator +0ms
```

That means your node is running and ready to start sending and receiving transactions. Congrats!

#### Common Errors

The Plasma Group plasma chain currently uses a single party, called an operator, to aggregate transactions into blocks. The cool thing about plasma is that your funds are always safe, even if the operator tries to steal them! However, this does mean that we’re susceptible to the occasional outages that any software service will have. As a result, you might see a message like this:

```
service:operator ERROR: Cannot connect to operator. Attempting to reconnect... +1ms
```

This usually means that you're not connected to the internet or, more likely, that the Plasma Group plasma chain operator is currently down and unable to receive transactions. We’re working really hard to beef up our operator and keep these outages minimized, but failures do happen. You can check our [Twitter](http://twitter.com/plasma_group) for updates on outages.

If the program says something else when you run it, or you spot another error, please submit a [bug report](https://github.com/plasma-group/plasma-core/issues/new?assignees=&labels=&template=bug_report.md&title=) on GitHub. If you’re not familiar with GitHub and could use some more information about how to submit your first bug report, check out our [resources] page.

### Making your First Transaction

Once you’ve got the node running, it’s time to make your first transaction! Before you can send money on the plasma chain, you’ll need to deposit money into the plasma chain smart contract. Basically this just means that you’re sending some funds from your Ethereum wallet to the plasma chain smart contract’s address.

#### Creating an Account

You can use the command line interface to send funds over to the plasma chain. If you've never used `plasma-node` before, you're going to need to create your first account. Here's the command for doing that:

```
plasma-cli createaccount
```

You should see something like this:

```
Created new account: 0x4AF55746D15991230df040EDf21aDEef5Be78043
```

Feel free to create a few accounts if you'd like. You can see all of your available accounts with `listaccounts`:

```
plasma-cli listaccounts
```

Hopefully you'll see a list of your accounts!

```
(0) 0x20a229b0677D7fe42214c15942B6c40cD1340249
(1) 0x4AF55746D15991230df040EDf21aDEef5Be78043
(2) 0x5322286C8bb78F4F8ee21452ed68c6f610D7A4AD
(3) 0x6bD7B1466beC0e8dc6E9b9099fAb75635a06CA9e
(4) 0x847B9EB499e332cC92f6B9649b9419FD0A2Abf53
(5) 0xd42b2b067cD2B2EDA3F7D3AdC9d3b400665CE814
```

#### Submitting a Deposit

You're almost ready to submit a deposit! Our plasma chain is currently deployed to the Ethereum test network (Rinkeby). Before you can deposit, you're going to need some testnet ETH. You can quickly get some using the [Rinkeby testnet faucet](https://faucet.rinkeby.io/) or by tweeting at us on [Twitter](https://twitter.com/plasma_group).

Once you've got some testnet ETH, you can submit your first deposit. The format of the deposit command looks like this (don’t copy this one): 

```
plasma-cli deposit <account> <token> <amount>
```

In place of `<account>` you’ll want to insert the account you’re depositing with. This can either be the “index” of the account (the number you see in front of the address when you run `listaccounts`) or the address of the account. In place of `<token>`, you can put the contract address of the token you're depositing (ETH is just "0"). We support [ERC20](https://en.wikipedia.org/wiki/ERC-20) tokens, but for now we're just going to leave `<token>` as 0 and deposit some ETH. Finally, `<amount>` is the total amount of ETH you're going to deposit, denominated in [wei](https://www.investopedia.com/terms/w/wei.asp). You can use [this Ethereum unit converter](https://etherconverter.online/) to easily calculate how much testnet ETH you'll be depositing.

Let's go ahead and deposit a few hundred wei:

```
plasma-cli deposit 0 0 500
```

That'll create an Ethereum transaction that you can view on a block explorer:

```
Sending deposit transaction...
Deposit successful!
View deposit on Etherscan: https://rinkeby.etherscan.io/tx/0xa066eb33b4d613ca4f06334d1867428c7788d44465afd92ae002a0242ec33b55
```

This is going to submit a deposit transaction for 500 wei from the `0th` (first) account.

#### Sending a Transaction
We're almost there! Sending a transaction is as simple as running one command that looks like this:

```
plasma-cli send <from> <to> <token> <amount>
```

`<from>` is the account you're going to send money from. As with `deposit`, you can either put the full address or use the account index. `<to>` is the address you're sending money to. This *must* be an Ethereum address (e.g. `0x4cdC4f412355F296C2cf261210Cc9274404E442b`). If you want to send money to yourself, just go ahead and create another account:

```
plasma-cli createaccount
```

Let's go ahead and send 500 wei to your other account. Again, feel free to replace `0x4cdC4f412355F296C2cf261210Cc9274404E442b` with whatever you'd like.

```
plasma-cli send 0 0x4cdC4f412355F296C2cf261210Cc9274404E442b 0 500
```

If everything goes according to plan, you'll see a transaction receipt:

```
Transaction receipt: 0000039a0120a229b0677D7fe42214c15942B6c40cD1340249d42b2b067cD2B2EDA3F7D3AdC9d3b400665CE8140000000000000000000000000000012c000000000000000000000190011c800cdbe44ebac984fa84e093ed1c8fa61ca14d4d5eb0e97b82d9dc54ada3f5d903dbb99d8f5aa8ecc765a5a329f4b557419ba7639ba4481b9e7e8108604e9138
```

This means you've just sent a plasma transaction. 🎉🎉🎉🎉
