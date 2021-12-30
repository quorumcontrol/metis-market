import { expect } from "chai";
import { ethers } from "hardhat";

describe("TestNFT", function () {
  it("can mint an nft", async function () {
    const signers = await ethers.getSigners()

    const TestNFT = await ethers.getContractFactory("TestNFT");
    const nft = await TestNFT.deploy();
    await nft.deployed();

    const tx = await nft.mint(signers[0].address, "http://test.test")
    const receipt = await tx.wait()
    const tokenId = nft.interface.parseLog(receipt.logs[0]).args.tokenId

    expect(await nft.tokenURI(tokenId)).to.equal('http://test.test')
  });
});
