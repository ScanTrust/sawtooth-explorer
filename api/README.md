# Sawtooth Explorer API and listener

Listener and API are in single ExpressJS app under `api/`

## Listener

Listener code is under `lib/events/`. It has 3 `.js` files — `encoding.js`, `handlers.js`, `subscriber.js` — roles are reflected in names, and a `proto.json` file, used only in `encoding.js` in encoding/decoding of events and subscription requests with their proto structures.
There's also `lib/syncDBHTTP.js` file which has methods for pulling `/state` or `/blocks` and populating DB with the results.
`lib/common/` now has 2 files: `http.js` with http wrapper-methods and `config.js` with configuration used across app. 

## API

API part is mostly under `routes/`
