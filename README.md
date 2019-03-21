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

PseudoDai:              0x0Ab3f8e8239FE566701c1E405dcEd8B379Ced6A9
Community Factory:      0xE3B146a0fDfFc6d893cEF603d5d9Ff8EB69c8D94
Basic Linear Factory:   0xDf6C81137b15A81116d77d56405902A96b685820
Membership Mgr Fact:    0x56769223538004D16EB7BE40335871047Da0856D
Event Manager Factory:  0x68AfDc1E4704A205Ba3A10A9d37EFD032C4d3F68

Testing TBC:            0xA7A51E1cCDa1faeaB22D3Fc9ef8721b06d475B34
Testing Membership:     0xB12908db496A95C788c9bea1d2e02BA8eB63660E
Testing Event manager:  0x49D6b190C6788523D714F0CEa239cF0c22B957D8