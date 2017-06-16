# Corda: A distributed ledger

## Introduction

* In a decentralised database, such as the one underpinning Bitcoin, the nodes make much weaker trust assumptions and actively cross-check each other's work
* Such databases trade performance and usability for security and global acceptance
* Corda is a decentralised database platform with the following novel features:
    * New transaction types can be defined using JVM bytecode
    * Transactions may execute in parallel, on different nodes, without either node being aware of the other's transactions
    * Nodes are arranged in an authenticated peer to peer network. All communication is direct
    * **There is no blockchain**
        * **Transaction races are deconflicted using pluggable notaries**
        * A single Corda network may contain multiple notaries that provide their guarantees using a variety of different algorithms
        * Corda is not tied to any particular consensus algorithm
    * Data is shared on a need-to-know basis
        * Nodes provide the dependency graph of a transaction they are sending to another node on demand, but **there is no global broadcast of all transactions**
    * Bytecode-to-bytecode transpilation is used to allow complex, multi-step transaction building protocols called flows to be modelled as blocking code
        * **The code is transformed into an asynchronous state machine, with checkpoints written to the node's backing database when messages are sent and received**
    * The data model allows for arbitrary object graphs to be stored in the ledger. These graphs are called states and are the atomic unit of data
    * Nodes are backed by a relational database and data placed in the ledger can be queried using SQL as well as joined with private tables
    * States can declare scheduled events. For example a bond state may declare an automatic transition to an "in default" state if it is not repaid in time

## Overview

* **There are two competing computational models used in decentralised databases: the virtual computer model and the UTXO model**
    * The virtual computer model is used by Ethereum. It models the database as the in-memory state of a global computer with a single thread of execution determined by the block chain
    * In the UTXO model, as used in Bitcoin, the database is a set of immutable rows. Transactions define outputs that append new rows and inputs which consume existing rows
* We use the UTXO model and as a result our transactions are structurally similar to Bitcoin transactions: they have inputs, outputs and signatures
    * Corda database rows can contain arbitrary data, not just a value field (Bitcoin)
    * Because the data consumed and added by transactions is not necessarily a set of key/value pairs, we don't talk about rows but rather states
* Corda states are associated with bytecode programs that must accept a transaction for it to be valid. A transaction must satisfy the programs for both the input and output states at once
* **Corda does not order transactions using a block chain and by implication does not use miners or proof-of-work**
    * Each state points to a notary, which is **a service that guarantees it will sign a transaction only if all the input states are unconsumed**
    * A transaction is not allowed to consume states controlled by multiple notaries and thus there is never any need for two-phase commit between notaries
    * If a combination of states would cross notaries then a special transaction type is used to move them onto a single notary first

## The peer to peer network

### Network overview

* A Corda network consists of the following components:
    * Nodes, communicating using AMQP/1.0 over TLS
    * A permissioning service that automates the process of provisioning TLS certificates
    * A network map service that publishes information about nodes on the network
    * **One or more notary services**. A notary may itself be distributed over multiple nodes
    * **Zero or more oracle services**. An oracle is a well known service that signs transactions if they state a fact and that fact is considered to be true. They may also optionally also provide the facts. This is how the ledger can be connected to the real world, despite being fully deterministic.

### Identity and the permissioning service

* Corda is designed for semi-private networks in which admission requires obtaining an identity signed by a root authority
* The flow API provides messaging in terms of identities, with routing and delivery to underlying nodes being handled automatically. **There is no global broadcast at any point**
    * The permissioning service can implement any policy it likes as long as the identities it signs are globally unique
* Even though messaging is always identified, transactions themselves may still contain anonymous public keys

### The network map

* The network map publishes the IP addresses through which every node on the network can be reached, along with the identity certificates of those nodes and the services they provide
* Each participant on the network, called a party, publishes one or more IP addresses in the network map
* **User interfaces and APIs always work in terms of identities - there is no equivalent to Bitcoin's notion of an address (hashed public key), and user-facing applications rely on auto-completion and search rather than QRcodes to identify a logical recipient**
* if the map service becomes unreachable new nodes may not join the network and existing nodes may not change their advertised service set

### Serialization, sessioning, deduplication and signing

* Each message has a UUID set in an AMQP header which is used as a deduplication key, thus accidentally redelivered messages will be ignored
* Messages that are successfully processed by a node generate a signed acknowledgement message called a 'receipt'
* The purpose of the receipts is to give a node undeniable evidence that a counterparty received a notification that would stand up later in a dispute mediation process
* Corda does not attempt to support deniable messaging

## Flow framework

### Overview

* Transaction data is not globally broadcast
    * It is transmitted to the relevant parties only when they need to see it
    * Even quite simple use cases - like sending cash - may involve a multi-step negotiation between counterparties and the involvement of a third party such as a notary
* Unlike traditional block chain systems in which the primary form of communication is global broadcast, in Corda all communication takes the form of small multi-party sub-protocols called flows
* Flows can pause if they throw exceptions or explicitly request human assistance
    * A flow that has stopped appears in the flow hospital where the node's administrator may decide to kill the flow or provide it with a solution
* The ability to request manual solutions is useful for cases where the other side isn't sure why you are contacting them, for example, the specified reason for sending a payment is not recognised, or when the asset used for a payment is not considered acceptable

### Data visibility and dependency resolution

* Checking transaction validity is the responsibility of the *ResolveTransactions* flow
    * This flow performs a breadth-first search over the transaction graph, downloading any missing transactions into local storage and validating them
    * The search bottoms out at the issuance transactions
    * **A transaction is not considered valid if any of its transitive dependencies are invalid**
* It is required that a node be able to present the entire dependency graph for a transaction it is asking another node to accept
* Transactions propagate around the network lazily and there is no need for distributed hash tables

## Data model

### Transaction structure

* States are the atomic unit of information in Corda
    * They are never altered: they are either current ('unspent') or consumed ('spent') and hence no longer valid
    * They cannot exist outside of the transactions that created them
* Transactions consume zero or more states (inputs) and create zero or more new states (outputs)
* Contracts check that the set of public keys specified by a command is appropriate, knowing that the transaction will not be valid unless every key listed in every command has a matching signature

### Composite keys

* Composite keys are trees in which leaves are regular cryptographic public keys with an accompanying algorithm identifiers
* Nodes in the tree specify both the weights of each child and a threshold weight that must be met
* The validty of a set of signatures can be determined by walking the tree bottom-up, summing the weights of the keys that have a valid signature and comparing against the threshold
* By using weights and thresholds a variety of conditions can be encoded, including boolean formulas with AND and OR

### Timestamps

* Timestamps are checked and enforced by notary services
* As the participants in a notary service will themselves not have precisely aligned clocks, whether a transaction is considered valid or not at the moment it is submitted to a notary may be unpredictable if submission occurs right on a boundary of the given window
    * However, from the perspective of all other observers the notary's signature is decisive: if the signature is present, the transaction is assumed to have occurred within that time

### Attachments and contract bytecodes

* Smart contracts in Corda are defined using JVM bytecode
* A contract is simply a class
    * The *verify* function is passed a transaction and either throws an exception if the transaction is considered to be invalid, or returns with no result if the transaction is valid
* The platform imposes some restrictions on what kinds of data can be included in attachments along with size limits, to avoid people placing inappropriate files on the global ledger (videos, PowerPoints etc)
* Corda contracts are simply zip files

### Hard forks, specifications and dispute resolution

* There is no direct equivalent in Corda of a block chain "hard fork", so the only solution to discarding buggy or fraudulent transaction chains would be to mutually agree out of band to discard an entire transaction subgraph
    * As there is no global visibility either this mutual agreement would not need to encompass all network participants: only those who may have received and processed such transactions
* The flip side of lacking global visibility is that there is no single point that records who exactly has seen which transactions
* Determining the set of entities that'd have to agree to discard a subgraph means correlating node activity logs
    * Corda nodes log sufficient information to ensure this correlation can take place
    * The platform defines a flow to assist with this, which can be used by anyone
    * A tool is provided that generates an "investigation request" and sends it to a seed node
    * The flow signals to the node administrator that a decision is required, and sufficient information is transmitted to the node to try and convince the administrator to take part (e.g. a signed court order)
    * **the tool can semi-automatically crawl the network to find all parties that would be affected by a proposed rollback**

### Oracles and tear-offs

* **An oracle is defined as a network service that is trusted to sign transactions containing statements about the world outside the ledger only if the statements are true**
* Here are some example statements an oracle might check:
    * The price of a stock at a particular moment was X
    * An agreed upon interest rate at a particular moment was Y
    * If a specific organisation has declared bankruptcy
    * Weather conditions in a particular place at a particular time
* Why do we insist on this notion of an oracle? Why a smart contract cannot simply fetch this information from some internet server itself?
    * **All calculations on the ledger must be deterministic. Everyone must be able to check the validity of a transaction and arrive at exactly the same answer, at any time (including years into the future), on any kind of computer**
    * If a smart contract could do things like read the system clock or fetch arbitrary web pages then it would be possible for some computers to conclude a transaction was valid, whilst others concluded it was not
* Because oracles sign specific transactions, not specific statements, an oracle that is charging for its services can amortise the cost of determining the truth of a statement over many users who cannot then share the signature itself (because it covers a one-time-use structure by definition)

### Encumbrances

* Each state in a transaction specifies a contract (boolean function) that is invoked with the entire transaction as input. All contracts must accept in order for the transaction to be considered valid
* Consider an asset that is supposed to remain frozen until a time is reached. Encumbrances allow a state to specify another state that must be present in any transaction that consumes it
* Encumbered states can only point to one encumbrance state, but that state can itself point to another and so on, resulting in a chain of encumbrances all of which must be satisfied

## Common financial constructs

### Assets

* We define the notion of an *OwnableState*. Ownable states are required to have an owner field which is a composite key
* From OwnableState we derive a *FungibleAsset* concept to represent assets of measurable quantity, in which units are sufficiently similar to be represented together in a single ledger state
    * Making that concrete, dollar notes are a fungible asset: regardless of whether you represent 10 as a single 10 note or two notes of 5 each the total value is the same

### Obligations

* Netting is a process by which a set of gross obligations is replaced by an economically-equivalent set where eligible offsetting obligations have been elided
    * The process is conceptually similar to trade compression, whereby a set of trades between two or more parties are replaced with an economically similar, but simpler, set
    * The final output is the amount of money that needs to actually be transferred
* Obligations have a lifecycle and can express constraints on the on-ledger assets used for settlement. The contract allows not only for trading and fungibility of obligations but also bi-lateral and multi-lateral netting


### Market infrastructure

* In many markets, central infrastructures such as clearing houses (also known as Central Counterparties, or CCPs) and Central Securities Depositories (CSD) have been created
* They provide governance, rules definition and enforcement, risk management and shared data and processing services
* The partial data visibility, flexible transaction verification logic and pluggable notary design means Corda could be a particularly good fit for future distributed ledger services contemplated by CCPs and CSDs

## Notaries and consensus

* Corda does not organise time into blocks
* A Corda network has one or more notary services which provide transaction ordering and timestamping services, thus abstracting the role miners play in other systems into a pluggable component
* Notaries are expected to be composed of multiple mutually distrusting parties who use a standard consensus algorithm
* Notaries are identified by and sign with composite public keys that conceptually follow the Interledger Crypto-Conditions specification
* Because multiple notaries can co-exist, a single network may provide a single global BFT (Byzantine Fault Tolerant) notary for general use and region-specific Raft (The Raft Consensus Algorithm -- https://raft.github.io/) notaries for lower latency trading within a unified regulatory area, for example London or New York
* Notaries accept transactions submitted to them for processing and either return a signature over the transaction, or a rejection error that states that a double spend has occurred. The presence of a notary signature from the state's chosen notary indicates transaction finality

### Comparison to Nakamoto block chains

* Bitcoin organises the timeline into a chain of blocks, with each block pointing to a previous block the miner has chosen to build upon
* Miners can choose to try and extend the block chain from any previous block, but are incentivised to build on the most recently announced block by the fact that other nodes in the system only recognise a block if it's a part of the chain with the most accumulated proof-of-work
* The incentive to build on the most recently announced proof of work is in tension with the reality that it takes time for a proof to circulate around the network
    * This means it is desirable that proofs are produced at a rate that is slow enough that very few are circulating at the same time
    * Given that transactions are likely to be produced at a higher rate than this, it implies a need for the proofs to consolidate multiple transactions. Hence the need for blocks
* **A Corda network is email-like in the sense that nodes have long term stable identities, of which they can prove ownership of to others**

### Algorithmic agility

* Consensus algorithms are a hot area of research and new algorithms are frequently developed that improve upon the state of the art. Unlike most distributed ledger systems Corda does not tightly integrate one specific approach
* Being able to support multiple notaries in the same network has other advantages:
    * It is possible to phase out notaries (i.e. sets of participants) that no longer wish to provide that service by migrating states
    * The scalability of the system can be increased by bringing online new notaries that run in parallel
* Notaries can compete on their availability and performance
* Users can pick between validating and non-validating notaries

### Validating and non-validating notaries

* Validating notaries resolve and fully check transactions they are asked to de-conflict
* **Thus in the degenerate case of a network with just a single notary and without the use of any privacy features, they gain full visibility into every transaction**
* Non-validating notaries assume transaction validity and do not request transaction data or their dependencies beyond the list of states consumed
* When the states are unlikely to live long or propagate far and the only entities who will learn their transaction hashes are somewhat trustworthy, the user may select to keep the data from the notary
* For liquid assets a validating notary should always be used to prevent value destruction and theft if the transaction identifiers leak

### Merging networks

* Because there is no single block chain it becomes possible to merge two independent networks together by simply establishing two-way connectivity between their nodes then configuring each side to trust each other's notaries and certificate authorities
* When merging networks, both sides must trust that each other's notaries have never signed double spends
* When merging an organisation-private network into the global ledger it should be possible to simply rely on incentives to provide this guarantee: there is no point in a company double spending against itself

### Guaranteed data distribution

* In a system without global broadcast things are very different: the notary clusters must accept transactions directly and there is no mechanism to ensure that everyone sees that the transaction is occurring
* Sometimes this doesn't matter: most transactions are irrelevant for you and having to download them just wastes resources. But occasionally you do wish to become aware that the ledger state has been changed by someone else
* To solve this, app developers can choose whether to request transaction distribution by the notary or not

## The vault

* The vault contains data extracted from the ledger that is considered relevant to the node's owner, stored in a form that can be easily queried and worked with
* It also contains private key material that is needed to sign transactions consuming states in the vault
* If a vault were to contain the entire cash balance of a user in just one state, there could only be a single transaction being constructed at once and this could impose unacceptable operational overheads on an organisation
* By automatically creating send-to-self transactions that split the big state into multiple smaller states, the number of transactions that can be created in parallel is increased

## Scalability

* Nodes only encounter transactions if they are involved in some way, or if the transactions are dependencies of transactions that involve them in some way
    * This loosely connected design means that it is entirely possible for most nodes to never see most of the transaction graph, and thus they do not need to process it
    * For Corda, as writes are lazily replicated on demand, it is difficult to quote a transactions/second figure for the whole network
* Nodes are logically structured as a series of microservices and have the potential in future to be run on separate machines
    * A node under heavy load would typically be running many flows in parallel
    * As flows access the network via the broker and local state via an ordinary database connection, more flow processing capacity could be added by just bringing online additional flow workers
* It is possible to increase scalability in some cases by bringing online additional notary clusters
    * this only adds capacity if the transaction graph has underlying exploitable structure (e.g. geographical biases), as a purely random transaction graph would end up constantly crossing notaries and the additional transactions to move states from one notary to another would negate the benefit

### Non-validating notaries

* The overhead of checking a transaction for validity before it is notarised is likely to be the main overhead for non-BFT notaries
* In the case where raw throughput is more important than ledger integrity it is possible to use a non-validating notary
* The primary bottleneck in a Corda network is expected to be the notary clus- ters, especially for byzantine fault tolerant (BFT) clusters made up of mutually distrusting nodes
    * BFT clusters are likely to be slower partly because the un- derlying protocols are typically chatty and latency sensitive, and partly because the primary situation when using a BFT protocol is beneficial is when there is no shared legal system which can be used to resolve fraud or other disputes, i.e. when cluster participants are spread around the world and thus the speed of light becomes a major limiting factor

## Privacy

* Transactions are not globally broadcast as in many other systems
* The vault generates and uses random keys that are unlinkable to an identity without the corresponding linkage certificate
* Large transaction graphs that involve liquid assets can be 'pruned' by requesting the asset issuer to re-issue the asset onto the ledger with a new reference field
* Some nodes may be in the position of learning about transactions that aren't directly related to trades they are doing, for example notaries or regulator nodes. Even when key randomisation is used these nodes can still learn valuable identity information by simply examining the source IP addresses or the authentication certificates of the nodes sending the data for notarisation
* the holy grail of privacy in decentralised database systems is the use of **zero knowledge proofs** to convince a peer that a transaction is valid, without revealing the contents of the transaction to them
    * we will one day wish to migrate to the use of zero knowledge succinct non-interactive arguments of knowledge ('zkSNARKs')

## Links

* https://medium.com/@ConsenSys/thoughts-on-utxo-by-vitalik-buterin-2bb782c67e53
* https://medium.com/think-consortium-on-blockchain/r3-corda-isnt-a-blockchain-what-does-this-mean-for-you-74cce6a09601
* https://www.corda.net/2016/12/rationale-tradeoffs-adopting-utxo-style-model/
* http://www.ibtimes.co.uk/qtum-building-bridges-between-bitcoin-ethereum-hyperledger-r3-corda-1605691
