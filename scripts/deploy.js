const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying Zero-Knowledge Proof Enhanced Voting Contract to Base Sepolia...');
  
  // Get the contract factories
  const Verifier = await ethers.getContractFactory('Verifier');
  const VotingContract = await ethers.getContractFactory('VotingContract');
  
  // Deploy the verifier contract first
  console.log('Deploying ZKP Verifier...');
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  console.log(`Verifier deployed to: ${verifier.address}`);
  
  // Deploy the main voting contract with the verifier address
  console.log('Deploying Voting Contract...');
  const votingContract = await VotingContract.deploy(verifier.address);
  await votingContract.deployed();
  console.log(`Voting Contract deployed to: ${votingContract.address}`);
  
  // Verify the contracts on Basescan
  console.log('Waiting for confirmations...');
  await verifier.deployTransaction.wait(6);
  await votingContract.deployTransaction.wait(6);
  
  console.log('\nDeployment Summary:');
  console.log('===================');
  console.log(`ZKP Verifier: ${verifier.address}`);
  console.log(`Voting Contract: ${votingContract.address}`);
  console.log('Network: Base Sepolia');
  
  // Save deployment info
  const deploymentInfo = {
    network: 'base-sepolia',
    verifierAddress: verifier.address,
    votingContractAddress: votingContract.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  console.log('\nContract deployed successfully with ZKP integration!');
  console.log('Features:');
  console.log('- Zero-Knowledge Proof voter eligibility verification');
  console.log('- Private voting with public vote counts');
  console.log('- Immutable vote recording on Base Sepolia');
  
  return deploymentInfo;
}

main()
  .then((info) => {
    console.log('\nDeployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });