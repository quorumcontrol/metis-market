import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { constants } from "ethers";
import { ethers } from "hardhat";
import { LockBox, TestNFT } from "../typechain";

describe("LockBox", function () {
  let lockBox:LockBox
  let testNFT:TestNFT

  let alice:SignerWithAddress

  beforeEach(async () => {
    const signers = await ethers.getSigners()
    alice = signers[0]

    const LockBoxFactory = await ethers.getContractFactory("LockBox");
    lockBox = await LockBoxFactory.deploy(constants.AddressZero, constants.AddressZero)
    await lockBox.deployed()

    const NFTFactory = await ethers.getContractFactory("TestNFT");
    testNFT = await NFTFactory.deploy()
    await testNFT.deployed()
  })

  it("can receive an NFT", async function () {
    await testNFT.mint(alice.address)
  });
});
