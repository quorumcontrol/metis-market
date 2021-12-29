import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { L2KeyHandler, LockBox, TestMessagePasser, TestNFT } from "../typechain";

describe("End2End", function () {
  let testNFT:TestNFT
  let testMessagePasser:TestMessagePasser
  let l2KeyHandler:L2KeyHandler
  let lockBox:LockBox

  let alice:SignerWithAddress

  let tokenId:BigNumber

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    alice = signers[0]

    const TestMessagePasserFactory = await ethers.getContractFactory("TestMessagePasser")
    testMessagePasser = await TestMessagePasserFactory.deploy()
    await testMessagePasser.deployed()

    const L2KeyHandlerFactory = await ethers.getContractFactory("L2KeyHandler")
    l2KeyHandler = await L2KeyHandlerFactory.deploy(testMessagePasser.address)

    const LockBoxFactory = await ethers.getContractFactory("LockBox");
    lockBox = await LockBoxFactory.deploy(testMessagePasser.address, l2KeyHandler.address)
    await lockBox.deployed()

    await l2KeyHandler.setupLockbox(lockBox.address)

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    testNFT = await NFTFactory.deploy()
    await testNFT.deployed()

    const tx = await testNFT.mint(alice.address)
    const receipt = await tx.wait()
    tokenId = testNFT.interface.parseLog(receipt.logs[0]).args.tokenId
  })

  it("lockbox receives an NFT", async () => {
    await expect(testNFT["safeTransferFrom(address,address,uint256)"](alice.address, lockBox.address, tokenId)).to.not.be.reverted
  });

  it("key handler mints on message received", async () => {
    await expect(testNFT["safeTransferFrom(address,address,uint256)"](alice.address, lockBox.address, tokenId)).to.not.be.reverted
    await expect(testMessagePasser.executeTestSend()).to.not.be.reverted
    expect(await l2KeyHandler.balanceOf(alice.address)).to.equal(1)
    const l2TokenId = await l2KeyHandler.tokenOfOwnerByIndex(alice.address, 0)
    const metadata = await l2KeyHandler.metadata(l2TokenId);
    expect(metadata.tokenContract).to.equal(testNFT.address)
    expect(metadata.tokenId).to.equal(tokenId)
  })

  it('releases a l1 token on burn from l2', async () => {
    await expect(testNFT["safeTransferFrom(address,address,uint256)"](alice.address, lockBox.address, tokenId)).to.not.be.reverted
    await expect(testMessagePasser.executeTestSend()).to.not.be.reverted
    const l2TokenId = await l2KeyHandler.tokenOfOwnerByIndex(alice.address, 0)
    await l2KeyHandler.burn(l2TokenId)
    await expect(testMessagePasser.executeTestSend()).to.not.be.reverted // send the message from the burn
    expect(await testNFT.ownerOf(tokenId)).to.equal(alice.address)
  })
});
