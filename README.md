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
9.  Run `yarn start:dev` to spin up all the necessary applications

## Contract Deployments
Contract deployments on test nets are to use our internal test account 
https://rinkeby.etherscan.io/address/0x0f17d2198dbb9d7a50557284f7ee10dfa5e0628a

### yarn deploy:rinkeby
The current contracts as of 20/03/2019 are deployed at the following address, with the following markets. 

PseudoDai:              0x2B8E4C20bD9124c523957B0825A881eeC9E5bfEc
Community Factory:      0x7a0cd5AF9a8b7EA78de043C62db171BC8558152A
Basic Linear Factory:   0x5FAeD081a4572547D3f93B4f44781A3AF6FD0EE8
Membership Mgr Fact:    0xb64Fd83473c7e2Ec2A9655812D5Bd8c3FB42e27A
Event Manager Factory:  0x77e555DE67740769A74880f017f9dF995E6b54ab

Testing TBC:            0x996d2504f903D4b234AEeE80ba6605CE30cBa5F7
Testing Membership:     0xb24424e3e8114bc13CBa8B7cBd6270b4dE1e8f71
Testing Event manager:  0xE6dE965a7D0B81921F2b037470C039B351E8aa43