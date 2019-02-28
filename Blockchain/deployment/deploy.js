require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../build/CommunityFactoryV1.json');

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

const defaultConfigs = {
    gasPrice: 20000000000,
    gasLimit: 4700000
}

const deploy = async (network, secret) => {
	if(!secret){
		secret = PRIVATE_KEY;
	}
	let deployer;
	switch(network){
		case "rinkeby":{
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, defaultConfigs);
			break;
		}
		case "devnet": {
			deployer = new etherlime.EtherlimeDevnetDeployer();
			break;
		}
		case "ganache":{
			deployer = new etherlime.EtherlimeGanacheDeployer();
			break;
		}
	}
	let pseudoDaiInstance = await deployer.deploy(
		PseudoDaiToken, 
		false, 
		daiSettings.name, 
		daiSettings.symbol, 
		daiSettings.decimals
	);
	let communityFactoryInstance = await deployer.deploy(
		CommunityFactoryV1, 
		false, 
		pseudoDaiInstance.contract.address,
		deployer.wallet.address,
	);
	const accountCommunityFactoryInstance = communityFactoryInstance.contract.connect(deployer.wallet);
	const txReceipt = await(await communityFactoryInstance
		.createCommunity(
			communitySettings.name,
			communitySettings.symbol,
			deployer.wallet.address,
			communitySettings.gradientDemoninator,
			communitySettings.contributionRate
		)).wait();



};

module.exports = {
	deploy
};