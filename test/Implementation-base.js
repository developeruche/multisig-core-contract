// Minimal proxy as Base

const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  

  describe("MultiSignWalletBase", function () {
    async function deployWalletContract() {

      const [owner, otherAccount, account1, account2, account3] = await ethers.getSigners();
  
      const Wallet = await ethers.getContractFactory("MultiSigWallet");
      const wallet = await Wallet.deploy();

      const Bank = await ethers.getContractFactory("Bank");
      const bank = await Bank.deploy();
  
  
      return { bank, wallet, owner, otherAccount, account1, account2, account3 };
    }
  
    describe("Deployment done properly and other", function () {
      it("Should set the right Owner", async function () {
        const { wallet } = await loadFixture(deployWalletContract);

        expect(await wallet.isBase()).to.equal(true);
      });

      it("Should revert with message submitTransaction", async function () {
        const { wallet, owner } = await loadFixture(deployWalletContract);

        // await wallet.getOwners();
        await expect(wallet.confirmTransaction(1)).to.be.revertedWithCustomError(wallet, "HasNotBeenInitialized");
      });

      it("Should revert with message cannotInit", async function () {
        const { wallet, owner, account1, account2, account3, bank } = await loadFixture(deployWalletContract);

        await expect(wallet.initialize([account1.address, account2.address, account3.address], 2, bank.address)).to.be.revertedWithCustomError(wallet, "CannotCallInitalized");
      });
    });
  });
  
