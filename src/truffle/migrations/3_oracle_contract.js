var MyContract = artifacts.require("Oracle");
var RouletteContract = artifacts.require("./roulette.sol");

// module.exports = function(deployer) {
//   // deployment steps
//   //
//   deployer.deploy(MyContract);
// };

module.exports = (deployer, network) =>{
  deployer.deploy(MyContract).then(function(){
    // console.log(MyContract.address);
    return deployer.deploy(RouletteContract, MyContract.address);
  });
};