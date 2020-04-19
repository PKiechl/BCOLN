var MyContract = artifacts.require("roulette");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};