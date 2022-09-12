const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const IMPLEMENTATION_ADDRESS = "0x564C74AF49E84bea7372E20145fFd4cC425B48AF";

    const Factory = await hre.ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy(IMPLEMENTATION_ADDRESS);
    await factory.deployed();

    console.log("Factory contract deployed to:", factory.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
