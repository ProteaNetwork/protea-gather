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

PseudoDai:              0xdC913A63f173d16B18473b8Fe6fff9BD15f85feD
Community Factory:      0xEBeF1034b15002f5775bA2a9b9d5df5b99749c0C
Basic Linear Factory:   0x004F90AA35dCAc1f2100F3661B34f715099B45Cc
Membership Mgr Fact:    0x04121AB4935953c97dAC812820BBF1a01836A6db
Event Manager Factory:  0x54e4ed0Cd96a0F061081e5678E9cCBb3EefEb0b1

Testing TBC:            0x73958a0BdA422F02CFFA0571EE713317580C48C5
Testing Membership:     0x704Ddd0C6CCeEfbBcCaEa0927fC8819BF31503CE
Testing Event manager:  0xAb11aa477651B77f73B6ba0D8a1932fE08a61235