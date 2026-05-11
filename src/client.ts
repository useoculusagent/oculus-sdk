import { AnchorProvider, BN, Program, web3 } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { findPolicyPda } from "./pda";
import type { PolicyAccount, PolicySummary, CheckSpendResult } from "./types";
import idl from "./idl/oculus_policy.json";

const DEFAULT_PROGRAM_ID = new PublicKey("OcuLus1111111111111111111111111111111111111");

/**
 * Lightweight client around the oculus-policy Anchor program.
 *
 * Usage:
 *   const sdk = new OculusClient({ connection, wallet });
 *   await sdk.initPolicy({ agent, dailyLimitUsdc: 500_000_000, windowSeconds: 86_400 });
 *   await sdk.checkSpend({ agent, amountUsdc: 50_000_000, memo: "swap-jupiter" });
 */
export class OculusClient {
  readonly program: Program;
  readonly connection: Connection;

  constructor(opts: { connection: Connection; wallet: web3.AnchorWallet; programId?: PublicKey }) {
    this.connection = opts.connection;
    const provider = new AnchorProvider(opts.connection, opts.wallet, { commitment: "confirmed" });
    this.program = new Program(idl as any, provider);
  }

  get programId(): PublicKey {
    return this.program.programId;
  }

  async initPolicy(args: {
    agent: PublicKey;
    dailyLimitUsdc: number | BN;
    windowSeconds?: number;
  }): Promise<string> {
    const limit = BN.isBN(args.dailyLimitUsdc) ? args.dailyLimitUsdc : new BN(args.dailyLimitUsdc);
    const window = args.windowSeconds ?? 86_400;
    const [policy] = findPolicyPda(this.programId, args.agent);
    return this.program.methods
      .initPolicy(args.agent, limit, window)
      .accounts({ policy })
      .rpc();
  }

  async fetchPolicy(agent: PublicKey): Promise<PolicyAccount | null> {
    const [policy] = findPolicyPda(this.programId, agent);
    try {
      return (await this.program.account.policy.fetch(policy)) as PolicyAccount;
    } catch {
      return null;
    }
  }

  async summary(agent: PublicKey): Promise<PolicySummary | null> {
    const p = await this.fetchPolicy(agent);
    if (!p) return null;
    const spent = p.spentWindow.toNumber();
    const limit = p.dailyLimitUsdc.toNumber();
    const resets = new Date((p.windowStartAt.toNumber() + p.windowSeconds) * 1000);
    return {
      agent: p.agent.toBase58(),
      dailyLimitUsdc: limit,
      spentWindow: spent,
      remainingWindow: Math.max(0, limit - spent),
      resetsAt: resets,
      paused: p.paused,
    };
  }

  async checkSpend(args: {
    agent: Keypair;
    amountUsdc: number;
    memo?: string;
  }): Promise<CheckSpendResult> {
    const [policy] = findPolicyPda(this.programId, args.agent.publicKey);
    const memo = Buffer.alloc(32);
    if (args.memo) Buffer.from(args.memo).copy(memo, 0, 0, Math.min(args.memo.length, 32));
    try {
      const sig = await this.program.methods
        .checkSpend(new BN(args.amountUsdc), Array.from(memo))
        .accounts({ policy, agent: args.agent.publicKey })
        .signers([args.agent])
        .rpc();
      return { ok: true, signature: sig };
    } catch (e: any) {
      const code = e?.error?.errorCode?.code as string | undefined;
      const reason =
        code === "LimitExceeded" ? "limit_exceeded" :
        code === "PolicyPaused" ? "policy_paused" :
        "unknown";
      return { ok: false, reason, details: e?.error };
    }
  }
}

export { DEFAULT_PROGRAM_ID };

// maintenance pass 2

// maintenance pass 14

// pass 6

// pass 31

// pass 53
