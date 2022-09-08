const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const IMPLEMENTATION_ADDRESS = "0x411E81F1670C9A6a92e0eBA66baf4b9F20174e8A";

    const Factory = await hre.ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy(IMPLEMENTATION_ADDRESS);
    await factory.deployed();

    console.log("Factory contract deployed to:", factory.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
