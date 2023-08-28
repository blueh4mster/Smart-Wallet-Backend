const { ethers } = require("hardhat");
(async () => {
  try {
    const smartWallet = await ethers.getContractFactory("smartWallet");

    const smartWalletInstance = await smartWallet.deploy();

    await smartWalletInstance.deployed();

    console.log(`deployed at ${smartWalletInstance.address}`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
