const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../../../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../../../../build/CommunityFactoryV1.json');
var MembershipManagerV1 = require('../../../../build/MembershipManagerV1.json');
var BasicLinearTokenManagerFactory = require('../../../../build/BasicLinearTokenManagerFactory.json');
var BasicLinearTokenManager = require('../../../../build/BasicLinearTokenManager.json');
var MembershipManagerV1Factory = require('../../../../build/MembershipManagerV1Factory.json');
var MembershipManagerV1 = require('../../../../build/MembershipManagerV1.json');
var EventManagerV1 = require('../../../../build/EventManagerV1.json');
var EventManagerV1Factory = require('../../../../build/EventManagerV1Factory.json');


const eventManagerSettings = {
    eventData: [
        {
            name: "Test event",
            maxAttendees: 0,
            requiredDai: ethers.utils.parseUnits("2", 18)
        }
    ]
}

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


describe('Event Manager', () => {
    let deployer;
    let proteaAdmin = devnetAccounts[0];
    let userAccount = devnetAccounts[1];
    let communityCreatorAccount = devnetAccounts[2];
    let eventManagerInstance, membershipManagerInstance, tokenManagerInstance, pseudoDaiInstance, communityFactoryInstance;
  
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
        eventManagerInstance = await etherlime.ContractAtDevnet(EventManagerV1, communityDetails[4][0]);

        await (
            await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(eventManagerInstance.contract.address)
        ).wait()

        const stateOfUtil = await membershipManagerInstance
            .from(communityCreatorAccount)
            .isRegistered(eventManagerInstance.contract.address);

        assert.equal(stateOfUtil, true, "Utility not registered")

        await (
            await membershipManagerInstance
                .from(communityCreatorAccount)
                .setReputationRewardEvent(
                    eventManagerInstance.contract.address,
                    0,
                    membershipSettings.registeredEvents[0].reward
                )
        ).wait()


        // Setting up community creator
        let tokensForDai = await tokenManagerInstance
            .from(communityCreatorAccount.wallet.address)
            .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));
        
        let userPDAIBalance = await pseudoDaiInstance
            .from(
                communityCreatorAccount.wallet.address
            ).balanceOf(
                communityCreatorAccount.wallet.address
            );
        
        await pseudoDaiInstance.from(communityCreatorAccount.wallet.address).mint();

        await pseudoDaiInstance.from(communityCreatorAccount.wallet.address)
            .approve(
                tokenManagerInstance.contract.address,
                ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
            );
        

        let approvedAmount = await pseudoDaiInstance
            .from(communityCreatorAccount.wallet.address)
            .allowance(
                communityCreatorAccount.wallet.address,
                tokenManagerInstance.contract.address
            );

        assert.equal(
            approvedAmount.toString(), 
            ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18).toString(),
            "The contract has the incorrect PDAI allowance"
        );

        await tokenManagerInstance
            .from(communityCreatorAccount.wallet.address)
            .mint(
                communityCreatorAccount.wallet.address, 
                tokensForDai
        );

        let communityManagerTokenBalance = await tokenManagerInstance
            .from(communityCreatorAccount.wallet.address)
            .balanceOf(
                communityCreatorAccount.wallet.address
        );

        let communityManagerPDAIBalanceAfter = await pseudoDaiInstance
            .from(communityCreatorAccount.wallet.address)
            .balanceOf(
                communityCreatorAccount.wallet.address
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
            communityManagerPDAIBalanceAfter.toString(),
            communityManagerTokenBalance.toString(),
            "Users PDAI has not decreased"
        );

        let onePercentContribution = ethers.utils.formatUnits(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18).div(101), 18);
        assert.equal(
            proteaPDAIBalanceAfter,
            onePercentContribution,
            "Contribution not sent correctly"
        )

        let requiredTokensBN = await tokenManagerInstance.from(communityCreatorAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);

        await (await membershipManagerInstance.from(communityCreatorAccount).stakeMembership(membershipSettings.testingStakeValue, communityCreatorAccount.wallet.address)).wait();
        
        let membershipState = await membershipManagerInstance
            .from(communityCreatorAccount)
            .getMembershipStatus(communityCreatorAccount.wallet.address);
        
        let membershipBalance = await tokenManagerInstance.from(communityCreatorAccount).balanceOf(membershipManagerInstance.contractAddress);
        assert.ok(
            requiredTokensBN.eq(membershipState[2]),
            "Tokens were not transfered"
        )
        assert.ok(
            membershipBalance.eq(membershipState[2]),
            "Tokens were not transfered correctly"
        )


        // Setting up users
        tokensForDai = await tokenManagerInstance
            .from(userAccount.wallet.address)
            .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));
        
        userPDAIBalance = await pseudoDaiInstance
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
        

        approvedAmount = await pseudoDaiInstance
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

        userPDAIBalanceAfter = await pseudoDaiInstance
            .from(userAccount.wallet.address)
            .balanceOf(
                userAccount.wallet.address
        )
        
        proteaPDAIBalanceAfter = ethers.utils.formatUnits(
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

        requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);

        await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();
        
        membershipState = await membershipManagerInstance
            .from(userAccount)
            .getMembershipStatus(userAccount.wallet.address);
        
        membershipBalance = await tokenManagerInstance.from(userAccount).balanceOf(membershipManagerInstance.contractAddress);
        // assert.ok(
        //     requiredTokensBN.eq(membershipState[2]),
        //     "Tokens were not transfered"
        // )
        // assert.ok(
        //     membershipBalance.eq(membershipState[2]),
        //     "Tokens were not transfered correctly"
        // )

    });

    describe("Deployment checks", () => {
    })

    describe("Organiser controls", () => {
        it("Admin can create event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 1, "Event not created successfully")
            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
        })
        it("Only admin can create events", async () =>{
            try {
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .createEvent(
                            eventManagerSettings.eventData[0].name,
                            eventManagerSettings.eventData[0].maxAttendees,
                            communityCreatorAccount.wallet.address,
                            eventManagerSettings.eventData[0].requiredDai
                        )
                )
                assert.fail("Function executed")
            } catch (error) {
                
            }
        })
        it("Creating event emits event", async () => {
            const receipt = await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.EventCreated.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.index,
                0,
                "Incorrect index emitted"
            )
            assert.ok(
                event.args.publisher,
                communityCreatorAccount.wallet.address,
                "Event publisher incorrect"
            )
        })

        it("Organiser can change the max attendees", async () =>{
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 1, "Event not created successfully")
            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")

            const receipt = await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .changeParticipantLimit(
                        0,
                        2
                    )
            ).wait()

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);
            
            assert.equal(eventData[1], 2, "Max attendees not updated")

        })

        it("Organiser can only change max attendees before an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 1, "Event not created successfully")
            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();
            try {
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .changeParticipantLimit(
                            0,
                            2
                        )
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }

        })

        it("Organiser cant change max attendees to less than the amount of RSVPS", async () => {
            let secondUserAccount = devnetAccounts[3];
            await pseudoDaiInstance.from(secondUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(secondUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .mint(
                    secondUserAccount.wallet.address, 
                    tokensForDai
            )).wait();

         
            await (await membershipManagerInstance.from(secondUserAccount).stakeMembership(membershipSettings.testingStakeValue, secondUserAccount.wallet.address)).wait();
        
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
            
            assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            
            // Second account RSVP's
            await (
                await eventManagerInstance
                    .from(secondUserAccount)
                    .rsvp(0)
            ).wait()

            try {
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .changeParticipantLimit(
                            0,
                            1
                        )
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }

        })
        it("Only organiser can change max attendees", async () => {
            try{
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .createEvent(
                            eventManagerSettings.eventData[0].name,
                            eventManagerSettings.eventData[0].maxAttendees,
                            communityCreatorAccount.wallet.address,
                            eventManagerSettings.eventData[0].requiredDai
                        )
                )
    
                let eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[3], 1, "Event not created successfully")
                assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
    
                const receipt = await (
                    await eventManagerInstance
                        .from(userAccount)
                        .changeParticipantLimit(
                            0,
                            2
                        )
                ).wait()
                assert.fail("Function executed")
            }
            catch(error) {
                
            }
        })

        it("Organiser can start an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")
            
        })
        it("Starting an event emits an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            const receipt = await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();
            
            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.EventStarted.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.index,
                0,
                "Incorrect index emitted"
            )
            assert.ok(
                event.args.publisher,
                communityCreatorAccount.wallet.address,
                "Event publisher incorrect"
            )
        })
        it("Only organiser can start events", async () =>{
            try{
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .createEvent(
                            eventManagerSettings.eventData[0].name,
                            eventManagerSettings.eventData[0].maxAttendees,
                            communityCreatorAccount.wallet.address,
                            eventManagerSettings.eventData[0].requiredDai
                        )
                )
    
                let eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .startEvent(0)
                ).wait();
                assert.fail("Function executed")
            }
            catch(error) {

            }
        })

        it("Organiser can end an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .endEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 3, "Event not ended")
        })
        it("Ending an event emits an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")

            const receipt = await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .endEvent(0)
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.EventConcluded.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.publisher,
                communityCreatorAccount.wallet.address,
                "Incorrect organiser emitted"
            )
            assert.equal(
                event.args.state,
                3,
                "Event state incorrect"
            )
        })
        it("Only organiser can end events", async () => {
            try {
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .createEvent(
                            eventManagerSettings.eventData[0].name,
                            eventManagerSettings.eventData[0].maxAttendees,
                            communityCreatorAccount.wallet.address,
                            eventManagerSettings.eventData[0].requiredDai
                        )
                )
    
                let eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
                
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .startEvent(0)
                ).wait();
    
                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[3], 2, "Event not started")
    
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .endEvent(0)
                ).wait();
                assert.fail("Function executed")
            }
            catch(error){

            }
        })

        it("Organiser can cancel an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .cancelEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 4, "Event not cancelled")
            
        })
        it("Canceling an event emits an event", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            const receipt = await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .cancelEvent(0)
            ).wait();

            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.EventConcluded.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.publisher,
                communityCreatorAccount.wallet.address,
                "Incorrect organiser emitted"
            )
            assert.equal(
                event.args.state,
                4,
                "Event state incorrect"
            )
        })
        it("Only organiser can cancel an event", async () =>{
            try{
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .createEvent(
                            eventManagerSettings.eventData[0].name,
                            eventManagerSettings.eventData[0].maxAttendees,
                            communityCreatorAccount.wallet.address,
                            eventManagerSettings.eventData[0].requiredDai
                        )
                )
    
                let eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .cancelEvent(0)
                ).wait();
    
                assert.fail("Function executed")
            }
            catch(error){

            }
        })

        it("Organiser can confirm attendance of attendees", async () => {
            let secondUserAccount = devnetAccounts[3];
            await pseudoDaiInstance.from(secondUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(secondUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .mint(
                    secondUserAccount.wallet.address, 
                    tokensForDai
            )).wait();

         
            await (await membershipManagerInstance.from(secondUserAccount).stakeMembership(membershipSettings.testingStakeValue, secondUserAccount.wallet.address)).wait();
        
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
            
            assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            
            // Second account RSVP's
            await (
                await eventManagerInstance
                    .from(secondUserAccount)
                    .rsvp(0)
            ).wait()


            oldUtilityLockedPool = utilityLockedPool;
            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            // Confirming group
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .organiserConfirmAttendance(
                        0,
                        [
                            userAccount.wallet.address,
                            secondUserAccount.wallet.address
                        ]
                    )
            )
            
            let batchUserState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address,0)
            assert.equal(batchUserState, 99, "User not confirmed");

            batchUserState = await eventManagerInstance.from(userAccount).getUserState(secondUserAccount.wallet.address,0)
            assert.equal(batchUserState, 99, "User not confirmed");

        })
        it("Organiser cant confirm attendance of attendees when event hasn't started", async () =>{
            let secondUserAccount = devnetAccounts[3];
            await pseudoDaiInstance.from(secondUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(secondUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .mint(
                    secondUserAccount.wallet.address, 
                    tokensForDai
            )).wait();

         
            await (await membershipManagerInstance.from(secondUserAccount).stakeMembership(membershipSettings.testingStakeValue, secondUserAccount.wallet.address)).wait();
        
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
            
            assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            
            // Second account RSVP's
            await (
                await eventManagerInstance
                    .from(secondUserAccount)
                    .rsvp(0)
            ).wait()


            oldUtilityLockedPool = utilityLockedPool;
            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");
            // Confirming group
            try {
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .organiserConfirmAttendance(
                            0,
                            [
                                userAccount.wallet.address,
                                secondUserAccount.wallet.address
                            ]
                        )
                )
                assert.fail("Function executed")
            } catch (error) {
                
            }
        })
        it("Organiser cant confirm attendance of attendees have not registered", async () => {
            let secondUserAccount = devnetAccounts[3];
            await pseudoDaiInstance.from(secondUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(secondUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .mint(
                    secondUserAccount.wallet.address, 
                    tokensForDai
            )).wait();

         
            await (await membershipManagerInstance.from(secondUserAccount).stakeMembership(membershipSettings.testingStakeValue, secondUserAccount.wallet.address)).wait();
        
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
            
            assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
            
            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            // Confirming group
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .organiserConfirmAttendance(
                        0,
                        [
                            userAccount.wallet.address,
                            secondUserAccount.wallet.address
                        ]
                    )
            )
            
            let batchUserState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address,0)
            assert.equal(batchUserState, 0, "User incorrectly updated");

            batchUserState = await eventManagerInstance.from(userAccount).getUserState(secondUserAccount.wallet.address,0)
            assert.equal(batchUserState, 0, "User incorrectly updated");

        })
    })

    describe("Attendee controls", () => {
        let secondUserAccount = devnetAccounts[3];
        
        beforeEach(async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User state incorrect or invalid");


             // Second user
            await pseudoDaiInstance.from(secondUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(secondUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(secondUserAccount.wallet.address)
                .mint(
                    secondUserAccount.wallet.address, 
                    tokensForDai
            )).wait();

         
            await (await membershipManagerInstance.from(secondUserAccount).stakeMembership(membershipSettings.testingStakeValue, secondUserAccount.wallet.address)).wait();
        })
        it("User can RSVP for an event", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
 
             
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()
 
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");
 
            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
 
           
        })
        it("User RSVPing for an event emits an event", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
 
             
            const receipt = await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()
                
            
            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.MemberRegistered.signature))[0];
            
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
                event.args.memberIndex,
                0,
                "Event memberIndex incorrect"
            )
        })
        it("User can't RSVP an event that has started, canceled, ended or not created", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();
             
            try {
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .endEvent(0)
            ).wait();

            try {
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }

            try {
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(1)
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .cancelEvent(1)
            ).wait();

            try {
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(1)
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }
 
        })
        it("User can't RSVP if there is not enough available stake", async () => {
            let thirdUserAccount = devnetAccounts[4];
            await pseudoDaiInstance.from(thirdUserAccount.wallet.address).mint();

            let tokensForDai = await tokenManagerInstance
                .from(thirdUserAccount.wallet.address)
                .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));

            await pseudoDaiInstance.from(thirdUserAccount.wallet.address)
                .approve(
                    tokenManagerInstance.contract.address,
                    ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                );
            await (await tokenManagerInstance
                .from(thirdUserAccount.wallet.address)
                .mint(
                    thirdUserAccount.wallet.address, 
                    tokensForDai
            )).wait();
            await (await membershipManagerInstance.from(thirdUserAccount).stakeMembership(ethers.utils.parseUnits("1", 18), thirdUserAccount.wallet.address)).wait();

            try {
                 
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .rsvp(0)
                ).wait()
                assert.fail("Function executed")
            } catch (error) {
                
            }
        })

        it("User can cancel RSVP if event hasnt started", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()
             
            
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");
 
            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .cancelRsvp(0)
            ).wait()

            
            let postMemberstate = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            assert.ok(initialMemberState[2].eq(postMemberstate[2]), "Available balance not deducted")
            
        })
        it("User cancelling emits an event", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()
             
            
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");
 
            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
            
            const receipt = await (
                await eventManagerInstance
                    .from(userAccount)
                    .cancelRsvp(0)
            ).wait()
            
            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.MemberCancelled.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.member,
                userAccount.wallet.address,
                "Incorrect member emitted"
            )
        })
        
        it("User can confirm attendance", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")

            // Confirm

            await (
                await eventManagerInstance
                    .from(userAccount)
                    .confirmAttendance(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 99, "User not confirmed");

            // Check balances at end

            let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")


        })
        it("User confirming attendance emits event", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")

            // Confirm

            const receipt = await (
                await eventManagerInstance
                    .from(userAccount)
                    .confirmAttendance(0)
            ).wait()

            let event = await (receipt.events.filter(
                event => event.eventSignature == eventManagerInstance.interface.events.MemberAttended.signature))[0];
            
            assert.ok(
                event,
                "Event not found"
            )
            assert.equal(
                event.args.member,
                userAccount.wallet.address,
                "Incorrect member emitted"
            )
        })
        it("User confirming attendance increases reputation", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 2, "Event not started")

            // Confirm

            await (
                await eventManagerInstance
                    .from(userAccount)
                    .confirmAttendance(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 99, "User not confirmed");

            // Check balances at end

            let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")
            assert.ok(finalMemberState[1].gt(0), "Reputation not increased");
        })

        it("User can withdraw tokens from a cancelled event", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");

            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");

            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
            

            // Cancelling
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .cancelEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 4, "Event not cancelled")

            await (
                await eventManagerInstance
                    .from(userAccount)
                    .claimGift(
                        userAccount.wallet.address,
                        0
                    )
            ).wait()

            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 99, "User state not updated");

            let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            
            assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Available balance not deducted")

        });

        it("User cant confirm if not attending", async () => {
            try {
                // RSVP
                let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 0, "User already RSVP'd");

                // Get initial balance
                let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

                // Start 
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .startEvent(0)
                ).wait();

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                assert.equal(eventData[3], 2, "Event not started")

                // Confirm

                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .confirmAttendance(0)
                ).wait()

                assert.fail("Function executed")
            } catch (error) {
                
            }
        })
        it("User cant confirm if event is not active", async () => {
            try{
                // RSVP
                let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 0, "User already RSVP'd");

                // Get initial balance
                let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            

                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()

                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 1, "User not RSVP'd");

                let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                
                assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")

                // Confirm

                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .confirmAttendance(0)
                ).wait()

                assert.fail("Function executed")
            }
            catch(error){

            }
        })

        it("User can receive gift if attended and event ended", async () => {
            // RSVP
            let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 0, "User already RSVP'd");
 
            // Get initial balance
            let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
            
            assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
            
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()

            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");
 
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User not RSVP'd");
 
            let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
             
            assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
 
            
            // Second account RSVP's
            await (
                await eventManagerInstance
                    .from(secondUserAccount)
                    .rsvp(0)
            ).wait()


            oldUtilityLockedPool = utilityLockedPool;
            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

            // Start 
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .startEvent(0)
            ).wait();
 
            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);
 
            assert.equal(eventData[3], 2, "Event not started")
 
            // Confirm
 
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .confirmAttendance(0)
            ).wait()
 
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 99, "User not confirmed");

            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            // Check balances at end
 
            let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")

            // End event

            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .endEvent(0)
            ).wait();

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[3], 3, "Event not ended")

            eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            // Sorting out gift
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .claimGift(userAccount.wallet.address, 0)
            ).wait()

            let postGiftMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
            assert.ok(postGiftMemberState[2].gt(initialMemberState[2]), "Gift not issued")

            // Check that utility pool empty
            utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

            assert.ok(utilityLockedPool.eq(0), "Tokens remaining in utility");
        })

        describe("Gifts distributed evently", () => {
            let thirdUserAccount = devnetAccounts[4];
            let fourthUser = devnetAccounts[5];
            let fifthUser = devnetAccounts[6];
            let sixthUser = devnetAccounts[7];
            let seventhUser = devnetAccounts[8];
            beforeEach(async () => {
                // Third user
                await pseudoDaiInstance.from(thirdUserAccount).mint();
                await pseudoDaiInstance.from(fourthUser).mint();
                await pseudoDaiInstance.from(fifthUser).mint();
                await pseudoDaiInstance.from(sixthUser).mint();
                await pseudoDaiInstance.from(seventhUser).mint();

                for(let i = 0; i < 5; i++){
                    tokensForDai = await tokenManagerInstance
                        .from(devnetAccounts[i + 4].wallet.address)
                        .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));
                    
                    await pseudoDaiInstance.from(devnetAccounts[i + 4].wallet.address)
                        .approve(
                            tokenManagerInstance.contract.address,
                            ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)
                        );

                    await (await tokenManagerInstance
                        .from(devnetAccounts[i + 4].wallet.address)
                        .mint(
                            devnetAccounts[i + 4].wallet.address, 
                            tokensForDai
                    )).wait();
                    await (
                        await membershipManagerInstance
                            .from(devnetAccounts[i + 4])
                            .stakeMembership(
                                membershipSettings.testingStakeValue, 
                                devnetAccounts[i + 4].wallet.address
                            )
                    ).wait();

                }
            })

            it("Splits evenly between 2 attending members with 1 absent", async () => {
                // RSVP
                let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 0, "User already RSVP'd");
    
                // Get initial balance
                let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
                
                assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 1, "User not RSVP'd");
    
                let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                
                assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
    
                
                // Second account RSVP's
                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .rsvp(0)
                ).wait()


                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Third account RSVP
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .rsvp(0)
                ).wait()


                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Start 
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .startEvent(0)
                ).wait();
    
                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[3], 2, "Event not started")
    
                // Confirm
    
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(secondUserAccount).getUserState(secondUserAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                // Check balances at end
    
                let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")

                // End event

                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .endEvent(0)
                ).wait();

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                assert.equal(eventData[3], 3, "Event not ended")

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                // Sorting out gift
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .claimGift(userAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .claimGift(secondUserAccount.wallet.address, 0)
                ).wait()

                let postGiftMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(postGiftMemberState[2].gt(initialMemberState[2]), "Gift not issued")

                 // Division had some remaining tokens, so manually transfering them
                 await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .emptyActivitySlot(0, communityCreatorAccount.wallet.address)
                ).wait();
                // Check that utility pool empty
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
               
                assert.ok(utilityLockedPool.eq(0), "Tokens remaining in utility");
            })

            it("Splits evenly between 3 attending members with 1 absent", async () => {
                
                // RSVP
                let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 0, "User already RSVP'd");
    
                // Get initial balance
                let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
                
                assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 1, "User not RSVP'd");
    
                let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                
                assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
    
                
                // Second account RSVP's
                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .rsvp(0)
                ).wait()


                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Third account RSVP
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .rsvp(0)
                ).wait()

                // Fourth account RSVP
                await (
                    await eventManagerInstance
                        .from(fourthUser)
                        .rsvp(0)
                ).wait()


                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Start 
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .startEvent(0)
                ).wait();
    
                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[3], 2, "Event not started")
    
                // Confirm
                // First
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");
                
                // Second
                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(secondUserAccount).getUserState(secondUserAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                // Third
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(thirdUserAccount).getUserState(thirdUserAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);


                // Check balances at end
    
                let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")

                // End event

                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .endEvent(0)
                ).wait();

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                assert.equal(eventData[3], 3, "Event not ended")

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                // Sorting out gift
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .claimGift(userAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .claimGift(secondUserAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .claimGift(thirdUserAccount.wallet.address, 0)
                ).wait()


                let postGiftMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(postGiftMemberState[2].gt(initialMemberState[2]), "Gift not issued")

              
                // Division had some remaining tokens, so manually transfering them
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .emptyActivitySlot(0, communityCreatorAccount.wallet.address)
                ).wait();
                // Check that utility pool empty
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.eq(0), "Tokens remaining in utility");
            })

            it("Splits evenly between 5 attending members with 2 absent", async () => {
                
                // RSVP
                let userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 0, "User already RSVP'd");
    
                // Get initial balance
                let initialMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                let utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
                
                assert.ok(utilityLockedPool.eq(0), "Utility already interacted with");
                
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .rsvp(0)
                ).wait()

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(0), "Utility stake not updated");
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 1, "User not RSVP'd");
    
                let rsvpMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                
                assert.ok(initialMemberState[2].gt(rsvpMemberState[2]), "Available balance not deducted")
    
                
                // Second account RSVP's
                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .rsvp(0)
                ).wait()


                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Third account RSVP
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .rsvp(0)
                ).wait()

                // Fourth account RSVP
                await (
                    await eventManagerInstance
                        .from(fourthUser)
                        .rsvp(0)
                ).wait()

                // Fifth account RSVP
                await (
                    await eventManagerInstance
                        .from(fifthUser)
                        .rsvp(0)
                ).wait()

                // Sixth account RSVP
                await (
                    await eventManagerInstance
                        .from(sixthUser)
                        .rsvp(0)
                ).wait()

                 // Seventh account RSVP
                 await (
                    await eventManagerInstance
                        .from(seventhUser)
                        .rsvp(0)
                ).wait()

                oldUtilityLockedPool = utilityLockedPool;
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);

                assert.ok(utilityLockedPool.gt(oldUtilityLockedPool), "Utility stake not updated");

                // Start 
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .startEvent(0)
                ).wait();
    
                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);
    
                assert.equal(eventData[3], 2, "Event not started")
    
                // Confirm
                // First
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");
                
                // Second
                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .confirmAttendance(0)
                ).wait()
    
                userState = await eventManagerInstance.from(secondUserAccount).getUserState(secondUserAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                // Third
                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .confirmAttendance(0)
                ).wait()

                // Fourth
                 await (
                    await eventManagerInstance
                        .from(fourthUser)
                        .confirmAttendance(0)
                ).wait()

                // Fifth
                 await (
                    await eventManagerInstance
                        .from(fifthUser)
                        .confirmAttendance(0)
                ).wait()

                userState = await eventManagerInstance.from(thirdUserAccount).getUserState(thirdUserAccount.wallet.address, 0);
                assert.equal(userState, 99, "User not confirmed");

                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);


                // Check balances at end
    
                let finalMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(initialMemberState[2].eq(finalMemberState[2]), "Deposit not returned")

                // End event

                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .endEvent(0)
                ).wait();

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                assert.equal(eventData[3], 3, "Event not ended")

                eventData = await eventManagerInstance
                    .from(communityCreatorAccount)
                    .getEvent(0);

                // Sorting out gift
                await (
                    await eventManagerInstance
                        .from(userAccount)
                        .claimGift(userAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(secondUserAccount)
                        .claimGift(secondUserAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(thirdUserAccount)
                        .claimGift(thirdUserAccount.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(fourthUser)
                        .claimGift(fourthUser.wallet.address, 0)
                ).wait()

                await (
                    await eventManagerInstance
                        .from(fifthUser)
                        .claimGift(fifthUser.wallet.address, 0)
                ).wait()


                let postGiftMemberState = await membershipManagerInstance.from(userAccount).getMembershipStatus(userAccount.wallet.address);            
                assert.ok(postGiftMemberState[2].gt(initialMemberState[2]), "Gift not issued")

                // Division had some remaining tokens, so manually transfering them
                await (
                    await eventManagerInstance
                        .from(communityCreatorAccount)
                        .emptyActivitySlot(0, communityCreatorAccount.wallet.address)
                ).wait();

                // Check that utility pool empty
                utilityLockedPool = await membershipManagerInstance.from(userAccount).getUtilityStake(eventManagerInstance.contract.address, 0);
                assert.ok(utilityLockedPool.eq(0), "Tokens remaining in utility");
            })
        })
    })

    describe("Meta data", () =>{
        it("Returns the event data", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )

            let eventData = await eventManagerInstance
                .from(communityCreatorAccount)
                .getEvent(0);

            assert.equal(eventData[0], eventManagerSettings.eventData[0].name, "Event not created successfully")
            
        })
        it("Returns the user's current state", async () => {
            await (
                await eventManagerInstance
                    .from(communityCreatorAccount)
                    .createEvent(
                        eventManagerSettings.eventData[0].name,
                        eventManagerSettings.eventData[0].maxAttendees,
                        communityCreatorAccount.wallet.address,
                        eventManagerSettings.eventData[0].requiredDai
                    )
            )
            await (
                await eventManagerInstance
                    .from(userAccount)
                    .rsvp(0)
            ).wait()
 
            userState = await eventManagerInstance.from(userAccount).getUserState(userAccount.wallet.address, 0);
            assert.equal(userState, 1, "User state not returnning correctly");
        })
    })
});
