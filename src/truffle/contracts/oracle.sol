pragma solidity ^0.5.11;

import "./oraclizeAPI.sol";
import "./roulette.sol";

contract Oracle is usingOraclize{
    // Oracle, manages the generation of the random number via Oraclize


    //Random.org API-KEY:7dab0ab9-8f2f-4b2d-8ed1-b62cc1454c00

    event LogOraclizeFee(uint fee);
    event LogQuerySent(string description);
    event LogQueryNotSent(string description);
    event LogQueryDone(bytes32 id, string result);
    bytes32 rng;
    uint urng;

    constructor()public payable{
        //OAR needed for testnet with oraclize. for ethereum-bridge
        //https://medium.com/coinmonks/how-to-create-a-dapp-using-truffle-oraclize-ethereum-bridge-and-webpack-9cb84b8f6bcb
        //address is deterministic, does not change.
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

    function getRandomNumber() public view returns (uint){
        return urng;
    }

    function generateRandomNumber() public payable  {
        //https://www.sitepoint.com/solidity-pitfalls-random-number-generation-for-ethereum/
        //simple randomizer, only for test purposes.
        //        return uint256(keccak256(abi.encodePacked(now)))%37;

        uint fee = oraclize_getPrice("URL");
        emit LogOraclizeFee(fee);
        bytes32 queryId = oraclize_query("URL",
            "json(https://api.random.org/json-rpc/1/invoke).result.random.data.0", '\n{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"7dab0ab9-8f2f-4b2d-8ed1-b62cc1454c00","n":1,"min":0,"max":36,"replacement":true,"base":10},"id":1}');

        //alternative: Use WolframAlpha
        // queryId = oraclize_query("WolframAlpha", "random number between 0 and 37");

        //to debug, check with ethereum-bridge in terminal
        emit LogQuerySent("sent query");
    }

    function __callback(bytes32 myQueryId, string memory result) public {
        //https://medium.com/aigang-network/how-ethereum-contract-can-communicate-with-external-data-source-2e32616ea180
        urng = parseInt(result);
        emit LogQueryDone(myQueryId, result);
    }

}