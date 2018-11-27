// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
const HDWalletProvider = require('truffle-hdwallet-provider');

const NETWORK_IDS = {
  // mainnet: 1,
  ropsten: 2,
  rinkeby: 4,
  kovan: 42
};


module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY, 1),
      network_id: 4,
      gas: 6612388, // Gas limit used for deploys
      gasPrice: 20000000000 // 20 gwei
    },
    poa: {
      network_id: 100,
      host: "https://dai.poa.network",
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};

// for (let networkName in NETWORK_IDS) {
//   module.exports.networks[ networkName ] = {
//     provider: new HDWalletProvider(MNEMONIC, 'https://' + networkName + '.infura.io/' + INFURA_API_KEY),
//     network_id: NETWORK_IDS[networkName],
//     gas: 6500000,
//     gasPrice: 21
//   };
// }