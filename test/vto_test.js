var Token = artifacts.require("ValstoToken.sol")

var TokenName = "Valsto";
var Symbol = "VTO";
var TokenSupply = 10000000000;
var Decimals = 18;

var TokenBuffer = 0;

expect = require("chai").expect;

var totalSupply;

var owner;
var reservedTokensAddress;
var teamTokensAddress;
var valstoWallertAddress;

contract("Check Token contract", function(accounts){

  describe("Check SC instance", function(){
    it("catch an instance of tokenContract", function(){
      return Token.deployed().then(function(instance){
        TokenInstance = instance;
      });
    });
    it("Saving totalSupply", function(){
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
  })

  describe ("Get tokenHolders addresses", function() {
    it ("check owner address", function(){
      return TokenInstance.owner.call().then(function(res){
        owner = res.toString();
      })
    })

    it ("check reservedTokensAddress address", function(){
      return TokenInstance.reservedTokensAddress.call().then(function(res){
        reservedTokensAddress = res.toString();
      })
    })

    it ("check teamTokensAddress address", function(){
      return TokenInstance.teamTokensAddress.call().then(function(res){
        teamTokensAddress = res.toString();
      })
    })

   
    it ("check valstoWallertAddress address", function(){
      return TokenInstance.valstoWallertAddress.call().then(function(res){
        valstoWallertAddress = res.toString();
      })
    })
  })

  describe ("Check initial balances", function(){
    it ("check owner balance", function(){
      return TokenInstance.balanceOf(web3.eth.accounts[0]).then(function(res){
        expect(res.toString()).to.be.equal((3650000000*Math.pow(10,Decimals)).toString());
      });
    });
    it ("check reservedTokensAddress balance", function(){
      return TokenInstance.balanceOf(reservedTokensAddress).then(function(res){
        expect(res.toString()).to.be.equal((750000000*Math.pow(10,Decimals)).toString());
      });
    });
    it ("check teamTokensAddress balance", function(){
      return TokenInstance.balanceOf(teamTokensAddress).then(function(res){
        expect(res.toString()).to.be.equal((450000000*Math.pow(10,Decimals)).toString());
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
  })

  var bufferBalance;

  describe ("Check buying function", function(){
    it ("check valstoWallertAddress balance", function(){
      bufferBalance = web3.eth.getBalance(valstoWallertAddress).toString();
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
    it ("check valstoWallertAddress balance now", function(){
      expect(web3.eth.getBalance(valstoWallertAddress).toString()/1).to.be.equal(bufferBalance/1 + 100000000000000000);
    })
  })

  describe ("close ICO", function(){
    it ("owner try to close ICO", function(){
      return TokenInstance.close({from: web3.eth.accounts[0]}).then(function(res){
        expect(res.toString()).to.not.be.an("error");
      })
    })
    it ("owner try to close ICO again (this transacion must failed)", async function(){
      try {
        await TokenInstance.TokenInstance.close({from: web3.eth.accounts[0]})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })
  })

  describe ("Check buying function now", function(){
    it ("check valstoWallertAddress balance", function(){
      bufferBalance = web3.eth.getBalance(valstoWallertAddress).toString();
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
        await web3.eth.sendTransaction({from: web3.eth.accounts[6], to: TokenInstance.address, value: 50000000000000000})
        assert.ok(false, "It didn't fail")
      } catch(error){
        assert.ok(true, "It must failed");
      }
    })
    it ("check valstoWallertAddress balance now", function(){
      expect(web3.eth.getBalance(valstoWallertAddress).toString()).to.be.equal(bufferBalance);
    })
  })

  describe ("increase EVM time", function(){
    it ("get blockTimestamp now", function(){
      console.log("current timestamp = " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
    })


    it("increse up to 121 days", function(){  
      web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [10454400], id: 0})
      web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0})
    })

    it ("get blockTimestamp again", function(){
      console.log("current timestamp = " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
    })
  })

})