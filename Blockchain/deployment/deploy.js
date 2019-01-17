require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MNEMONIC = process.env.MNEMONIC;

const etherlime = require('etherlime');

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();

};

module.exports = {
	deploy
};