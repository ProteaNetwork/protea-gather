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

PseudoDai:              0x7397935a4B366Ef0bd6C93A3a9Da645650D6b50A
Community Factory:      0x1b88Fcf219F52A64c5d1047cA43036662B345F93
Basic Linear Factory:   0x21C140660e5d668Db619c2505fcC4f497F501d54
Membership Mgr Fact:    0xAEBB14f353a78DD705484601eAD5f232b4ea9721
Event Manager Factory:  0x1375AB1630B35a4705a4B27890A96850b76A69fC

Testing TBC:            0x5C23B58D751edDeAF56a3a635e69DcaeE994E00f
Testing Membership:     0x215C41703cb44e7f57C5b7e87Fb116D5F618B474
Testing Event manager:  0x767560Ec6994E0daAE45a6b6F47a9917cF4BB38A