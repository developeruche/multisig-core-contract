const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const Bankk = await hre.ethers.getContractFactory("Bank");
    const bank = await Bankk.deploy();
    await bank.deployed();

    console.log("Bank contract deployed to:", bank.address);




    // const depositERC20TokenTxn = await bank.;
    const depositERC20TokenTxn = await bank.depositERC20Token("0x5FbDB2315678afecb367f032d93F642f64180aa3", 200);
    const depositERC20TokenTxnReciept = await depositERC20TokenTxn.wait();
    console.log("Deposit ERC20Token Txn Log: ", depositERC20TokenTxnReciept);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
