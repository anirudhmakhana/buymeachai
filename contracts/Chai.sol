// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Chai{
    
    struct Memo{
        string name;
        string message;
        uint timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner;
    uint256 public feePercentage = 5; 
    uint256 public accumulatedFees;

    constructor(){
        owner = payable(msg.sender);
    }

    function buyChai(string memory name, string memory message) public payable{
        require(msg.value > 0, "Amount should be greater than 0!");
        owner.transfer(msg.value);
        memos.push(Memo(name, message, block.timestamp, msg.sender));
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}