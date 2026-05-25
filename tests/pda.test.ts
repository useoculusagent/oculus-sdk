import { describe, it, expect } from "vitest";
import { PublicKey } from "@solana/web3.js";
import { findPolicyPda } from "../src/pda";

describe("findPolicyPda", () => {
  it("derives a deterministic address per agent", () => {
    const programId = new PublicKey("OcuLus1111111111111111111111111111111111111");
    const agent = new PublicKey("11111111111111111111111111111111");
    const [pda1] = findPolicyPda(programId, agent);
    const [pda2] = findPolicyPda(programId, agent);
    expect(pda1.toBase58()).toBe(pda2.toBase58());
  });
});
