const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var BasicLinearTokenManager = require('../../build/BasicLinearTokenManager.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');
var BasicLinearTokenManagerFactory = require('../../build/BasicLinearTokenManagerFactory.json');
var MembershipManagerV1Factory = require('../../build/MembershipManagerV1Factory.json');
var EventManagerV1Factory = require('../../build/EventManagerV1Factory.json');


const communitySettings = {
    name: "community",
    symbol: "com",
    gradientDemoninator: 2000, // Unused but required for the interface
    contributionRate: 10
}
const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

const defaultTokenVolume = 100;

describe('V1 Token Manager', () => {
    let deployer;
    let proteaAdmin = devnetAccounts[0];
    let userAccount = devnetAccounts[1];
    let communityCreatorAccount = devnetAccounts[2];
    let anotherCommunityCreatorAccount = devnetAccounts[3];
    let tokenManagerInstance, pseudoDaiInstance, communityFactoryInstance;
  
    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeDevnetDeployer(proteaAdmin.secretKey);
        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );

        communityFactoryInstance = await deployer.deploy(
            CommunityFactoryV1, 
            false, 
            pseudoDaiInstance.contract.address,
            proteaAdmin.wallet.address,
        );

        const tokenManagerFactoryInstance = await deployer.deploy(
            BasicLinearTokenManagerFactory,
            false,
            communityFactoryInstance.contract.address
        );

        const membershipManagerFactoryInstance = await deployer.deploy(
            MembershipManagerV1Factory,
            false,
            communityFactoryInstance.contract.address
        );

        const eventManagerFactoryInstance = await deployer.deploy(
            EventManagerV1Factory,
            false,
            communityFactoryInstance.contract.address
        );

        const result = await (await communityFactoryInstance
            .from(proteaAdmin.wallet.address)
            .initialize(
                [
                    tokenManagerFactoryInstance.contract.address,
                    membershipManagerFactoryInstance.contract.address,
                    eventManagerFactoryInstance.contract.address
                ]
            )).wait();

        const txReceipt = await(await communityFactoryInstance
            .from(communityCreatorAccount)
            .createCommunity(
                communitySettings.name,
                communitySettings.symbol,
                communityCreatorAccount.wallet.address,
                communitySettings.gradientDemoninator,
                communitySettings.contributionRate
            )).wait();
        let communityDetails = await communityFactoryInstance
            .from(communityCreatorAccount.wallet.address)
            .getCommunity(0);
        tokenManagerInstance = await etherlime.ContractAtDevnet(BasicLinearTokenManager, communityDetails[3]);
    });

    describe('Token functionality', async () => {
        describe('Bonded creation curve functionality', async () => {
            it('Mints tokens', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));
                let userPDAIBalance = await pseudoDaiInstance.from(
                    userAccount.wallet.address
                ).balanceOf(
                    userAccount.wallet.address
                );
    
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance.from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .allowance(
                        userAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    approvedAmount.toString(), 
                    priceOfMint.toString(),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address, 
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userTokenBalance = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
                let userPDAIBalanceAfter = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );

                let proteaPDAIBalanceAfter = ethers.utils.formatUnits(
                    await pseudoDaiInstance
                        .from(proteaAdmin.wallet.address)
                        .balanceOf(
                        proteaAdmin.wallet.address
                    ), 
                    18
                );

                assert.equal(
                    ethers.utils.formatUnits(userTokenBalance, 18),
                    (defaultTokenVolume - (defaultTokenVolume * (communitySettings.contributionRate / 100))),
                    "User dos not have tokens"
                );

                assert.notEqual(
                    userPDAIBalanceAfter.toString(),
                    userPDAIBalance.toString(),
                    "Users PDAI has not decreased"
                );

                const onePercentContribution = ethers.utils.formatUnits(priceOfMint.div(101), 18);
                assert.equal(
                    proteaPDAIBalanceAfter,
                    onePercentContribution,
                    "Contribution not sent correctly"
                )
            });

            it('Burning tests', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userPDAIBalanceBeforeMint = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
    
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.wallet.address)
                    .allowance(
                        userAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let userTokenBalanceAfterMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
                let userPDAIBalanceAfterMint = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalanceAfterMint, 18),
                    (defaultTokenVolume - (defaultTokenVolume * (communitySettings.contributionRate / 100))),
                    "User does not have tokens"
                );
                assert.notEqual(
                    userPDAIBalanceAfterMint,
                    userPDAIBalanceBeforeMint,
                    "Users PDAI has not decreased"
                );



                // Check reward for burn
                let currentBalance = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
                let rewardforBurnDAI = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .rewardForBurn(
                        currentBalance
                );

                // Check volume for withdraw
                let rewardforBurnToken = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .colateralToTokenSelling(
                        rewardforBurnDAI
                );

                assert.equal(
                    ethers.utils.formatUnits(currentBalance, 18),
                    ethers.utils.formatUnits(rewardforBurnToken, 18),
                    "Issue in burn calculation"
                )
                

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .burn(userTokenBalanceAfterMint.div(2));
                let userTokenBalanceAfterBurn = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );
                let userPDAIBalanceAfterBurn = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
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
                    50 - (50 * (communitySettings.contributionRate / 100)),
                    "Users has incorrect token balance"
                );
            });


            it("Returns burning values correctly", async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`1`, 18)
                );
                let userPDAIBalanceBeforeMint = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );

                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.wallet.address)
                    .allowance(
                        userAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits(`1`, 18)
                );
                let userBalance = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .balanceOf(
                        userAccount.wallet.address
                );

                let rewardforBurnDAI = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .rewardForBurn(
                        userBalance
                );

                // Check volume for withdraw
                let rewardforBurnToken = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .colateralToTokenSelling(
                        rewardforBurnDAI
                );

                assert.equal(
                    ethers.utils.formatUnits(userBalance, 18),
                    ethers.utils.formatUnits(rewardforBurnToken, 18),
                    "Issue in burn calculation"
                )

                let priceOfMint2 = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`1`, 18)
                );
            })

            it('Curve gradient test', async () => {
                let priceOfOneBefore = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("10", 18)
                );
    
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance.from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(userAccount.wallet.address)
                    .allowance(
                        userAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits("10", 18)
                );
                let oneTokenPrice = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits("1", 18)
                );
                assert.notEqual(
                    ethers.utils.formatUnits(priceOfOneBefore, 18),
                    ethers.utils.formatUnits(oneTokenPrice, 18),
                    "The price to mint 1 token has not changed after minting"
                );
            });

            it("Sends contribution amount to revenue target on purchase", async () => {
                const tokenVolume = ethers.utils.parseUnits(`${defaultTokenVolume}`, 18);

                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(tokenVolume);
                let userPDAIBalance = await pseudoDaiInstance.from(
                    userAccount.wallet.address
                ).balanceOf(
                    userAccount.wallet.address
                );
    
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance.from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                
                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address, 
                        tokenVolume
                );

                const balance = await pseudoDaiInstance
                        .from(proteaAdmin.wallet.address)
                        .balanceOf(
                            userAccount.wallet.address
                    );

                assert.notEqual(ethers.utils.formatUnits(balance, 18), ethers.utils.formatUnits(tokenVolume, 18), "Tokens were not contributed");

                const revenueTargetBalance = await tokenManagerInstance
                        .from(proteaAdmin.wallet.address)
                        .balanceOf(
                            communityCreatorAccount.wallet.address
                    );

                assert.notEqual(
                    parseFloat(ethers.utils.formatUnits(revenueTargetBalance,18)), 
                    0, 
                    "Tokens were not contributed");
            })
            
        });

        describe('Moving along the curve', async () => {
            it('Total supply changes with minting and burning', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance.from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let totalSupplyBeforeMinting = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .totalSupply();
                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                let totalSupplyAfterMinting = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .totalSupply();
                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .burn(ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18)
                );
                let totalSupplyAfterBurning = await tokenManagerInstance
                    .from(userAccount.wallet.address)
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
                    defaultTokenVolume,
                    `Total supply is not ${defaultTokenVolume} after minting ${defaultTokenVolume}`
                );
                assert.equal(
                    ethers.utils.formatUnits(totalSupplyAfterBurning, 18),
                    defaultTokenVolume / 2,
                    "Total supply is not affected by burning"
                );
            });

            it("DAI for Token resolving functioning accurately", async () => {

                let tokenToDaiBN = await tokenManagerInstance
                .from(userAccount.wallet.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume * 2}`, 18));

                let finalTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                let daiToTokenBN = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(finalTokenToDai, 18));
                let finalDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                tokenToDaiBN = await tokenManagerInstance
                .from(userAccount.wallet.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

                let firstTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                daiToTokenBN = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(firstTokenToDai, 18));
                let firstDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                assert.equal(
                    parseFloat(firstDaiToToken),
                    defaultTokenVolume,
                    "First Dai to token Volume valuation incorrect"
                )

                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                await pseudoDaiInstance.from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        tokenToDaiBN
                    );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );

                // Test case 2
                tokenToDaiBN = await tokenManagerInstance
                .from(userAccount.wallet.address)
                .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

                let secondTokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                daiToTokenBN = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .colateralToTokenBuying(ethers.utils.parseUnits(secondTokenToDai, 18));
                
                let secondDaiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                assert.equal(
                    parseFloat(secondDaiToToken),
                    defaultTokenVolume,
                    "Second Dai to token Volume valuation incorrect"
                );

                assert.ok(
                    parseFloat(firstTokenToDai) < parseFloat(secondTokenToDai),
                    "The price has not increased"
                );

                assert.equal(
                    parseFloat(firstTokenToDai) + parseFloat(secondTokenToDai),
                    parseFloat(finalTokenToDai),
                    "Intergral valuations inccorect"
                );

                assert.equal(
                    parseFloat(firstDaiToToken) + parseFloat(secondDaiToToken),
                    parseFloat(finalDaiToToken),
                    "Intergral valuations inccorect"
                )
            })

            it("Large purchases", async () => {
                for(let i = 0; i < 10; i++){
                    if(devnetAccounts[i].wallet.address == communityCreatorAccount.wallet.address) {
                        return;
                    }
                    // TODO: Skip revenue target
                    await pseudoDaiInstance.from(devnetAccounts[i].wallet.address).mint();

                    let balance = ethers.utils.formatUnits(await pseudoDaiInstance.from(devnetAccounts[i].wallet.address)
                        .balanceOf(devnetAccounts[i].wallet.address), 18);

                    let daiToTokenBN = await tokenManagerInstance
                        .from(devnetAccounts[i])
                        .colateralToTokenBuying(ethers.utils.parseUnits(balance, 18));

                    let daiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                    await pseudoDaiInstance.from(devnetAccounts[i].wallet.address)
                        .approve(
                            tokenManagerInstance.contract.address,
                            ethers.utils.parseUnits(balance, 18)
                        );

                    await tokenManagerInstance
                        .from(devnetAccounts[i].wallet.address)
                        .mint(
                            devnetAccounts[i].wallet.address,
                            ethers.utils.parseUnits(daiToToken, 18)
                    );

                    let communityBalance = ethers.utils.formatUnits(await tokenManagerInstance.from(devnetAccounts[i].wallet.address)
                        .balanceOf(devnetAccounts[i].wallet.address), 18);
                    
                    // console.log(parseFloat(communityBalance),
                    //         parseFloat(daiToToken))
                    assert.equal(
                        parseFloat(communityBalance),
                        parseFloat(daiToToken) - (parseFloat(daiToToken) * (communitySettings.contributionRate / 100)),
                        `${i} Balance incorrect`
                    )// This should fail 
                }
            })

            it("DAI pricing holds up at scale", async () => {
                // Setting the mint
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                for(let i = 0; i < 19; i++){
                    let tokenToDaiBN = await tokenManagerInstance
                        .from(userAccount.wallet.address)
                        .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

                    let tokenToDai = ethers.utils.formatUnits(tokenToDaiBN, 18);

                    let daiToTokenBN = await tokenManagerInstance
                        .from(userAccount.wallet.address)
                        .colateralToTokenBuying(ethers.utils.parseUnits(tokenToDai, 18));
                    let daiToToken = ethers.utils.formatUnits(daiToTokenBN, 18);

                    assert.equal(
                        parseFloat(daiToToken),
                        defaultTokenVolume,
                        `${i} - Dai to token Volume valuation incorrect`
                    )

                    await pseudoDaiInstance.from(userAccount.wallet.address)
                        .approve(
                            tokenManagerInstance.contract.address,
                            tokenToDaiBN
                        );

                    await tokenManagerInstance
                        .from(userAccount.wallet.address)
                        .mint(
                            userAccount.wallet.address,
                            ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                    );

                    let balance = ethers.utils.formatUnits(await tokenManagerInstance.from(communityCreatorAccount.wallet.address)
                            .balanceOf(userAccount.wallet.address), 18);

                    assert.equal(
                        parseFloat(balance),
                        ((defaultTokenVolume + (defaultTokenVolume * i)) - (defaultTokenVolume + (defaultTokenVolume * i)) * parseFloat(communitySettings.contributionRate / 100)),
                        `${i} Balance incorrect`
                    )
                }
            })
        })

        describe('Transferring', async () => {
            it('Transferring functionality', async () => {
                let priceOfMint = await tokenManagerInstance
                    .from(communityCreatorAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await pseudoDaiInstance.from(communityCreatorAccount.wallet.address).mint();
                await pseudoDaiInstance.from(communityCreatorAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        priceOfMint
                    );
                let approvedAmount = await pseudoDaiInstance
                    .from(communityCreatorAccount.wallet.address)
                    .allowance(
                        communityCreatorAccount.wallet.address,
                        tokenManagerInstance.contract.address
                );
                assert.equal(
                    ethers.utils.formatUnits(approvedAmount, 18),
                    ethers.utils.formatUnits(priceOfMint, 18),
                    "The contract has the incorrect PDAI allowance"
                );

                await tokenManagerInstance
                    .from(communityCreatorAccount.wallet.address)
                    .mint(
                        communityCreatorAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );
                await tokenManagerInstance
                    .from(communityCreatorAccount.wallet.address)
                    .approve(
                        anotherCommunityCreatorAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18)
                );
                await tokenManagerInstance.from(anotherCommunityCreatorAccount.wallet.address).transferFrom(
                    communityCreatorAccount.wallet.address,
                    anotherCommunityCreatorAccount.wallet.address,
                    ethers.utils.parseUnits(`${defaultTokenVolume / 2}`, 18),
                );
                let userTokenBalance = await tokenManagerInstance.from(
                    communityCreatorAccount.wallet.address
                    ).balanceOf(
                        communityCreatorAccount.wallet.address
                );
                let otherUserTokenBalance = await tokenManagerInstance.from(
                    anotherCommunityCreatorAccount.wallet.address
                    ).balanceOf(
                        anotherCommunityCreatorAccount.wallet.address
                );
                assert.equal(
                    ethers.utils.formatUnits(userTokenBalance, 18),
                    ethers.utils.formatUnits(otherUserTokenBalance, 18),
                    "Tokens where not transferer to other address"
                );
            });
        });

        describe("Meta data view tests", async () => {
            it("Total Supply", async () => {
                await pseudoDaiInstance.from(userAccount.wallet.address).mint();
                let totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );

                assert.equal(
                    totalSupply,
                    0,
                    "Pool balance is not 0"
                )

                let tokenToDaiBN = await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .priceToMint(ethers.utils.parseUnits(`${defaultTokenVolume}`, 18));

                await pseudoDaiInstance
                .from(userAccount.wallet.address)
                    .approve(
                        tokenManagerInstance.contract.address,
                        tokenToDaiBN
                    );

                await tokenManagerInstance
                    .from(userAccount.wallet.address)
                    .mint(
                        userAccount.wallet.address,
                        ethers.utils.parseUnits(`${defaultTokenVolume}`, 18)
                );

                totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );

                assert.equal(
                    totalSupply,
                    defaultTokenVolume,
                    `Total supply is incorrect`
                )
            })

            it("Revenue target", async () => {
                let revenueTarget = await tokenManagerInstance.from(
                        proteaAdmin.wallet.address
                    ).revenueTarget();

                assert.equal(
                    revenueTarget,
                    communityCreatorAccount.wallet.address,
                    "Address invalid"
                )
            })

            it("Contribution rate", async () => {
                let contributionRate = await tokenManagerInstance.from(
                        proteaAdmin.wallet.address
                    ).contributionRate();
                
                assert.equal(
                    parseFloat(ethers.utils.formatUnits(contributionRate, 2)),
                    0.1,
                    "Rate incorrect"
                )
            })
        })
    });
})