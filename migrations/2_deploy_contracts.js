var ValstoToken = artifacts.require("ValstoToken.sol");

var reservedTokensAddress = '0xNNNNNNNNNNNNNNNNN1';
var teamTokensAddress = '0xNNNNNNNNNNNNNNNNN2';

var valstoWalletAddress = '0xNNNNNNNNNNNNNNNNN4';

module.exports = function(deployer) {
  deployer.deploy(ValstoToken, reservedTokensAddress, teamTokensAddress, valstoWalletAddress).then(function(){})
}