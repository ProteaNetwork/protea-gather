const web3Abi = require('web3-eth-abi');

var TokenManager = artifacts.require('./TokenManager.sol');
var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
const web3 = TokenManager.web3;

contract('Token Manager', accounts => {
    tokenOwnerAddress = accounts[0];
    adminAddress = accounts[1];
    userAddress = accounts[2];
    anotherUserAddress = accounts[3];
  
    beforeEach('', async () => {
        pseudoDaiToken = await PseudoDaiToken.new("DAI", "DAI", 18);
        tokenManager = await TokenManager.new("tokenMan", "PDAI", pseudoDaiToken.address);
    });

    describe('Functionality', async () => {
        it('Is initiated correctly', async () => {
            let name = await tokenManager.name();
            assert.equal(name, "tokenMan", "Name is correct");

            let symbol = await tokenManager.symbol();
            assert.equal(
                symbol, 
                "0x5044414900000000000000000000000000000000000000000000000000000000", 
                "symbol is correct"
            );
            
            let decimals = await tokenManager.decimals();
            assert.equal(decimals['c'], 10000, "Decimals correct");
        });

        it('Transferring functionality', async () => {
            await pseudoDaiToken.mint(0, {from: userAddress});
            await pseudoDaiToken.approve(tokenManager.address, 125, {from: userAddress});
            await tokenManager.mint(10, {from: userAddress});
            let balanceOfUser = await tokenManager.balanceOf(userAddress);
            assert.equal(balanceOfUser.toNumber(), 10, "User has 10 tokens");

            await tokenManager.transfer(anotherUserAddress, 5, {from: userAddress});
            let balanceOfUserAfter = await tokenManager.balanceOf(userAddress);
            let balanceOfReciver = await tokenManager.balanceOf(anotherUserAddress);
            assert.equal(balanceOfUserAfter.toNumber(), balanceOfReciver.toNumber(), "User and sender have same balance");
            assert.equal(balanceOfUserAfter.toNumber(), 5, "User has 5 tokens");
            assert.equal(balanceOfReciver.toNumber(), 5, "Reciver has 5 tokens");
        });

        it('Encoded transfer from functionality', async () => {
            // await pseudoDaiToken.mint(0, {from: userAddress});
            // let balanceOfUser = await pseudoDaiToken.balanceOf(userAddress);
            // await pseudoDaiToken.approve(tokenManager.address, 125, {from: userAddress});
            // await tokenManager.mint(10, {from: userAddress});

            // let transferSuccess = await tokenManager.transferFrom();
        });
    });

    describe('Bonded creation curve functionality', async () => {
        it('Minting tests', async () => {
            let priceOfMint = await tokenManager.priceToMint(10);
            assert.equal(priceOfMint['c'], 125, "The price to mint is 125");

            await pseudoDaiToken.mint(0, {from: userAddress});
            let balanceOfUser = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceOfUser.toNumber(), 250, "Balance of user is correct");

            await pseudoDaiToken.approve(tokenManager.address, 125, {from: userAddress});
            let allowance = await pseudoDaiToken.allowance(userAddress, tokenManager.address);
            assert.equal(allowance.toNumber(), 125, "Approved amount is correct");

            let contactBalance = await pseudoDaiToken.balanceOf(tokenManager.address);
            assert.equal(contactBalance.toNumber(), 0, "Contract has no DAI");

            await tokenManager.mint(10, {from: userAddress});
            let contactBalanceAfter = await pseudoDaiToken.balanceOf(tokenManager.address);
            assert.equal(contactBalanceAfter.toNumber(), 125, "The contract has DAI from the user");

            let balance = await tokenManager.balanceOf(userAddress);
            assert.equal(balance.toNumber(), 10, "Balance after minting is 10");

            let oneTokenPrice = await tokenManager.priceToMint(1);
            assert.equal(oneTokenPrice.toNumber(), 26, "The price of the 11th token is correct");

            let priceOfMintAfter = await tokenManager.priceToMint(10);
            assert.equal(
                priceOfMintAfter.toNumber(), 
                375, 
                "The price changes after the first mint"
            );
            assert.notEqual(
                priceOfMintAfter.toNumber(), 
                priceOfMint.toNumber(), 
                "The price changes"
            );
        });

        it('Curve gradient test', async () => {
            let priceOfMint = await tokenManager.priceToMint(10);
            assert.equal(priceOfMint['c'], 125, "The price to mint is 125");

            await pseudoDaiToken.mint(0, {from: userAddress});
            await pseudoDaiToken.approve(tokenManager.address, priceOfMint, {from: userAddress});
            await tokenManager.mint(10, {from: userAddress});
            let oneTokenPrice = await tokenManager.priceToMint(1);
            let balanceAfter = await tokenManager.balanceOf(userAddress);
            assert.equal(balanceAfter, 10, "Balance is 10");
            assert.equal(oneTokenPrice.toNumber(), 26, "Initial price is 26");

            await pseudoDaiToken.mint(1, {from: userAddress});
            //mint twice to give user enough DAI to buy another 10
            await pseudoDaiToken.mint(2, {from: userAddress});
            let priceOfMintAfter = await tokenManager.priceToMint(10);
            await pseudoDaiToken.approve(
                tokenManager.address, 
                priceOfMintAfter, 
                {from: userAddress}
            );
            await tokenManager.mint(10, {from: userAddress});
            let oneTokenPriceAfter = await tokenManager.priceToMint(1);
            assert.notEqual(
                oneTokenPrice.toNumber(), 
                oneTokenPriceAfter.toNumber(), 
                "Different prices"
            );
            assert.equal(oneTokenPriceAfter.toNumber(), 51, "After price is 51");
        });

        it('Burning tests', async () => {
            await pseudoDaiToken.mint(0, {from: userAddress});
            pseudoDaiToken.approve(tokenManager.address, 125, {from: userAddress});
            await tokenManager.mint(10, {from: userAddress});
            let balance = await tokenManager.balanceOf(userAddress);
            assert.equal(balance.toNumber(), 10, "10 tokens where bought");

            let tokenManagerBalance = await pseudoDaiToken.balanceOf(tokenManager.address);
            assert.equal(
                tokenManagerBalance.toNumber(), 
                125, 
                "Token manager has correct number of DAI"
            );

            let rewardForBurn = await tokenManager.rewardForBurn(10);
            assert.equal(rewardForBurn.toNumber(), 125, "Reward for burn correct");

            await tokenManager.burn(10, {from: userAddress});
            let balanceAfter = await tokenManager.balanceOf(userAddress);
            assert.equal(balanceAfter.toNumber(), 0, "All tokens are burnt");

            let balanceOfManagerAfter = await pseudoDaiToken.balanceOf(tokenManager.address);
            assert.equal(balanceOfManagerAfter.toNumber(), 0, "Token manager no longer has DAI");

            let priceOfMint = await tokenManager.priceToMint(10);
            assert.equal(
                priceOfMint.toNumber(), 
                125, 
                "Price of minting moves back down the curve"
            );
        });

        it('Total supply changes with minting and burning', async () => {
            await pseudoDaiToken.mint(0, {from: userAddress});
            pseudoDaiToken.approve(tokenManager.address, 125, {from: userAddress});
            await tokenManager.mint(10, {from: userAddress});
            let supply = await tokenManager.totalSupply();
            assert.equal(supply.toNumber(), 10, "Total supply affected by minting");

            await tokenManager.burn(10, {from: userAddress});
            let supplyAfterBurn = await tokenManager.totalSupply();
            assert.equal(supplyAfterBurn.toNumber(), 0, "Supply change with burn");
        });
    });
});