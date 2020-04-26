pragma solidity ^0.5.11;

import "./oraclizeAPI.sol";

contract Oracle is usingOraclize{

    //Random.org API-KEY:7dab0ab9-8f2f-4b2d-8ed1-b62cc1454c00

    event LogOraclizeFee(uint fee);
    event LogQuerySent(string description);
    event LogQueryNotSent(string description);
    event LogQueryDone(bytes32 id, string result);
    bytes32 rng;
    bool done=false;
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
        //TODO right now queryId is returned, not the actual result.
        //TODO need stringToUint conversion and __callback function

    }

    function __callback(bytes32 myQueryId, string memory result) public {
//        //https://medium.com/aigang-network/how-ethereum-contract-can-communicate-with-external-data-source-2e32616ea180
        urng = parseInt(result);
        done=true;
        emit LogQueryDone(myQueryId, result);
    }

    function setDoneFalse() public{
        done=false;
    }

    function getDone()public view returns (bool){
        return done;
    }

    ////
    function getRandom()public view returns (bytes32){
        return rng;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        //From Oraclize
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }


    function bytesToUInt(bytes32 v) public returns (uint ret) {
        if (v == 0x0) {
            //            throw;
        }

        uint digit;

        for (uint i = 0; i < 32; i++) {
            digit = uint((uint(v) / (2 ** (8 * (31 - i)))) & 0xff);
            if (digit == 0) {
                break;
            }
            else if (digit < 48 || digit > 57) {
                //                throw;
            }
            ret *= 10;
            ret += (digit - 48);
        }
        return ret;
    }

}