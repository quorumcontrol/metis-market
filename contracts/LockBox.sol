//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/IOVMMessagePasser.sol";

contract LockBox {
    
    IOVMMessagePasser private messagePasser;

    constructor(
        address _messagePasserAddress
    ) {
        messagePasser = IOVMMessagePasser(_messagePasserAddress);
    }

    


}
