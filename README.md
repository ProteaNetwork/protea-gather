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

PseudoDai:              0xfaeBBc23c5Ad6d810eBe50727f847c4Dc7adB49d
Community Factory:      0x4bFF293fFDD340b90799a211DE92f126aF28cBB3
Basic Linear Factory:   0x86DD0DBdca8bB19c009b7871C97e31Cb9761B37C
Membership Mgr Fact:    0xb976c8451120a4219FfA07E83D4F25cdfFbc9932
Event Manager Factory:  0x442C9648f2BB8B0B38A850777B13Bfbc5Ed8a0d9

Testing TBC:            0x623edF1D4CE1b5BD18AF11004122f56ed28C8028
Testing Membership:     0x407DF03a78a8bbd72Fe445c4Dd4c6b4049AB6702
Testing Event manager:  0x9806edDb94e5A2Dd9Fd76abDCc525712fE83176d