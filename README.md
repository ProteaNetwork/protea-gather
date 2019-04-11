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
The current contracts as of 11/04/2019 are deployed on Rinkeby at the following address, with the following markets. 

PseudoDai:              0x080654F69f7EdEb74BaaBcA37de5819744A49535
Community Factory:      0xB55f81Cd94F07d9c5C476AAb6b0beCCd2DB24833
Basic Linear Factory:   0xf81A79DC18A9df50002F2628f7e8931c5DA64A02
Membership Mgr Fact:    0xc06Bc518A3227E1bF89Dee75C19e4A3c7a198181
Event Manager Factory:  0xb621Ce801A370d29b42615394376394C6fa760E1