var Token = artifacts.require("ValstoToken.sol")

var TokenName = "Valsto";
var Symbol = "VTO";
var TokenSupply = 1000000000;
var Decimals = 18;

var TokenBuffer = 0;

expect = require("chai").expect;

var totalSupply;

var owner;
var merchantTokenAddress;
var teamTokensAddress;
var valstoWalletAddress;

contract("Check Token contract", function(accounts){

  describe("Check Smart Contract instance", function(){
    it("catch an instance of tokenContract", function(){
      return Token.deployed().then(function(instance){
        TokenInstance = instance;
      });
    });
    it("Test totalSupply", function(){
      return TokenInstance.totalSupply().then(function(res){
        totalSupply = res.toString();
        expect(res.toString()).to.be.equal((TokenSupply*(Math.pow(10,Decimals))).toString());
      });
    });
  });

  describe ("Check initial parameters", function () {
    it ("Check Token name", function(){
      return TokenInstance.name.call().then(function(res){
        expect(res.toString()).to.be.equal(TokenName);
      })
    })
    it ("Check Token Symbol", function(){
      return TokenInstance.symbol.call().then(function(res){
        expect(res.toString()).to.be.equal(Symbol);
      })
    })
    it ("check Token Decimals", function(){
      return TokenInstance.decimals.call().then(function(res){
        expect(parseInt(res.toString())).to.be.equal(Decimals);
      })
    })
  });

  describe ("Get tokenHolders addresses", function() {
    it ("check owner address", function(){
      return TokenInstance.owner.call().then(function(res){
        owner = res.toString();
      })
    })

    it ("check merchantTokenAddress address", function(){
      return TokenInstance.merchantTokenAddress.call().then(function(res){
        merchantTokenAddress = res.toString();
      })
    })

    it ("check teamTokensAddress address", function(){
      return TokenInstance.teamTokensAddress.call().then(function(res){
        teamTokensAddress = res.toString();
      })
    })

    it ("check valstoWalletAddress address", function(){
      return TokenInstance.valstoWalletAddress.call().then(function(res){
        valstoWalletAddress = res.toString();
      })
    })
  });

  describe ("Check initial balances", function(){
    it ("check owner balance", function(){
      return TokenInstance.balanceOf(web3.eth.accounts[0]).then(function(res){
        expect(res.toString()).to.be.equal((600000000*Math.pow(10,Decimals)).toString());
      });
    });
    it ("check merchantTokenAddress balance", function(){
      return TokenInstance.balanceOf(merchantTokenAddress).then(function(res){
        expect(res.toString()).to.be.equal((350000000*Math.pow(10,Decimals)).toString());
      });
    });
    it ("check teamTokensAddress balance", function(){
      return TokenInstance.balanceOf(teamTokensAddress).then(function(res){
        expect(res.toString()).to.be.equal((50000000*Math.pow(10,Decimals)).toString());
      });
    });

  });

  describe ("Check function transfer", function (){
    it ("check owner possibility to transfer tokens", function(){
      return TokenInstance.transfer(web3.eth.accounts[2], 100, {from: web3.eth.accounts[0]}).then(function(res){
        expect(res.toString()).to.not.be.an("error");
      })
    })
    it ("check another user possibility to transfer tokens", function(){
      return TokenInstance.transfer(web3.eth.accounts[3], 100, {from: web3.eth.accounts[2]}).then(function(res){
        expect(res.toString()).to.not.be.an("error");
      })
    })
  });

  var valstoWalletAddressBalance;

  describe ("Check buying function", function(){
    it ("check valstoWalletAddress balance", function(){
      valstoWalletAddressBalance = web3.eth.getBalance(valstoWalletAddress).toString();
    })

    it ("send 0.05 ETH to contract", async function(){
      try {
        await web3.eth.sendTransaction({from: web3.eth.accounts[6], to: TokenInstance.address, value: 50000000000000000})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })
    it ("send 0.1 ETH to contract", async function(){
      try {
        await web3.eth.sendTransaction({from: web3.eth.accounts[6], to: TokenInstance.address, value: 100000000000000000})
        assert.ok(true, "It should not fail");
      } catch(error){
        assert.ok(false, "It mustn't failed")
      }
    })
    it ("check valstoWalletAddress balance now", function(){
      expect(web3.eth.getBalance(valstoWalletAddress).toString()/1).to.be.equal(valstoWalletAddressBalance/1 + 150000000000000000);
    })
  });

  describe ("close TDE", function(){
    it ("owner try to close TDE", function(){
      return TokenInstance.close({from: web3.eth.accounts[0]}).then(function(res){
        expect(res.toString()).to.not.be.an("error");
      })
    })
    it ("owner try to close TDE again (this transacion must failed)", async function(){
      try {
        await TokenInstance.TokenInstance.close({from: web3.eth.accounts[0]})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })

    it ("Team cannot send VTO tokens after TDE close", async function(){
       try {
         await web3.eth.sendTransaction({from: teamTokensAddress, to: web3.eth.accounts[6], value: 50000000000000000})
         assert.ok(false, "It didn't fail")
       } catch(error){
         assert.ok(true, "It must failed");
       }
    })
  });

  describe ("Check buying function after TDE closed", function(){
    it ("check valstoWalletAddress balance", function(){
      valstoWalletAddressBalance = web3.eth.getBalance(valstoWalletAddress).toString();
    })

    it ("send 0.05 ETH to contract", async function(){
      try {
        await web3.eth.sendTransaction({from: web3.eth.accounts[6], to: TokenInstance.address, value: 50000000000000000})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })
    it ("send 0.1 ETH to contract", async function(){
      try {
        await web3.eth.sendTransaction({from: web3.eth.accounts[6], to: TokenInstance.address, value: 100000000000000000})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })
    it ("check valstoWalletAddress balance now", function(){
      expect(web3.eth.getBalance(valstoWalletAddress).toString()).to.be.equal(valstoWalletAddressBalance);
    })
  });

});
