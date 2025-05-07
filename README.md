## Halflife Oracle

**Halflife Oracle** streams on‑chain data, fuses it into a real‑time **Token Lifespan Index (TLI)**, and publishes the score on‑chain and over WebSockets every block.
Traders can build perpetual “time” derivatives, exchanges can price listing risk, and risk desks can see a single 0‑100 heartbeat for any ERC‑20 they care about.

---

### ✨ Key features

* **5 s refresh‑rate** using Base Flashblocks mini‑blocks.
* **Multi‑source ETL**—Covalent for holder snapshots, Bitquery & 1inch for liquidity, Santiment for CEX flows, Glassnode‑style dormancy from Substreams.
* **Gradient‑boosted survival model** trained on 10 k historical token deaths; SHAP weights are published for transparency.
* **Chainlink‑compatible aggregator** pushes the TLI on‑chain so smart‑contracts can read a single uint256.
* **Off‑chain WebSocket API** streams the full metric bundle for dashboards and quants.

---

### 📊 Why these metrics?

| Metric bucket                  | API(s)                                                                              | Why it matters                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Holder growth & churn**      | Covalent `token_holders` ([Covalent][1])                                            | Adoption velocity stalls days before price collapses.                  |
| **Dormancy / coin‑age**        | Substreams Firehose ([Welcome to Flipside \| Flipside Docs][2])                     | Spikes mean long‑term capital is leaving the network.                  |
| **Liquidity depth & slippage** | Bitquery DEX GraphQL ([Bitquery][3]) + 1inch `/quote` ([1inch Developer Portal][4]) | Shallow or fragmented liquidity lets a rug pull drain pools in one tx. |
| **30‑d TVL & LP fees**         | Token Terminal fees API ([Bitquery][5])                                             | Falling fee income shows mercenary LPs are exiting.                    |
| **CEX inflow/outflow**         | Santiment Exchange Flow ([GitHub][6])                                               | Large inflows mean holders are heading for the exit.                   |
| **Whale labels**               | Arkham Intelligence API ([Covalent][7])                                             | Single whale deposits often trigger cascades.                          |
| **NVT sanity check**           | CoinMetrics / CryptoQuant NVT ([Welcome to Flipside \| Flipside Docs][8])           | Flags bubbles where value outruns usage.                               |

Each signal covers a different failure mode—conviction, monetary velocity, liquidity runway, exogenous drains, or valuation heat—so the survival model can learn which matters most in each regime.

---

### 🏗 Architecture

```
 Flashblocks WS  ─┐
                 │    ┌───────────────┐
 Covalent REST   ─┼──▶│ Ingest Layer  │──────────┐
 Bitquery GQL    ─┤    └───────────────┘          │
 1inch REST      ─┤                              ▼
 Santiment REST  ─┘    ┌──────────────────┐   ┌────────┐
                           Transform &        Survival
                      EWMA Normalisation  ─▶  Model
                        (Rust & DuckDB)       (xgboost)
                               │                  │
                               ▼                  │
                    ┌───────────────────────┐     │
                    │ Chainlink Aggregator  │◀────┘
                    └───────────────────────┘
                               │
                               ▼
                    WebSocket / REST API
```

---

### 🚀 Quick start

```bash
git clone https://github.com/your‑org/halflife‑oracle.git
cd halflife‑oracle
cp .env.sample .env      # add API keys from Covalent, Bitquery, 1inch, Santiment
docker compose up --build
```

* `npm run ingest` – starts the ETL workers
* `npm run oracle` – posts the TLI to the Chainlink aggregator every block
* `npm run api` – websockets on `ws://localhost:8080`

> **Tip:** Free‑tier limits are plenty for dev: Covalent 5 req/s, Bitquery 100 k GQL points/day, 1inch 1 RPS ([1inch Developer Portal][4]), Flipside 500 query‑seconds/month ([Welcome to Flipside | Flipside Docs][9]).

---

### 🧩 Environment variables

| Key                     | Purpose                     |
| ----------------------- | --------------------------- |
| `COVALENT_API_KEY`      | Holder snapshots & balances |
| `BITQUERY_KEY`          | Liquidity & fee queries     |
| `ONEINCH_BASE_URL`      | Real‑time slippage          |
| `SANTIMENT_KEY`         | CEX flow metrics            |
| `FLIPSIDE_KEY`          | Back‑test SQL jobs          |
| `CHAINLINK_PRIVATE_KEY` | Signs oracle updates        |

---

### 📈 Model details

* **Feature set:** 17 features across 5 buckets
* **Algorithm:** Gradient‑boosted survival tree via XGBoost‑Survival
* **Retrain cadence:** weekly; drift tests run nightly
* **Explainability:** SHAP plots auto‑published to `docs/model/latest.html`

> See `ml/README.md` for training notebooks and hyper‑params.

---

### 🤝 Contributing

1. Fork > create feature branch > PR against `dev`.
2. Run `npm test` (unit) and `make e2e` (Ganache fork) before pushing.
3. Sign the CLA in `docs/CLA.md`.

New ETL adapters are welcome—check `src/ingest/interfaces.ts` for spec.

---

### 📜 License

MIT — see `LICENSE`.

---

### 🙏 Acknowledgements

This project borrows inspiration and patterns from Chainlink node repos ([GitHub][10]), open‑source oracle demos ([GitHub][6]) and the community tutorials on running decentralized data feeds ([GitHub][11]).

[1]: https://www.covalenthq.com/blog/q1-2023-product-report/?utm_source=chatgpt.com "Q1 2023 Product Update - Covalent HQ"
[2]: https://docs.flipsidecrypto.xyz/data/data-products/api-sdk-developers/get-started/archive/shroomdk-migration-guide?utm_source=chatgpt.com "ShroomDK Migration Guide - Flipside Docs"
[3]: https://bitquery.io/blog/ethereum-dex-graphql-api?utm_source=chatgpt.com "Ethereum DEX GraphQL APIs with Examples - Bitquery"
[4]: https://docs.1inch.io/?utm_source=chatgpt.com "Dev Portal | documentation"
[5]: https://bitquery.io/labs/graphql?utm_source=chatgpt.com "Blockchain GraphQL APIs - Bitquery"
[6]: https://github.com/luciamunozdev/Chainlink-Building-an-Oracle/blob/main/README.md?utm_source=chatgpt.com "Chainlink-Building-an-Oracle/README.md at main - GitHub"
[7]: https://www.covalenthq.com/blog/2022-annual-report/?utm_source=chatgpt.com "2022 Annual Report - A Year of Firsts - Covalent HQ"
[8]: https://docs.flipsidecrypto.xyz/data/data-products/api-sdk-developers/get-started-1/archive/r?utm_source=chatgpt.com "[LEGACY] R - Flipside Docs"
[9]: https://docs.flipsidecrypto.xyz/data/data-products/api-sdk-developers/getting-started?utm_source=chatgpt.com "Get Started - Your first API call in < 2 min - Flipside Docs"
[10]: https://github.com/smartcontractkit/chainlink?utm_source=chatgpt.com "smartcontractkit/chainlink: node of the decentralized oracle ... - GitHub"
[11]: https://github.com/alejoacosta74/chainlink-node-oracle-demo/blob/master/README.md?utm_source=chatgpt.com "README.md - alejoacosta74/chainlink-node-oracle-demo - GitHub"
