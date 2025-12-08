# Escrow Contract

**Escrow System on Midnight Network**

## Quick Start

### 1. Install Dependencies

```sh
yarn install
```

### 2. Fetch ZK Parameters

```sh
cd packages/cli
./fetch-zk-params.sh
```

This downloads all required ZK parameters (k=10 to k=17) to `.cache/midnight/zk-params/`.

### 3. Build All Packages

```sh
yarn build:all
```

This compiles the contract, builds the API, and builds the UI.

### 4. Start Infrastructure

Choose one option:

#### Option A: Testnet (connects to Midnight public testnet)

```sh
cd packages/cli
docker compose -f testnet.yml up
```

#### Option B: Standalone/Local (runs your own local network)

```sh
cd packages/cli
docker compose -f standalone.yml up
```

**Ports:**
- Node: `9944`
- Indexer: `8088`
- Proof Server: `6300`

### 5. Configure Environment Variables

#### For Testnet:

```sh
cd packages/ui
echo "VITE_NETWORK_ID=TestNet
VITE_LOGGING_LEVEL=trace" > .env
```

#### For Standalone/Undeployed:

```sh
cd packages/ui
echo "VITE_NETWORK_ID=Undeployed
VITE_LOGGING_LEVEL=trace" > .env
```

### 6. Configure Wallet

- Open **Midnight Lace Wallet**
- Go to **Settings** → **Network**
- Select:
  - **TestNet** for Option A
  - **Undeployed** for Option B (standalone)

### 7. Fund Wallet (Standalone only)

If using standalone, fund your wallet address:

```sh
yarn fund mn_shield-addr_undeployed...
```

### 8. Start Development Server

```sh
cd packages/ui
yarn start
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

## Notes

- Contributor addresses must be `ZswapCoinPublicKey` format (32 bytes, hex string)
- The contract uses an empty private state
- Treasury is managed using `QualifiedCoinInfo`
- Contract address already deployed on TestNet: `020027a770b658fc040c3435fdf5f59b90c2b3430911d76ef52cd0017a087b8c7984`
