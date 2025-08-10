import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoterSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Voter registration
  app.post("/api/voters/register", async (req, res) => {
    try {
      const validatedData = insertVoterSchema.parse(req.body);
      
      // Check if voter already exists by matric number
      const existingVoterByMatric = await storage.getVoterByMatricNumber(validatedData.matricNumber);
      if (existingVoterByMatric) {
        return res.status(400).json({ error: `This matric number is already registered. Use a different matric number or connect wallet: ${existingVoterByMatric.walletAddress.slice(0,6)}...${existingVoterByMatric.walletAddress.slice(-4)}` });
      }

      // Check if voter already exists by wallet address
      const existingVoterByWallet = await storage.getVoterByWalletAddress(validatedData.walletAddress);
      if (existingVoterByWallet) {
        return res.status(400).json({ error: `This wallet is already registered as ${existingVoterByWallet.fullName}. Use a different wallet or connect to existing registration.` });
      }

      const voter = await storage.createVoter(validatedData);
      res.json(voter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Check voter by wallet address
  app.get("/api/voters/wallet/:address", async (req, res) => {
    try {
      const voter = await storage.getVoterByWalletAddress(req.params.address);
      if (!voter) {
        return res.status(404).json({ error: "Voter not found" });
      }
      res.json(voter);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all positions with candidates
  app.get("/api/positions", async (req, res) => {
    try {
      const positions = await storage.getPositionsWithCandidates();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all candidates with their vote counts
  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getCandidatesWithPositions();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all registered voters (for admin/debug)
  app.get("/api/voters", async (req, res) => {
    try {
      const voters = await storage.getAllVoters();
      res.json(voters);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Submit vote
  app.post("/api/votes", async (req, res) => {
    try {
      const voteSchema = z.object({
        voterId: z.string(),
        votes: z.array(z.object({
          candidateId: z.string(),
          positionId: z.string()
        })),
        transactionHash: z.string(),
        blockNumber: z.number(),
        zkProof: z.any().optional()
      });

      const validatedData = voteSchema.parse(req.body);
      
      // Check if voter exists and hasn't voted
      const voter = await storage.getVoter(validatedData.voterId);
      if (!voter) {
        return res.status(404).json({ error: "Voter not found" });
      }

      if (voter.hasVoted || await storage.hasVoterVoted(validatedData.voterId)) {
        return res.status(400).json({ error: "Voter has already voted" });
      }

      // Create votes for each position with ZKP
      const createdVotes = [];
      for (const vote of validatedData.votes) {
        const createdVote = await storage.createVote({
          voterId: validatedData.voterId,
          candidateId: vote.candidateId,
          transactionHash: validatedData.transactionHash,
          blockNumber: validatedData.blockNumber,
          zkProof: (req.body as any).zkProof // Include ZKP from request
        });
        
        // Increment candidate vote count
        await storage.incrementCandidateVoteCount(vote.candidateId);
        createdVotes.push(createdVote);
      }

      // Mark voter as having voted
      await storage.updateVoterVotedStatus(validatedData.voterId, true);

      res.json({ votes: createdVotes, message: "Votes recorded successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: fromZodError(error).toString() });
      }
      console.error("Vote submission error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get voting statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getVotingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Seed initial data (for development)
  app.post("/api/seed", async (req, res) => {
    try {
      // Create positions
      const classPresident = await storage.createPosition({
        name: "Class President",
        description: "Leadership position for the entire class"
      });

      const departmentalPresident = await storage.createPosition({
        name: "Departmental President", 
        description: "Leadership position for the department"
      });

      const financialSecretary = await storage.createPosition({
        name: "Financial Secretary",
        description: "Manages financial matters and budget"
      });

      // Create candidates
      await storage.createCandidate({
        name: "John Smith",
        department: "Computer Science Department",
        positionId: classPresident.id
      });

      await storage.createCandidate({
        name: "Sarah Johnson",
        department: "Computer Science Department", 
        positionId: classPresident.id
      });

      await storage.createCandidate({
        name: "Michael Brown",
        department: "Computer Science Department",
        positionId: departmentalPresident.id
      });

      await storage.createCandidate({
        name: "Emily Davis",
        department: "Computer Science Department",
        positionId: departmentalPresident.id
      });

      await storage.createCandidate({
        name: "David Wilson",
        department: "Business Administration",
        positionId: financialSecretary.id
      });

      await storage.createCandidate({
        name: "Lisa Anderson", 
        department: "Accounting Department",
        positionId: financialSecretary.id
      });

      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
