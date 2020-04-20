pragma solidity ^0.5.11;

contract Oracle{
    // TODO change to something more secure
    // could use random.org API with oraclize api calls.
    //or keep this solution. (works).

    function generateRandomNumber() public view returns (uint256) {
        //https://www.sitepoint.com/solidity-pitfalls-random-number-generation-for-ethereum/
        return uint256(keccak256(abi.encodePacked(now)))%37;
    }
}