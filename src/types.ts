import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface PolicyAccount {
  owner: PublicKey;
  agent: PublicKey;
  dailyLimitUsdc: BN;
  windowSeconds: number;
  windowStartAt: BN;
  spentWindow: BN;
  paused: boolean;
  pauseReason: number;
  createdAt: BN;
  bump: number;
}

export interface PolicySummary {
  agent: string;
  dailyLimitUsdc: number;
  spentWindow: number;
  remainingWindow: number;
  resetsAt: Date;
  paused: boolean;
}

export interface CheckSpendResult {
  ok: boolean;
  signature?: string;
  reason?: "limit_exceeded" | "policy_paused" | "unknown";
  details?: unknown;
}

export type SpendCheckedEvent = {
  agent: PublicKey;
  amountUsdc: BN;
  spentWindow: BN;
  limit: BN;
  at: BN;
};

export type LimitBreachedEvent = {
  agent: PublicKey;
  attempted: BN;
  limit: BN;
  spentWindow: BN;
  at: BN;
};

// pass 2

// pass 20

// pass 32

// pass 46

// pass 47
