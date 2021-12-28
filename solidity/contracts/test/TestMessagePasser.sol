//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../interfaces/IOVMMessagePasser.sol";

contract TestMessagePasser is IOVMMessagePasser {

    address public lastMessageSender;
    address public lastTarget;
    bytes public lastCallData;
    

    function setMessageSender(address sender) public {
      lastMessageSender = sender;
    }

    function sendMessage(
        address _target,
        bytes memory callData,
        uint32
    ) override public {
      lastTarget = _target;
      lastCallData = callData;
      lastMessageSender = msg.sender;
    }

    function xDomainMessageSender() override public view returns (address) {
      return lastMessageSender;
    }

    function executeTestSend() public {
      (bool worked,) = lastTarget.call(lastCallData);
      require(worked, "call to target failed");
    }
}
