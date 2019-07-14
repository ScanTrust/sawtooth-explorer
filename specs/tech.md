# Technical Specification

## General

Explorer consists of four main components

#### [API](../api/)

* Provides access to all cached data via a REST API
* User account management
* 

#### [**Listener**](../api/)

* Listens to sawtooth events (*state-delta*, *block-commit*) and caches every change in database.
* On launch the listner requests a replay of all missed events since the last known block (see *"catch-up"* in sawtooth docs).

#### Frontend

* VueJS app communicating with the API and providing an interface to explore data in different ways.

#### Database

* We currently use mongo to keep a cached copy of all known sawtooth state.  


# Cache

Cache is stored in a MongoDB instance associated with the explorer installation.  Other backends are possible, but for the time being we are using mongo to explore this problem space.  Should the type of lookups used require changing to a relational DB then we will do so.

### StateElement

| Field       | Type     | Comment                             |
| ----------- | -------- | ----------------------------------- |
| `address`   | string   | State address                       |
| `data`      | string   | Snapshot of the data encoded base64 |             |
| `blockId`   | string   | Block ID this write is located in   |
| `createdAt` | datetime | Date this record was created        |

*Note:* The created date is the date the record was inserted into the cache, not the date 
the block was written.  The block write date can't be determined from sawtooth.  However, if
this block was cached as a result of the real-time listener, then it should be close.

### Transaction

| Field             | Type        | Comment                                     |
| ----------------- | ----------- | ------------------------------------------- |
| `id`              | `pk` string | The transaction ID                          |
| `batchId`         | string      | Batch ID this transaction was included in   |
| `blockId`         | `fk` string | Block ID this write is located in           |
| `payload`         | string      | The transaction payload base64 encoded      |
| `signerPublicKey` | `fk` string | Public key associated with this transaction |
| `familyPrefix` | `fk` string | Transaction family address prefix           |

### Block

| Field             | Type   | Comment                                   |
| ----------------- | ------ | ----------------------------------------- |
| `id`              | string | The transaction ID                        |
| `num`             | string | Batch ID this transaction was included in |
| `stateHash`       | string | Block ID this write is located in         |
| `previousBlockId` | string | The transaction payload                   |

### Batch

We do not currently cache batch information.

### Events

We do not currently capture custom events.  This information is available in the 
block, should we desire to add this feature.

| Field     | Type   | Comment                           |
| --------- | ------ | --------------------------------- |
| `event`   | string | The event name                    |
| `payload` | string | Payload sent by the event         |
| `blockId` | string | Block ID this event was generated |

### Signers

Signers is a list of public signing keys along with a friendly 
name so that they can be displayed in the dashboard. This can 
be used to show the source of the transaction in human readable
form.

| Field       | Type   | Comment                          |
| ----------- | ------ | -------------------------------- |
| `publicKey` | string | The public key of the signer     |
| `name`      | string | The friendly name of for the key |


### TxP

| Field    | Type        | Comment                          |
| -------- | ----------- | -------------------------------- |
| `prefix` | `pk` string | 6 char hex prefix for the family |
| `name`   | string      | Name of the transaction family   |

## How custom transaction family decoding works

If some txn family has a cbor or protobuf encoded transaction payload or state's element's data field, admin of the Explorer instance can specify this in txn family details (or in settings?).
If it's **cbor**, it's clear: he just enables it and later he's going to be able to switch between 'raw' and 'json' in state element details' Data field or/and in transaction details' Payload field.
If it's **protobuf**, he first uploads all the .proto files he wants to be used to try to decode explored data. Then, on the backend these files are compiled and saved as .json file with compiled proto's `.toJSON()` method. When Vue app is opened in the browser, it's going to ask backend to give this JSON, if it has one. If some .json received, it loads it as proto object from json `protobuf.Root.fromJSON(...)`.
Once Vue got new protos, it should:

1. Try decoding all data on vuex store, that may be proto-decodable (according to what admin specified for which txn families). On success, add decoding result to an object in store. On failure, clear the field of current object of the store
2. ?
