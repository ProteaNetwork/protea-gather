
// @ts-ignore
window.web3 = {
  currentProvider: {
    getSigner: jest.fn().mockImplementation(() => {
      return {
        getAddress: jest.fn(() => '0xD9995BAE12FEe327256FFec1e3184d492bD94C31'),
      };
    }),
  },
};

// @ts-ignore
window.ethereum = {
  enable: () => jest.fn(() => true),
  isConnected: jest.fn(() => true),
  on: () => jest.fn(),
};

export default window;
