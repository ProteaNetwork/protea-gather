const web3Abi = require('web3-eth-abi');

var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');

contract('Pseudo DAI', accounts => {
    tokenOwnerAddress = accounts[0];
    adminAddress = accounts[1];
    userAddress = accounts[2];
    anotherUserAddress = accounts[3];

    beforeEach('', async () => {
        pseudoDaiToken = await PseudoDaiToken.new("PseudoDAI", "PDAI", 18);
    });

    describe('DAI Core functionality', async () => {
        it('Is initiated correctly', async () => {
            let name = await pseudoDaiToken.name();
            assert.equal(name, "PseudoDAI", "The name is correct"); 
            let symbol = await pseudoDaiToken.symbol();
            assert.equal(symbol, "PDAI", "The symbol is correct");
            let decimal = await pseudoDaiToken.decimals();
            assert.equal(decimal, 18, "Decimal is correct");
            let totalSupply = await pseudoDaiToken.totalSupply();
            assert.equal(totalSupply, 0, "The supply is empty");
        });

        it('User can only withdraw 500 free DAI', async () => {
            let balanceBefore = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceBefore, 0, "User owns no tokens before minting");
            await pseudoDaiToken.mint({from: userAddress});
            let balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 250, "Balance increased from registration");
            await pseudoDaiToken.mint({from: userAddress});
            let balanceAfter = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceAfter, 375, "Balance increases after second withdraw");
            await pseudoDaiToken.mint({from: userAddress});
            let lastBalance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(lastBalance, 500, "The user has withdrawn the max amount of tokens");
            try {
                await pseudoDaiToken.mint({from: userAddress});
                assert.equal(true, false, "Should fail before this");
            } catch(err) {
                assert.equal(true, true, "User cannot withdraw more than 500");
            }
        });

        it('Transfer functionality', async () => {
            let balanceBefore = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceBefore, 0, "User owns no tokens before minting");
            await pseudoDaiToken.mint({from: userAddress});
            let balanceAfter = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceAfter, 250, "Balance increases after withdraw");
            pseudoDaiToken.transfer(anotherUserAddress, 100, {from: userAddress}); 
            let balanceAfterTransferSender = await pseudoDaiToken.balanceOf(userAddress);
            let balanceAfterTransferReciver = await pseudoDaiToken.balanceOf(anotherUserAddress);
            assert.equal(balanceAfterTransferSender, 150, "User account has correct funds removed");
            assert.equal(balanceAfterTransferReciver, 100, "Receiver has correct balance.");
        });
    });
});