pragma solidity ^0.5.11;

contract test1{

uint amount;

constructor()public{
    amount=0;
}

function set(uint newAmount) public{
    amount=newAmount;
}

function get() public view returns (uint){
    return (amount);
}

}