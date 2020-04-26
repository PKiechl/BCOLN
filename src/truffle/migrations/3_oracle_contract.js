var OracleContract = artifacts.require("Oracle");
var RouletteContract = artifacts.require("./roulette.sol");
const Web3 = require("web3");

// module.exports = function(deployer) {
//   // deployment steps
//   //
//   deployer.deploy(OracleContract);
// };

web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));


module.exports = async function(deployer, network, accounts) {
  // https://medium.com/coinmonks/how-to-create-a-dapp-using-truffle-oraclize-ethereum-bridge-and-webpack-9cb84b8f6bcb
  // Contract needs a balance > 0 to communicate with Oraclize
  await deployer.deploy(OracleContract, {
    from: accounts[0],
    gas: 6721975,
    value: 5000000000000000000
  });
  await deployer.deploy(RouletteContract, OracleContract.address, {
    from: accounts[0],
    gas: 6721975,
    value: 90000000000000000000
  });
};

// module.exports = (deployer, network) =>{
//   deployer.deploy(OracleContract).then(function(){
//     // console.log(OracleContract.address);
//     return deployer.deploy(RouletteContract, OracleContract.address);
//   });
// };
