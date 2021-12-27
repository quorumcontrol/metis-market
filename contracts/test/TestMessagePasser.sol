//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "../interfaces/IOVMMessagePasser.sol";

contract TestMessagePasser is IOVMMessagePasser {

    address public messageSender;
    

    function setMessageSender(address sender) public {
      messageSender = sender;
    }

    function sendMessage(
        address _target,
        bytes memory,
        uint32
    ) override public {
      console.log(_target);
    }

    function xDomainMessageSender() override public view returns (address) {
      return messageSender;
    }
}
