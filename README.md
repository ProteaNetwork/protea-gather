# Protea Gather Beta
[Protea Gather](https://gather.protea.io) is a dapp built on the [Protea [x]](https://protea.io) protocol. Protea Gather provides an ecosystem that visualises social capital, encourages sustainable engagement & rewards commitment for meetup communities of all kinds.

### Design Goals
* Create a radically open and modular codebase, that can easily be amended by anyone
* Give back to the developer community & advance shared understanding of how to build better products
Product Goals
* Create sustainable funding mechanisms for meetup communities
* Visualise social capital in meetup communities, thereby amplifying their voice
* Reward sustainable meetup engagement with token incentives
* Create a framework that fosters meaningful human connections

## Table Of Contents
- [Tech Stack](#tech-stack)
- [System Prerequisites](#system-prerequisites)
- [Getting Started](#getting-started)
- [Contract Deployments](#contract-deployments)
- [Starting the app](#starting-the-app)
- [Configuring ApiServer](#configuring-apiServer)
- [Configuring WebApp](#configuring-webApp)
- [Configuring Blockchain](#configuring-blockchain)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Tech stack

This is built with our [Full-Stack Boilerplate](https://gitlab.com/linumlabs/ethers-react-redux-typescript-mongo-boilerplate)

* Database: MongoDb
* Api Server: NestJS
* Web App: React + Redux + Redux-Saga + Ethers.js

## System prerequisites 

* NodeJS >= v10
* Yarn >= 1.0
* MongoDb instance

## Getting Started
The stack is configured as a monorepo. After configuring the various components & environment variables, the project can be spun up from the root.

### Clone the repo

1. Clone the repo
2. Run `yarn` in the project root to install all dependancies


#### Starting Application
After configuring the `ApiServer`, `WebApp`, and `Blockchain` following the steps below, run yarn start:dev from the root to spin up all the necessary components.

## Configuring `ApiServer`
1. Go to project root
2. Run `cd ApiServer`
3. Run `cp .env.example .env` - this is where you will configure all environment variables
4. Input your MongoDb server details in the `MONGO-HOST=` field (this will be
    localhost if you are running mongo locally or in a docker container with 
    host networking)

## Configuring `WebApp`
1. Go to project root
2. Run `cd WebApp`
3. Run `cp .env.example .env`
4. Ensure the ApiServer details in the `API_HOST=` field are correct

## Configuring `Blockchain`
### Dependencies 

*  solc@0.5.4
*  etherlime@0.9.18

### Running tests

* First install the required packages with `yarn install`
* (Assuming you have docker installed) Run `yarn start:devnets` which will start the docker container 
* To run the tests, execute `yarn test`

### Etherlime Devnet Deployer

A number of changes have been made to Etherlime, and submitted in a PR, in order to interface with Ganache alternatives. We are using these changes to run our tests as can be seen in the `package.json`: `"etherlime": "BenSchZA/etherlime#temp-feature",`.

A new Etherlime deployer class has been created, with an alternative set of test accounts pre-configured:

* Ganache accounts global variable: `accounts`
* Devnet accounts global variable: `devnetAccounts`

* Ganache deployer: `deployer = await new etherlime.EtherlimeGanacheDeployer(NodeSigner.secretKey);`
* Devnet deployer: `deployer = new etherlime.EtherlimeDevnetDeployer(NodeSigner.secretKey);`

* Ganache `ContractAt`: `basicLinearMarketInstance = await etherlime.ContractAt(BasicLinearMarket, marketAddress[0]);`
* Devnet `ContractAtDevnet`: `basicLinearMarketInstance = await etherlime.ContractAtDevnet(BasicLinearMarket, marketAddress[0]);`

### Deploying contracts to network (local/Rinkeby)

1. Configure environment variables in `.env` file (never commit to repo or expose secrets!) using `.env.example` as an example
2. If deploying to Rinkeby, comment out `RINKEBY_PRIVATE_KEY` variable, and vice-versa
4. Run `yarn deploy:devnet` or `yarn deploy:NETWORKNAME` to deploy contracts

## Contract Deployments
Contract deployments on test nets are to use our internal test account 
- https://etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
- https://goerli.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
- https://rinkeby.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
- https://kovan.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
- https://ropsten.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a

### Mainnet
The current contracts as of 29/05/2019 are deployed on Mainnet at the following address, with the following markets. 
#### yarn deploy:mainnet
* Dai:                    [0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359](https://etherscan.io/address/0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359)
* Community Factory:      [0xc5Af5f868eff2F7cC49d7BE5362C505bD5Bec06a](https://etherscan.io/address/0xc5Af5f868eff2F7cC49d7BE5362C505bD5Bec06a)
* Basic Linear Factory:   [0x727Cb5dc8c3abF5044d2cE3239FF9a441551F9eF](https://etherscan.io/address/0x727Cb5dc8c3abF5044d2cE3239FF9a441551F9eF)
* Membership Mgr Fact:    [0x08381500b1DeAfd200E5aBE046Fd7096c9Dc5Ba2](https://etherscan.io/address/0x08381500b1DeAfd200E5aBE046Fd7096c9Dc5Ba2)
* Event Manager Factory:   [0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3](https://etherscan.io/address/0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3)

### Goerli
The current contracts as of 24/05/2019 are deployed on Goerli at the following address, with the following markets. 
#### yarn deploy:goerli
* PseudoDai:              [0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3](https://goerli.etherscan.io/address/0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3) - Gas used 948421
* Community Factory:      [0x9f36F9100F75A68BA66C02106A539c1dC72c97C1](https://goerli.etherscan.io/address/0x9f36F9100F75A68BA66C02106A539c1dC72c97C1) - Gas used 1230352
* Basic Linear Factory:   [0xa86bA03C6A2858755423A5225C34464848e5E1C2](https://goerli.etherscan.io/address/0xa86bA03C6A2858755423A5225C34464848e5E1C2) - Gas used 1938111
* Membership Mgr Fact:    [0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e](https://goerli.etherscan.io/address/0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e) - Gas used 2412319
* Event Manager Factory:  [0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2](https://goerli.etherscan.io/address/0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2) - Gas used 3263815


### Rinkeby
The current contracts as of 14/04/2019 are deployed on Rinkeby at the following address, with the following markets. 
#### yarn deploy:rinkeby
* PseudoDai:              [0xb5947cFD299a4bB5a749AA18A8D1a41353B52332](https://rinkeby.etherscan.io/address/0xb5947cFD299a4bB5a749AA18A8D1a41353B52332) - Gas used 948421
* Community Factory:      [0xb142f4d19c4CA99230990143896b0a32E31ed4C0](https://rinkeby.etherscan.io/address/0xb142f4d19c4CA99230990143896b0a32E31ed4C0) - Gas used 1230352
* Basic Linear Factory:   [0x6e4451E154F740aa7386a8831DC73C072C948a8D](https://rinkeby.etherscan.io/address/0x6e4451E154F740aa7386a8831DC73C072C948a8D) - Gas used 1938111
* Membership Mgr Fact:    [0xbE24cC927f55D0645146052EC58c2b4cE8219239](https://rinkeby.etherscan.io/address/0xbE24cC927f55D0645146052EC58c2b4cE8219239) - Gas used 2412319
* Event Manager Factory:  [0x4b4daE72c251371530ce0CED2Ed8192b6caBcb85](https://rinkeby.etherscan.io/address/0x4b4daE72c251371530ce0CED2Ed8192b6caBcb85) - Gas used 3263815

### Kovan
The current contracts as of 24/05/2019 are deployed on Kovan at the following address, with the following markets. 
#### yarn deploy:kovan
* PseudoDai:              [0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3](https://kovan.etherscan.io/address/0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3) - Gas used 948421
* Community Factory:      [0x9f36F9100F75A68BA66C02106A539c1dC72c97C1](https://kovan.etherscan.io/address/0x9f36F9100F75A68BA66C02106A539c1dC72c97C1) - Gas used 1230352
* Basic Linear Factory:   [0xa86bA03C6A2858755423A5225C34464848e5E1C2](https://kovan.etherscan.io/address/0xa86bA03C6A2858755423A5225C34464848e5E1C2) - Gas used 1938111
* Membership Mgr Fact:    [0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e](https://kovan.etherscan.io/address/0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e) - Gas used 2412319
* Event Manager Factory:  [0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2](https://kovan.etherscan.io/address/0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2) - Gas used 3263815

#### Ropsten
The current contracts as of 23/05/2019 are deployed on Ropsten at the following address, with the following markets. 
#### yarn deploy:ropsten
* PseudoDai:              [0x3f05e5D250FE1A294c665E970513a36D7E2F3230](https://ropsten.etherscan.io/address/0x3f05e5D250FE1A294c665E970513a36D7E2F3230) - Gas used 948421
* Community Factory:      [0x253a8E67C88c95955CE1817aE2AF92c260Fad605](https://ropsten.etherscan.io/address/0x253a8E67C88c95955CE1817aE2AF92c260Fad605) - Gas used 1230352
* Basic Linear Factory:   [0xc6585F8e3E3e949f87170A8F024b2Ce9B1Cb3a42](https://ropsten.etherscan.io/address/0xc6585F8e3E3e949f87170A8F024b2Ce9B1Cb3a42) - Gas used 1938111
* Membership Mgr Fact:    [0x22Eecbe89f9b50Fa997D03562c62229127Cd65d4](https://ropsten.etherscan.io/address/0x22Eecbe89f9b50Fa997D03562c62229127Cd65d4) - Gas used 2412319
* Event Manager Factory:  [0xdE114425b6B4cA64C159cfb9aCEB2cb96195cDEA](https://ropsten.etherscan.io/address/0xdE114425b6B4cA64C159cfb9aCEB2cb96195cDEA) - Gas used 3263815

## Authors
* [Ryan Noble / RyRy79261](https://gitlab.com/ryry79261): Initial work
* [Michael Yankelev / panterazar](https://gitlab.com/panterazar): Framework/Implementation & support
* [Benjamin Scholtz / BenSchZA](https://gitlab.com/BenSchZA): DevOps & Bonding curve algorithms
* [Florian Bühringer / Capeflow](https://gitlab.com/Capeflow): Product Lead & Bonding curve algorithms

See also the list of contributors who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
Andrew Tudhope
Paul Kholhaas
Devon Krantz