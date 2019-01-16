const web3Abi = require('web3-eth-abi');

var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
var CommunityFactory = artifacts.require('./CommunityFactory.sol');


const communitySettings = {
    name: "Community 1",
    symbol: "COM1",

}
// TODO: Remove magic strings
contract('Community factory', accounts => {
    adminAddress = accounts[0];
    communityCreatorAddress = accounts[1];
    anotherCommunityCreatorAddress = accounts[2];

    beforeEach('', async () => {
        pseudoDaiToken = await PseudoDaiToken.new("DAI", "DAI", 18);
        communityFactory = await CommunityFactory.new(pseudoDaiToken.address);
    });

    describe('Deployment', async () => {
        it('Creates a community', async () => {
            await communityFactory.createCommunity(
                communitySettings.name,
                communitySettings.symbol,
                {from: communityCreatorAddress}
            );
            let communityDetails = await communityFactory.getCommunity(0);
            assert.equal(
                communityDetails[0], 
                communitySettings.name, 
                "The community has the right name"
            );
            assert.equal(
                communityDetails[1],
                communityCreatorAddress,
                "The community owner is correct"
            );
        });

        it('returns a community', async () => {
            await communityFactory.createCommunity(
                communitySettings.name,
                communitySettings.symbol,
                {from: communityCreatorAddress}
            );
            let communityDetails = await communityFactory.getCommunity(0);
            assert.equal(
                communityDetails[0],
                communitySettings.name, 
                "The community has the right name");
            assert.equal(
                communityDetails[1],
                communityCreatorAddress,
                "The community owner is correct"
            );

            await communityFactory.createCommunity(
                `Not${communitySettings.name}`,
                `Not${communitySettings.symbol}`,
                {from: anotherCommunityCreatorAddress}
            );
            let communityDetails2 = await communityFactory.getCommunity(1);
            assert.equal(communityDetails2[0], 
                `Not${communitySettings.name}`,
                "The community has the right name");
            assert.equal(
                communityDetails2[1],
                anotherCommunityCreatorAddress,
                "The community owner is correct"
            );
        });
    });
});