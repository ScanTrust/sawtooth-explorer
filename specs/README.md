# Technical Specification

Explorer consists of three main components:

1. **Listener.** Listens to sawtooth events (state-delta, block-commit) and caches every change in database.
2. **API.** Provides access to all cached data.
3. **Frontend.** VueJS app communicating with the API and providing an interface to explore data in different ways.
4. **Cache.** MongoDB for now, may change to Postgres. Data models have following structure:
    1. **StateElement** -- a snapshot of one state element (e.g. address and binary data) in time. Fields:
        1. **address:** string
        2. **data:** binary
        3. **createdAt:** date
        4. **transactionId:** string // may change to blockId if it's impossible to correlate state-delta to a transaction
    2. **Transaction** -- transaction. Fields:
        1. **id:** string
        2. **blockId:** string
        3. **batchId:** string
        4. **payload:** binary
        5. **signerPublicKey:** string
    3. **Block** -- block. Fields:
        1. **id:** string
        2. **num:** num
        3. **stateHash:** string
        4. **previousBlockId:** string
