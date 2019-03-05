const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../build/PseudoDaiToken.json');

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18,
    mintAmount: 1000
}

describe('Pseudo DAI', () => {
    let deployer;
    let adminAccount = devnetAccounts[1];
    let tokenOwnerAccount = devnetAccounts[2];
    let anotherTokenOwnerAccount = devnetAccounts[3];

    let pseudoDaiInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeDevnetDeployer(adminAccount.secretKey);
        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );
    });

    describe('DAI Core functionality', async () => {
        it('User can withdraw free DAI', async () => {
            let balanceBeforeMint = await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)    
                .balanceOf(tokenOwnerAccount.wallet.address);
            assert.equal(
                ethers.utils.formatUnits(balanceBeforeMint, 18), 
                0,
                "User owns tokens before minting"
            );

            await (await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint()).wait();
            let balanceAfterMint = await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .balanceOf(tokenOwnerAccount.wallet.address);
            assert.equal(
                ethers.utils.formatUnits(balanceAfterMint, 18), 
                1000,
                "User received incorrect amount of PDAI"
            );

            try {
                await (await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint()).wait()
                assert.fail("User can withdraw more PDAI than allowed")
            } catch (error) {
                
            }
        });

        it('Transfer functionality', async () => {
            let balanceBeforeMint = await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .balanceOf(tokenOwnerAccount.wallet.address);
            assert.equal(
                ethers.utils.formatUnits(balanceBeforeMint, 18), 
                0, 
                "User owns no tokens before minting"
            );

            await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .mint();
            let balanceAfterMint = await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .balanceOf(tokenOwnerAccount.wallet.address);
            assert.equal(
                ethers.utils.formatUnits(balanceAfterMint, 18),
                1000, 
                "Balance increases after withdraw"
            );

            await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .transfer(
                    anotherTokenOwnerAccount.wallet.address, 
                    ethers.utils.parseUnits("100", 18)
            ); 
            let ownerBalanceAfterTransfer = await pseudoDaiInstance
                .from(tokenOwnerAccount.wallet.address)
                .balanceOf(tokenOwnerAccount.wallet.address);
            let reciverBalanceAfterTransfer = await pseudoDaiInstance
                .from(anotherTokenOwnerAccount.wallet.address)
                .balanceOf(anotherTokenOwnerAccount.wallet.address);
            assert.equal(
                ethers.utils.formatUnits(ownerBalanceAfterTransfer, 18),
                900, 
                "User account has correct funds removed"
            );
            assert.equal(
                ethers.utils.formatUnits(reciverBalanceAfterTransfer, 18),
                100, 
                "Receiver does not have funds"
            );
        });
    });
});