// interfaces/IOVMMessagePasser.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IOVMMessagePasser {
    function sendMessage(
        address _target,
        bytes memory _message,
        uint32 _gasLimit
    ) external;

    function xDomainMessageSender() external view returns (address);
}
