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
The current contracts as of 14/04/2019 are deployed on Rinkeby at the following address, with the following markets. 

#### Rinkeby
PseudoDai:              0xD2F77f6B90fc8f0040d1f99C999891CafeCdB1D6
Community Factory:      0xD5E6D7cE0B1A2B52F28387A126236c32aa1E2599
Basic Linear Factory:   0x80fa2b7ED4c090e7585D93070fBD67225734eeA8
Membership Mgr Fact:    0x5aCD469be0Fbb2479CEAa2A7Ac403d1fDD1bfcb6
Event Manager Factory:  0xbFefc9ac48ec83961E29027B46bff7d3a3255Cc4