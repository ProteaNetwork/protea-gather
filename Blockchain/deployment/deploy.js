require('dotenv').config();
// yarn debug deploy --network=devnet --runs=999
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
// const DEPLOYER_MNEMONIC = process.env.DEPLOYER_MNEMONIC;
const DAI_ADDRESS = process.env.DAI_ADDRESS;
const PROTEA_ADDRESS = process.env.PROTEA_ADDRESS;

const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../build/CommunityFactoryV1.json');
var BasicLinearTokenManagerFactory = require('../build/BasicLinearTokenManagerFactory.json');
var BasicLinearTokenManagerFactoryV2 = require('../build/BasicLinearTokenManagerFactoryV2.json');
var MembershipManagerV1Factory = require('../build/MembershipManagerV1Factory.json');
var EventManagerV1Factory = require('../build/EventManagerV1Factory.json');

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

const defaultConfigs = {
    gasPrice: 20000000000,
    gasLimit: 4700000
}

const mainnetConfig = {
    gasPrice: 20000000000,
    gasLimit: 1430000
}

const goerliDefaultConfigs = {
    gasPrice: 20000000000,
    gasLimit: 4700000,
    chainId: 5 // Suitable for deploying on private networks like Quorum
}

const deploy = async (network, secret) => {
	if(!secret){
		secret = DEPLOYER_PRIVATE_KEY;
	}
	let deployer, proteaAdmin, daiAddress, communityFactoryInstance;
	
	switch(network){
		case "mainnet": {
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, mainnetConfig);
			deployer.defaultOverrides.gasLimit = 3264000;

			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	DAI_ADDRESS,
			// 	PROTEA_ADDRESS,
			// 	{gasLimit: 1231000}
			// );

			break;
		}
		case "goerli":{
			deployer = new etherlime.JSONRPCPrivateKeyDeployer(secret, "https://rpc.goerli.mudit.blog/", goerliDefaultConfigs)
			// let pseudoDaiInstance = await deployer.deploy(
			// 	PseudoDaiToken, 
			// 	false, 
			// 	daiSettings.name, 
			// 	daiSettings.symbol, 
			// 	daiSettings.decimals,
			// 	{gasLimit: 948421}
			// );
			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	pseudoDaiInstance.contract.address,
			// 	deployer.wallet.address,
			// 	{gasLimit: 1231000}
			// );
			break;
		}
		case "rinkeby":{
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, defaultConfigs);
			// let pseudoDaiInstance = await deployer.deploy(
			// 	PseudoDaiToken, 
			// 	false, 
			// 	daiSettings.name, 
			// 	daiSettings.symbol, 
			// 	daiSettings.decimals,
			// 	{gasLimit: 948421}
			// );
			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	pseudoDaiInstance.contract.address,
			// 	deployer.wallet.address,
			// 	{gasLimit: 1231000}
			// );
			break;
		}
		case "kovan":{
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, defaultConfigs);
			// let pseudoDaiInstance = await deployer.deploy(
			// 	PseudoDaiToken, 
			// 	false, 
			// 	daiSettings.name, 
			// 	daiSettings.symbol, 
			// 	daiSettings.decimals,
			// 	{gasLimit: 948421}
			// );
			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	pseudoDaiInstance.contract.address,
			// 	deployer.wallet.address,
			// 	{gasLimit: 1231000}
			// );
			break;
		}
		case "ropsten":{
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, defaultConfigs);
			// let pseudoDaiInstance = await deployer.deploy(
			// 	PseudoDaiToken, 
			// 	false, 
			// 	daiSettings.name, 
			// 	daiSettings.symbol, 
			// 	daiSettings.decimals,
			// 	{gasLimit: 948421}
			// );
			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	pseudoDaiInstance.contract.address,
			// 	deployer.wallet.address,
			// 	{gasLimit: 1231000}
			// );
			break;
		}
		case "devnet": {
			deployer = new etherlime.EtherlimeDevnetDeployer('0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8');
			// // proteaAdmin = new ethers.Wallet('0x2030b463177db2da82908ef90fa55ddfcef56e8183caf60db464bc398e736e6f');
			// let pseudoDaiInstance = await deployer.deploy(
			// 	PseudoDaiToken, 
			// 	false, 
			// 	daiSettings.name, 
			// 	daiSettings.symbol, 
			// 	daiSettings.decimals,
			// 	{gasLimit: 948421}
			// );
			// communityFactoryInstance = await deployer.deploy(
			// 	CommunityFactoryV1, 
			// 	false, 
			// 	pseudoDaiInstance.contract.address,
			// 	deployer.wallet.address,
			// 	{gasLimit: 1231000}
			// );
			break;
		}
	}

	
	// const tokenManagerFactoryInstance = await deployer.deploy(
	// 	BasicLinearTokenManagerFactoryV2,
	// 	false,
	// 	// communityFactoryInstance.contract.address,
	// 	"0x9f36F9100F75A68BA66C02106A539c1dC72c97C1",
	// 	{gasLimit: 2000000}
	// );

	// const membershipManagerFactoryInstance = await deployer.deploy(
	// 	MembershipManagerV1Factory,
	// 	false,
	// 	communityFactoryInstance.contract.address,
	// 	{gasLimit: 2413000}
	// );

	// const eventManagerFactoryInstance = await deployer.deploy(
	// 	EventManagerV1Factory,
	// 	false,
	// 	communityFactoryInstance.contract.address,
	// 	{gasLimit: 3264000}
	// );
	// await (await communityFactoryInstance
	// 	.initialize(
	// 		[
	// 			tokenManagerFactoryInstance.contract.address,
	// 			membershipManagerFactoryInstance.contract.address,
	// 			eventManagerFactoryInstance.contract.address
	// 		],{gasLimit: 100000}
	// 	)).wait(); 


	// communityFactoryInstance = await deployer.deploy(
	// 		CommunityFactoryV1, 
	// 		false, 
	// 		DAI_ADDRESS,
	// 		PROTEA_ADDRESS,
	// 		{gasLimit: 1231000}
	// 	);
	communityFactoryInstance = await etherlime.ContractAt(CommunityFactoryV1,
		"0x9f36F9100F75A68BA66C02106A539c1dC72c97C1", deployer.wallet, deployer.wallet.provider);
		console.log(communityFactoryInstance)
	await (await communityFactoryInstance
		.setTokenManagerFactory(
			"0xfF103Ea84d734761a7e4094D9d1396e42cD509e5",
			{gasLimit: 100000}
		)).wait(); 
};

module.exports = {
	deploy
};


// PDAI deploy: 948,421
// Community Factory: 1,230,352  @ 2Gwei   		
// Token factory: 1,938,111  @ 2 Gwei 0.0038762
// Membership Factory: 2,412,319 @ 2Gwei 0.0048246
// Event factory: 3,263,815 @ 2Gwei  0.0065276
// Initialize:  92,785 @ 2Gwei 0.0001856