# @oculus/sdk

> TypeScript SDK for the Oculus on-chain policy program. Talk to the program, subscribe to spend events, manage agent guardrails.

[![npm](https://img.shields.io/badge/npm-%40oculus%2Fsdk-cb3837?style=flat-square)](https://www.npmjs.com/package/@oculus/sdk)
[![License](https://img.shields.io/badge/license-MIT-d4d9e1?style=flat-square)](LICENSE)

## Install

```bash
npm install @oculus/sdk @coral-xyz/anchor @solana/web3.js
```

## Quick start

```ts
import { OculusClient } from "@oculus/sdk";
import { Connection, PublicKey } from "@solana/web3.js";

const sdk = new OculusClient({ connection, wallet });

// Bind a policy to an agent: $500/day rolling.
await sdk.initPolicy({
  agent: new PublicKey("Ag3nt..."),
  dailyLimitUsdc: 500_000_000,        // 500 USDC (6 decimals)
  windowSeconds: 86_400,
});

// Before a swap, check the spend at policy level.
const result = await sdk.checkSpend({ agent, amountUsdc: 50_000_000, memo: "swap-jupiter" });
if (!result.ok) {
  console.warn("blocked:", result.reason);
}
```

## API

| Method            | Purpose                                                          |
|-------------------|------------------------------------------------------------------|
| `initPolicy`      | Create a per-agent policy PDA with a daily USDC limit            |
| `checkSpend`      | Validate a spend against the rolling window                      |
| `fetchPolicy`     | Read raw policy state                                            |
| `summary`         | Decoded view: limit, spent, remaining, reset time, paused        |
| `onSpendChecked`  | Subscribe to `SpendChecked` events                               |
| `onLimitBreached` | Subscribe to `LimitBreached` events                              |

## Linked

- [oculus-program](https://github.com/useoculusagent/oculus-program) — the Anchor program
- [oculusagent.xyz](https://oculusagent.xyz) — product

## License

MIT

<!-- rev 1 -->

<!-- rev 39 -->

<!-- rev 45 -->

<!-- rev 50 -->
