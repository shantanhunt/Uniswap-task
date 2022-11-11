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

  // This is contract is for Swapping tokens 
  const SwapExample = await ethers.getContractFactory("SwapExample1");
  const swapExample = await SwapExample.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");

  // const MockDAI = await ethers.getContractFactory("MockDAI");
  // const mockDAI = await MockDAI.deploy("Moack DAI", "MOCKDAI");

  console.log("SwapExample address:", swapExample.address);

  // Hardcoding Pool Address for MockDAI-SAND for now
  const poolAdd = "0x076c373a9aeb3E2F72f45339e9e11A4D37Dc7fEf"; // Make a constructor in SwapExample for poolAdd

  // Calculate position liquidity
  const liquidity = await liquidityExample.getLiquidity(6321);
  console.log("Position liquidity: ", liquidity);

  // Getting params
  const result = await liquidityExample.getLiquidityAndTokensAddress(6321);
  console.log("Result: ", result);

  // Calculating Ratio
  const ratio = await liquidityExample.calculateRatioOfLPShare(6321);
  console.log("Ratio: ", ratio);
  const val0 = await liquidityExample.getPoolLiquidity();
  console.log("Liq: ", val0);

  // Get balance of tokens
  const bal = await liquidityExample.getPoolTokenBalance("0x4d582295afb968ea3b9492c5ec594b830d180e8d");
  console.log("Balance: ", bal);

  // calculateWithdrawableTokens
  const withdrawable = await liquidityExample.calculateWithdrawableTokens(6321);
  console.log("Withdrawable: ", withdrawable);

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

  