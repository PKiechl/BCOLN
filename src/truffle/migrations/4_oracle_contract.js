var MyContract = artifacts.require("oracle");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};