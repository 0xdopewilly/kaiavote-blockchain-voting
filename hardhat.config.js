require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const KAIA_TESTNET_RPC = "https://public-en-kairos.node.kaia.io";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    kaiaTestnet: {
      url: KAIA_TESTNET_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 1001,
      gasPrice: 25000000000, // 25 gwei for KAIA Testnet
      gas: 3000000, // Standard gas limit for KAIA
    }
  },
  etherscan: {
    apiKey: {
      kaiaTestnet: "placeholder" // KAIA verification
    },
    customChains: [
      {
        network: "kaiaTestnet",
        chainId: 1001,
        urls: {
          apiURL: "https://kairos.kaiascope.com/api",
          browserURL: "https://kairos.kaiascope.com"
        }
      }
    ]
  }
};