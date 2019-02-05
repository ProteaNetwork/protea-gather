const etherlime = require('etherlime');
const ethers = require('ethers');

var TokenManager = require('../build/TokenManager.json');
var PseudoDaiToken = require('../build/PseudoDaiToken.json');

const tokenManagerSettings = {
    name: "community",
    symbol: "com"
}
const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

describe('Token Manager', () => {
    let deployer;
    let adminAccount = accounts[1];
    let tokenOwnerAccount = accounts[2];
    let anotherTokenOwnerAccount = accounts[3];

    let tokenManagerInstance, pseudoDaiInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(adminAccount.secretKey);
        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );
        tokenManagerInstance = await deployer.deploy(
            TokenManager,
            false,
            tokenManagerSettings.name,
            tokenManagerSettings.symbol,
            pseudoDaiInstance.contract.address
        );
    });

    describe('Token functionality', async () => {
        describe('Bonded creation curve functionality', async () => {
            it('Minting tests', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18));
                let userPDAIBalance = await pseudoDaiInstance.from(
                    tokenOwnerAccount.wallet.address
                ).balanceOf(
                    tokenOwnerAccount.wallet.address
                );
    
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint();
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .allowance(
                        tokenOwnerAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    approvedAmount.toString(), 
                    priceOfMint.toString(),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .mint(ethers.utils.parseUnits("10", 18)
                );
                let userTokenBalance = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                let userPDAIBalanceAfter = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalance, 18),
                    10,
                    "User dose not have tokens"
                );
                assert.notEqual(
                    userPDAIBalanceAfter.toString(),
                    userPDAIBalance.toString(),
                    "Users PDAI has not decreased"
                );
            });

            it('Burning tests', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
                let userPDAIBalanceBeforeMint = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
    
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint();
                await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                );
                let approvedAmount = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .allowance(
                        tokenOwnerAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .mint(ethers.utils.parseUnits("10", 18)
                );
                let userTokenBalanceAfterMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                let userPDAIBalanceAfterMint = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalanceAfterMint, 18),
                    10,
                    "User dose not have tokens"
                );
                assert.notEqual(
                    userPDAIBalanceAfterMint,
                    userPDAIBalanceBeforeMint,
                    "Users PDAI has not decreased"
                );

                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .burn(ethers.utils.parseUnits("5", 18));
                let userTokenBalanceAfterBurn = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                let userPDAIBalanceAfterBurn = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                assert.notEqual(
                    ethers.utils.formatUnits(userPDAIBalanceAfterBurn, 18),
                    ethers.utils.formatUnits(userPDAIBalanceAfterMint, 18),
                    "Users PDAI balance has not changed between mint and burn"
                );
                assert.notEqual(
                    ethers.utils.formatUnits(userTokenBalanceAfterBurn, 18),
                    ethers.utils.formatUnits(userTokenBalanceAfterMint, 18),
                    "Users token balance has not changed between mint and burn"
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalanceAfterBurn, 18),
                    5,
                    "Users has incorrect token balance"
                );
            });

            it('Curve gradient test', async () => {
                let priceOfOneBefore = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                let priceOfMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
    
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint();
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .allowance(
                        tokenOwnerAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .mint(ethers.utils.parseUnits("10", 18)
                );
                let oneTokenPrice = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                assert.notEqual(
                    ethers.utils.formatUnits(priceOfOneBefore, 18),
                    ethers.utils.formatUnits(oneTokenPrice, 18),
                    "The price to mint 1 token has not changed after minting"
                );
            });

            it('Total supply changes with minting and burning', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint();
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let totalSupplyBeforeMinting = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .totalSupply();
                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .mint(ethers.utils.parseUnits("10", 18)
                );
                let totalSupplyAfterMinting = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .totalSupply();
                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .burn(ethers.utils.parseUnits("5", 18)
                );
                let totalSupplyAfterBurning = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .totalSupply();
                assert.notEqual(
                    ethers.utils.formatUnits(totalSupplyBeforeMinting, 18),
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    "Total supply has not changed after minting"
                );
                assert.notEqual(
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    ethers.utils.formatUnits(totalSupplyAfterBurning, 18),
                    "Total supply has not changed after burning"
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyBeforeMinting, 18),
                    0,
                    "Total supply is not 0 before minting"
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyAfterMinting, 18),
                    10,
                    "Total supply is not 10 after minting 10"
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyAfterBurning, 18),
                    5,
                    "Total supply is not affected by burning"
                );
            });
        });

        describe('Transferring', async () => {
            it('Transferring functionality', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address).mint();
                await pseudoDaiInstance.from(tokenOwnerAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .allowance(
                        tokenOwnerAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .mint(ethers.utils.parseUnits("10", 18)
                );
                await tokenManagerInstance
                    .from(tokenOwnerAccount.wallet.address)
                    .approve(
                        anotherTokenOwnerAccount.wallet.address,
                        ethers.utils.parseUnits("5", 18)
                );
                await tokenManagerInstance.from(anotherTokenOwnerAccount.wallet.address).transferFrom(
                    tokenOwnerAccount.wallet.address,
                    anotherTokenOwnerAccount.wallet.address,
                    ethers.utils.parseUnits("5", 18),
                );
                let userTokenBalance = await tokenManagerInstance.from(
                    tokenOwnerAccount.wallet.address
                    ).balanceOf(
                        tokenOwnerAccount.wallet.address
                );
                let otherUserTokenBalance = await tokenManagerInstance.from(
                        anotherTokenOwnerAccount.wallet.address
                    ).balanceOf(
                        anotherTokenOwnerAccount.wallet.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalance, 18),
                    ethers.utils.formatUnits(otherUserTokenBalance, 18),
                    "Tokens where not transferer to other address"
                );
            });
        });
    });
});