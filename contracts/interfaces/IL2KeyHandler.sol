// interfaces/IOVMMessagePasser.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IL2KeyHandler {
    function register(
        address tokenContract,
        uint256 tokenId,
        address owner
    ) external;
}
