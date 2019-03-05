# Protea V2 API

This API is based on the following core:

[NestJS](https://github.com/nestjs/nest) framework TypeScript starter repository.
[Mongoose](https://mongoosejs.com/) object document mapping framework
[MongoDB](https://www.mongodb.com/) NoSQL database

## ❯ Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

Install [Yarn](https://yarnpkg.com/en/docs/install)

### Step 2: Install a Mongo database

You will need access to a Mongo database to run this server.

- You can install Mongo locally: [Download](https://www.mongodb.com/download-center/community)
- Run a Mongo docker image: `docker run --name apidb -d -p 27017:27017 mongo:latest`
- Use a 'Mongo as a Service' provider (Microsoft, Google, Amazon, MongoDB Atlas)

### Step 3: Configure environmental variables

Create a copy of the `.env.example` file and rename it to  `.env`

Update the database connection and any other fields required as per the comments and example

### Step 4: Running the app

```bash
# development
$ docker start apidb

$ yarn start

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

## License

MIT
