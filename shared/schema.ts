import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const voters = pgTable("voters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  matricNumber: text("matric_number").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  hasVoted: boolean("has_voted").default(false),
  zkProofHash: text("zk_proof_hash"), // Zero-knowledge proof for eligibility verification
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const positions = pgTable("positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const candidates = pgTable("candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  department: text("department").notNull(),
  positionId: varchar("position_id").notNull().references(() => positions.id),
  voteCount: integer("vote_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voterId: varchar("voter_id").notNull().references(() => voters.id),
  candidateId: varchar("candidate_id").notNull().references(() => candidates.id),
  transactionHash: text("transaction_hash").notNull(),
  blockNumber: integer("block_number"),
  zkProofHash: text("zk_proof_hash"), // Zero-knowledge proof for vote integrity
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Eligible voters list managed by admin
export const eligibleVoters = pgTable("eligible_voters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matricNumber: text("matric_number").notNull().unique(),
  department: text("department").notNull(),
  level: text("level"), // e.g., "100L", "200L", etc.
  uploadedBy: text("uploaded_by").notNull().default("admin"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Relations
export const votersRelations = relations(voters, ({ many }) => ({
  votes: many(votes),
}));

export const positionsRelations = relations(positions, ({ many }) => ({
  candidates: many(candidates),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  position: one(positions, {
    fields: [candidates.positionId],
    references: [positions.id],
  }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  voter: one(voters, {
    fields: [votes.voterId],
    references: [voters.id],
  }),
  candidate: one(candidates, {
    fields: [votes.candidateId],
    references: [candidates.id],
  }),
}));

// Insert schemas with matric number validation
export const insertVoterSchema = createInsertSchema(voters).omit({
  id: true,
  hasVoted: true,
  zkProofHash: true,
  createdAt: true,
}).extend({
  matricNumber: z.string()
    .min(1, "Matric number is required")
    .regex(/^[A-Z]{2,5}\/\d{4}\/\d{3}$/, "Invalid matric number format. Must be DEPT/YYYY/XXX (e.g., CSC/2012/001 or ENG/2023/045)")
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
  createdAt: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  voteCount: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

export const insertEligibleVoterSchema = createInsertSchema(eligibleVoters).omit({
  id: true,
  uploadedBy: true,
  createdAt: true,
});

// Types
export type InsertVoter = z.infer<typeof insertVoterSchema>;
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type InsertEligibleVoter = z.infer<typeof insertEligibleVoterSchema>;

export type Voter = typeof voters.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type Candidate = typeof candidates.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type EligibleVoter = typeof eligibleVoters.$inferSelect;

// Extended types for API responses
export type CandidateWithPosition = Candidate & {
  position: Position;
};

export type PositionWithCandidates = Position & {
  candidates: Candidate[];
};

export type VotingStats = {
  totalVotes: number;
  eligibleVoters: number;
  turnoutPercentage: number;
};
