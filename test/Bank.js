const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
  

  describe("Bank", function () {
    async function deployBankContract() {

      const [owner, otherAccount] = await ethers.getSigners();
  
      const Token = await ethers.getContractFactory("ConsenseWalletToken");
      const token = await Token.deploy();

      const Bank = await ethers.getContractFactory("Bank");
      const bank = await Bank.deploy();
  
      return { bank, token, owner, otherAccount };
    }
  
    describe("Deployment done properly", function () {
      it("Should set the right Owner", async function () {
        const { bank, owner } = await loadFixture(deployBankContract);

        expect(await bank.owner()).to.equal(owner.address);
      });
    });

    describe("Deposit ERC20 token", function () {
        it("It should deposit ERC20 tokens from the msg.sender to the contract", async function () {
            const { bank, token } = await loadFixture(deployBankContract);

            // making erc20 approval
            await token.approve(bank.address, 2000);

            // making the deposit of erc20
            await bank.depositERC20Token(token.address, 2000);

            expect(await token.balanceOf(bank.address)).to.equal(2000);
        })
    })

    describe("Transfer ERC20 token", function () {
        it("It should transfer ERC20 tokens from the bank address to a specified address", async function () {
            const { bank, owner, token, otherAccount } = await loadFixture(deployBankContract);

            // making erc20 approval
            await token.approve(bank.address, 2000);

            // making the deposit of erc20
            await bank.depositERC20Token(token.address, 2000);

            // transfering to a new account
            await bank.transferERC20Token(otherAccount.address, token.address, 2000);

            expect(await token.balanceOf(otherAccount.address)).to.equal(2000);
        })

        it("It should revert with error message insufficent funds", async function () {
            const { bank, owner, token, otherAccount } = await loadFixture(deployBankContract);

            // making erc20 approval
            await token.approve(bank.address, 2000);

            // making the deposit of erc20
            await bank.depositERC20Token(token.address, 2000);


            await expect(bank.transferERC20Token(otherAccount.address, token.address, 2001)).to.be.revertedWith("Insufficient fund");
        })
    })

    describe("deposit ETHER", function () {
        it("It deposit ether to the bank contract", async function () {
            const { bank } = await loadFixture(deployBankContract);


            // making the deposit of erc20
            await bank.deposit({ value: ethers.utils.parseEther("1") });


            expect(await bank.getBalance()).to.equal(ethers.utils.parseEther("1"));
        })
    });

    describe("transfer ETHER", function () {
        it("It deposit ether to the bank contract", async function () {
            const { bank, owner, otherAccount } = await loadFixture(deployBankContract);

            let usersBalance = ethers.utils.parseEther("10008");

            // making the deposit of ether
            await bank.deposit({ value: ethers.utils.parseEther("8") });

            // making the deposit of ether
            await bank.transfer(otherAccount.address, ethers.utils.parseEther("8"));

            let prov = ethers.provider;
            const balance = await prov.getBalance(otherAccount.address);

            expect(balance).to.equal(usersBalance);
        })
    });

    describe("Pause", function () {
        it("Contracts should not run if the contract was paused", async function () {
            const { bank, owner, otherAccount } = await loadFixture(deployBankContract);

            // making the deposit of ether
            await bank.deposit({ value: ethers.utils.parseEther("8") });

            // pausing the contracts
            await bank.pause();


            await expect(bank.transfer(otherAccount.address, ethers.utils.parseEther("8"))).to.be.revertedWith("Pausable: paused");
        })
    });

    describe("Unpause", function () {
        it("Contracts should run becaused the contract is no longer paused", async function () {
            const { bank, owner, otherAccount } = await loadFixture(deployBankContract);

            let usersBalance = ethers.utils.parseEther("10008");

            // pausing the contracts
            await bank.pause();

            // pausing the contracts
            await bank.unpause();


            // making the deposit of erc20
            await bank.deposit({ value: ethers.utils.parseEther("8") });


            // making the deposit of ether
            await bank.transfer(otherAccount.address, ethers.utils.parseEther("8"));

            prov = ethers.provider;
            const balance = await prov.getBalance(otherAccount.address);

            expect(balance).to.equal(usersBalance);
        })
    });

    describe("recoverTrappedMoney", function () {
        it("Balance of ERC20 token of the user should returned", async function () {
            const { bank, owner, otherAccount, token } = await loadFixture(deployBankContract);

            // making the deposit of ether
            await token.transfer(bank.address, 2000);

            // pausing the contracts
            await bank.recoverTrappedMoney(otherAccount.address, token.address, 1800);


            expect(await token.balanceOf(otherAccount.address)).to.equal(1800);
        })
    });
  });
  
