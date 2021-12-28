//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IOVMMessagePasser.sol";
import "./interfaces/IL2KeyHandler.sol";


contract L2KeyHandler is IL2KeyHandler, ERC721Enumerable, ERC721Burnable {
    uint32 constant private GAS_LIMIT = 1000000;

    error Unauthorized();
    error AlreadySetup();

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
        address _messagePasserAddress
    ) ERC721("L2KeyHandler", "L2NFT") {
        messagePasser = IOVMMessagePasser(_messagePasserAddress);
    }

    function setupLockbox(address _lockBox) public {
      // TODO: require owner
      if (lockBox != address(0)) {
        revert AlreadySetup();
      }
      lockBox = _lockBox;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) override(ERC721,ERC721Enumerable) internal {
      if (to == address(0)) {
        LockedL1Token storage meta = metadata[tokenId];
        // handling the burn of a token
        messagePasser.sendMessage(
          lockBox,
          abi.encodeWithSignature("release(address,uint256,address)", meta.tokenContract, meta.tokenId, from), 
          GAS_LIMIT);
      }
      return super._beforeTokenTransfer(from, to, tokenId);
    }

    function register(
        address tokenContract,
        uint256 tokenId,
        address owner
    ) override public {
      if (msg.sender != address(messagePasser) || messagePasser.xDomainMessageSender() != lockBox) {
        revert Unauthorized();
      }
      // todo: assert that the message came from the LockBox
      _tokenIds.increment();

      uint256 newItemId = _tokenIds.current();
      _mint(owner, newItemId);
      metadata[newItemId] = LockedL1Token({
        tokenContract: tokenContract,
        tokenId: tokenId
      });
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
