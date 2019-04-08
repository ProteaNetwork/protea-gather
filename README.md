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

PseudoDai:              0xb5Cb54d52D1Addb86c36e1240F18c552Dd85A82b
Community Factory:      0xECA9C2b4B4c4e8eCB7052751347724Ca60468168
Basic Linear Factory:   0x1CC8E6aAaE5F1206ebA7E1e25f5D4221FAcFFA60
Membership Mgr Fact:    0x8195e5977896f20471f45396eeaC286a27C7fB8b
Event Manager Factory:  0xA515C0EeF16b2103370b785840524E4d6c164246

Testing TBC:            0x19260257f967Fbd62998C71C6251c7482A1cE01F
Testing Membership:     0x4Ce301a9F7a83C9bFAE3a4F06ad2Fe5404c62430
Testing Event manager:  0x65464728B4fbfCEe4C4dEA20edeDce5CDAF913BE