const web3Abi = require('web3-eth-abi');

var EventManager = artifacts.require('./EventManager.sol');
var TokenManager = artifacts.require('./TokenManager.sol');
var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
var RewardManager = artifacts.require('./RewardManager.sol');
// const web3 = ProteaMeetup.web3;

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

contract('Event Manager', (accounts) => {
    let tokenManager,
        adminAddress,
        userAddress,
        tokenOwnerAddress;

    adminAddress = accounts[1];
    userAddress = accounts[2];
    tokenOwnerAddress = accounts[3];
    communityDeployOwner = accounts[3];

    beforeEach('', async () => {
        pseudoDaiToken = await PseudoDaiToken.new("psDAI", "DAI", 18);
        tokenManager = await TokenManager.new(
            "community",
            "com",
            pseudoDaiToken.address,
            {from: communityDeployOwner}
        )

        rewardManager = await RewardManager.new(
            tokenManager.address,
            {from: communityDeployOwner}
        );
        
        eventManager = await EventManager.new(
            tokenManager.address,
            rewardManager.address,
            5, 
            {from: communityDeployOwner}
        )
        
        // Loading accounts with tokens
        await pseudoDaiToken.mint(0, {from: userAddress});
        await pseudoDaiToken.mint(1, {from: userAddress});
        await pseudoDaiToken.mint(2, {from: userAddress});
        await pseudoDaiToken.approve(tokenManager.address, 400, {from: userAddress});
        let priceOfMint = await tokenManager.priceToMint(30);
        console.log(priceOfMint)
        await tokenManager.mint(30, {from: userAddress});
        let balanceOfUser = await tokenManager.balanceOf(userAddress);
        assert.equal(balanceOfUser.toNumber(), 30, "User has 30 tokens");

        await pseudoDaiToken.mint(0, {from: adminAddress});
        await pseudoDaiToken.mint(1, {from: adminAddress});
        await pseudoDaiToken.mint(2, {from: adminAddress});
        await pseudoDaiToken.approve(tokenManager.address, 400, {from: adminAddress});
        await tokenManager.mint(30, {from: adminAddress});
        let balanceOfAdmin = await tokenManager.balanceOf(adminAddress);
        assert.equal(balanceOfAdmin.toNumber(), 30, "Admin has 30 tokens");
        
    })

    describe("Protea Token Functions", () => {

        it("Contract set up with correct details", async () => {
            let tokenManagerAddress = await eventManager.tokenManager();
            assert.equal(tokenManagerAddress, tokenManager.address, "Incorrect token manager");

            let rewardManagerAddress = await eventManager.rewardManager();
            assert.equal(rewardManagerAddress, rewardManager.address, "Incorrect reward manager");

            let eventManagerAdmin = await eventManager.admin();
            assert.equal(eventManagerAdmin, communityDeployOwner, "Correct owner");
            
            let creationCost = await eventManager.creationCost();
            assert.equal(creationCost, 20, "Creation cost incorrect");
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

            // const rsvpEncoded = web3Abi.encodeFunctionCall(rsvpABI, [0,  userAddress]
            // );
            const stake = 20;
            const eventSettings = [
                "Testing Create",
                20,
                adminAddress,
                stake
            ]

            const createEncoded = web3Abi.encodeFunctionCall(createABI,
                eventSettings
            )

            // Begin creating custom transaction call
            const transferMethodTransactionData = web3Abi.encodeFunctionCall(
                transferABI, [
                    eventManager.address,
                    20,
                    rsvpEncoded
                ]
            );

          
            await web3.eth.sendTransaction({
                from: adminAddress,
                // gas: 170000,
                to: eventManager.address,
                data: transferMethodTransactionData,
                value: 0
            });

            const eventData = await eventManager.getEvent(0);
            assert.equal(eventData[0], eventSettings[0], "Event was not deployed");
        });
    });
});
