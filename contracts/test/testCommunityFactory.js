const web3Abi = require('web3-eth-abi');

var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
var CommunityFactory = artifacts.require('./CommunityFactory.sol');

contract('Community factory', accounts => {
    adminAddress = accounts[0];
    communityCreatorAddress = accounts[1];
    anotherCommunityCreatorAddress = accounts[2];

    beforeEach('', async () => {
        pseudoDaiToken = await PseudoDaiToken.new("DAI", "DAI", 18);
        communityFactory = await CommunityFactory.new(pseudoDaiToken.address);
    });

    describe('Checking the creation of a community', async () => {
        it('Checking the creating of a community', async () => {
            await communityFactory.createCommunity(
                "The community",
                "community",
                "com",
                {from: communityCreatorAddress}
            );
            let communityDetails = await communityFactory.getCommunity(1);
            assert.equal(communityDetails[0], "The community", "The community has the right name");
            assert.equal(
                communityDetails[1],
                communityCreatorAddress,
                "The community owner is correct"
            );
        });

        it('Checking the returning of communities', async () => {
            await communityFactory.createCommunity(
                "The community",
                "community",
                "com",
                {from: communityCreatorAddress}
            );
            let communityDetails = await communityFactory.getCommunity(1);
            assert.equal(communityDetails[0], "The community", "The community has the right name");
            assert.equal(
                communityDetails[1],
                communityCreatorAddress,
                "The community owner is correct"
            );

            await communityFactory.createCommunity(
                "The community mark2",
                "community2",
                "com2",
                {from: anotherCommunityCreatorAddress}
            );
            let communityDetails2 = await communityFactory.getCommunity(2);
            assert.equal(communityDetails2[0], "The community mark2", "The community has the right name");
            assert.equal(
                communityDetails2[1],
                anotherCommunityCreatorAddress,
                "The community owner is correct"
            );

            let allCommunitiesIndex = await communityFactory.getAllCommunityIndexes();
            assert.equal(allCommunitiesIndex[0].toNumber(), 1, "The first community is at 1");
            assert.equal(allCommunitiesIndex[1].toNumber(), 2, "The first community is at 1");
        });
    });
});