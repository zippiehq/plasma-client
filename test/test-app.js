const chai = require('chai')
const PlasmaNode = require('../src/app')

const should = chai.should()

describe('Plasma Node', () => {
  const node = new PlasmaNode({
    eventPollInterval: 100,
    transactionPollInterval: 100
  })

  it('should start correctly', async () => {
    should.not.Throw(async () => {
      await node.start()
    })
  })

  it('should stop correctly', async () => {
    should.not.Throw(async () => {
      await node.stop()
    })
  })
})
