pragma solidity ^0.5.11;

import "./oraclizeAPI.sol";

contract Oracle is usingOraclize{
    // TODO change to something more secure
    // could use random.org API with oraclize api calls.
    //or keep this solution. (works).

    //API-KEY:7dab0ab9-8f2f-4b2d-8ed1-b62cc1454c00

    event LogOraclizeFee(uint fee);
    event LogQuerySent(string description);
    event LogQueryNotSent(string description);
    bytes32 rng;
    uint urng;

    constructor()public payable{
        // if (_privateNetwork) {
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        // }

    }

    function generateRandomNumber() public payable returns (uint) {
        //https://www.sitepoint.com/solidity-pitfalls-random-number-generation-for-ethereum/
        //        return uint256(keccak256(abi.encodePacked(now)))%37;

        uint fee = oraclize_getPrice("URL");
        emit LogOraclizeFee(fee);
        bytes32 queryId = oraclize_query("URL",
            "json(https://api.random.org/json-rpc/1/invoke).result.random.data.0", '\n{"jsonrpc":"2.0","method":"generateIntegers","params":{"apiKey":"7dab0ab9-8f2f-4b2d-8ed1-b62cc1454c00","n":1,"min":0,"max":36,"replacement":true,"base":10},"id":1}');
        //        bytes32 queryId = oraclize_query("WolframAlpha", "random number between 1 and 6");

        // queryId = oraclize_query("WolframAlpha", "random number between 0 and 37");
         emit LogQuerySent("sent query");

        rng=queryId;
        urng=bytesToUInt(rng);
        //for some reason number is too big, just modulo it.
         return urng%37;
    }

//    function __callback(bytes32 myId, string memory result){
//        //https://medium.com/aigang-network/how-ethereum-contract-can-communicate-with-external-data-source-2e32616ea180
//        urng =
//    }



    function getRandom()public view returns (bytes32){
        return rng;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
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