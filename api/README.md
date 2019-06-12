# Sawtooth Explorer API and listener

Listener and API are in single ExpressJS app under `api/`

## Listener

Listener code is under `lib/events/`. It has 3 `.js` files — `encoding.js`, `handlers.js`, `subscriber.js` — roles are reflected in names, and a `proto.json` file, used only in `encoding.js` in encoding/decoding of events and subscription requests with their proto structures.  
There's also `lib/syncDBHTTP.js` file which has methods for pulling `/state` or `/blocks` and populating DB with the results.  
`lib/common/` now has only `http.js` with http wrapper-methods.  

## API (not there yet)

API part is under `routes/`

### Specification

`GET /stateElements?addresses=...&txnIds=...`  
**addresses** — comma-separated address prefixes. All stateElements matching any of prefixes are returned.  
**txnIds** — comma-separated txnIds. All stateElements whose txnId match any of the ones listed are returned.  

`GET /transactions?signer=...&since=...&ids=...&blockIds=...&batchIds=...`  
**signer** — signer public key.  
**since** — UNIX timestamp (ms) to return transactions which were written to db after it.  
**ids** — requested txns' ids.  
**blockIds** and **batchIds** — comma-separated id strings.  

`GET /blocks?ids=...&recentN=...&txnIds=...`  
**ids** — requested blocks' ids.  
**recentN** — number of most recent blocks to be returned.  
**txnIds** — comma-separated txnIds. All blocks which had transactions with these ids are returned.  

`GET /signers?publicKeys=...`  
**publicKeys** — comma-separated pubKeys. All signers with these pubKeys are returned.

## Deployment

1. MongoDB should be running.
2. MongoDB's and Sawtooth's urls and ports are specified in `./config.js`.
3. npm and node installed.
4. `npm i`.
5. `PORT=3001 npm run start` to start API on 3001 port.
