require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config("");
const infuraprojectID = process.env.INFURA_ID;
const mnemonic = process.env.MNEMONIC;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks: {
    sepolia: {
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10,
      },
      url: "https://sepolia.infura.io/v3/" + infuraprojectID,
    },
  },
};
