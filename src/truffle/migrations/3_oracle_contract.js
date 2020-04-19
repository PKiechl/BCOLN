var MyContract = artifacts.require("Oracle");

module.exports = function(deployer) {
  // deployment steps
  //
  deployer.deploy(MyContract);
};