var MyContract = artifacts.require("test1");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
 
