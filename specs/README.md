# Technical Specification

Explorer consists of three main components:

1. **Listener.** Listens to sawtooth events (state-delta, block-commit) and caches every change in database.
2. **API.** Provides access to all cached data.
3. **Frontend.** VueJS app communicating with the API and providing an interface to explore data in different ways.
4. **Cache.** MongoDB for now, may change to Postgres. Data models have following structure:
4.1. **StateElement** -- a snapshot of one state element (e.g. address and binary data) in time. Fields:
4.1.1. **address:** string
4.1.2. **data:** binary
4.1.3. **createdAt:** date
4.1.4. **transactionId:** string // may change to blockId if it's impossible to correlate state-delta to a transaction
4.2. **Transaction** -- transaction. Fields:
4.2.1. **id:** string
4.2.2. **blockId:** string
4.2.3. **batchId:** string
4.2.4. **payload:** binary
4.2.5. **signerPublicKey:** string
4.3. **Block** -- block. Fields:
4.3.1. **id:** string
4.3.1. **num:** num
4.3.1. **stateHash:** string
4.3.1. **previousBlockId:** string

