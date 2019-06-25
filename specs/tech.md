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

| Field       | Type     | Comment                           |
| ----------- | -------- | --------------------------------- |
| `address`   | string   | State address                     |
| `data`      | binary   | Snapshot of the data              |
| `blockId`   | string   | Block ID this write is located in |
| `createdAt` | datetime | Date this record was created      |

*Note:* The created date is the date the record was inserted into the cache, not the date 
the block was written.  The block write date can't be determined from sawtooth.  However, if
this block was cached as a result of the real-time listener, then it should be close.

### Transaction

| Field             | Type        | Comment                                     |
| ----------------- | ----------- | ------------------------------------------- |
| `id`              | `pk` string | The transaction ID                          |
| `batchId`         | string      | Batch ID this transaction was included in   |
| `blockId`         | `fk` string | Block ID this write is located in           |
| `payload`         | binary      | The transaction payload                     |
| `signerPublicKey` | `fk` string | Public key associated with this transaction |

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

| Field    | Type   | Comment                          |
| -------- | ------ | -------------------------------- |
| `prefix` | string | 6 char hex prefix for the family |
| `name`   | string | Name of the transaction family   |


