const etherlime = require('etherlime');
const ethers = require('ethers');

const helpers = require('./helpers.js');

var EventManager = require('../build/EventManager.json');
var TokenManager = require('../build/TokenManager.json');
var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var PseudoDaiToken = require('../build/PseudoDaiToken.json');
var RewardManager = require('../build/RewardManager.json');

const createABI =  {
    "constant": false,
    "inputs": [
        {
            "name": "_name",
            "type": "string"
        },
        {
            "name": "_maxAttendees",
            "type": "uint24"
        },
        {
            "name": "_organiser",
            "type": "address"
        },
        {
            "name": "_requiredStake",
            "type": "uint256"
        },
        {
            "name": "_participantLimit",
            "type": "uint256"
        }
    ],
    "name": "_createEvent",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};

const rsvpABI = {
    "constant": false,
    "inputs": [
      {
        "name": "_index",
        "type": "uint256"
      },
      {
        "name": "_member",
        "type": "address"
      }
    ],
    "name": "_rsvp",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};

const transferABI = {
    "constant": false,
    "inputs": [
        {
            "name": "_to",
            "type": "address"
        },
        {
            "name": "_value",
            "type": "uint256"
        },
        {
            "name": "_data",
            "type": "bytes"
        }
    ],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};

const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

describe('Event Manager', () => {
    let deployer;

    let adminAccount = accounts[1];
    let userAccount = accounts[2];
    let tokenOwnerAccount = accounts[3];
    let communityDeployOwnerAccount = accounts[3];


    let tokenManagerInstance, 
    pseudoDaiInstance, 
    rewardManagerInstance,
    eventManagerInstance;

    beforeEach('', async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(adminAccount.secretKey);
        
        pseudoDaiInstance = await deployer.deploy(PseudoDaiToken, false, daiSettings.name, daiSettings.symbol, daiSettings.decimals);
        
        tokenManagerInstance = await deployer.deploy(TokenManager, false, 
            "community",
            "com",
            pseudoDaiInstance.contract.address
        );

        rewardManagerInstance = await deployer.deploy(RewardManager, false, 
            tokenManagerInstance.contract.address
        );
        
        eventManagerInstance = await deployer.deploy(EventManager, false, 
            tokenManagerInstance.contract.address,
            rewardManagerInstance.contract.address,
            5
        );

        // Loading accounts with tokens
        await pseudoDaiInstance.from(userAccount).mint(); // {from: userAccount}
        await pseudoDaiInstance.from(userAccount).approve(tokenManagerInstance.contract.address, helpers.floatToUint256(400));

        // let priceOfMint = await tokenManagerInstance.from(userAccount).priceToMint(helpers.floatToUint256(30));
        // console.log(priceOfMint)

        // console.log(helpers.floatToUint256(30))

        // await tokenManagerInstance.from(userAccount).mint(helpers.floatToUint256(30));
        // let balanceOfUser = await tokenManagerInstance.from(userAccount).balanceOf(userAccount.wallet.address);
        // assert.equal(balanceOfUser.toNumber(), helpers.floatToUint256(30), "User has 30 tokens");

        // await pseudoDaiInstance.from(adminAccount).mint();
        // await pseudoDaiInstance.from(adminAccount).approve(tokenManagerInstance.contract.address, helpers.floatToUint256(400));
        // await tokenManagerInstance.from(adminAccount).mint(helpers.floatToUint256(30));
        // let balanceOfAdmin = await tokenManagerInstance.from(adminAccount).balanceOf(adminAccount.wallet.address);
        // assert.equal(balanceOfAdmin.toNumber(), helpers.floatToUint256(30), "Admin has 30 tokens");
        
    })

    describe("Protea Token Functions", () => {

        it("Contract set up with correct details", async () => {
            let tokenManagerAddress = await eventManagerInstance.from(userAccount).tokenManager();
            assert.equal(tokenManagerAddress, tokenManagerInstance.contract.address, "Incorrect token manager");

            let rewardManagerAddress = await eventManagerInstance.from(userAccount).rewardManager();
            assert.equal(rewardManagerAddress, rewardManagerInstance.contract.address, "Incorrect reward manager");

            let eventManagerAdmin = await eventManager.from(userAccount).admin();
            assert.equal(eventManagerAdmin, communityDeployOwner.wallet.address, "Incorrect owner");
            
            let creationCost = await eventManager.from(userAccount).creationCost();
            assert.equal(creationCost.toNumber(), 20, "Creation cost incorrect");
        });

        it("Admin can update stakes", async () => {
            let creationCost = await eventManager.creationCost();
            assert.equal(creationCost, 20, "Correct owner");
            
            let maxAttendanceBonus = await eventManager.maxAttendanceBonus();
            assert.equal(maxAttendanceBonus, 5, "Correct owner");

            await eventManager.updateStakes(25, 10, {from: communityDeployOwner});
            let creationCostAfter = await eventManager.creationCost();
            assert.equal(creationCostAfter, 25, "Correct owner");
            
            let maxAttendanceBonusAfter = await eventManager.maxAttendanceBonus();
            assert.equal(maxAttendanceBonusAfter, 10, "Correct owner");
        });

        it("Create Event", async () => {
            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            // let targetAbi = CommunityToken.contract.abi[proteaToken.contract.abi.length - 1];
            // console.log('ABI code', CommunityToken.contract.abi);

            // const rsvpEncoded = web3Abi.encodeFunctionCall(rsvpABI, [0,  userAccount]
            // );
            // const stake = 20;
            // const eventSettings = [
            //     "Testing Create",
            //     20,
            //     adminAccount,
            //     stake
            // ]

            // const createEncoded = web3Abi.encodeFunctionCall(createABI,
            //     eventSettings
            // )

            // // Begin creating custom transaction call
            // const transferMethodTransactionData = web3Abi.encodeFunctionCall(
            //     transferABI, [
            //         eventManager.address,
            //         20,
            //         rsvpEncoded
            //     ]
            // );

          
            // await web3.eth.sendTransaction({
            //     from: adminAccount,
            //     // gas: 170000,
            //     to: eventManager.address,
            //     data: transferMethodTransactionData,
            //     value: 0
            // });

            // const eventData = await eventManager.getEvent(0);
            // assert.equal(eventData[0], eventSettings[0], "Event was not deployed");
        });
    });
});
