const hre = require("hardhat");

async function main() {
  
  const [owner, signer1, signer2] = await ethers.getSigners();

  // -> I have not deployed this code, I only write it down here
  const ConsenseToken = await hre.ethers.getContractFactory("ConsenseWalletToken");
  const consenseToken = await ConsenseToken.deploy();
  await consenseToken.deployed();

  console.log("Consense Wallet Token contract deployed to:", consenseToken.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
