const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');

const eventManagerSettings = {
}

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

describe('Event Manager', () => {
    let deployer;
    let proteaAccount = devnetAccounts[0];
    let adminAccount = devnetAccounts[1];
    let userAccount = devnetAccounts[2];
    let tokenOwnerAccount = devnetAccounts[3];
    let communityDeployOwnerAccount = devnetAccounts[3];


    let tokenManagerInstance, 
    pseudoDaiInstance, 
    eventManagerInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeDevnetDeployer(adminAccount.secretKey);
        pseudoDaiInstance = await deployer.deploy(
            PseudoDaiToken, 
            false, 
            daiSettings.name, 
            daiSettings.symbol, 
            daiSettings.decimals
        );
        await pseudoDaiInstance.from(userAccount.wallet.address).mint(); // {from: userAccount}
    });

});
