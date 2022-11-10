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
  // const Example = await ethers.getContractFactory("SwapExample1");
  // const example = await Example.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");

  // const MockDAI = await ethers.getContractFactory("MockDAI");
  // const mockDAI = await MockDAI.deploy("Moack DAI", "MOCKDAI");

  console.log("SwapExample address:", example.address);

  // Importing mockDAI ABI to interact with mockDAI
  const DAIAddress = "0x4d582295afB968eA3b9492c5ec594b830D180E8d";
  const mockDAI = new ethers.Contract(DAIAddress, DAI.abi, deployer);
  const ownerBalance = await mockDAI.balanceOf(deployer.address);
  console.log("Owner balance in Mock DAI", ownerBalance);

  // Importing mockDAI ABI to interact with mockSAND as both have same ABI
  const SANDAddress = "0xC07DDD7Cf136e12C97c0488A02052a16c573b30C";
  const mockSAND = new ethers.Contract(SANDAddress, DAI.abi, deployer);
  const ownerBalance2 = await mockSAND.balanceOf(deployer.address);
  console.log("Owner balance in Mock SAND", ownerBalance2);


  // expect(await mockDAI.totalSupply()).to.equal(ownerBalance);

  console.log("Test passed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  