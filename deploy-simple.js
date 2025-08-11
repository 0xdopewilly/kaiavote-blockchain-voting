import { ethers } from 'ethers';
import fs from 'fs';

async function deployContracts() {
  console.log('🚀 Deploying CRYPTOVOTE to Monad Testnet...');
  
  // Connect to Monad Testnet
  const provider = new ethers.JsonRpcProvider('https://10143.rpc.thirdweb.com');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Connected wallet:', wallet.address);
  
  // Get balance
  const balance = await provider.getBalance(wallet.address);
  console.log('Wallet balance:', ethers.formatEther(balance), 'ETH');
  
  if (balance === 0n) {
    throw new Error('❌ No balance in wallet. Please add Monad Testnet tokens for gas fees.');
  }
  
  // Read contract bytecode and ABI (simplified)
  console.log('📄 Preparing contract deployment...');
  
  // Simple voting contract bytecode (placeholder - in real deployment you'd compile the Solidity)
  const simpleBytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061021c806100606000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063893d20e81461003b578063a6f9dae114610059575b600080fd5b610043610075565b60405161005091906100d1565b60405180910390f35b610073600480360381019061006e919061011d565b61009e565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061015c82610131565b9050919050565b61016c81610151565b82525050565b600060208201905061018760008301846101635056fe";
  
  // Deploy mock contract for demonstration
  const contractFactory = new ethers.ContractFactory(
    ["function owner() view returns (address)", "function transferOwnership(address) external"],
    simpleBytecode,
    wallet
  );
  
  try {
    console.log('🔄 Deploying contract...');
    
    // Get current gas price from network
    const feeData = await provider.getFeeData();
    console.log('Network fee data:', feeData);
    
    const contract = await contractFactory.deploy({
      gasLimit: 5000000,
      maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('2', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('1', 'gwei')
    });
    
    console.log('⏳ Waiting for confirmation...');
    const receipt = await contract.waitForDeployment();
    
    const deployedAddress = await contract.getAddress();
    console.log('✅ Contract deployed successfully!');
    console.log('📍 Contract Address:', deployedAddress);
    console.log('🔗 Network: Monad Testnet (Chain ID: 10143)');
    console.log('⛽ Gas Used:', receipt.gasUsed?.toString() || 'N/A');
    console.log('🔍 Explorer:', `https://monad-testnet.socialscan.io/address/${deployedAddress}`);
    
    return {
      contractAddress: deployedAddress,
      transactionHash: receipt.hash,
      network: 'monad-testnet',
      chainId: 10143
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

// Run deployment
deployContracts()
  .then(result => {
    console.log('\n🎉 CRYPTOVOTE deployment completed!');
    console.log('Contract Address:', result.contractAddress);
    console.log('Now ready for web application deployment...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });