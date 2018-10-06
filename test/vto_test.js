var Token = artifacts.require("ValstoToken.sol")

var TokenName = "Valsto";
var Symbol = "VTO";
var TokenSupply = 1000000000;
var Decimals = 18;

var TokenBuffer = 0;

expect = require("chai").expect;

var totalSupply;

var owner;
var merchants;
var team;
var contractWallet;

contract("Check Token contract", function(accounts) {

    describe("Check Smart Contract instance", function() {
        it("catch an instance of tokenContract", function() {
            return Token.deployed().then(function(instance) {
                TokenInstance = instance;
            });
        });
        it("Test totalSupply", function() {
            return TokenInstance.totalSupply().then(function(res) {
                totalSupply = res.toString();
                expect(res.toString()).to.be.equal((TokenSupply * (Math.pow(10, Decimals))).toString());
            });
        });
    });

    describe("Check initial parameters", function() {
        it("Check Token name", function() {
            return TokenInstance.name.call().then(function(res) {
                expect(res.toString()).to.be.equal(TokenName);
            })
        })
        it("Check Token Symbol", function() {
            return TokenInstance.symbol.call().then(function(res) {
                expect(res.toString()).to.be.equal(Symbol);
            })
        })
        it("Check Token Decimals", function() {
            return TokenInstance.decimals.call().then(function(res) {
                expect(parseInt(res.toString())).to.be.equal(Decimals);
            })
        })
    });

    describe("Get token holders addresses", function() {
        it("Get owner address", function() {
            return TokenInstance.owner.call().then(function(res) {
                owner = res.toString();
            })
        })

        it("Get merchant token holder address", function() {
            return TokenInstance.merchants.call().then(function(res) {
                merchants = res.toString();
            })
        })

        it("Get team token holder address", function() {
            return TokenInstance.team.call().then(function(res) {
                team = res.toString();
            })
        })

        it("Get contract wallet address", function() {
            return TokenInstance.contractWallet.call().then(function(res) {
                contractWallet = res.toString();
            })
        })
    });

    describe("Check initial balances", function() {
        it("Check owner balance", function() {
            return TokenInstance.balanceOf(web3.eth.accounts[0]).then(function(res) {
                expect(res.toString()).to.be.equal((600000000 * Math.pow(10, Decimals)).toString());
            });
        });
        it("Check merchants balance", function() {
            return TokenInstance.balanceOf(merchants).then(function(res) {
                expect(res.toString()).to.be.equal((350000000 * Math.pow(10, Decimals)).toString());
            });
        });
        it("Check team balance", function() {
            return TokenInstance.balanceOf(team).then(function(res) {
                expect(res.toString()).to.be.equal((50000000 * Math.pow(10, Decimals)).toString());
            });
        });

    });

    describe("Check function transfer before TDE close", function() {
        it("Check owner possibility to transfer VTO tokens", function() {
            return TokenInstance.transfer(web3.eth.accounts[3], 100, { from: web3.eth.accounts[0] }).then(function(res) {
                expect(res.toString()).to.not.be.an("error");
            })
        })
        it("Check any user possibility to transfer VTO tokens", function() {
            return TokenInstance.transfer(web3.eth.accounts[4], 10, { from: web3.eth.accounts[3] }).then(function(res) {
                expect(res.toString()).to.not.be.an("error");
            })
        })
        it('Team cannot transfer VTO tokens before TDE close (this transacion must failed)', async function() {
            try {
                await TokenInstance.transfer(web3.eth.accounts[4], 10, { from: team })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })

    });

    var contractWalletBalance;

    describe("Check buying function before TDE close", function() {
        it("Check contract wallet balance", function() {
            contractWalletBalance = web3.eth.getBalance(contractWallet).toString();
        })

        it("Send 0.05 ETH to contract", async function() {
            try {
                await web3.eth.sendTransaction({ from: web3.eth.accounts[6], to: TokenInstance.address, value: 50000000000000000 })
            } catch (error) {
                assert.fail()
            }
        })
        it("Send 0.1 ETH to contract", async function() {
            try {
                await web3.eth.sendTransaction({ from: web3.eth.accounts[6], to: TokenInstance.address, value: 100000000000000000 })
            } catch (error) {
                assert.fail()
            }
        })
        it("Check contract wallet balance now", function() {
            expect(web3.eth.getBalance(contractWallet).toString() / 1).to.be.equal(contractWalletBalance / 1 + 150000000000000000);
        })
    });

    describe("Close TDE", function() {
        it("Only owner can close TDE", async function() {
            try {
                await TokenInstance.close({ from: web3.eth.accounts[7] })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })

        it("Owner try to close TDE", async function() {
            try {
                await TokenInstance.close({ from: web3.eth.accounts[0] })

            } catch (error) {
                assert.fail()
            }
        })
        it("Owner try to close TDE again (this transacion must failed)", async function() {
            try {
                await TokenInstance.close({ from: web3.eth.accounts[0] })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })
        it('Team cannot transfer VTO tokens after TDE close (this transacion must failed)', async function() {
            try {
                await TokenInstance.transfer(web3.eth.accounts[6], 5000000000000000000, { from: team })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })
    });

    describe("Check function transfer after close TDE (this transacion must failed)", function() {
        it("Check owner possibility to transfer VTO tokens", function() {
            return TokenInstance.transfer(web3.eth.accounts[3], 100, { from: web3.eth.accounts[0] }).then(function(res) {
                expect(res.toString()).to.not.be.an("error");
            })
        })
        it("Check another user possibility to transfer VTO tokens", function() {
            return TokenInstance.transfer(web3.eth.accounts[4], 10, { from: web3.eth.accounts[3] }).then(function(res) {
                expect(res.toString()).to.not.be.an("error");
            })
        })

    });

    describe("Check buying function after close TDE", function() {
        it("Check contract wallet balance", function() {
            contractWalletBalance = web3.eth.getBalance(contractWallet).toString();
        })

        it("Send 0.05 ETH to contract (this transacion must failed)", async function() {
            try {
                await web3.eth.sendTransaction({ from: web3.eth.accounts[6], to: TokenInstance.address, value: 50000000000000000 })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })
        it("Send 0.1 ETH to contract (this transacion must failed)", async function() {
            try {
                await web3.eth.sendTransaction({ from: web3.eth.accounts[6], to: TokenInstance.address, value: 100000000000000000 })
                assert.fail()
            } catch (error) {
                assert(error.toString().includes('revert'), error.toString())
            }
        })
        it("Check contractWallet balance now", function() {
            expect(web3.eth.getBalance(contractWallet).toString()).to.be.equal(contractWalletBalance);
        })
    });

});