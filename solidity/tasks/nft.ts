import { task } from 'hardhat/config'
import { fetchContract } from './contracts'
import { TestNFT } from '../typechain'

task('mint-nft', 'local only task to provide a minted nft')
  .addParam('to', 'the address where to mint')
  .setAction(async ({ to }, env) => {
    const testNFT = await fetchContract<TestNFT>('TestNFT', env)
    const tx = await testNFT.mint(to)
    const receipt = await tx.wait()
    const tokenId = testNFT.interface.parseLog(receipt.logs[0]).args.tokenId

    console.log('minted', {
      contractAddress: testNFT.address,
      tokenId: tokenId,
    })
  })
