const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const IMPLEMENTATION_ADDRESS = "0x2F76B336470AdC50503E04612F137532f6C4c551";

    const Factory = await hre.ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy(IMPLEMENTATION_ADDRESS);
    await factory.deployed();

    console.log("Factory contract deployed to:", factory.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
