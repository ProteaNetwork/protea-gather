const web3Abi = require('web3-eth-abi');

var EventManager = artifacts.require('./EventManager.sol');
var TokenManager = artifacts.require('./TokenManager.sol');
var PseudoDaiToken = artifacts.require('./PseudoDaiToken.sol');
// const web3 = ProteaMeetup.web3;


contract('TokenManager', (accounts) => {
    let tokenManager,
        adminAddress,
        userAddress,
        tokenOwnerAddress;

    adminAddress = accounts[1];
    userAddress = accounts[2];
    tokenOwnerAddress = accounts[3];
    beforeEach('', async () => {
        tokenManager = await TokenManager.new({
            from: tokenOwnerAddress
        })
        eventManager = await EventManager.new({
            from: tokenOwnerAddress
        })
    })

    describe("Protea Token Functions", () => {


        it("Encode and Call event manager properly", async () => {

            let receiverContract = await ERC223Receiver.new(conferenceName, deposit, limitOfParticipants,
                coolingPeriod, proteaToken.address, encryption, {
                    from: adminAddress
                });
            // https://beresnev.pro/test-overloaded-solidity-functions-via-truffle/
            // Truffle unable to use overloaded functions, assuming target overload is last entry to the contract
            // Possible upgrade, include lodash to dynamically load abi function
            let targetAbi = CommunityToken.contract.abi[proteaToken.contract.abi.length - 1];
            console.log('ABI code', CommunityToken.contract.abi);

            
            // Begin creating custom transaction call
            // const transferMethodTransactionData = web3Abi.encodeFunctionCall(
            //     targetAbi, [
            //         eventManager.address,
            //         issuingAmount,
            //         web3.toHex("0x00aaff") // Need the Create event call here
            //     ]
            // );

            console.log(transferMethodTransactionData);
          
            // await web3.eth.sendTransaction({
            //     from: userAddress,
            //     gas: 170000,
            //     to: erc223Contract.address,
            //     data: transferMethodTransactionData,
            //     value: 0
            // });

        });
    })
   

});
