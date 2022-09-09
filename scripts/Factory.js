const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const IMPLEMENTATION_ADDRESS = "0x7d2c431Fe6ffa2f32491eEAfCE8a90707e00c512";

    const Factory = await hre.ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy(IMPLEMENTATION_ADDRESS);
    await factory.deployed();

    console.log("Factory contract deployed to:", factory.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
