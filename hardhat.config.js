require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"sepolia",
  networks: {
    sepolia: {
      url: process.env.API_URL,
      accounts: [process.env.API_KEY]
    }
  },

  solidity: {
    compilers: [
      {version: "0.5.16"},
      {version: "0.6.6"},
      {version: "0.7.6"},
      {version: "0.4.17"},
      {version: "0.8.24"}
    ]
  }
    
};
