## Getting started

### Dependencies 

*  solc@0.5.0
*  etherlime@0.9.18

### Running tests

* First install the required packages with `yarn install`
* (Assuming you have docker installed) Run `yarn start:devnets` which will start the docker container 
* If already running devnets, use `docker ps` followed by `docker attach ID` to connect to the existing instance
* To run the tests, execute `yarn test`

## Etherlime Devnet Deployer

A number of changes have been made to Etherlime, and submitted in a PR, in order to interface with Ganache alternatives. We are using these changes to run our tests as can be seen in the `package.json`: `"etherlime": "BenSchZA/etherlime#temp-feature",`.

A new Etherlime deployer class has been created, with an alternative set of test accounts pre-configured:

* Ganache accounts global variable: `accounts`
* Devnet accounts global variable: `devnetAccounts`

* Ganache deployer: `deployer = await new etherlime.EtherlimeGanacheDeployer(NodeSigner.secretKey);``
* Devnet deployer: `deployer = new etherlime.EtherlimeDevnetDeployer(NodeSigner.secretKey);`

* Ganache `ContractAt`: `basicLinearMarketInstance = await etherlime.ContractAt(BasicLinearMarket, marketAddress[0]);`
* Devnet `ContractAtDevnet`: `basicLinearMarketInstance = await etherlime.ContractAtDevnet(BasicLinearMarket, marketAddress[0]);`
