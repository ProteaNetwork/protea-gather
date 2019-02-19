const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var ITokenManager = require('../../build/ITokenManager.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');

const communitySettings = {
    name: "community",
    symbol: "com",
    contributionRate: 10
}
const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

const defaultTokenVolume = 100;


describe('V1 Membership Manager', () => {
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
            proteaAdmin.wallet.address
        );

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

    describe('Deployment checks', async () => {

        
    });

    describe("Admin management", () => {

    })

    describe("Utility management", () => {
        it("Adds utility")
        it("Removes utility")
        it("Sets the reputation reward")
    })

    describe("Membership management", () => {
        it("Adds tokens to membership")
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
        it("Returns the token manager")
        it("Returns utility data")
        it("Returns utility item data")
        it("Returns members contribution to utility item")
        it("Checks the state of a utility")
    })
})