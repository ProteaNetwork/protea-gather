# Protea MVP 

The initial MVP for showcasing both Protea community TBCs and the initial utility, Protea Meetup


## Structure

This is built with our [Full-Stack Boilerplate](https://gitlab.com/linumlabs/ethers-react-redux-typescript-mongo-boilerplate)

* Database: MongoDb
* Api Server: NestJS
* Web App: React + Redux
 
## System Requirements

* NodeJS >= v10
* Yarn >= 1.0
* MongoDb instance

## Getting Started

1.  Clone the repo
2.  Run `yarn` in the project root
3.  Run `cd ApiServer`
4.  Make a copy of the `.env.example` file named `.env`
5.  Input your MongoDb server details in the `MONGO-HOST=` field (this will be
    localhost if you are running mongo locally or in a docker container with 
    host networking)
6.  Run `cd ..`
7.  Run `cd WebApp`
7.  Make a copy of the `.env.example` file named `.env`
8.  Ensure the ApiServer details in the `API_HOST=` field are correct
9.  Run `cd ..`
10. Run `cd Blockchain`
11. Run `yarn build` To compile all the contracts
12. Run `cd ..`
13. Run `yarn start:dev` to spin up all the necessary applications

## Contract Deployments
Contract deployments on test nets are to use our internal test account 
https://etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
https://goerli.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
https://rinkeby.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
https://kovan.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a
https://ropsten.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a

### Mainnet
The current contracts as of 29/05/2019 are deployed on Mainnet at the following address, with the following markets. 
#### yarn deploy:mainnet
Dai:                    0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359
Community Factory:      0xc5Af5f868eff2F7cC49d7BE5362C505bD5Bec06a
Basic Linear Factory:   0x727Cb5dc8c3abF5044d2cE3239FF9a441551F9eF
Membership Mgr Fact:    0x08381500b1DeAfd200E5aBE046Fd7096c9Dc5Ba2
Event Manager Factory:  0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3

### Goerli
The current contracts as of 24/05/2019 are deployed on Goerli at the following address, with the following markets. 
#### yarn deploy:goerli
PseudoDai:              0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3 - Gas used 948421
Community Factory:      0x9f36F9100F75A68BA66C02106A539c1dC72c97C1 - Gas used 1230352
Basic Linear Factory:   0xa86bA03C6A2858755423A5225C34464848e5E1C2 - Gas used 1938111
Membership Mgr Fact:    0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e - Gas used 2412319
Event Manager Factory:  0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2 - Gas used 3263815


### Rinkeby
The current contracts as of 14/04/2019 are deployed on Rinkeby at the following address, with the following markets. 
#### yarn deploy:rinkeby
PseudoDai:              0xb5947cFD299a4bB5a749AA18A8D1a41353B52332 - Gas used 948421
Community Factory:      0xb142f4d19c4CA99230990143896b0a32E31ed4C0 - Gas used 1230352
Basic Linear Factory:   0x6e4451E154F740aa7386a8831DC73C072C948a8D - Gas used 1938111
Membership Mgr Fact:    0xbE24cC927f55D0645146052EC58c2b4cE8219239 - Gas used 2412319
Event Manager Factory:  0x4b4daE72c251371530ce0CED2Ed8192b6caBcb85 - Gas used 3263815

### Kovan
The current contracts as of 24/05/2019 are deployed on Kovan at the following address, with the following markets. 
#### yarn deploy:kovan
PseudoDai:              0x47bCAeA99942eCbf5e4d0b0C82D8fec5854810b3 - Gas used 948421
Community Factory:      0x9f36F9100F75A68BA66C02106A539c1dC72c97C1 - Gas used 1230352
Basic Linear Factory:   0xa86bA03C6A2858755423A5225C34464848e5E1C2 - Gas used 1938111
Membership Mgr Fact:    0xF29e66aA67421a53B8d9cb14C9d6768907B7D47e - Gas used 2412319
Event Manager Factory:  0x261871a421f8cAAa4686Df18aDe13b3406E4c9E2 - Gas used 3263815

#### Ropsten
The current contracts as of 23/05/2019 are deployed on Ropsten at the following address, with the following markets. 
#### yarn deploy:ropsten
PseudoDai:              0x3f05e5D250FE1A294c665E970513a36D7E2F3230 - Gas used 948421
Community Factory:      0x253a8E67C88c95955CE1817aE2AF92c260Fad605 - Gas used 1230352
Basic Linear Factory:   0xc6585F8e3E3e949f87170A8F024b2Ce9B1Cb3a42 - Gas used 1938111
Membership Mgr Fact:    0x22Eecbe89f9b50Fa997D03562c62229127Cd65d4 - Gas used 2412319
Event Manager Factory:  0xdE114425b6B4cA64C159cfb9aCEB2cb96195cDEA - Gas used 3263815