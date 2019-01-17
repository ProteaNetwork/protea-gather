const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var CommunityFactory = require('../build/CommunityFactory.json');


const communitySettings = {
    name: "Community 1",
    symbol: "COM1",

}

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

describe('Community factory', () => {
    let deployer;
    let adminAccount = accounts[1];
    let communityCreatorAccount = accounts[2];
    let anotherCommunityCreatorAccount = accounts[3];

    let communityFactoryInstance, pseudoDaiInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(adminAccount.secretKey);
        pseudoDaiInstance = await deployer.deploy(PseudoDaiToken, false, daiSettings.name, daiSettings.symbol, daiSettings.decimals);
        communityFactoryInstance = await deployer.deploy(CommunityFactory, false, pseudoDaiInstance.contract.address);
    });

    describe('Deployment', async () => {
        it('Creates a community', async () => {
            await communityFactoryInstance.from(communityCreatorAccount)
                .createCommunity(
                    communitySettings.name,
                    communitySettings.symbol
                );
            let communityDetails = await communityFactoryInstance.from(communityCreatorAccount).getCommunity(0);
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
            await communityFactoryInstance.from(communityCreatorAccount).createCommunity(
                communitySettings.name,
                communitySettings.symbol
            );
            let communityDetails = await communityFactoryInstance.from(communityCreatorAccount).getCommunity(0);
            assert.equal(
                communityDetails[0],
                communitySettings.name, 
                "The community has the wrong name");
            assert.equal(
                communityDetails[1],
                communityCreatorAccount.wallet.address,
                "The community owner is incorrect"
            );

            await communityFactoryInstance.from(anotherCommunityCreatorAccount).createCommunity(
                `Not${communitySettings.name}`,
                `Not${communitySettings.symbol}`
            );
            let communityDetails2 = await communityFactoryInstance.from(anotherCommunityCreatorAccount).getCommunity(1);

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