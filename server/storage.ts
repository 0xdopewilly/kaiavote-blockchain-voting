import { 
  voters, 
  positions, 
  candidates, 
  votes,
  type Voter, 
  type Position,
  type Candidate,
  type Vote,
  type InsertVoter, 
  type InsertPosition,
  type InsertCandidate,
  type InsertVote,
  type CandidateWithPosition,
  type PositionWithCandidates,
  type VotingStats
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Voter operations
  getVoter(id: string): Promise<Voter | undefined>;
  getVoterByMatricNumber(matricNumber: string): Promise<Voter | undefined>;
  getVoterByWalletAddress(walletAddress: string): Promise<Voter | undefined>;
  getAllVoters(): Promise<Voter[]>;
  createVoter(voter: InsertVoter): Promise<Voter>;
  updateVoterVotedStatus(id: string, hasVoted: boolean): Promise<void>;

  // Position operations
  getAllPositions(): Promise<Position[]>;
  getPositionsWithCandidates(): Promise<PositionWithCandidates[]>;
  createPosition(position: InsertPosition): Promise<Position>;

  // Candidate operations
  getAllCandidates(): Promise<Candidate[]>;
  getCandidatesByPosition(positionId: string): Promise<Candidate[]>;
  getCandidatesWithPositions(): Promise<CandidateWithPosition[]>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  incrementCandidateVoteCount(candidateId: string): Promise<void>;

  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByVoter(voterId: string): Promise<Vote[]>;
  hasVoterVoted(voterId: string): Promise<boolean>;

  // Statistics
  getVotingStats(): Promise<VotingStats>;
}

export class DatabaseStorage implements IStorage {
  async getVoter(id: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.id, id));
    return voter || undefined;
  }

  async getVoterByMatricNumber(matricNumber: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.matricNumber, matricNumber));
    return voter || undefined;
  }

  async getVoterByWalletAddress(walletAddress: string): Promise<Voter | undefined> {
    // Always search with lowercase for consistency
    const normalizedAddress = walletAddress.toLowerCase();
    const [voter] = await db.select().from(voters).where(eq(voters.walletAddress, normalizedAddress));
    return voter || undefined;
  }

  async getAllVoters(): Promise<Voter[]> {
    return await db.select().from(voters);
  }

  async createVoter(insertVoter: InsertVoter & { zkProof?: any }): Promise<Voter> {
    const { zkProof, ...voterData } = insertVoter as any;
    
    // Store ZKP hash if provided for audit purposes
    const zkProofHash = zkProof ? 
      JSON.stringify(zkProof).slice(0, 100) : // Store truncated proof for demo
      null;
    
    const [voter] = await db
      .insert(voters)
      .values({
        ...voterData,
        zkProofHash
      })
      .returning();
    return voter;
  }

  async updateVoterVotedStatus(id: string, hasVoted: boolean): Promise<void> {
    await db
      .update(voters)
      .set({ hasVoted })
      .where(eq(voters.id, id));
  }

  async getAllPositions(): Promise<Position[]> {
    return await db.select().from(positions);
  }

  async getPositionsWithCandidates(): Promise<PositionWithCandidates[]> {
    const positionsData = await db.select().from(positions);
    const candidatesData = await db.select().from(candidates);

    return positionsData.map(position => ({
      ...position,
      candidates: candidatesData.filter(candidate => candidate.positionId === position.id)
    }));
  }

  async createPosition(insertPosition: InsertPosition): Promise<Position> {
    const [position] = await db
      .insert(positions)
      .values(insertPosition)
      .returning();
    return position;
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return await db.select().from(candidates);
  }

  async getCandidatesByPosition(positionId: string): Promise<Candidate[]> {
    return await db.select().from(candidates).where(eq(candidates.positionId, positionId));
  }

  async getCandidatesWithPositions(): Promise<CandidateWithPosition[]> {
    return await db
      .select({
        id: candidates.id,
        name: candidates.name,
        department: candidates.department,
        positionId: candidates.positionId,
        voteCount: candidates.voteCount,
        createdAt: candidates.createdAt,
        position: {
          id: positions.id,
          name: positions.name,
          description: positions.description,
          createdAt: positions.createdAt,
        }
      })
      .from(candidates)
      .innerJoin(positions, eq(candidates.positionId, positions.id));
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values(insertCandidate)
      .returning();
    return candidate;
  }

  async incrementCandidateVoteCount(candidateId: string): Promise<void> {
    await db
      .update(candidates)
      .set({ voteCount: sql`${candidates.voteCount} + 1` })
      .where(eq(candidates.id, candidateId));
  }

  async createVote(insertVote: InsertVote & { zkProof?: any }): Promise<Vote> {
    const { zkProof, ...voteData } = insertVote as any;
    
    // Store ZKP hash for vote integrity verification
    const zkProofHash = zkProof ? 
      JSON.stringify(zkProof).slice(0, 100) : // Store truncated proof for demo
      null;
    
    const [vote] = await db
      .insert(votes)
      .values({
        ...voteData,
        zkProofHash
      })
      .returning();
    return vote;
  }

  async getVotesByVoter(voterId: string): Promise<Vote[]> {
    return await db.select().from(votes).where(eq(votes.voterId, voterId));
  }

  async hasVoterVoted(voterId: string): Promise<boolean> {
    const [vote] = await db.select().from(votes).where(eq(votes.voterId, voterId)).limit(1);
    return !!vote;
  }

  async getVotingStats(): Promise<VotingStats> {
    const [totalVotesResult] = await db.select({ count: sql<number>`count(*)` }).from(votes);
    const [eligibleVotersResult] = await db.select({ count: sql<number>`count(*)` }).from(voters);
    
    const totalVotes = totalVotesResult.count || 0;
    const eligibleVoters = eligibleVotersResult.count || 0;
    const turnoutPercentage = eligibleVoters > 0 ? (totalVotes / eligibleVoters) * 100 : 0;

    return {
      totalVotes,
      eligibleVoters,
      turnoutPercentage: Math.round(turnoutPercentage * 100) / 100
    };
  }
}

export const storage = new DatabaseStorage();
