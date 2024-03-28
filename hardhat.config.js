require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork:"sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/F4LqDG9oAkkkQasmyfb5ZoqH_kc0y5hw",
      accounts: ["xxxxx"]
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
