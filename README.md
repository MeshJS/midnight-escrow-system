# Midnight Escrow System

Decentralized escrow system built on the Midnight Network using Compact smart contracts. The escrow contract enables secure, trustless transactions by holding funds in escrow until conditions are met.

### Key Features

- **Create Escrows**: Deposit funds and assign them to a contributor using their `ZswapCoinPublicKey` address
- **Release Funds**: Release escrowed funds to the designated contributor
- **State Management**: Track escrow status (active, released, refunded)
- **Privacy-Preserving**: Built on Midnight Network with zero-knowledge proofs for transaction privacy
- **Treasury Management**: Secure fund storage using `QualifiedCoinInfo`

### How It Works

1. **Create**: A user creates an escrow by depositing funds and specifying a contributor address. The contract stores the funds in its treasury and assigns a unique escrow ID.

2. **Release**: When conditions are met, the escrow can be released, transferring the funds to the designated contributor address.

3. **State Tracking**: Each escrow maintains its state (active → released), allowing for transparent tracking of all escrow transactions.

## Quick Start

### 1. Install Dependencies

```sh
yarn install
```

### 2. Fetch ZK Parameters

- Navigate to the `cli` folder:
```sh
cd packages/cli
```

- Run zk-params script for proof server:
```sh
./fetch-zk-params.sh
```

This downloads all required ZK parameters (k=10 to k=17) to `.cache/midnight/zk-params/`.

### 3. Configure Environment Variables

#### For Testnet:

- Navigate to the `ui` folder
```sh
cd packages/ui
```

- Add the `.env` variables
```sh
echo "VITE_NETWORK_ID=TestNet
VITE_LOGGING_LEVEL=trace" > .env
```

#### For Standalone (Local Development):

- Navigate to the `ui` folder
```sh
cd packages/ui
```

- Add the `.env` variables (use `Undeployed` as the Network ID for local development)
```sh
echo "VITE_NETWORK_ID=Undeployed
VITE_LOGGING_LEVEL=trace" > .env
```

### 4. Build All Packages

```sh
yarn build:all
```

This compiles the contract, builds the API, and builds the UI.

> **Note:** This project uses Compact 0.24.0 for contract compilation.

### 5. Start Infrastructure

Choose one option:

#### Option A: Testnet (connects to Midnight public testnet)

```sh
cd packages/cli && docker compose -f testnet.yml up
```

#### Option B: Standalone (runs your own local network)

```sh
cd packages/cli && docker compose -f standalone.yml up
```

**Ports:**
- Node: `9944`
- Indexer: `8088`
- Proof Server: `6300`

### 6. Configure Wallet

- Open **Midnight Lace Wallet**
- Go to **Settings** → **Network**
- Select:
  - **TestNet** for Option A
  - **Undeployed** for Option B (Standalone infrastructure)

### 7. Fund Wallet (Standalone only)

If using Standalone infrastructure, fund your wallet address:

- Go to the `cli` folder:
```sh
cd packages/cli
```

- Run the `fund` command to receive Midnight test tokens (tDUST), replace `mn_shield-addr_undeployed...` with your Undeployed network address:

```sh
yarn fund mn_shield-addr_undeployed...
```

### 8. Start Development Server

```sh
cd packages/ui && yarn start
```

Open `http://localhost:8080` in your browser.

## Root Scripts

```sh
yarn build:all       # Build everything
yarn infra:up        # Start standalone infrastructure
yarn infra:down      # Stop standalone infrastructure
yarn infra:logs      # View infrastructure logs
yarn fund <address>  # Fund wallet (standalone mode)
```

## Project Structure

```
escrow/
├── packages/
│   ├── contract/     # Escrow Compact contract
│   ├── api/          # API layer
│   ├── ui/           # React frontend
│   └── cli/          # Infrastructure & CLI tools
│       ├── standalone.yml  # Local network compose
│       ├── testnet.yml     # Testnet compose
│       └── src/            # Funding scripts
├── compact/          # Compact compiler
└── .cache/           # ZK params (gitignored)
```

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the existing code style
3. **Test thoroughly** - ensure all builds pass and the contract works as expected
4. **Submit a pull request** with a clear description of your changes

---

<div align="center">
  <p>
    <a href="https://meshjs.dev/"><img src="packages/ui/public/images/mesh-logo.svg" alt="MeshJS Logo" width="30" height="20" style="vertical-align: middle;" /></a>
    <strong> × </strong>
    <a href="https://socious.io/"><img src="packages/ui/public/images/socious-logo.svg" alt="Socious Logo" width="18" height="20" style="vertical-align: middle;" /></a>
  </p>
  <p>Powered by <a href="https://meshjs.dev/">MeshJS</a> in partnership with <a href="https://socious.io/">Socious</a></p>
  <p>Built with ❤️ on Midnight Network</p>
</div>