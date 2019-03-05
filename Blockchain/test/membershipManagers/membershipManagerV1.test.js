const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');
var MembershipManagerV1 = require('../../build/MembershipManagerV1.json');
var BasicLinearTokenManagerFactory = require('../../build/BasicLinearTokenManagerFactory.json');
var BasicLinearTokenManager = require('../../build/BasicLinearTokenManager.json');
var MembershipManagerV1Factory = require('../../build/MembershipManagerV1Factory.json');
var MembershipManagerV1 = require('../../build/MembershipManagerV1.json');
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

const membershipSettings = {
    utilityAddress: "",
    registeredEvents: [
        {
            id: 0,
            reward: 250,
            title: "Attended"
        }
    ],
    testingStakeValue: ethers.utils.parseUnits("10", 18),
}

const defaultTokenVolume = 100;
const defaultDaiPurchase = 500;


describe('V1 Membership Manager', () => {
    let deployer;
    let proteaAdmin = devnetAccounts[0];
    let userAccount = devnetAccounts[1];
    let communityCreatorAccount = devnetAccounts[2];
    let utilityAccount = devnetAccounts[3];
    membershipSettings.utilityAddress = utilityAccount.wallet.address;
    let membershipManagerInstance, tokenManagerInstance, pseudoDaiInstance, communityFactoryInstance;
  
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
        membershipManagerInstance = await etherlime.ContractAtDevnet(MembershipManagerV1, communityDetails[2]);

        // Setting up a user 
        let tokensForDai = await tokenManagerInstance
            .from(userAccount.wallet.address)
            .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));
        
        let userPDAIBalance = await pseudoDaiInstance
            .from(
                userAccount.wallet.address
            ).balanceOf(
                userAccount.wallet.address
            );
        
        await pseudoDaiInstance.from(userAccount.wallet.address).mint();
        await pseudoDaiInstance.from(userAccount.wallet.address)
            .approve(
                tokenManagerInstance.contract.address,
                ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
            );
        let approvedAmount = await pseudoDaiInstance
            .from(userAccount.wallet.address)
            .allowance(
                userAccount.wallet.address,
                tokenManagerInstance.contract.address
            );

        assert.equal(
            approvedAmount.toString(), 
            ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18).toString(),
            "The contract has the incorrect PDAI allowance"
        );

        await tokenManagerInstance
            .from(userAccount.wallet.address)
            .mint(
                userAccount.wallet.address, 
                tokensForDai
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
        )
        
        let proteaPDAIBalanceAfter = ethers.utils.formatUnits(
            await pseudoDaiInstance
                .from(proteaAdmin.wallet.address)
                .balanceOf(
                proteaAdmin.wallet.address
            ), 
            18
        );

        assert.notEqual(
            userPDAIBalanceAfter.toString(),
            userPDAIBalance.toString(),
            "Users PDAI has not decreased"
        );

        const onePercentContribution = ethers.utils.formatUnits(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18).div(101), 18);
        assert.equal(
            proteaPDAIBalanceAfter,
            onePercentContribution,
            "Contribution not sent correctly"
        )
    });

    describe('Deployment checks', async () => {
        it("Has the token manager set after initialization", async () => {
            const tokenManager = await membershipManagerInstance.from(userAccount).tokenManager();
            assert.equal(tokenManager, tokenManagerInstance.contractAddress, "Token manager not set")
        })        
    });

    describe("Admin management", () => {
        it("Adds an admin", async () => {
            await (
                await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addAdmin(userAccount.wallet.address)
            )
        })

        it("Fails to add admin for non-admins", async () => {
            try{
                await (await membershipManagerInstance
                    .from(userAccount)
                    .addAdmin(userAccount.wallet.address)
                )
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        });

        it("Removes an admin", async () => {
            await (await membershipManagerInstance
                .from(communityCreatorAccount)
                .addAdmin(userAccount.wallet.address)
            )

            await (await membershipManagerInstance
                .from(userAccount)
                .removeAdmin(communityCreatorAccount.wallet.address)
            )
        })
        it("Fails to remove an admin for non-admins", async () =>{
            try {
                await (await membershipManagerInstance
                    .from(userAccount)
                    .removeAdmin(communityCreatorAccount.wallet.address)
                )
                assert.fail("Unauthorised access went through")
            }
            catch(error){
                
            }
        })

        it("Adds a system admin", async () => {
            await (await membershipManagerInstance
                .from(communityCreatorAccount)
                .addSystemAdmin(userAccount.wallet.address)
            )
        })
        it("Fails to add a system admin for non-system admins", async () => {
            try{
                await (await membershipManagerInstance
                    .from(userAccount)
                    .addSystemAdmin(userAccount.wallet.address)
                )
                assert.fail("Unauthorised access went through")
            }
            catch(error) {

            }
        })

        it("Removes a system admin", async () => {
            await (await membershipManagerInstance
                .from(communityCreatorAccount)
                .addSystemAdmin(userAccount.wallet.address)
            )

            await (await membershipManagerInstance
                .from(userAccount)
                .removeSystemAdmin(communityCreatorAccount.wallet.address)
            )
        })
        it("Fails to remove a system admin for non-system admins", async () => {
            try{
                await (await membershipManagerInstance
                    .from(userAccount)
                    .removeSystemAdmin(communityCreatorAccount.wallet.address)
                )
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        })
    })

    describe("Utility management", () => {
        it("Adds utility", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");
        })
        it("Adding utility emits event", async () => {
            const receipt = await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == membershipManagerInstance.interface.events.UtilityAdded.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.issuer,
                membershipSettings.utilityAddress,
                "Incorrect issuer emitted"
            )
        })
        it("Prevents adding utility for non-admin", async () => {
            try{
                await(
                    await membershipManagerInstance
                    .from(userAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).done();
                assert.fail("Unauthorised access went through")
            }
            catch(error){
            }
        });
        it("Removes utility", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let state = await membershipManagerInstance
            .from(communityCreatorAccount)
            .isRegistered(membershipSettings.utilityAddress);
        
            assert.equal(state, true, "Utility not registered");

            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .removeUtility(membershipSettings.utilityAddress)
            ).wait();
            
            state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            assert.equal(state, false, "Utility still registered");
        })
        it("Removing utility emits event", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let state = await membershipManagerInstance
            .from(communityCreatorAccount)
            .isRegistered(membershipSettings.utilityAddress);
        
            assert.equal(state, true, "Utility not registered");

            const receipt = await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .removeUtility(membershipSettings.utilityAddress)
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == membershipManagerInstance.interface.events.UtilityRemoved.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.issuer,
                membershipSettings.utilityAddress,
                "Incorrect issuer emitted"
            )
        });
        it("Prevents removing utility for non-admin", async () => {
            try{
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                let state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
                assert.equal(state, true, "Utility not registered");
    
                const receipt = await (
                    await membershipManagerInstance
                    .from(userAccount)
                    .removeUtility(membershipSettings.utilityAddress)
                ).wait();
                assert.fail("Unauthorised access went through")
            }
            catch(error){
            }
        });
        it("Sets the reputation reward", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);

            assert.ok(
                reward.eq(0),
                "Reward not initialized correctly"
            )

            let state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
        
            assert.equal(state, true, "Utility not registered");

            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
            ).wait();

            reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
          
            assert.ok(
                reward.eq(membershipSettings.registeredEvents[0].reward),
                "Reward not set correctly"
            )
        })
        it("Setting reputation emits event", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);

            assert.ok(
                reward.eq(0),
                "Reward not initialized correctly"
            )

            let state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
        
            assert.equal(state, true, "Utility not registered");

            const receipt = await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == membershipManagerInstance.interface.events.ReputationRewardSet.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.issuer,
                membershipSettings.utilityAddress,
                "Incorrect issuer emitted"
            )

            assert.equal(
                event.args.id,
                membershipSettings.registeredEvents[0].id,
                "Incorrect id emitted"
            )

            assert.ok(
                event.args.amount.eq(membershipSettings.registeredEvents[0].reward),
                "Incorrect reward emitted"
            )
        });
        it("Prevents setting the reputation reward for non-system admin", async ()=> {
            try{
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                let reward = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
    
                assert.ok(
                    reward.eq(0),
                    "Reward not initialized correctly"
                )
    
                let state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
            
                assert.equal(state, true, "Utility not registered");
    
                const receipt = await (
                    await membershipManagerInstance
                    .from(utilityAccount)
                    .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
                ).wait();
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        });
    })

    describe("Membership management", () => {
        it("Adds tokens to membership", async () => {
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            const membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )
        })

        it("Adding tokens to membership emits event", async () => {
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const receipt = await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let event = await (receipt.events.filter(
                event => event.eventSignature == membershipManagerInstance.interface.events.MembershipStaked.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.member,
                userAccount.wallet.address,
                "Incorrect member emitted"
            )
            assert.ok(
                event.args.tokensStaked.eq(requiredTokensBN),
                "Incorrect tokens staked emitted"
            )
        })

        it("Fails to add tokens to membership when funds insufficent", async () => {
            try{
                await (await membershipManagerInstance.from(utilityAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
                assert.fail("Unauthorised access went through")
           }
            catch(error){

            }
        })

        it("Withdraws tokens from membership", async () => {
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            let membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await (await membershipManagerInstance.from(userAccount).withdrawMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                membershipState[2].eq(0),
                "Tokens were not returned"
            )

            assert.ok(
                membershipState[2].eq(0),
                "Tokens were not returned correctly"
            )
        })
        it("Withdrawing tokens from membership emits event", async () => {
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            let membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            const receipt = await (await membershipManagerInstance.from(userAccount).withdrawMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            let event = await (receipt.events.filter(
                event => event.eventSignature == membershipManagerInstance.interface.events.MembershipWithdrawn.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.member,
                userAccount.wallet.address,
                "Incorrect member emitted"
            )
            assert.ok(
                event.args.tokensWithdrawn.eq(requiredTokensBN),
                "Incorrect tokens staked emitted"
            )
        })
        it("Fails to withdraw tokens from membership when none available", async () => {
            try {
                await (await membershipManagerInstance.from(utilityAccount).withdrawMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        });

    })

    describe("Utility interactions", () => {
        it("Issues the reputation reward", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);

            assert.ok(
                reward.eq(0),
                "Reward not initialized correctly"
            )

            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            assert.ok(membershipState[1].eq(0), "Reputation not 0")

            let state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
        
            assert.equal(state, true, "Utility not registered");

            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
            ).wait();

            reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
          
            assert.ok(
                reward.eq(membershipSettings.registeredEvents[0].reward),
                "Reward not set correctly"
            )

            await (await membershipManagerInstance
                .from(utilityAccount)
                .issueReputationReward(userAccount.wallet.address, membershipSettings.registeredEvents[0].id))
                    .wait();

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            assert.ok(membershipState[1].eq(membershipSettings.registeredEvents[0].reward), "Reputation not increased")
        })
        it("Fails to issue reputation rewards from non-utility", async () => {
            try{
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                let reward = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
    
                assert.ok(
                    reward.eq(0),
                    "Reward not initialized correctly"
                )
    
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                assert.ok(membershipState[1].eq(0), "Reputation not 0")
    
                let state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
            
                assert.equal(state, true, "Utility not registered");
    
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
                ).wait();
    
                reward = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
              
                assert.ok(
                    reward.eq(membershipSettings.registeredEvents[0].reward),
                    "Reward not set correctly"
                )

                await (await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .issueReputationReward(userAccount.wallet.address, membershipSettings.registeredEvents[0].id))
                        .wait();
                        assert.fail("Unauthorised access went through")
                }
            catch(error){

            }
        })
        it("Locks commitment", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );

            let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
            
            assert.ok(
                utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Utility's tokens does not match up to tokens take from user"
            )


            let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
            
            assert.ok(
                memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Record of users contribution not recorded correctly"
            )
        })
        it("Fails to lock commitment from non-utility", async () => {
            try {
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                const state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
                
                assert.equal(state, true, "Utility not registered");
    
                const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
                const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
                
                const totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );
    
                await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                
                const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
    
                assert.ok(
                    requiredTokensBN.eq(membershipState[2]),
                    "Tokens were not transfered"
                )
    
                assert.ok(
                    membershipBalance.eq(membershipState[2]),
                    "Tokens were not transfered correctly"
                )
    
                await membershipManagerInstance
                    .from(userAccount)
                    .lockCommitment(
                        userAccount.wallet.address, 
                        0, 
                        ethers.utils.parseUnits("5", 18)
                    )
    
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        })
        it("Unlocks commitment", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );

            let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
            
            assert.ok(
                utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Utility's tokens does not match up to tokens take from user"
            )


            let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
            
            assert.ok(
                memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Record of users contribution not recorded correctly"
            )

            await (
                await membershipManagerInstance
                    .from(utilityAccount)
                    .unlockCommitment(userAccount.wallet.address, 0, 0)
            ).wait()

            memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
            
            assert.ok(
                memberUtilityStake.eq(0),
                "Contribution not updated"
            )

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.eq(membershipState[2]),
                "Available stake not updated correctly"
            );

        })
        it("Fails to unlock commitment from non-utility", async () =>{
            try {
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                const state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
                
                assert.equal(state, true, "Utility not registered");
    
                const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
                const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
                
                const totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );
    
                await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                
                const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
    
                assert.ok(
                    requiredTokensBN.eq(membershipState[2]),
                    "Tokens were not transfered"
                )
    
                assert.ok(
                    membershipBalance.eq(membershipState[2]),
                    "Tokens were not transfered correctly"
                )
    
                await membershipManagerInstance
                    .from(utilityAccount)
                    .lockCommitment(
                        userAccount.wallet.address, 
                        0, 
                        ethers.utils.parseUnits("5", 18)
                    )
    
                const previousAvailableMembership = membershipState[2];
    
                membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
    
                assert.ok(
                    previousAvailableMembership.gt(membershipState[2]),
                    "Available stake not updated correctly"
                );
    
                let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
                
                assert.ok(
                    utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                    "Utility's tokens does not match up to tokens take from user"
                )
    
    
                let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
                
                assert.ok(
                    memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                    "Record of users contribution not recorded correctly"
                )
    
                await (
                    await membershipManagerInstance
                        .from(userAccount)
                        .unlockCommitment(userAccount.wallet.address, 0)
                ).wait()
    
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        })
        it("Manually transfers tokens from pool to target member", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            let membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );

            let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
            
            assert.ok(
                utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Utility's tokens does not match up to tokens take from user"
            )


            let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
            
            assert.ok(
                memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Record of users contribution not recorded correctly"
            )

            // Focus of the test

            await (
                await membershipManagerInstance
                    .from(utilityAccount)
                    .manualTransfer(memberUtilityStake, 0, userAccount.wallet.address)
            ).wait()

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.eq(membershipState[2]),
                "Tokens not returned"
            )
        })
        it("Fails to manually transfer from non-utility", async () =>{
            try {
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                const state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
                
                assert.equal(state, true, "Utility not registered");
    
                const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
                const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
                
                const totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );
    
                await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                
                let membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
    
                assert.ok(
                    requiredTokensBN.eq(membershipState[2]),
                    "Tokens were not transfered"
                )
    
                assert.ok(
                    membershipBalance.eq(membershipState[2]),
                    "Tokens were not transfered correctly"
                )
    
                await membershipManagerInstance
                    .from(utilityAccount)
                    .lockCommitment(
                        userAccount.wallet.address, 
                        0, 
                        ethers.utils.parseUnits("5", 18)
                    )
    
                const previousAvailableMembership = membershipState[2];
    
                membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
    
                assert.ok(
                    previousAvailableMembership.gt(membershipState[2]),
                    "Available stake not updated correctly"
                );
    
                let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
                
                assert.ok(
                    utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                    "Utility's tokens does not match up to tokens take from user"
                )
    
    
                let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
                
                assert.ok(
                    memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                    "Record of users contribution not recorded correctly"
                )
    
                // Focus of the test
    
                await (await membershipManagerInstance
                    .from(userAccount)
                    .manualTransfer(memberUtilityStake, 0, userAccount.wallet.address)
                )
    
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        })
    })

    describe("System checks", () => {
        it("Disabling for migration works as expected" , async () => {
            await (
                await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .disableForMigration()
            )

            try {
               
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                const state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
                
                assert.equal(state, true, "Utility not registered");
    
                const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
                const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
                
                const totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );
    
                await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                
                const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
    
                assert.ok(
                    requiredTokensBN.eq(membershipState[2]),
                    "Tokens were not transfered"
                )
    
                assert.ok(
                    membershipBalance.eq(membershipState[2]),
                    "Tokens were not transfered correctly"
                )

                await (
                    await membershipManagerInstance
                        .from(communityCreatorAccount)
                        .disableForMigration()
                )
                    
                await membershipManagerInstance
                    .from(utilityAccount)
                    .lockCommitment(
                        userAccount.wallet.address, 
                        0, 
                        ethers.utils.parseUnits("5", 18)
                    )

                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
            // Stake#
            try {
               
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                const state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
                
                assert.equal(state, true, "Utility not registered");
    
                const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
                const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
                
                const totalSupply = ethers.utils.formatUnits(
                    await tokenManagerInstance.from(
                        userAccount.wallet.address
                        ).totalSupply(),
                    18
                );

                await (
                    await membershipManagerInstance
                        .from(communityCreatorAccount)
                        .disableForMigration()
                )
    
                await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
                
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                
                const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
    
                assert.ok(
                    requiredTokensBN.eq(membershipState[2]),
                    "Tokens were not transfered"
                )
    
                assert.ok(
                    membershipBalance.eq(membershipState[2]),
                    "Tokens were not transfered correctly"
                )

               
                    
                await membershipManagerInstance
                    .from(utilityAccount)
                    .lockCommitment(
                        userAccount.wallet.address, 
                        0, 
                        ethers.utils.parseUnits("5", 18)
                    )

                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }

            // Issue
            try {
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .addUtility(membershipSettings.utilityAddress)
                ).wait();
    
                let reward = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
    
                assert.ok(
                    reward.eq(0),
                    "Reward not initialized correctly"
                )
    
                let membershipState = await membershipManagerInstance
                    .from(userAccount)
                    .getMembershipStatus(userAccount.wallet.address);
                assert.ok(membershipState[1].eq(0), "Reputation not 0")
    
                let state = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .isRegistered(membershipSettings.utilityAddress);
            
                assert.equal(state, true, "Utility not registered");
    
                await (
                    await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .setReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
                ).wait();
    
                reward = await membershipManagerInstance
                    .from(communityCreatorAccount)
                    .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
              
                assert.ok(
                    reward.eq(membershipSettings.registeredEvents[0].reward),
                    "Reward not set correctly"
                )
                await (
                    await membershipManagerInstance
                        .from(communityCreatorAccount)
                        .disableForMigration()
                )
                await (await membershipManagerInstance
                    .from(utilityAccount)
                    .issueReputationReward(userAccount.wallet.address, membershipSettings.registeredEvents[0].id))
                        .wait();
                assert.fail("Unauthorised access went through")
            }
            catch(error){

            }
        })
    })

    describe("Meta data view tests", async () => {
        it("Gets membership status", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );
            assert.ok(membershipState.length == 3, "Incorrect amount of fields");
        })
        it("Returns the token manager", async () => {
            const tokenManager = await membershipManagerInstance
                .from(communityCreatorAccount.wallet.address)
                .tokenManager();
            assert.equal(
                tokenManager,
                tokenManagerInstance.contract.address
            )
        })
        it("Returns utility item total stake", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );
            // Focus of the test: 

            let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
            
            assert.ok(
                utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Utility's tokens does not match up to tokens take from user"
            )
        })
        it("Returns members contribution to utility item", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");

            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );

            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
            
            let membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);
            
            const membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);

            assert.ok(
                requiredTokensBN.eq(membershipState[2]),
                "Tokens were not transfered"
            )

            assert.ok(
                membershipBalance.eq(membershipState[2]),
                "Tokens were not transfered correctly"
            )

            await membershipManagerInstance
                .from(utilityAccount)
                .lockCommitment(
                    userAccount.wallet.address, 
                    0, 
                    ethers.utils.parseUnits("5", 18)
                )

            const previousAvailableMembership = membershipState[2];

            membershipState = await membershipManagerInstance
                .from(userAccount)
                .getMembershipStatus(userAccount.wallet.address);

            assert.ok(
                previousAvailableMembership.gt(membershipState[2]),
                "Available stake not updated correctly"
            );

            let utilityStake = await membershipManagerInstance.from(userAccount).getUtilityStake(utilityAccount.wallet.address, 0);
            
            assert.ok(
                utilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Utility's tokens does not match up to tokens take from user"
            )
            // Focus of the test: 

            let memberUtilityStake = await membershipManagerInstance.from(userAccount).getMemberUtilityStake(utilityAccount.wallet.address, userAccount.wallet.address, 0);
            
            assert.ok(
                memberUtilityStake.eq(previousAvailableMembership.sub(membershipState[2])),
                "Record of users contribution not recorded correctly"
            )
        })
        it("Checks the state of a utility", async () => {
            const beforeRegistering = await membershipManagerInstance.from(userAccount).isRegistered(utilityAccount.wallet.address);

            assert.ok(beforeRegistering == false, "Utility registered");

            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            const state = await membershipManagerInstance
                .from(communityCreatorAccount)
                .isRegistered(membershipSettings.utilityAddress);
            
            assert.equal(state, true, "Utility not registered");


            const afterRegistering = await membershipManagerInstance.from(userAccount).isRegistered(utilityAccount.wallet.address);
            assert.ok(afterRegistering, "Utility registered");

        })
    })
})