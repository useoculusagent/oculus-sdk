import type { Program } from "@coral-xyz/anchor";
import type { SpendCheckedEvent, LimitBreachedEvent } from "./types";

/**
 * Subscribe to on-chain events emitted by the policy program.
 * Returns an unsubscribe function.
 */
export function onSpendChecked(program: Program, cb: (e: SpendCheckedEvent, slot: number) => void): () => void {
  const id = program.addEventListener("SpendChecked", (e: any, slot: number) => cb(e as SpendCheckedEvent, slot));
  return () => program.removeEventListener(id);
}

export function onLimitBreached(program: Program, cb: (e: LimitBreachedEvent, slot: number) => void): () => void {
  const id = program.addEventListener("LimitBreached", (e: any, slot: number) => cb(e as LimitBreachedEvent, slot));
  return () => program.removeEventListener(id);
}

// pass 1

// pass 10

// pass 13

// pass 19
