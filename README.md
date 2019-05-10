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
PseudoDai:              0xc77aC3D1D2f56f8F2003Ae1AD9872cc978b004d4
Community Factory:      0xC5e72E3198f312369Ce2b4295e480732153D882a
Basic Linear Factory:   0xa95b397b04127996b7ecd14Aa3546c6e9a59C3bC
Membership Mgr Fact:    0x13Da6f2a5cA04d6D0C6041b297e3Eeb7dFb3466E
Event Manager Factory:  0x6D0D7D3826D01bda4a61d3b526742c232388A418