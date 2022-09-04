// Minimal proxy as Base

const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  

  describe("MultiSignClone", function () {
    async function deployWalletContract() {

      const [owner, otherAccount, account1, account2, account3] = await ethers.getSigners();

          //   deploying bank contract
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();

    //   deploying implementation contract
      const WalletImpClone = await ethers.getContractFactory("MultiSigWallet");
      const walletImpClone = await WalletImpClone.deploy();

    //   deploying factory contract with implementation contract passed  
      const WalletFactory = await ethers.getContractFactory("WalletFactory");
      const walletFactory = await WalletFactory.deploy(walletImpClone.address);

      

      let clone = await walletFactory.clone([owner.address, account2.address, account3.address], 2, bank.address);
      let clone_ = await clone.wait();
      let deployed_clone = clone_.events[0].args.newContract;

      const WalletClone = await ethers.getContractFactory("MultiSigWallet");
      const walletClone = await WalletClone.attach(
        deployed_clone
      );
      


      return { owner, bank, otherAccount, account1, account2, account3, walletClone };
    }
  
    describe("IsBase", function () {
      it("Should set the right Owner", async function () {
        const { walletClone } = await loadFixture(deployWalletContract);

        // console.log(walletClone);

        expect(await walletClone.isBase()).to.equal(false);
      });
    });

    describe("SubmitTranaction", function () {
        it("Should revert because of the OnlyOwners Guide ", async function () {
          const { walletClone, owner, bank } = await loadFixture(deployWalletContract);

          const etherValue = ethers.utils.parseEther("1");


          let ABI = [
            "function deposit() payable"];
          let iface = new ethers.utils.Interface(ABI);
          let calldata = iface.encodeFunctionData("deposit");

          // submiting the transaction
          let cb = await walletClone.submitTransaction(bank.address, etherValue, calldata, "Testing Transaction :)", {value: etherValue});
          cb = await cb.wait();
          cb = cb.events[0].args
          // console.log("THE CALL", cb.data);

          // obtaining the last transaction
          let cc = await walletClone.getTransaction(0);
          // console.log("THE WAIT", cc.data);

          expect(cb.data).to.be.equal(cc.data)
        });
      });

      describe("confirmTransaction", function () {
        it("Transaction should be confirmed", async function () {
          const { walletClone, owner, bank } = await loadFixture(deployWalletContract);

          const etherValue = ethers.utils.parseEther("1");


          let ABI = [
            "function deposit() payable"];
          let iface = new ethers.utils.Interface(ABI);
          let calldata = iface.encodeFunctionData("deposit");

          // submiting the transaction
          let cb = await walletClone.submitTransaction(bank.address, etherValue, calldata, "Testing Transaction :)", {value: etherValue});
          cb = await cb.wait();
          cb = cb.events[0].args
          // console.log("THE CALL", cb.data);

          // obtaining the last transaction
          let cc = await walletClone.confirmTransaction(0);

          // let ck = await walletClone.confirmTransaction(0);

          // obtaining the last transaction
          let cd = await walletClone.getTransaction(0);
          // console.log("THE WAIT", cd.numConfirmations);



          expect(cd.numConfirmations).to.be.equal(1)
        });
      });

      describe("excecuteTransaction", function () {
        it("Should excecute transaction because all the users have sign the transaction", async function () {
          const { walletClone, owner, bank, account2 } = await loadFixture(deployWalletContract);

          const etherValue = ethers.utils.parseEther("1");


          let ABI = [
            "function deposit() payable"];
          let iface = new ethers.utils.Interface(ABI);
          let calldata = iface.encodeFunctionData("deposit");

          // submiting the transaction
          let cb = await walletClone.submitTransaction(bank.address, etherValue, calldata, "Testing Transaction :)", {value: etherValue});
          cb = await cb.wait();
          cb = cb.events[0].args;



          // confirming the last transaction
          await walletClone.confirmTransaction(0);
          await walletClone.connect(account2).confirmTransaction(0);
          await walletClone.connect(account2).executeTransaction(0);





          let cx = await walletClone.getTransaction(0);
          // console.log("THE WAIT", cx.numConfirmations);


          expect(cx.numConfirmations).to.be.equal(2)
        });
      });

      describe("revokeConfirmation", function () {
        it("Should revoke transaction confirmation", async function () {
          const { walletClone, owner, bank, account2 } = await loadFixture(deployWalletContract);

          const etherValue = ethers.utils.parseEther("1");


          let ABI = [
            "function deposit() payable"];
          let iface = new ethers.utils.Interface(ABI);
          let calldata = iface.encodeFunctionData("deposit");

          // submiting the transaction
          let cb = await walletClone.submitTransaction(bank.address, etherValue, calldata, "Testing Transaction :)", {value: etherValue});
          cb = await cb.wait();
          cb = cb.events[0].args;



          // confirming the last transaction
          await walletClone.confirmTransaction(0);
          await walletClone.connect(account2).confirmTransaction(0);
          await walletClone.connect(account2).revokeConfirmation(0);





          let cx = await walletClone.getTransaction(0);
          // console.log("THE WAIT", cx.numConfirmations);


          expect(cx.numConfirmations).to.be.equal(1)
        });
      });

      describe("Receive function redirecting funds to the bank contract", function () {
        it("test if the ban contract recieved the funds", async function () {
          const { walletClone, owner, bank, account2 } = await loadFixture(deployWalletContract);
          const etherValue = ethers.utils.parseEther("1");

          // sending one ether to the walletclone contract
          await owner.sendTransaction({
            to: walletClone.address,
            value: etherValue
          });


          // checking the banlance of the bank repo
          prov = ethers.provider;
          const balance = await prov.getBalance(bank.address);          


          expect(balance).to.be.equal(etherValue);
        });
      });
  });
  
