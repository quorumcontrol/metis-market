import { task } from 'hardhat/config'
import { fetchContract } from './contracts'
import { TestMessagePasser, TestNFT } from '../typechain'
import { BigNumber, utils } from 'ethers'

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

task('pass-message', 'local only tell the test message passer to send the message')
  .setAction(async ({ to }, env) => {
    const messagePasser = await fetchContract<TestMessagePasser>('TestMessagePasser', env)
    const tx = await messagePasser.executeTestSend()
    await tx.wait()
    console.log('complete')
  })

task('set-balance', 'local only send eth to an account')
  .addParam('to', 'the address where to mint')
  .addParam('amount', 'the amount to set')
  .setAction(async ({ to, amount }, env) => {
    await env.network.provider.send("hardhat_setBalance", [
      to,
      utils.parseEther(amount).toHexString(),
    ]);
    console.log('done')
  })
