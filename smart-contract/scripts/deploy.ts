import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting BiteMyShinyContract deployment...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const networkInfo = await ethers.provider.getNetwork();

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "RBTC");
  console.log("Network:", network.name);
  console.log("Chain ID:", networkInfo.chainId.toString());

  const initialTreasury = ethers.parseEther("0.001");
  console.log("\nInitial treasury:", ethers.formatEther(initialTreasury), "RBTC");

  const BiteMyShinyContract = await ethers.getContractFactory("BiteMyShinyContract");
  const bender = await BiteMyShinyContract.deploy({ value: initialTreasury });
  await bender.waitForDeployment();

  const address = await bender.getAddress();
  console.log("\nBiteMyShinyContract deployed to:", address);

  // Verify deployment
  console.log("\nVerifying deployment...");
  const currentCost = await bender.currentCost();
  const contractBalance = await ethers.provider.getBalance(address);
  console.log("  Current cost:", currentCost.toString(), "wei (1 sat)", currentCost === 10000000000n ? "[OK]" : "[FAIL]");
  console.log("  Treasury:", ethers.formatEther(contractBalance), "RBTC", contractBalance === initialTreasury ? "[OK]" : "[FAIL]");

  // Save deployment info
  const deploymentInfo = {
    contract: "BiteMyShinyContract",
    address: address,
    deployer: deployer.address,
    network: network.name,
    chainId: Number(networkInfo.chainId),
    initialTreasury: ethers.formatEther(initialTreasury),
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `BiteMyShinyContract-${network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\nDeployment info saved to deployments/BiteMyShinyContract-${network.name}.json`);

  console.log("\n" + "=".repeat(50));
  console.log("To verify run:");
  console.log(`npx hardhat verify --network ${network.name} ${address}`);
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
