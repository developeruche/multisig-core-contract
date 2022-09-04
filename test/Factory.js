const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  

  describe("WalletFactory", function () {
    async function deployFactoryContract() {

      const [owner, otherAccount, account1, account2, account3] = await ethers.getSigners();
  
                //   deploying bank contract
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();

      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      const multisignWallet = await MultiSigWallet.deploy();

      const Factory = await ethers.getContractFactory("WalletFactory");
      const factory = await Factory.deploy(multisignWallet.address);

  
      return { bank, multisignWallet, factory, owner, otherAccount, account1, account2, account3 };
    }
  
    describe("Deployment done properly", function () {
      it("Should set the right admin", async function () {
        const { factory, owner } = await loadFixture(deployFactoryContract);

        expect(await factory.admin()).to.equal(owner.address);
      });
    });


    describe("clone", function () {
        it("Contracts should be deployed properly and the wallet array should populated", async function () {
          const { factory, owner, account1, account2, account3, bank } = await loadFixture(deployFactoryContract);

          let clone = await factory.clone([account1.address, account2.address, account3.address], 2, bank.address);

        
          let clone_ = await clone.wait();
          let deployed_clone = clone_.events[0].args.newContract;

          
          let factories = await factory.getWalletOwners(deployed_clone);


  
          expect(account1.address).to.equal(factories[0]);
          expect(account2.address).to.equal(factories[1]);
          expect(account3.address).to.equal(factories[2]);
        });
      });

  });
  
