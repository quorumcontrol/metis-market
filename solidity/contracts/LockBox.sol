//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./interfaces/IOVMMessagePasser.sol";

contract LockBox is IERC721Receiver {
    error Unauthorized();

    uint32 constant private GAS_LIMIT = 1000000;
    
    IOVMMessagePasser private messagePasser;
    address private l2KeyHandler;

    constructor(
        address _messagePasserAddress,
        address _l2KeyHandlerAddress
    ) {
        messagePasser = IOVMMessagePasser(_messagePasserAddress);
        l2KeyHandler = _l2KeyHandlerAddress;
    }

    function release(address tokenAddress, uint256 tokenId, address to) public {
        if (msg.sender != address(messagePasser) || messagePasser.xDomainMessageSender() != l2KeyHandler) {
            revert Unauthorized();
        }
        // console.log("releasing to", to, tokenAddress);
        // console.log("releasing token id: ", tokenId);
        IERC721(tokenAddress).safeTransferFrom(address(this), to, tokenId);
    }

    // TODO: support sending to a different address using the data argument
    function onERC721Received(address, address from, uint256 tokenId, bytes memory) override public returns (bytes4) {
        messagePasser.sendMessage(l2KeyHandler, abi.encodeWithSignature("register(address,uint256,address)", msg.sender, tokenId, from), GAS_LIMIT);
        return IERC721Receiver.onERC721Received.selector;
    }
}
