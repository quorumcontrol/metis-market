import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { constants, BigNumber } from "ethers";
import { ethers } from "hardhat";
import { LockBox, LockBox__factory, TestNFT } from "../typechain";

describe("LockBox", function () {
  let lockBox:LockBox
  let testNFT:TestNFT

  let alice:SignerWithAddress

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    alice = signers[0]

    const TestMessagePasserFactory = await ethers.getContractFactory("TestMessagePasser")
    const testMessagePasser = await TestMessagePasserFactory.deploy()
    await testMessagePasser.deployed()

    const LockBoxFactory = await ethers.getContractFactory("LockBox");
    lockBox = await LockBoxFactory.deploy(testMessagePasser.address, constants.AddressZero)
    await lockBox.deployed()

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    testNFT = await NFTFactory.deploy()
    await testNFT.deployed()
  })

  it("can receive an NFT", async function () {
    const tx = await testNFT.mint(alice.address)
    const receipt = await tx.wait()
    const tokenId:BigNumber = testNFT.interface.parseLog(receipt.logs[0]).args.tokenId
    await expect(testNFT["safeTransferFrom(address,address,uint256)"](alice.address, lockBox.address, tokenId)).to.not.be.reverted
  });
});
