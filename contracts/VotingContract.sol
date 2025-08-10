// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./verifier.sol";

contract VotingContract {
    struct Vote {
        string candidateId;
        uint256 timestamp;
        bool isValid;
    }
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 registrationTime;
    }
    
    mapping(address => Voter) public voters;
    mapping(address => Vote[]) public voterBallots;
    mapping(string => uint256) public candidateVotes;
    
    address public admin;
    bool public votingActive;
    uint256 public totalVotes;
    
    // ZKP Verifier contract
    Verifier public immutable zkVerifier;
    
    event VoterRegistered(address indexed voter, uint256 timestamp);
    event VoteSubmitted(address indexed voter, uint256 voteCount, uint256 timestamp);
    event VotingStatusChanged(bool active);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRegistered() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        _;
    }
    
    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }
    
    constructor(address _zkVerifier) {
        admin = msg.sender;
        votingActive = true;
        zkVerifier = Verifier(_zkVerifier);
    }
    
    /**
     * @dev Register a voter with ZKP proof of eligibility
     * @param proof ZK proof that voter is eligible (has valid matric number)
     * @param publicSignals Public signals for the proof verification
     */
    function registerVoter(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[1] memory publicSignals
    ) external {
        require(!voters[msg.sender].isRegistered, "Voter already registered");
        
        // Verify ZK proof that the voter has a valid matric number
        // without revealing the actual matric number
        bool proofValid = zkVerifier.verifyTx(_pA, _pB, _pC, publicSignals);
        require(proofValid, "Invalid proof of eligibility");
        
        voters[msg.sender] = Voter({
            isRegistered: true,
            hasVoted: false,
            registrationTime: block.timestamp
        });
        
        emit VoterRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Submit votes with ZKP proof of vote integrity
     * @param candidateIds Array of candidate IDs being voted for
     * @param proof ZK proof that the vote is valid and voter hasn't voted before
     */
    function submitVote(
        string[] memory candidateIds,
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[2] memory publicSignals // [voterHash, voteHash]
    ) external onlyRegistered hasNotVoted votingIsActive {
        require(candidateIds.length > 0, "Must vote for at least one candidate");
        require(candidateIds.length <= 10, "Too many votes");
        
        // Verify ZK proof that:
        // 1. The voter is eligible and hasn't voted before
        // 2. The vote selection is valid
        bool proofValid = zkVerifier.verifyTx(_pA, _pB, _pC, publicSignals);
        require(proofValid, "Invalid vote proof");
        
        // Record votes
        for (uint i = 0; i < candidateIds.length; i++) {
            voterBallots[msg.sender].push(Vote({
                candidateId: candidateIds[i],
                timestamp: block.timestamp,
                isValid: true
            }));
            
            candidateVotes[candidateIds[i]]++;
        }
        
        voters[msg.sender].hasVoted = true;
        totalVotes++;
        
        emit VoteSubmitted(msg.sender, candidateIds.length, block.timestamp);
    }
    
    /**
     * @dev Get vote count for a candidate
     */
    function getCandidateVotes(string memory candidateId) external view returns (uint256) {
        return candidateVotes[candidateId];
    }
    
    /**
     * @dev Check if voter is registered
     */
    function isVoterRegistered(address voter) external view returns (bool) {
        return voters[voter].isRegistered;
    }
    
    /**
     * @dev Check if voter has voted
     */
    function hasVoterVoted(address voter) external view returns (bool) {
        return voters[voter].hasVoted;
    }
    
    /**
     * @dev Get voter's votes (only callable by the voter themselves for privacy)
     */
    function getMyVotes() external view returns (Vote[] memory) {
        require(voters[msg.sender].isRegistered, "Not registered");
        return voterBallots[msg.sender];
    }
    
    /**
     * @dev Admin function to toggle voting status
     */
    function toggleVoting() external onlyAdmin {
        votingActive = !votingActive;
        emit VotingStatusChanged(votingActive);
    }
    
    /**
     * @dev Get total number of votes cast
     */
    function getTotalVotes() external view returns (uint256) {
        return totalVotes;
    }
    
    /**
     * @dev Get voting statistics
     */
    function getVotingStats() external view returns (uint256 _totalVotes, bool _votingActive) {
        return (totalVotes, votingActive);
    }
}