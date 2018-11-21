# Protea API Server

This project is built off of [NestJS](https://github.com/nestjs/nest). 

## Quick start

1.  Make sure that you have Node.js v8.10 and npm v5 or above installed.

2.  Ensure you have installed or have access to a MongoDb database (see below)

3.  Run `yarn` or `npm i`

4.  Configure the environmental variables. Create a copy of the `.env.example` file and save it as `.env`. Complete required fields as per example

5.  At this point you can run `yarn start:dev` to start the API Server at `http://localhost:3001`.

## Documentation, Support

NestJS provides very comprehensive documentation [here](https://docs.nestjs.com/).
[Stackoverflow](https://stackoverflow.com/questions/tagged/nestjs)
[Gitter](https://gitter.im/nestjs/nestjs)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
