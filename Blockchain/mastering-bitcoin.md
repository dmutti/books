# Mastering Bitcoin

## Links

* https://github.com/hyperledger
* https://github.com/hyperledger/hyperledger
* https://github.com/hyperledger/fabric
* https://github.com/hyperledger/fabric-api

## Introduction

* Bitcoin is a collection of concepts and technologies that form the basis of a digital money ecosystem.
    * Units of currency called bitcoins are used to store and transmit value among participants in the bitcoin network.
    * Bitcoin users communicate with each other using the bitcoin protocol primarily via the Internet
* **Users of bitcoin own keys that allow them to prove ownership of transactions in the bitcoin network**, unlocking the value to spend it and transfer it to a new recipient
    * Those keys are often stored in a digital wallet on each user's computer.
    * Possession of the key that unlocks a transaction is the only prerequisite to spending bitcoins, putting the control entirely in the hands of each user.
* Bitcoin mining decentralizes the currency-issuance and clearing functions of a central bank and replaces the need for any central bank with this global competition.
* **The "double-spend problem"**
    * Physical money addresses the double-spend issue easily because the same paper note cannot be in two places at once.
    * In these cases [storing and digitally transfering money], the counterfeiting and double-spend issues are handled by clearing all electronic transactions through central authorities that have a global view of the currency in circulation
    * For digital money, which cannot take advantage of esoteric inks or holographic strips, cryptography provides the basis for trusting the legitimacy of a user's claim to value
* To be robust against intervention by antagonists, whether legitimate governments or criminal elements, a decentralized digital currency was needed to avoid a single point of attack.
* Bitcoin consists of:
    * A decentralized peer-to-peer network (the bitcoin protocol)
    * A public transaction ledger (the blockchain)
    * A decentralized mathematical and deterministic currency issuance (distributed mining)
    * A decentralized transaction verification system (transaction script)
* **The key innovation was to use a distributed computation system (called a "proof-of-work" algorithm) to conduct a global "election" every 10 minutes, allowing the decentralized network to arrive at consensus about the state of transactions. **
* The three main forms of bitcoin clients are:
    * A full client, or "full node", is a client that stores the entire history of bitcoin transactions (every transaction by every user, ever), manages the users' wallets, and can initiate transactions directly on the bitcoin network -> "standalone email server"
    * A lightweight client stores the user's wallet but relies on third-party–owned servers for access to the bitcoin transactions and network. The light client does not store a full copy of all transactions and therefore must trust the third-party servers for transaction validation -> "email client"
    * Web clients are accessed through a web browser and store the user’s wallet on a server owned by a third party -> "webmail"
        * If a web-wallet service is compromised, as many have been, the users can lose all their funds. Conversely, if users have a full client without adequate backups, they might lose their funds through a computer mishap
* Like email addresses, Bitcoin addresses can be shared with other bitcoin users who can use them to send bitcoin directly to your wallet
    * Unlike email addresses, you can create new addresses as often as you like, all of which will direct funds to your wallet.
    * A wallet is simply a collection of addresses and the keys that unlock the funds within.
    * You can increase your privacy by using a different address for every transaction (there is practically no limit to the number of addresses a user can create)
* There is nothing sensitive, from a security perspective, about the bitcoin address. It can be posted anywhere without risking the security of her account.

## How Bitcoin Works

* The bitcoin system, unlike traditional banking and payment systems, is based on decentralized trust
    * Instead of a central trusted authority, in bitcoin, trust is achieved as an emergent property from the interactions of different participants in the bitcoin system.
* The bitcoin system consists of
    * users with wallets containing keys
    * transactions that are propagated across the network
    * and miners who produce (through competitive computation) the consensus blockchain, which is the authoritative ledger of all transactions
* The payment request QR code encodes the following URL, defined in BIP0021:

```txt
bitcoin:1GdK9UzpHBzqzX2A9JFP3Di4weBwqgmoQA?
amount=0.015&
label=Bob%27s%20Cafe&
message=Purchase%20at%20Bob%27s%20Cafe
```

* Components of the URL
    * A bitcoin address: "1GdK9UzpHBzqzX2A9JFP3Di4weBwqgmoQA"
    * The payment amount: "0.015"
    * A label for the recipient address: "Bob's Cafe"
    * A description for the payment: "Purchase at Bob's Cafe"

* Transactions are like lines in a double-entry bookkeeping ledger.
    * In simple terms, each transaction contains one or more "inputs", which are debits against a bitcoin account
    * On the other side of the transaction, there are one or more "outputs", which are credits added to a bitcoin account
    * The inputs and outputs (debits and credits) do not necessarily add up to the same amount. Instead, outputs add up to slightly less than inputs and the difference represents an implied "transaction fee", which is a small payment collected by the miner who includes the transaction in the ledger
* Transactions move value from transaction inputs to transaction outputs.
    * An input is where the coin value is coming from, usually a previous transaction's output.
    * A transaction output assigns a new owner to the value by associating it with a key.
    * The destination key is called an encumbrance. It imposes a requirement for a signature for the funds to be redeemed in future transactions.
    * Outputs from one transaction can be used as inputs in a new transaction, thus creating a chain of ownership as the value is moved from address to address
* The most common form of transaction is a simple payment from one address to another, which often includes some "change" returned to the original owner. This type of transaction has one input and two outputs
    * Input 0: From Alice, signed by Alice
    * Output 0: To Bob
    * Output 1: To Alice (change)
* Another common form of transaction is one that aggregates several inputs into a single output. This represents the real-world equivalent of exchanging a pile of coins and currency notes for a single larger note (usually generated by wallet applications to clean up lots of smaller amounts that were received as change for payments)
* Another transaction form is one that distributes one input to multiple outputs representing multiple recipients. This type of transaction is sometimes used by commercial entities to distribute funds, such as when processing payroll payments to multiple employees.
* A wallet application can construct transactions even if it is completely offline. The transaction does not need to be constructed and signed while connected to the bitcoin network. It only has to be sent to the network eventually for it to be executed.
* Most wallet applications keep a small database of "unspent transaction outputs" that are locked (encumbered) with the wallet's own keys. Because a full-index client takes up a lot of disk space, most user wallets run "lightweight" clients that track only the user's own unspent outputs.

```bash
# Look up all the unspent outputs for Alice’s bitcoin address

curl -v 'https://blockchain.info/unspent?active=1Cdid9KFAaatwczBwBttQcwXYCpvK8h7FK'
```

* A transaction output is created in the form of a script that creates an encumbrance on the value and can only be redeemed by the introduction of a solution to the script.
    * In simpler terms, Alice's transaction output will contain a script that says something like, "This output is payable to whoever can present a signature from the key corresponding to Bob's public address". Because only Bob has the wallet with the keys corresponding to that address, only Bob's wallet can present such a signature to redeem this output. Alice will therefore "encumber" the output value with a demand for a signature from Bob.
* For the transaction to be processed by the network in a timely fashion, Alice's wallet application will add a small fee. This is not explicit in the transaction; it is implied by the difference between inputs and outputs.
* Any bitcoin network node (other client) that receives a valid transaction it has not seen before will immediately forward it to other nodes to which it is connected. Thus, the transaction rapidly propagates out across the peer-to-peer network, reaching a large percentage of the nodes within a few seconds.
* Bob's wallet application can also independently verify that the transaction is well formed, uses previously unspent inputs, and contains sufficient transaction fees to be included in the next block. At this point Bob can assume, with little risk, that the transaction will shortly be included in a block and confirmed.
    * A common misconception about bitcoin transactions is that they must be "confirmed" by waiting 10 minutes for a new block, or up to 60 minutes for a full six confirmations.
    * Although confirmations ensure the transaction has been accepted by the whole network, such a delay is unnecessary for small-value items.
    * A merchant may accept a valid small-value transaction with no confirmations, with no more risk than a credit card payment made without an ID or a signature, as merchants routinely accept today.
* The bitcoin system of trust is based on computation. Transactions are bundled into blocks, which require an enormous amount of computation to prove, but only a small amount of computation to verify as proven. The mining process serves two purposes in bitcoin
    * Mining creates new bitcoins in each block, almost like a central bank printing new money. The amount of bitcoin created per block is fixed and diminishes with time.
    * Mining creates trust by ensuring that transactions are only confirmed if enough computational power was devoted to the block that contains them. More blocks mean more computation, which means more trust.
    * At the time of this writing, the difficulty is so high that it is profitable only to mine with application-specific integrated circuits (ASIC), essentially hundreds of mining algorithms printed in hardware, running in parallel on a single silicon chip.
* Transactions are added to the new block, prioritized by the highest-fee transactions first and a few other criteria. Each miner starts the process of mining a new block of transactions as soon as he receives the previous block from the network, knowing he has lost that previous round of competition
* **Each block mined on top of the one containing the transaction is an additional confirmation. As the blocks pile on top of each other, it becomes exponentially harder to reverse the transaction, thereby making it more and more trusted by the network.**
* **By convention, any block with more than six confirmations is considered irrevocable, because it would require an immense amount of computation to invalidate and recalculate six blocks.**

## The Bitcoin Client

* Without a signature, this transaction is meaningless; we haven't yet proven that we own the address from which the unspent output is sourced.
* By signing, we remove the encumbrance on the output and prove that we own this output and can spend it. We use the `signrawtransaction` command to sign the transaction.
    * An encrypted wallet must be unlocked before a transaction is signed because signing requires access to the secret keys in the wallet.

## Keys, Addresses, Wallets

* Ownership of bitcoin is established through
    * digital keys
    * bitcoin addresses
    * and digital signatures
* The digital keys are not actually stored in the network, but are instead created and stored by users in a file, or simple database, called a wallet. Keys enable many of the interesting properties of bitcoin, including decentralized trust and control, ownership attestation, and the cryptographic-proof security model.
* In the payment portion of a bitcoin transaction, the recipient’s public key is represented by its digital fingerprint, called a **bitcoin address**
* Not all bitcoin addresses represent public keys; they can also represent other beneficiaries such as scripts
    * bitcoin addresses abstract the recipient of funds, making transaction destinations flexible, similar to paper checks
* Bitcoin uses elliptic curve multiplication as the basis for its public key cryptography.
* When spending bitcoins, the current bitcoin owner presents her public key and a signature (**different each time, but created from the same private key**) in a transaction to spend those bitcoins.
    * Through the presentation of the public key and signature, everyone in the bitcoin network can verify and accept the transaction as valid, confirming that the person transferring the bitcoins owned them at the time of the transfer.
* The bitcoin private key is just a number. You can pick your private keys randomly using just a coin, pencil, and paper: toss a coin 256 times and you have the binary digits of a random private key you can use in a bitcoin wallet.
* Creating a bitcoin key is essentially the same as "Pick a number between 1 and 2^256"
    * Do not write your own code to create a random number or use a "simple" random number generator offered by your programming language
    * Use a cryptographically secure pseudo-random number generator (CSPRNG) with a seed from a source of sufficient entropy.
* The algorithms used to make a bitcoin address from a public key are the Secure Hash Algorithm (SHA) and the RACE Integrity Primitives Evaluation Message Digest (RIPEMD), specifically SHA256 and RIPEMD160.
    * A bitcoin address is not the same as a public key. Bitcoin addresses are derived from a public key using a one-way function.
* Bitcoin addresses are almost always presented to users in an encoding called "Base58Check", which uses 58 characters (a Base58 number system) and a checksum to help human readability, avoid ambiguity, and protect against errors in address transcription and entry.
* Base58 is Base64 without the 0 (number zero), O (capital o), l (lower L), I (capital i), and the symbols "\", "+" and "/".
    * Base58Check is a Base58 encoding format, frequently used in bitcoin, which has a built-in error-checking code. The checksum is an additional four bytes added to the end of the data that is being encoded.
    * To convert data (a number) into a Base58Check format, we first add a prefix to the data, called the "version byte", which serves to easily identify the type of data that is encoded.
    * Next, we compute the "double-SHA" checksum, meaning we apply the SHA256 hash-algorithm twice on the previous result (prefix and data). From the resulting 32-byte hash (hash-of-a-hash), we take only the first four bytes. These four bytes serve as the error-checking code, or checksum. The checksum is concatenated (appended) to the end.
    * The result is composed of three items: a prefix, the data, and a checksum.

```bash
# bitcoin's Base58 alphabet
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
checksum = SHA256(SHA256(prefix+data))
```

* Wallets
