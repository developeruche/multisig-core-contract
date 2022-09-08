const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const Imp = await hre.ethers.getContractFactory("MultiSigWallet");
    const imp = await Imp.deploy();
    await imp.deployed();

    console.log("imp contract deployed to:", imp.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
