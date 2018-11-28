const web3Abi = require('web3-eth-abi');

const exceptions = require('./exceptions.js');

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
            await pseudoDaiToken.mint(0, {from: userAddress});
            let balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 250, "Balance increased from registration");
            await pseudoDaiToken.mint(1, {from: userAddress});
            let balanceAfter = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceAfter, 375, "Balance increases after second withdraw");
            await pseudoDaiToken.mint(2, {from: userAddress});
            let lastBalance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(lastBalance, 500, "The user has withdrawn the max amount of tokens");
            try {
                await pseudoDaiToken.mint(0, {from: userAddress});
                assert.equal(true, false, "Should fail before this");
            } catch(err) {
                assert.equal(true, true, "User cannot withdraw more than 500");
            }
        });

        it('Transfer functionality', async () => {
            let balanceBefore = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceBefore, 0, "User owns no tokens before minting");
            await pseudoDaiToken.mint(0, {from: userAddress});
            let balanceAfter = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balanceAfter, 250, "Balance increases after withdraw");
            pseudoDaiToken.transfer(anotherUserAddress, 100, {from: userAddress}); 
            let balanceAfterTransferSender = await pseudoDaiToken.balanceOf(userAddress);
            let balanceAfterTransferReceiver = await pseudoDaiToken.balanceOf(anotherUserAddress);
            assert.equal(balanceAfterTransferSender, 150, "User account has correct funds removed");
            assert.equal(balanceAfterTransferReceiver, 100, "Receiver has correct balance.");
        });
    });

    describe("Minting functionality", async () => {
        it('Reward manager must mint if provided reward index', async () => {
            await pseudoDaiToken.mint(0, {from: userAddress});
            let balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 250, "Balance increased from registration");

            await pseudoDaiToken.mint(1, {from: userAddress});
            balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 375, "Balance increased from secondary device");

            await pseudoDaiToken.mint(2, {from: userAddress});
            balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 500, "Balance increased from backup");

        })
        it('Reward manager must return reward state for the user', async () => {
            let [registered, secondary, backup] = await pseudoDaiToken.fetchRewardState(userAddress, {from: userAddress});
            assert.equal(registered, false, "User not registered");
            assert.equal(secondary, false, "Secondary device not registered");
            assert.equal(registered, false, "Backup codes not generated");
        })

        it('Reward manager must refuse rewards if account creation reward not issued', async () => {
            await exceptions.catchRevert(pseudoDaiToken.mint(1, {from: userAddress}));
        })

        it('Reward manager must refuse rewards if all is issued', async () => {
            await pseudoDaiToken.mint(0, {from: userAddress});
            let balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 250, "Balance increased from registration");

            await pseudoDaiToken.mint(1, {from: userAddress});
            balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 375, "Balance increased from secondary device");

            await pseudoDaiToken.mint(2, {from: userAddress});
            balance = await pseudoDaiToken.balanceOf(userAddress);
            assert.equal(balance, 500, "Balance increased from backup");

            await exceptions.catchRevert(pseudoDaiToken.mint(2, {from: userAddress}));
        })

        it('Reward manager must refuse rewards if account creation reward not issued', async () => {
            await exceptions.catchRevert(pseudoDaiToken.mint(4, {from: userAddress}));
        })
    })
});