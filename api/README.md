# Sawtooth Explorer API and listener

Listener and API are in single ExpressJS app under `api/`

## Listener

Listener code is under `lib/events/`. It has 3 `.js` files — `encoding.js`, `handlers.js`, `subscriber.js` — roles are reflected in names, and a `proto.json` file, used only in `encoding.js` in encoding/decoding of events and subscription requests with their proto structures.  
There's also `lib/syncDBHTTP.js` file which has methods for pulling `/state` or `/blocks` and populating DB with the results.  
`lib/common/` now has only `http.js` with http wrapper-methods.  

## API

API part is under `routes/`

### Specification

In case of some error the response is

```JS
{
    ok: Boolean,
    err: String
}
```

#### Public API

`GET /stateElements?addresses=...&txnIds=...`  
*optional* **addresses** — comma-separated address prefixes. All stateElements matching any of prefixes are returned.  
*optional* **blockIds** — comma-separated blockIds. All stateElements whose blockId match any of the ones listed are returned.  
*optional* **since** — UNIX timestamp (ms) to return transactions which were written to db after it.  

`GET /transactions?signer=...&since=...&ids=...&blockIds=...&batchIds=...`  
*optional* **signer** — signer public key.  
*optional* **ids** — requested txns' ids.  
*optional* **blockIds** and **batchIds** — comma-separated id strings.  

`GET /blocks?ids=...&recentN=...&txnIds=...`  
*optional* **ids** — requested blocks' ids.  
*optional* **recentN** — number of most recent blocks to be returned.  
*optional* **txnIds** — comma-separated txnIds. All blocks which had transactions with these ids are returned.  

`GET /signers?publicKeys=...`  
*optional* **publicKeys** — comma-separated pubKeys. All signers with these pubKeys are returned.  

#### Authorization API

`POST /login`  
*required* **username**  
*required* **password**  
Response on success:

```JS
{
    "ok": true,
    "token": "...",
    "user": { /*...*/ }
}
```

`POST /register`  
*required* **username**  
*required* **password**  
Response on success:

```JS
{
    "message": "registration_successful",
    "ok": true
}

```

#### Private API

`POST /signers/add`  
*required* **publicKey** — pubKey.  
*required* **label** — signer label/name.  

## Deployment

1. MongoDB should be running.
2. MongoDB's and Sawtooth's urls and ports are specified in `./config.js`.
3. npm and node installed.
4. `npm i`.
5. `PORT=3001 npm run start` to start API on 3001 port.
