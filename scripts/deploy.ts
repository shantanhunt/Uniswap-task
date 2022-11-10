// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { expect } from "chai";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Example = await ethers.getContractFactory("SwapExample1");
  const example = await Example.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");

  const MockDAI = await ethers.getContractFactory("MockDAI");
  const mockDAI = await MockDAI.deploy("Moack DAI", "MOCKDAI");

  console.log("SwapExample address:", example.address);
  const ownerBalance = await mockDAI.balanceOf(deployer.address);
  expect(await mockDAI.totalSupply()).to.equal(ownerBalance);
  console.log("Test passed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  