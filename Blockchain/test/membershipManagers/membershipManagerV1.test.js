const etherlime = require('etherlime');
const ethers = require('ethers');

var PseudoDaiToken = require('../../build/PseudoDaiToken.json');
var ITokenManager = require('../../build/ITokenManager.json');
var CommunityFactoryV1 = require('../../build/CommunityFactoryV1.json');

const communitySettings = {
    name: "community",
    symbol: "com",
    contributionRate: 10
}
const daiSettings = {
    name: "PDAI",
    symbol: "PDAI",
    decimals: 18
}

const defaultTokenVolume = 100;