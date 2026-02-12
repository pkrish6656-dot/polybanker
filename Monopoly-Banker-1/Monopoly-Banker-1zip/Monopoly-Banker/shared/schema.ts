import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  balance: integer("balance").notNull().default(1500),
  color: text("color").notNull().default("#3b82f6"),
  isBankrupt: boolean("is_bankrupt").notNull().default(false),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromPlayerId: integer("from_player_id"), // Null represents the Bank
  toPlayerId: integer("to_player_id"),   // Null represents the Bank
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  name: true,
  color: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  fromPlayerId: true,
  toPlayerId: true,
  amount: true,
  description: true,
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Custom types for API communication
export type TransferRequest = {
  fromPlayerId?: number; // Optional, missing = Bank
  toPlayerId?: number;   // Optional, missing = Bank
  amount: number;
  description: string;
};
