/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("@nomiclabs/hardhat-waffle");
require("ethereum-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-network-helpers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    mumbai: {
      chainId: 80001,
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.P_KEY],
    },
    goerli: {
      chainId: 5,
      url: process.env.GOERLI_RPC,
      accounts: [process.env.P_KEY],
    },
    // goerli: {
    //   url: process.env.GOERLI_RPC,
    //   accounts: [GOERLI_PKEY, GOERLI_PKEY1, GOERLI_PKEY2],
    //   chainId: 5,
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
    },
    user2: {
      default: 2,
    },
    user3: {
      default: 3,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
  },
};
