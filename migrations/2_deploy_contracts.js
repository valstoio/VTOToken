var ValstoToken = artifacts.require("ValstoToken.sol");


var merchants = '0xfd8e8c2c48a0f03722a128889cfea3bbfdc31595'; 
var team = '0x22baacd51961c826f9f2da8976f9e7b82c057769'; 
var contractWallet = '0x8c753cbc00ef504322a3b0f1cd326580d50f6497'; 

module.exports = function(deployer) {
  deployer.deploy(ValstoToken, merchants, team, contractWallet).then(function(){})
}
