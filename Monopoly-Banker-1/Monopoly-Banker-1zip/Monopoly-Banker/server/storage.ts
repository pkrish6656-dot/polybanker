import {
  users,
  type User,
  type InsertUser,
  players,
  type Player,
  type InsertPlayer,
  transactions,
  type Transaction,
  type InsertTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Players
  getPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player>;
  deletePlayer(id: number): Promise<void>;
  resetGame(startBalance: number): Promise<Player[]>;

  // Transactions
  getTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class DatabaseStorage implements IStorage {
  // Players
  async getPlayers(): Promise<Player[]> {
    return await db.select().from(players).orderBy(players.id);
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db
      .insert(players)
      .values(insertPlayer)
      .returning();
    return player;
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player> {
    const [updated] = await db
      .update(players)
      .set(updates)
      .where(eq(players.id, id))
      .returning();
    return updated;
  }

  async deletePlayer(id: number): Promise<void> {
    await db.delete(players).where(eq(players.id, id));
  }

  async resetGame(startBalance: number): Promise<Player[]> {
    // 1. Delete all transactions
    await db.delete(transactions);

    // 2. Reset all players
    await db
      .update(players)
      .set({
        balance: startBalance,
        isBankrupt: false,
      });

    return await this.getPlayers();
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(50); // Last 50 transactions
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    // 1. Insert transaction record
    const [transaction] = await db
      .insert(transactions)
      .values(tx)
      .returning();

    // 2. Update balances
    // From Player (paying)
    if (tx.fromPlayerId) {
      const fromPlayer = await this.getPlayer(tx.fromPlayerId);
      if (fromPlayer) {
        let newBalance = fromPlayer.balance - tx.amount;
        await this.updatePlayer(tx.fromPlayerId, {
          balance: newBalance,
          // Auto-detect bankruptcy? Optional. Let's strictly just update balance.
        });
      }
    }

    // To Player (receiving)
    if (tx.toPlayerId) {
      const toPlayer = await this.getPlayer(tx.toPlayerId);
      if (toPlayer) {
        let newBalance = toPlayer.balance + tx.amount;
        await this.updatePlayer(tx.toPlayerId, {
          balance: newBalance,
        });
      }
    }

    return transaction;
  }
}

export const storage = new DatabaseStorage();
