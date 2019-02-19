const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');

const communitySettings = {
    name: "Community 1",
    symbol: "COM1",
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
            proteaAdmin.wallet.address
        );
    });

    describe('Deployment', async () => {
        it('Creates a community', async () => {
            const txReceipt = await(await communityFactoryInstance
                .from(communityCreatorAccount)
                .createCommunity(
                    communitySettings.name,
                    communitySettings.symbol,
                    communityCreatorAccount.wallet.address,
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
});