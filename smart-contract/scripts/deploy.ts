import { ethers } from "hardhat";

async function main() {
  const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");

  // Deploy with initial funds as treasury
  const bender = await BiteMyShinyContract.deploy({ value: ethers.parseEther("0.01") });
  await bender.waitForDeployment();

  const address = await bender.getAddress();
  console.log("Bender deployed to:", address);
}

main().catch(console.error);
