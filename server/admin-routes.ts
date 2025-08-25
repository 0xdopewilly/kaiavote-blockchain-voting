import { Router } from "express";
import { storage } from "./storage";
import { insertEligibleVoterSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Get all registered voters (admin only)
router.get("/voters", async (req, res) => {
  try {
    const voters = await storage.getAllVoters();
    res.json(voters);
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ message: "Failed to fetch voters" });
  }
});

// Get all votes with details (admin only)
router.get("/votes", async (req, res) => {
  try {
    const votes = await storage.getAllVotesWithDetails();
    res.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Failed to fetch votes" });
  }
});

// Get all eligible voters (admin only)
router.get("/eligible-voters", async (req, res) => {
  try {
    const eligibleVoters = await storage.getAllEligibleVoters();
    res.json(eligibleVoters);
  } catch (error) {
    console.error("Error fetching eligible voters:", error);
    res.status(500).json({ message: "Failed to fetch eligible voters" });
  }
});

// Upload eligible voters list (admin only)
router.post("/eligible-voters/upload", async (req, res) => {
  try {
    const schema = z.object({
      voters: z.array(insertEligibleVoterSchema).min(1, "At least one voter is required"),
      clearExisting: z.boolean().default(true)
    });
    
    const validatedData = schema.parse(req.body);
    
    // Clear existing list if requested
    if (validatedData.clearExisting) {
      await storage.clearEligibleVoters();
    }
    
    // Add new eligible voters
    const addedVoters = await storage.addEligibleVoters(validatedData.voters);
    
    res.json({ 
      message: `Successfully uploaded ${addedVoters.length} eligible voters`,
      added: addedVoters.length,
      cleared: validatedData.clearExisting
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: fromZodError(error).toString() });
    }
    console.error("Error uploading eligible voters:", error);
    res.status(500).json({ message: "Failed to upload eligible voters" });
  }
});

// Clear all eligible voters (admin only)
router.delete("/eligible-voters", async (req, res) => {
  try {
    await storage.clearEligibleVoters();
    res.json({ message: "All eligible voters cleared successfully" });
  } catch (error) {
    console.error("Error clearing eligible voters:", error);
    res.status(500).json({ message: "Failed to clear eligible voters" });
  }
});

export default router;