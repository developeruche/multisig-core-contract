require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    matic: {
      url: process.env.MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: "https://goerli.infura.io/v3/965a992142e64206ad4e67bd922124af", 
      accounts: [process.env.PRIVATE_KEY]
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/965a992142e64206ad4e67bd922124af", 
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: "UHSC4TSVC7Y7VZRIUAG9SPMHD85JM9PHZ8"
  }
};
