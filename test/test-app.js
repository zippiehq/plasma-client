const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const PlasmaNode = require('../src/app')

chai.should()
chai.use(chaiAsPromised)

describe('Plasma Node', () => {
  const node = new PlasmaNode()

  it('should start correctly', async () => {
    await node.start().should.eventually.be.fulfilled
  })

  it('should stop correctly', async () => {
    await node.stop().should.eventually.be.fulfilled
  })
})
