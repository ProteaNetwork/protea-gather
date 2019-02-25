const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');
var BasicLinearTokenManagerFactory = require('../../build/BasicLinearTokenManagerFactory.json');
var MembershipManagerV1Factory = require('../../build/MembershipManagerV1Factory.json');
var EventManagerV1Factory = require('../../build/EventManagerV1Factory.json');

const communitySettings = {
    name: "Community 1",
    symbol: "COM1",
    gradientDemoninator: 2000, // Unused but required for the interface
    contributionRate: (ethers.utils.parseUnits("0.1", 18)).toHexString()
}
const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

describe('Community factory', () => {
    let deployer;
    let proteaAdmin = devnetAccounts[0];
    let adminAccount = devnetAccounts[1];
    let communityCreatorAccount = devnetAccounts[2];
    let anotherCommunityCreatorAccount = devnetAccounts[3];

    let communityFactoryInstance, pseudoDaiInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeDevnetDeployer(adminAccount.secretKey);
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
            .from(adminAccount.wallet.address)
            .initialize(
                [
                    tokenManagerFactoryInstance.contract.address,
                    membershipManagerFactoryInstance.contract.address,
                    eventManagerFactoryInstance.contract.address
                ]
            )).wait();
    });

    describe('Deployment', async () => {
        it('Creates a community', async () => {
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
            assert.equal(
                communityDetails[0], 
                communitySettings.name, 
                "The community has the wrong name"
            );
            assert.equal(
                communityDetails[1],
                communityCreatorAccount.wallet.address,
                "The community owner is incorrect"
            );
        });

        it('returns a community', async () => {
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
            assert.equal(
                communityDetails[0],
                communitySettings.name, 
                "The community has the wrong name");
            assert.equal(
                communityDetails[1],
                communityCreatorAccount.wallet.address,
                "The community owner is incorrect"
            );

            const txReceipt2 = await(await communityFactoryInstance
                .from(anotherCommunityCreatorAccount)
                .createCommunity(
                    `Not${communitySettings.name}`,
                    `Not${communitySettings.symbol}`,
                    anotherCommunityCreatorAccount.wallet.address,
                    communitySettings.gradientDemoninator,
                    communitySettings.contributionRate
                )).wait();

            let communityDetails2 = await communityFactoryInstance
                .from(anotherCommunityCreatorAccount.wallet.address)
                .getCommunity(1);

            assert.equal(communityDetails2[0], 
                `Not${communitySettings.name}`,
                "The community has the wrong name");
                
            assert.equal(
                communityDetails2[1],
                anotherCommunityCreatorAccount.wallet.address,
                "The community owner is incorrect"
            );
        });
    });
    
    describe("Admin controls", () => {
        it("Sets the token manager factory");
        it("Sets the membership manager factory");
        it("Sets the event manager factory");
    })
});