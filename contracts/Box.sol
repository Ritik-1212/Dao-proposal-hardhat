//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    //emits when the value is changed
    event storedValue(uint256 value);

    //function to store and update value
    function store(uint256 new_value) public {
        value = new_value;

        emit storedValue(new_value);
    }

    //funtion to retrieve the current value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
