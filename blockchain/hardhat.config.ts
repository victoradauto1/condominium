import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "solidity-coverage";

import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity:{
    version:"0.8.28",
    settings:{
      optimizer:{
        enabled: true,
        runs: 1000
      }
    }
  } ,
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    hardhat: {
      accounts: {
        count: 25
      }
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: {
        mnemonic: process.env.SECRET || "",
      },
    },
    lineaSepolia: {
      url: `https://linea-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 59141,
      accounts: {
        mnemonic: process.env.SECRET || "",
      },
    }
  },
  etherscan: {
    apiKey: process.env.APY_KEY_ETHER || "",
  },
};

export default config;
