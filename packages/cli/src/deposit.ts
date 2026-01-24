///////////////////////////////////////////////////////
// Deposit native tokens into a Midnight wallet address
// Usage: yarn deposit <receiverAddress>
///////////////////////////////////////////////////////

import { StandaloneConfig } from "./config.js";
import { nativeToken } from "@midnight-ntwrk/ledger";
import { getZswapNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { WalletBuilder, type Resource } from "@midnight-ntwrk/wallet";
import type { Wallet, WalletState } from "@midnight-ntwrk/wallet-api";
import { pino } from "pino";
import type { PrettyOptions } from "pino-pretty";
import type { Subscription } from "rxjs";

const LOG_LEVEL = "info";
const DEPOSIT_AMOUNT = 1_000_000_000_000n; // 1e12 (1,000,000 DUST)
const GENESIS_SEED =
  "0000000000000000000000000000000000000000000000000000000000000001";
const POLL_INTERVAL_MILLISECONDS = 7_500;

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const logger = pino({
  level: LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: { colorize: true } satisfies PrettyOptions,
  },
});

function createReceiverAddress(parameters: string[]): string {
  return parameters[2] as string;
}

function nextState(wallet: Wallet): Promise<WalletState> {
  return new Promise((resolve) => {
    const subscription: Subscription = wallet.state().subscribe((value) => {
      subscription.unsubscribe();
      resolve(value);
    });
  });
}

async function waitUntilFunded(wallet: Wallet): Promise<bigint> {
  let ticks = 0;
  for (;;) {
    const state = await nextState(wallet);
    const balance = state.balances[nativeToken()] as bigint;
    ticks += 1;

    if (ticks % 2 === 1) {
      logger.info("Wallet syncing...");
    } else {
      logger.info({
        balance: balance.toString(),
        transactions: state.transactionHistory.length,
      });
    }

    if (balance > 0n) {
      return balance;
    }
    await sleep(POLL_INTERVAL_MILLISECONDS);
  }
}

async function openWallet(): Promise<Wallet & Resource> {
  const configuration = new StandaloneConfig();
  const wallet = await WalletBuilder.buildFromSeed(
    configuration.indexer,
    configuration.indexerWS,
    configuration.proofServer,
    configuration.node,
    GENESIS_SEED,
    getZswapNetworkId(),
    "warn"
  );
  wallet.start();
  return wallet;
}

async function deposit(): Promise<void> {
  const receiver = createReceiverAddress(process.argv);
  logger.info("Booting deposit flow");

  try {
    const wallet = await openWallet();
    try {
      const initialState = await nextState(wallet);
      logger.info({ sender: initialState.address }, "Sender online");

      const balance = await waitUntilFunded(wallet);
      logger.info({ balance: balance.toString() }, "Sender funded");

      const transfer = await wallet.transferTransaction([
        { amount: DEPOSIT_AMOUNT, receiverAddress: receiver, type: nativeToken() },
      ]);
      logger.info("Transfer recipe ready");

      const proof = await wallet.proveTransaction(transfer);
      logger.info("Proof built");

      const transactionHash = await wallet.submitTransaction(proof);
      logger.info(
        { transactionHash, receiver, amount: DEPOSIT_AMOUNT.toString() },
        "Deposit broadcast"
      );
    } finally {
      await wallet.close();
      logger.info("Wallet shutdown complete");
    }
  } catch (error) {
    logger.error({ error: String(error) }, "Deposit flow failed");
    process.exitCode = 1;
  }
}

deposit().catch((error) => {
  console.error("Unexpected error:", String(error));
  process.exit(1);
});
