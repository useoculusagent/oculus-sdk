import { PublicKey } from "@solana/web3.js";

export const POLICY_SEED = Buffer.from("policy");

/**
 * Derive the Policy PDA for a given agent wallet.
 * Mirrors the seeds layout in programs/oculus-policy/src/instructions/init_policy.rs.
 */
export function findPolicyPda(programId: PublicKey, agent: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [POLICY_SEED, agent.toBytes()],
    programId,
  );
}

// maintenance pass 10

// maintenance pass 12

// pass 17
