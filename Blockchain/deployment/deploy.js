require('dotenv').config();
// yarn debug deploy --network=devnet --runs=999
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
// const DEPLOYER_MNEMONIC = process.env.DEPLOYER_MNEMONIC;
const DAI_ADDRESS = process.env.DAI_ADDRESS;

const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var CommunityFactoryV1 = require('../build/CommunityFactoryV1.json');
var BasicLinearTokenManagerFactory = require('../build/BasicLinearTokenManagerFactory.json');
var MembershipManagerV1Factory = require('../build/MembershipManagerV1Factory.json');
var EventManagerV1Factory = require('../build/EventManagerV1Factory.json');

// var EventManagerV1 = require('../build/EventManagerV1.json');
// var MembershipManagerV1 = require('../build/MembershipManagerV1.json');
// var BasicLinearTokenManager = require('../build/BasicLinearTokenManager.json');

// const eventManagerSettings = {
//     eventData: [
//         {
//             name: "Test event",
//             maxAttendees: 0,
//             requiredDai: ethers.utils.parseUnits("2", 18)
//         }
//     ]
// }

const communitySettings = {
    name: "community",
    symbol: "com",
    gradientDemoninator: 2000, // Unused but required for the interface
    contributionRate: 10
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

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}
const defaultDaiPurchase = 500;

const defaultConfigs = {
    gasPrice: 20000000000,
    gasLimit: 4700000
}

const deploy = async (network, secret) => {
	if(!secret){
		secret = DEPLOYER_PRIVATE_KEY;
	}
	let deployer, proteaAdmin, daiAddress, communityFactoryInstance;
	
	switch(network){
		case "mainnet": {
			daiAddress = DAI_ADDRESS;
			communityFactoryInstance = await deployer.deploy(
				CommunityFactoryV1, 
				false, 
				daiAddress,
				deployer.wallet.address,
			);
			break;
		}
		case "rinkeby":{
			deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, INFURA_API_KEY, defaultConfigs);
			// TODO: fix deployment here to target live DAI if mainnet selected
			let pseudoDaiInstance = await deployer.deploy(
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
				deployer.wallet.address,
			);
			break;
		}
		case "devnet": {
			deployer = new etherlime.EtherlimeDevnetDeployer('0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8');
			// proteaAdmin = new ethers.Wallet('0x2030b463177db2da82908ef90fa55ddfcef56e8183caf60db464bc398e736e6f');
			// TODO: fix deployment here to target live DAI if mainnet selected
			let pseudoDaiInstance = await deployer.deploy(
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
				deployer.wallet.address,
			);
			break;
		}
	}

	


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
	await (await communityFactoryInstance
		.initialize(
			[
				tokenManagerFactoryInstance.contract.address,
				membershipManagerFactoryInstance.contract.address,
				eventManagerFactoryInstance.contract.address
			]
		)).wait();


	// if(network != 'mainnet'){
	// 	// const proteaAdminCommunityFactoryInstance = communityFactoryInstance.connect(proteaAdmin);
	// 	let proteaAdminCommunityFactoryInstance;
	// 	if(network == 'devnet'){
	// 		proteaAdminCommunityFactoryInstance = await etherlime.ContractAtDevnet(CommunityFactoryV1, communityFactoryInstance.contractAddress, proteaAdmin, deployer.provider);
	// 	}else{
// 			proteaAdminCommunityFactoryInstance = await etherlime.ContractAt(CommunityFactoryV1, communityFactoryInstance.contractAddress, proteaAdmin, deployer.provider);
// 		}
// 		// const proteaAdminCommunityFactoryInstance = new ethers.Contract(communityFactoryInstance.contractAddress, CommunityFactoryV1.abi, deployer.provider);
// 		await(await proteaAdminCommunityFactoryInstance
// 			.createCommunity(
// 				communitySettings.name,
// 				communitySettings.symbol,
// 				proteaAdmin.address,
// 				communitySettings.gradientDemoninator,
// 				communitySettings.contributionRate
// 			)).wait();
	
// 		let communityDetails = await proteaAdminCommunityFactoryInstance
// 			.getCommunity(0);
		
// 		// This gets the formatting in the console correct for some reason
// 	console.log(`
// Test Community 1
// 	TBC: 			${communityDetails[3]}
// 	Membership Manager: 	${communityDetails[2]}
// 	Event Utility:     	${communityDetails[4][0]}
// 	`)

		
// 		let tokenManagerInstance, membershipManagerInstance, eventManagerInstance;
// 		if(network == 'rinkeby'){
// 			pseudoDaiInstance = await etherlime.ContractAt(PseudoDaiToken, pseudoDaiInstance.contractAddress, proteaAdmin, deployer.provider);
// 			tokenManagerInstance = await etherlime.ContractAt(BasicLinearTokenManager, communityDetails[3], proteaAdmin, deployer.provider);
// 			membershipManagerInstance = await etherlime.ContractAt(MembershipManagerV1, communityDetails[2], proteaAdmin, deployer.provider);
// 			eventManagerInstance = await etherlime.ContractAt(EventManagerV1, communityDetails[4][0], proteaAdmin, deployer.provider);
// 		}else{
// 			pseudoDaiInstance = await etherlime.ContractAtDevnet(PseudoDaiToken, pseudoDaiInstance.contractAddress, proteaAdmin, deployer.provider);
// 			tokenManagerInstance = await etherlime.ContractAtDevnet(BasicLinearTokenManager, communityDetails[3], proteaAdmin, deployer.provider);
// 			membershipManagerInstance = await etherlime.ContractAtDevnet(MembershipManagerV1, communityDetails[2], proteaAdmin, deployer.provider);
// 			eventManagerInstance =  await etherlime.ContractAtDevnet(EventManagerV1, communityDetails[4][0], proteaAdmin, deployer.provider);
// 		}
// 		// Setting up utility
// 		await (
//             await membershipManagerInstance
//                 .addUtility(eventManagerInstance.contract.address)
// 		).wait()
		
// 		await (
//             await membershipManagerInstance
//                 .setReputationRewardEvent(
//                     eventManagerInstance.contract.address,
//                     0,
//                     membershipSettings.registeredEvents[0].reward
//                 )
//         ).wait()

// 		// Setting up account
// 		let tokensForDai = await tokenManagerInstance
//             .colateralToTokenBuying(ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18));
        
//         await (await pseudoDaiInstance.mint()).wait();

//         await (await pseudoDaiInstance
//             .approve(
//                 tokenManagerInstance.contractAddress,
// 				ethers.utils.parseUnits(`${defaultDaiPurchase}`, 18)// Might be this
// 				// Set to 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
//             )).wait();
        
//         await (await tokenManagerInstance
//             .mint(
//                 proteaAdmin.address, 
//                 // tokensForDai.sub(ethers.utils.parseUnits("1407.19508946058371257", 18))
//                 tokensForDai
// 		)).wait();

//         let requiredTokensBN = await tokenManagerInstance.colateralToTokenSelling(membershipSettings.testingStakeValue);

//         await (await membershipManagerInstance.stakeMembership(membershipSettings.testingStakeValue, proteaAdmin.address)).wait();
        
//         let membershipState = await membershipManagerInstance
//             .getMembershipStatus(proteaAdmin.address);
        
		
// 		// Setting up test event
// 		await (
// 			await eventManagerInstance
// 				.createEvent(
// 					eventManagerSettings.eventData[0].name,
// 					eventManagerSettings.eventData[0].maxAttendees,
// 					proteaAdmin.address,
// 					eventManagerSettings.eventData[0].requiredDai
// 				)
// 		).wait()
// }
	
};

module.exports = {
	deploy
};