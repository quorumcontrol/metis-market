//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IOVMMessagePasser.sol";
import "./interfaces/IL2KeyHandler.sol";


contract L2KeyHandler is IL2KeyHandler, ERC721  {
     using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IOVMMessagePasser private messagePasser;
    address private lockBox;

    struct LockedL1Token {
      address tokenContract;
      uint256 tokenId;
    }

    mapping(uint256 => LockedL1Token) public metadata;

    constructor(
        address _messagePasserAddress,
        address _lockBox
    ) ERC721("Layer1NFTHolder", "L1NFT") {
        messagePasser = IOVMMessagePasser(_messagePasserAddress);
        lockBox = _lockBox;
    }

    function register(
        address tokenContract,
        uint256 tokenId,
        address owner
    ) override public {

      // todo: assert that the message came from the LockBox
       _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();
      _mint(owner, newItemId);
      metadata[newItemId] = LockedL1Token({
        tokenContract: tokenContract,
        tokenId: tokenId
      });
    }
}
