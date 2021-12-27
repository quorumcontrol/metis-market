import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestNFT", function () {
  it("can mint an nft", async function () {
    const signers = await ethers.getSigners()

    const TestNFT = await ethers.getContractFactory("TestNFT");
    const nft = await TestNFT.deploy();
    await nft.deployed();

    await expect(nft.mint(signers[0].address)).to.not.be.reverted
  });
});
