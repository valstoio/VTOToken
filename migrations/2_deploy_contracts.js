var ValstoToken = artifacts.require("ValstoToken.sol");

//owner 0xB44a5ee07EC72f99B63a69BC470B94d6d21937d8
var merchantTokenAddress = '0xEf0567915b173d0bbdd172F97F8432f0EaF15C06'; //4
var teamTokensAddress = '0xa96C6Cbdcda8Ef934402F22bBf76A30182FA36bd'; //5
var valstoWalletAddress = '0x4376cad798397464E49A97e927768A353CbE96D5'; //8

module.exports = function(deployer) {
  deployer.deploy(ValstoToken, merchantTokenAddress, teamTokensAddress, valstoWalletAddress).then(function(){})
}
