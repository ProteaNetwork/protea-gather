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
PseudoDai:              0xb5947cFD299a4bB5a749AA18A8D1a41353B52332
Community Factory:      0xb142f4d19c4CA99230990143896b0a32E31ed4C0
Basic Linear Factory:   0x6e4451E154F740aa7386a8831DC73C072C948a8D
Membership Mgr Fact:    0xbE24cC927f55D0645146052EC58c2b4cE8219239
Event Manager Factory:  0x4b4daE72c251371530ce0CED2Ed8192b6caBcb85