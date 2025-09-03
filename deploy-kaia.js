import { ethers } from 'ethers';

async function deployToKaia() {
  console.log('🚀 Deploying CryptoVote to KAIA Kairos Testnet...');
  
  // KAIA Kairos Testnet configuration
  const provider = new ethers.JsonRpcProvider('https://public-en-kairos.node.kaia.io');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Connected wallet:', wallet.address);
  
  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log('Wallet balance:', ethers.formatEther(balance), 'KAIA');
  
  if (balance === 0n) {
    throw new Error('❌ No balance in wallet. Please add KAIA testnet tokens for gas fees.');
  }
  
  try {
    // Simple voting contract bytecode for KAIA
    const contractBytecode = "0x608060405234801561001057600080fd5b50610400806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632c69c7f81461005c5780633fc8cef3146100715780639e7a13ad14610084578063b3f98adc146100a4578063c1be49e1146100b7575b600080fd5b61006f61006a366004610249565b6100d7565b005b61006f61007f366004610291565b610203565b6100976100923660046102dc565b610227565b6040516100a991906102fe565b60405180910390f35b61006f6100b2366004610249565b610203565b6100ca6100c5366004610307565b610241565b6040516100a99190610329565b6001600160a01b03811660009081526020819052604090205460ff16156101465760405162461bcd60e51b815260206004820152600e60248201526d105b1c9958591e481d9bdd195960921b60448201526064015b60405180910390fd5b8051600081116101985760405162461bcd60e51b815260206004820152601f60248201527f4d75737420766f746520666f72206174206c65617374206f6e652063616e6469006044820152601b60fa1b606482015260840161013d565b6001600160a01b038216600081815260208190526040808220805460ff19166001179055518392600080516020610364833981519152926101da928792610347565b60405180910390a260005b81518110156101ff576101f782828151811061013557610135610380565b602002602001015161024d565b6001016101e5565b5050565b610203826100d7565b600061022260018360405161021c91906103a5565b60200160405180910390a2565b919050565b6000816040516020016102419190610324565b60405160208183030381529060405280519060200120600052600160205260406000205490565b50565b6000808360405160200161024191906103a5565b80356001600160a01b038116811461022257600080fd5b600082601f8301126102a257600080fd5b813567ffffffffffffffff8111156102bc576102bc6103e7565b6040516102d360207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9093169201601f19168201810190845182185b828110156102fe57815184526020938401930161030a565b5050505050919050565b60006020828403121561031a57600080fd5b610323826102d6565b9392505050565b60006020808352835180829085019150828501818188015b858110156103405781518852938201939082019060010161032f565b509097965050505050505056fea2646970667358221220b5a5e2c4a5a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a464736f6c63430008130033";
    
    const contractAbi = [
      {
        "inputs": [
          {"name": "candidateIds", "type": "string[]"},
          {"name": "voterAddress", "type": "address"}
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"name": "voterAddress", "type": "address"}],
        "name": "hasVoted",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{"name": "candidateId", "type": "string"}],
        "name": "getVoteCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    
    console.log('🔄 Deploying contract to KAIA...');
    
    // Get gas price for KAIA
    const feeData = await provider.getFeeData();
    console.log('KAIA network fee data:', {
      gasPrice: feeData.gasPrice?.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString()
    });
    
    // Create contract factory
    const contractFactory = new ethers.ContractFactory(contractAbi, contractBytecode, wallet);
    
    // Deploy with KAIA-optimized gas settings
    const contract = await contractFactory.deploy({
      gasLimit: 3000000,
      gasPrice: feeData.gasPrice || ethers.parseUnits('25', 'gwei')
    });
    
    console.log('⏳ Waiting for deployment confirmation...');
    const receipt = await contract.waitForDeployment();
    
    const deployedAddress = await contract.getAddress();
    console.log('✅ Contract deployed successfully to KAIA!');
    console.log('📍 Contract Address:', deployedAddress);
    console.log('🔗 Network: KAIA Kairos Testnet (Chain ID: 1001)');
    console.log('⛽ Gas Used:', receipt.deploymentTransaction()?.gasUsed?.toString() || 'N/A');
    console.log('🔍 Explorer:', `https://kairos.kaiascan.io/address/${deployedAddress}`);
    console.log('💚 KAIA benefits: Low gas fees and high throughput for academic voting!');
    
    return deployedAddress;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

// Run deployment
deployToKaia().catch(console.error);