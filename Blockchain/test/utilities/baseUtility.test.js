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
var BaseUtility = require('../../build/BaseUtility.json');

const eventManagerSettings = {
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


describe('Base utilty test', () => {
    let deployer;
    let proteaAdmin = devnetAccounts[0];
    let userAccount = devnetAccounts[1];
    let communityCreatorAccount = devnetAccounts[2];
    let utilityAccount = devnetAccounts[3];
    membershipSettings.utilityAddress = utilityAccount.wallet.address;
    let baseUtilityInstance, membershipManagerInstance, tokenManagerInstance, pseudoDaiInstance, communityFactoryInstance;
  
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

        baseUtilityInstance = await deployer.deploy(
            BaseUtility, 
            false, 
            tokenManagerInstance.contract.address,
            membershipManagerInstance.contract.address,
            communityCreatorAccount.wallet.address
        );

        await (
            await membershipManagerInstance
            .from(communityCreatorAccount)
            .addUtility(baseUtilityInstance.wallet.address)
        ).wait();

        await (
            await membershipManagerInstance
            .from(communityCreatorAccount)
            .setReputationRewardEvent(baseUtilityInstance.wallet.address, membershipSettings.registeredEvents[0].id, membershipSettings.registeredEvents[0].reward)
        ).wait();

        let reward = await membershipManagerInstance
            .from(communityCreatorAccount)
            .getReputationRewardEvent(baseUtilityInstance.wallet.address, membershipSettings.registeredEvents[0].id);
          
        assert.ok(
            reward.eq(membershipSettings.registeredEvents[0].reward),
            "Reward not set correctly"
        )
    });

    describe("Deployment checks", () => {
        it("Has the token manager set after initialization", async () => {
            const tokenManager = await baseUtilityInstance.from(userAccount).tokenManager();
            assert.equal(tokenManager, tokenManagerInstance.contractAddress, "Token manager not set")
        })     

        it("Has the membership manager set after initialization", async () => {
            const membershipManager = await baseUtilityInstance.from(userAccount).membershipManager();
            assert.equal(membershipManager, membershipManagerInstance.contractAddress, "Membership manager not set")
        })     
    })

    describe("Admin controls", () => {
        it("Adds new admin", async () => {
            let userAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(userAccount.wallet.address);
            assert(!userAdmin, "User already admin");

            const receipt = await (
                await baseUtilityInstance
                    .from(communityCreatorAccount)
                    .addAdmin(userAccount.wallet.address)
            ).wait();
            userAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(userAccount.wallet.address);
            assert(userAdmin, "User not admin");
        })

        it("Removes old admin", async () => {
            let userAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(userAccount.wallet.address);
            assert(!userAdmin, "User already admin");

            let firstAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(communityCreatorAccount.wallet.address);
            assert(firstAdmin, "Creator not admin");

            await (
                await baseUtilityInstance
                    .from(communityCreatorAccount)
                    .addAdmin(userAccount.wallet.address)
            ).wait();

            userAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(userAccount.wallet.address);
            assert(userAdmin, "User not admin");
            

            await (
                await baseUtilityInstance
                    .from(userAccount)
                    .removeAdmin(communityCreatorAccount.wallet.address)
            ).wait();

            firstAdmin = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(communityCreatorAccount.wallet.address);
            assert(!firstAdmin, "Creator still admin");
        })
        it("Checks if admin", async () => {
            let adminStatus = await baseUtilityInstance
                .from(communityCreatorAccount)
                .isAdmin(communityCreatorAccount.wallet.address);
            assert(adminStatus, "Creator not admin");
        })
    })

    describe("Meta data", () =>{
        it("Returns index of activites", async () => {
            const index = await baseUtilityInstance
                .from(communityCreatorAccount)
                .index()
            assert.equal(index, 0, "Index not returned");
        })
    })
});
