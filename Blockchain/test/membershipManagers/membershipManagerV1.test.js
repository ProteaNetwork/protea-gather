const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var ITokenManager = require('../../build/ITokenManager.json');
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
    testingStakeValue: ethers.utils.parseUnits("10", 18)
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

        
    });

    describe("Admin management", () => {

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
        it("Adding utility emits event");
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
        it("Removing utility emits event");
        it("Sets the reputation reward", async () => {
            await (
                await membershipManagerInstance
                .from(communityCreatorAccount)
                .addUtility(membershipSettings.utilityAddress)
            ).wait();

            let reward = await membershipManagerInstance
                .from(communityCreatorAccount)
                .getReputationRewardEvent(membershipSettings.utilityAddress, membershipSettings.registeredEvents[0].id);
            assert.equal(
                parseFloat(ethers.utils.formatUnits(reward, 0)),
                0,
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
          
            assert.equal(
                parseFloat(ethers.utils.formatUnits(reward, 0)),
                membershipSettings.registeredEvents[0].reward,
                "Reward not set correctly"
            )
        })

        it("Setting reputation emits event");
    })

    describe("Membership management", () => {
        it("Adds tokens to membership", async () => {
            const balanceBN = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
            const requiredTokensBN = await tokenManagerInstance.from(userAccount).colateralToTokenSelling(membershipSettings.testingStakeValue);
            console.log(ethers.utils.formatUnits(requiredTokensBN,18))
            const totalSupply = ethers.utils.formatUnits(
                await tokenManagerInstance.from(
                    userAccount.wallet.address
                    ).totalSupply(),
                18
            );
            console.log(totalSupply)
            await (await membershipManagerInstance.from(userAccount).stakeMembership(membershipSettings.testingStakeValue, userAccount.wallet.address)).wait();

        })
        it("Withdraws tokens from membership")

    })

    describe("Utility interactions", () => {
        it("Issues the reputation reward")
        it("Locks commitment")
        it("Unlocks commitment")
        it("Manually transfers tokens from pool to target member")

    })

    describe("System checks", () => {
        it("Disabling for migration works as expected")
    })

    describe("Meta data view tests", async () => {
        it("Gets membership status")
        it("Gets reputation of member")
        it("Returns the token manager", async () => {
            const tokenManager = await membershipManagerInstance
                .from(communityCreatorAccount.wallet.address)
                .tokenManager();
            assert.equal(
                tokenManager,
                tokenManagerInstance.contract.address
            )
        })
        it("Returns utility data")
        it("Returns utility item data")
        it("Returns members contribution to utility item")
        it("Checks the state of a utility")
    })
})