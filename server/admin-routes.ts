import { Router } from "express";
import { storage } from "./storage";

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

export default router;