const hre = require("hardhat");

async function main() {
  
    const [owner, signer1, signer2] = await hre.ethers.getSigners();

    const IMPLEMENTATION_ADDRESS = "0xFCc68585A5a33872d4eDf2131fe97D2BDe372a29";

    const Factory = await hre.ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy(IMPLEMENTATION_ADDRESS);
    await factory.deployed();

    console.log("Factory contract deployed to:", factory.address);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
