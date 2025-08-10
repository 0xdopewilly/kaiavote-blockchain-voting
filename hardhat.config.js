require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const MONAD_TESTNET_RPC = "https://10143.rpc.thirdweb.com";

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
    monadTestnet: {
      url: MONAD_TESTNET_RPC,
      accounts: [PRIVATE_KEY],
      chainId: 10143,
      gasPrice: 1000000, // Much lower gas price for Monad (0.001 gwei)
      gas: 5000000, // Higher gas limit for Monad's high throughput
    }
  },
  etherscan: {
    apiKey: {
      monadTestnet: "placeholder" // Monad may not have verification service yet
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: 10143,
        urls: {
          apiURL: "https://monad-testnet.socialscan.io/api",
          browserURL: "https://monad-testnet.socialscan.io"
        }
      }
    ]
  }
};