# Technical Specification

Explorer consists of four main components:

1. **Listener.** Listens to sawtooth events (*state-delta*, *block-commit*) and caches every change in database.
On launch requests events replay since last known block (see *"catch-up"* in sawtooth docs). **createdAt** field of StateElement may be wrong in case described above because of that it's db document creation date. So, having blockchain with blocks commited, first launch will make DB having all replay-created StateElements **createdAt** field set approximately to the moment of the launch.
2. **API.** Provides access to all cached data.
3. **Frontend.** VueJS app communicating with the API and providing an interface to explore data in different ways.
4. **Cache.** MongoDB for now, may change to Postgres. Data models have following structure:
    1. **StateElement** -- a snapshot of one state element (e.g. address and binary data) in time. Write is always caused by *state-delta* event. To get a full history on certain state address, query documents with address specified and sort by createdAt. Fields:
        1. **address:** string
        2. **data:** binary
        3. **createdAt:** date // may be wrong, see Listener spec
        4. **transactionId:** string // may change to blockId if it's impossible to correlate *state-delta* to a transaction
    2. **Transaction** -- transaction. Fields:
        1. **id:** string
        2. **blockId:** string
        3. **batchId:** string
        4. **payload:** binary
        5. **signerPublicKey:** string
    3. **Block** -- block. Fields:
        1. **id:** string
        2. **num:** number
        3. **stateHash:** string
        4. **previousBlockId:** string
