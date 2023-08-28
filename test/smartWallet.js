const { expect } = require("chai");

const hre = require("hardhat");
const { string } = require("hardhat/internal/core/params/argumentTypes");

describe("smartWallet", function () {
  it("is possible to transfer funds to this wallet", async () => {
    const smartWallet = await hre.ethers.getContractFactory("smartWallet");
    const smartWalletInstance = await smartWallet.deploy();
    const [owner, otherAcc] = await hre.ethers.getSigners();

    const walletBalBefore = await smartWalletInstance.getBalance();

    const [tester] = await hre.ethers.getSigners();
    const transactionHash = await tester.sendTransaction({
      to: smartWalletInstance.address,
      value: 10,
    });

    const walletBalAfter = await smartWalletInstance.getBalance();
    expect(walletBalAfter).to.equal(walletBalBefore + 10);
  });

  it("is possible to set allowance for an address", async () => {
    const smartWallet = await hre.ethers.getContractFactory("smartWallet");
    const smartWalletInstance = await smartWallet.deploy();
    const [owner, tester] = await hre.ethers.getSigners();
    const ownerofWallet = await smartWalletInstance.getOwner();

    await smartWalletInstance.connect(owner).allowAddress(tester.address, 5);

    expect(await smartWalletInstance.getAllowance(tester.address)).to.equal(5);
  });

  it("is possible to withdraw from the wallet", async () => {
    const smartWallet = await hre.ethers.getContractFactory("smartWallet");
    const smartWalletInstance = await smartWallet.deploy();
    const [owner, tester1, tester2] = await hre.ethers.getSigners();

    const transactionHash = await tester1.sendTransaction({
      to: smartWalletInstance.address,
      value: 10,
    });
    await smartWalletInstance.connect(owner).allowAddress(tester2.address, 5);
    const balBefore = await smartWalletInstance.getBalance();
    const allowanceBefore = await smartWalletInstance.getAllowance(
      tester2.address
    );

    await smartWalletInstance.connect(tester2).withdraw(1);
    const amt = 1;
    const walletBalAfter = await smartWalletInstance.getBalance();

    expect(walletBalAfter).to.equal(balBefore - amt);
    expect(await smartWalletInstance.getAllowance(tester2.address)).to.equal(
      allowanceBefore - amt
    );
  });

  it("fails to transfer ownership if caller is not owner", async () => {
    const smartWallet = await hre.ethers.getContractFactory("smartWallet");
    const smartWalletInstance = await smartWallet.deploy();
    const [owner, tester] = await hre.ethers.getSigners();

    expect(await smartWalletInstance.getOwner()).to.equal(owner.address);
    await expect(
      smartWalletInstance.connect(tester).transferOwnership(tester.address)
    ).to.be.revertedWith(
      "action not allowed! You are not the owner of this wallet"
    );
  });
});
