// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { expect } from "chai";
import DAI from "../artifacts/contracts/MockDAI.sol/MockDAI.json";

async function main() {
  const [deployer, bob] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Uncomment this while running actual tests for interaction.
  // This is contract is for providing/exiting liquidity 
  const LiquidityExample = await ethers.getContractFactory("LiquidityExample");
  const liquidityExample = await LiquidityExample.deploy();

  console.log("Deployment Tx hash: ", liquidityExample.deployTransaction.hash);
  console.log("LiquidityExample address:", liquidityExample.address);

  console.log("Test passed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  