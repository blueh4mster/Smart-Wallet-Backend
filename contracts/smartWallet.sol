// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract smartWallet{
    address payable owner;
    uint public balance;
    mapping (address => uint) allowances;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {
        balance += msg.value;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "action not allowed! You are not the owner of this wallet");
        _;
    }

    function allowAddress(address _address, uint amt) public onlyOwner {
        allowances[_address] +=amt;
    }

    function withdraw (uint amt) public {
        require(balance>=amt, "not enough funds");
        require(msg.sender==owner || allowances[msg.sender]>=amt, "not allowed to spend this amount");
        if (msg.sender!= owner){
            allowances[msg.sender] -=amt;
        }
        balance-=amt;
        payable(msg.sender).transfer(amt);
    }

    function denyAddress (address _addr) public onlyOwner{
        allowances[_addr] = 0;
    }

    function transferOwnership (address _addr ) public onlyOwner{
        owner = payable(_addr);
    }

    function getBalance() public view returns(uint) {
        return balance;
    }

    function getOwner() public view returns (address){
        return owner;
    }

    function getAllowance(address _addr) public view returns(uint){
        return allowances[_addr];
    }

}