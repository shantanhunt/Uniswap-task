import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.7.6",
  networks: {
    hardhat: {
      hardfork: "merge",
      // If you want to do some forking set `enabled` to true. 
      // It is higly recommended to set forking block number, otherwise the latest one will be used each time
      // which can lead into inconsistency of tests
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/TiSaAZzkxhfz4sI2J7cYVhLbB4z57r9W",
        blockNumber: 15752899,
        enabled: true
      },
      chainId: 31337,
      gas: 2100000,
      gasPrice: 80000000000
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;

