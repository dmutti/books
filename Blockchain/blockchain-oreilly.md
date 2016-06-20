# Blockchain

## Blockchain 1.0: Currency

* The blockchain is the decentralized transparent ledger with the transaction records -- the database that is
    * shared by all network nodes
    * updated by miners
    * monitored by everyone
    * and owned and controlled by no one
    * "It is like a giant interactive spreadsheet that everyone has access to and updates and confirms that the digital transactions transferring funds are unique."

### The Double-Spend and Byzantine Generals' Computing Problems

* Until blockchain cryptography, digital cash was, like any other digital asset, infinitely copiable, and there was no way to confirm that a certain batch of digital cash had not already been spent without a central intermediary.
* There had to be a trusted third party (whether a bank or a quasibank like PayPal) in transactions, which kept a ledger confirming that each portion of digital cash was spent only once; **the double-spend problem**.
* Coin ownership is recorded in the public ledger and confirmed by cryptographic protocols and the mining community.
    * The blockchain is trustless in the sense that a user does not need to trust the other party in the transaction, or a central intermediary, but does need to trust the system: the blockchain protocol software system.

### Personal CriptoSecurity

* Decentralized autonomy in the form of private keys stored securely in your ewallet means that there is no customer service number to call for password recovery or private key backup. If your private key is gone, your Bitcoin is gone.
    * Circle Internet Financial, Xapo
* Another element of personal cryptosecurity that many experts recommend is `coin mixing`, pooling your coins with other transactions so that they are more anonymous
    * Dark Coin, Dark Wallet, and BitMixer
* **One of the great advantages is that blockchain is a push technology** (the user initiates and pushes relevant information to the network for this transaction only), not a pull technology (like a credit card or bank for which the user's personal information is on file to be pulled any time it is authorized)
    * Pull technology requires having datastores of customer personal information that are essentially centralized honey pots, increasingly vulnerable to hacker identity theft attacks

### Summary: Blockchain 1.0 in Practical Use

* Currency and payments make up the first and most obvious application.
* Alternative currencies make sense based on an economic argument alone
    * reducing worldwide credit card merchant payment fees from as much as 3 percent to below 1 percent has obvious benefits for the economy
* users can receive funds immediately in digital wallets instead of waiting days for transfers
* The core functionality of blockchain currencies is that any transaction can be sourced and completed directly between two individuals over the Internet

## Blockchain 2.0: Contracts

* Whereas Blockchain 1.0 is for the decentralization of money and payments, Blockchain 2.0 is for the decentralization of markets more generally, and contemplates the transfer of many other kinds of assets beyond currency using the blockchain, from the creation of a unit of value through every time it is transferred or divided.
* Blockchain 1.0 has been likened to the underlying TCP/IP transport layer of the Web, with the opportunity now available to build 2.0 protocols on top of it (as HTTP, SMTP, and FTP were in the Internet model).
* **The key idea is that the decentralized transaction ledger functionality of the block‐ chain could be used to register, confirm, and transfer all manner of contracts and property**

| Class | Examples |
|-------|----------|
| General | Escrow transactions, bonded contracts, third-party arbitration, multiparty signature transactions |
| Financial transactions | Stock, private equity, crowdfunding, bonds, mutual funds, derivatives, annuities, pensions |
| Public records | Land and property titles, vehicle registrations, business licenses, marriage certificates, death certificates |
| Identification | Driver's licenses, identity cards, passports, voter registrations |
| Private records | IOUs, loans, contracts, bets, signatures, wills, trusts, escrows |
| Attestation | Proof of insurance, proof of ownership, notarized documents |
| Physical asset keys | Home, hotel rooms, rental cars, automobile access (Getaround) |
| Intangible assets | Patents, trademarks, copyrights, reservations, domain names |

* To protect an idea, instead of trademarking it or patenting it, you could encode it to the blockchain and you would have proof of a specific cargo being registered with a specific datetime stamp for future proof

### Financial Services

* Ripple Labs is using blockchain technology to reinvent the banking ecosystem and allow traditional financial institutions to conduct their own business more efficiently.
    * Ripple's payment network lets banks transfer funds and foreign exchange transactions directly between themselves without a third-party intermediary, as is now required
    * Ripple is also developing a smart contracts platform and language, `Codius`
* Spanish bank Bankinter's Innovation Foundation investment in `Coinffeine`, a Bitcoin technology startup that aims to make it possible for end users to buy and sell Bitcoin directly without an exchange
* `BTCjam` is an example of such decentralized blockchain-based peer-to-peer lending
* `Tera Exchange` launched the first US-regulated Bitcoin swaps exchange, which could make it possible for institutional and individual investors to buy Bitcoin contracts directly through its online trading platforms.
* `Vaurum` is building an API for financial institutions to offer traditional brokerage investors and bank customers access to Bitcoin.
* `Buttercoin`, a Bitcoin trading platform and exchange for high-volume transactions (200,000–500,000 Bitcoin, or $70 -- $175 million), targeted at a business clientele who has a need to complete large-scale Bitcoin transactions

### Crowdfunding

* Blockchain-based crowdfunding platforms make it possible for startups to raise funds by creating their own digital currencies and selling "cryptographic shares" to early backers. Investors in a crowdfunding campaign receive tokens that represent shares of the startup they support
* Another project is Lighthouse, which aims to enable its users to run crowdfunding or assurance contracts directly from within a Bitcoin wallet.

### Smart Property

* The blockchain can be used for any form of asset registry, inventory, and exchange, including every area of finance, economics, and money; hard assets (physical property); and intangible assets (votes, ideas, reputation, intention, health data, and information).
* The general concept of smart property is the notion of transacting all property in blockchain-based models. Property could be physical-world hard assets like a home, car, bicycle, or computer, or intangible assets such as stock shares, reservations, or copyrights
* `Swancoin`, where 121 physical-world artworks, crafted on 30 × 30 cm varnished plywood, are available for purchase and transfer via the Bitcoin blockchain
* Smart property, then, is property whose ownership is controlled via the blockchain, using contracts subject to existing law
* Example -- a pre-established smart contract could automatically transfer the ownership of a vehicle title from the financing company to the individual owner when all the loan payments have been made (as automatically confirmed by other blockchain-based smart contracts)
* Smart property transacted with blockchains is a completely new kind of concept. **We are not used to having cryptographically defined property rights that are self-enforced by code.**
    * A property transfer specified in the code cannot but occur as encoded.
* **Trustless lending**
    * Making property smart allows it to be traded with much less trust
    * This reduces fraud and mediation fees, and affords a much greater amount of trade to take place that otherwise would never have happened, because parties do not need to know and trust each other
    * it makes it possible for strangers to lend you money over the Internet, taking your smart property as collateral, which should make lending more competitive and thus credit cheaper.
    * Contract disputes in the United States (44%) and United Kingdom (57%) account for the largest type of litigation, and might be avoided with more precision at the time of setting forth agreements, and with automated enforcement mechanisms.
* **Colored coins**
    * Certain Bitcoins are "colored" or "tagged" as corresponding to a particular asset or issuer via the transaction memo field in a Bitcoin transaction.
    * certain Bitcoins encode some other asset that can be securely transacted with the blockchain
    * This model still requires some trust -- in this case, that the asset called out in the memo field will be deployed as agreed.
    * colored coins are intended for use within a certain community, serving as loyalty points or tokens to denote a range of physical and digital goods and services

### Smart Contracts

* In the blockchain context, contracts or smart contracts mean blockchain transactions that go beyond simple buy/sell currency transactions, and may have more extensive instructions embedded into them.
* **In a more formal definition, a contract is a method of using Bitcoin to form agreements with people via the blockchain.**
* a smart contract is both defined by the code and executed (or enforced) by the code, automatically without discretion.
* three elements of smart contracts that make them distinct are autonomy, self-sufficiency, and decentralization
    * **Autonomy** means that after it is launched and running, a contract and its initiating agent need not be in further contact.
    * smart contracts might be **self-sufficient** in their ability to marshal resources -- that is, raising funds by providing services or issuing equity, and spending them on needed resources, such as processing power or storage.
    * smart contracts are **decentralized** in that they do not subsist on a single centralized server; they are distributed and self-executing across network nodes.
* The classic example used to demonstrate smart contracts in the form of code executing automatically is a vending machine.
    * Unlike a person, a vending machine behaves algorithmically; the same instruction set will be followed every time in every case.
    * When you deposit money and make a selection, the item is released.
    * There is no possibility of the machine not feeling like complying with the contract today, or only partially complying (as long as it is not broken).
    * **A smart contract similarly cannot help but execute the prespecified code -- "code is law" in the sense that the code will execute no matter what**
* smart contracts impact not just contract law, but more broadly the notion of the social contract within society.
    * We need to determine and define what kinds of social contracts we would like with "code law", automatically and potentially unstoppably executing code
* Minimal trust often makes things more convenient by taking human judgment out of the equation, thus allowing complete automation.
* An example of a basic smart contract on the blockchain is an inheritance gift that becomes available on either the grandchild's eighteenth birthday or the grandparent's day of death
* A transaction can be created that sits on the blockchain and goes uninitiated until certain future events are triggered, either a certain time or event.
* Smart contracts could also be deployed in pledge systems like Kickstarter. Individuals make online pledges that are encoded in a blockchain, and if the entrepreneur's fundraising goal is reached, only then will the Bitcoin funds be released from the investor wallets.
    * the entrepreneur's budget, spending, and burn rate could be tracked by the subsequent outflow transactions from the blockchain address that received the fundraising.

### Blockchain 2.0 Protocol Projects

| Project | URL | Description | Notes |
|---------|-----|-------------|-------|
| Ripple | https://ripple.com/ | Gateway, payment, exchange, remittance network; smart contract system: Codius | Separate blockchain |
| Counterparty | https://www.counterparty.co/ | Overlay protocol for currency issuance and exchange | Bitcoin blockchain overlay |
| Ethereum | http://ethereum.org/ | General-purpose Turing-complete cryptocurrency platform | Own blockchain, Ethereum virtual machine |
| Mastercoin | http://www.mastercoin.org/ | Financial derivatives | Bitcoin blockchain overlay |
| NXT | http://www.nxtcommunity.org/ | Altcoin mined with proof-of-stake consensus model | Bitcoin blockchain overlay |
| Open Transactions | http://opentransactions.org/ | Untraceable anonymous, no latency transactions | No blockchain; transactions library |
| BitShares | http://bitshares.org/ | Decentralized crypto-equity share exchange | Separate blockchain |
| Open Assets | https://github.com/OpenAssets | Colored coin issuance and wallet | Bitcoin blockchain overlay |
| Colored Coins | http://coloredcoins.org/ | Bitcoin asset marking for digital/physical assets | Bitcoin blockchain overlay |

### Wallet Development Projects

* The primary category of applications being built atop blockchain protocols is wallets.
* Wallets are obviously a core infrastructural element for cryptocurrencies, because they are the mechanism for the secure holding and transfer of Bitcoin and any cryptographic asset

| Project name | URL | Underlying infrastructure |
|--------------|-----|---------------------------|
| **Wallet projects** | | |
| ChromaWallet | http http://chromawallet.com/ | Open Assets |
| CoinSpark | http://coinspark.org/ | Open Assets |
| Counterwallet | https://counterwallet.io/ | Counterparty |
| **Wallet companies** | | |
| Coinprism | https://www.coinprism.com/ | Open Assets |
| Melotic | https://www.melotic.com/ | Ability to trade curated digital assets (e.g., Storjcoin, LTBCoin) with Bitcoin |
| OneWallet | https://www.onewallet.io | Bitcoin marketplace and wallet |

### Blockchain Development Platforms and APIs

* Blockchain.info (https://blockchain.info/api) has a number of APIs for working with its ewallet software (it's one of the largest ewallet providers) to make and receive payments and engage in other operations
* Chain (https://chain.com/) has interfaces to make calls to the data available in full blockchain nodes, and standard information queries such as the Bitcoin balances by address and push notifications when there is activity with a certain address
* Stellar (https://www.stellar.org/) is a semidecentralized (maintained by gateway institutions, not miners) public ledger platform and unified development environment (blockchain APIs, multisig APIs) linked to the Stripe payment network.
    * Related: Block.io (https://block.io/), Gem (https://gem.co/), and BlockCypher (http://www.blockcypher.com/)

### Blockchain Ecosystem: Decentralized Storage, Communication, and Computation

* There is a need for a decentralized ecosystem surrounding the blockchain itself for full-solution operations.
    * Storj (https://storj.io/) for any sort of file storage (text, images, audio, multimedia)
    * IPFS (https://ipfs.io/) for file serving, link maintenance, and storage;
    * Maidsafe (http://maidsafe.net/) and Ethereum (https://www.ethereum.org/) for storage, communication, and file serving
* File storage could either be centralized (like Dropbox or Google Drive) or could be in the same decentralized architecture as the blockchain.
    * The blockchain transaction that registers the asset can include a pointer and access method and privileges for the off-chain stored file.
* the IPFS project has proposed an interesting technique for decentralized secure file serving.
    * IPFS stands for InterPlanetary File System, which refers to the need for a global and permanently accessible filesystem to resolve the problem of broken website links to files, well beyond the context of blockchain technology for the overall functionality of the Internet.
    * BitTorrent peer-to-peer file-sharing technology has been merged with the tree and versioning functionality of Git
    * IPFS, then, is a global, versioned, peer-to-peer filesystem
        * a system for requesting and serving a file from any of the multiple places it might exist on the Web (versus having to rely on a central repository) per a hash (unique code) that confirms the file's integrity by checking that spam and viruses are not in the file


### Ethereum: Turing-Complete Virtual Machine

* **A blockchain infrastructure project aiming to deliver a Turing-complete scripting language and Turing-complete platform **
* Ethereum is a platform and a programming language for building and publishing distributed applications.
* More fundamentally, Ethereum is a foundational general-purpose cryptocurrency platform that is a Turing-complete virtual machine (meaning that it can run any coin, script, or cryptocurrency project)
    * Ethereum is a fundamental underlying infrastructure platform that can run all blockchains and protocols, rather like a unified universal development platform
* Each full node in the Ethereum network runs the Ethereum Virtual Machine for seamless distributed program (smart contract) execution.
* Ether‐eum is the underlying blockchain-agnostic, protocol-agnostic platform for application development to write smart contracts that can call multiple other blockchains, protocols, and cryptocurrencies.
* Ethereum has its own distributed ecosystem
    * **Swarm** -- a decentralized file-serving method.
    * **Whisper** -- a peer-to-peer protocol for secret messaging and digital cryptography
    * **Mist** -- a the tool of choice to browse and use Dapps.

### Dapps, DAOs, DACs, and DASs: Increasingly Autonomous Smart Contracts

* Dapps, DAOs, DACs, DASs, automatic markets, and tradenets are some of the more intricate concepts being envisioned for later-stage blockchain deployments
* the general idea is that with smart contracts, there could be an increasing progression in the autonomy by which smart contracts operate.
* Dapps, DAOs, DACs, and DASs are abbreviated terms for
    * decentralized applications
    * decentralized autonomous organizations
    * decentralized autonomous corporations
    * decentralized autonomous societies
* this group connotes a potential progression to increasingly complex and automated smart contracts that become more like self-contained entities, conducting preprogrammed and eventually self-programmed operations linked to a blockchain
* Our working definition of a Dapp is an application that runs on a network in a distributed fashion with participant information securely protected and operation execution decentralized across network nodes.

| Project | URL | Activity | Equivalent |
|---------|-----|----------|------------|
| OpenBazaar | https://openbazaar.org/ | Buy/sell items in local physical world | Craigslist |
| LaZooz | http://lazooz.org/ | Ridesharing, including Zooz, a proof-of-movement coin | Uber |
| Twister | http://twister.net.co/ | Social networking, peer-to-peer microblogging | Twitter/Facebook |
| Gems | http://getgems.org/ | Social networking, token-based social messaging | Twitter/SMS |
| Bitmessage | https://bitmessage.org | Secure messaging (individual or broadcast) | SMS Services |
| Storj | http://storj.io/ | File storage | Dropbox |
| Swarm | https://www.swarm.co/ | Cryptocurrency crowdfunding platforms | Kickstarter, Indiegogo venture capital funding |
| Koinify | https://koinify.com/ | | |
| bitFlyer | http://fund yer.bit yer.jp/ | | |

* A DAO (decentralized autonomous organization) is a more complex form of a decentralized application
* To become an organization, a Dapp might
    * adopt more complicated functionality such as a constitution, which would outline its governance publicly on the blockchain
    * and a mechanism for financing its operations such as issuing equity in a crowdfunding
* DAOs/DACs (decentralized autonomous organizations/corporations) are a concept derived from artificial intelligence.
    * Here, a decentralized network of autonomous agents perform tasks, which can be conceived in the model of a corporation running without any human involvement under the control of a set of business rules

* Eventually there could be DASs (decentralized autonomous societies) -- essentially fleets of smart contracts, or entire ecosystems of Dapps, DAOs, and DACs operating autonomously
* An automatic market is the idea that unitized, packetized, quantized resources (initially like electricity, gas, bandwidth, and in the deeply speculative future, units of synaptic potentiation in brains) are automatically transacted based on dynamically evolving conditions and preprogrammed user profiles, permissions, and bidding functions.
    * Algorithmic stock market trading and real-time bidding (RTB) advertising networks are the closest existing examples of automatic markets.
* Truly smart grids (e.g., energy, highway, and traffic grids) could have automatic bidding functions on both the cost and revenue side of their operations -- for both inputs (resources) and outputs (customers) and participation in automatic clearing mechanisms.
    * A related concept is trade‐nets: in the future there could be self-operating, self-owned assets like a self-driving, self-owning car
* **Tradenets could even have embedded, automatically executing smart contracts to trigger the building of new transportation pods based on signals of population growth, demand, and business plan validity.**

## Blockchain 3.0: Justice Applications Beyond Currency, Economics, and Markets

* Decentralization is "where water goes", where water flows naturally, along the way of least resistance and least effort.
* The blockchain could be an Occam's razor, the most efficient, direct, and natural means of coordinating all human and machine activity; it is a natural efficiency process.

### Blockchain Layer Could Facilitate Big Data's Predictive Task Automation

* Big data's predictive analysis could dovetail perfectly with the automatic execution of smart contracts
* We could accomplish this specifically by adding blockchain technology as the embedded economic payments layer and the tool for the administration of quanta, implemented through automated smart contracts, Dapps, DAOs, and DACs.

### Namecoin: Decentralized Domain Name System

* an altcoin that can be used to verify Domain Name System (DNS) registrations
* an alternative DNS that is transnational and cannot be controlled by any government or corporation
* The idea is that URLs permanently embedded in the blockchain would be resistant to the government seizing of domains.
* a decentralized DNS means that top-level domains can exist that are not controlled by anyone, and they have DNS lookup tables shared on a peer-to-peer network
* As long as there are volunteers running the decentralized DNS server software, alternative domains registered in this system can be accessed. Authorities cannot impose rules to affect the operation of a well-designed and executed global peer-to-peer top-level domain.
* Technical issues were found with the Namecoin implementation that left .bit domains vulnerable to takeover

### Freedom of Speech/Anti-Censorship Applications: Alexandria and Ostel

* Alexandria aims to create an unalterable historical record by encoding Twitter feeds to a blockchain. This method captures tweets that might be censored out later by takedown requests.
* Ostel's (https://ostel.co/) free encrypted Voice over IP (VoIP) telephony service
    * because the United States National Security Agency (NSA) can listen in on other services like Skype

### Decentralized DNS Functionality Beyond Free Speech: Digital Identity

* One challenge related to Bitcoin, the Internet, and network communications more generally is Zooko's Triangle.
* This is the problem encountered in any system that gives names to participants in a network protocol: how to make identifiers such as a URL or a person's handle (ex: DeMirage99) simultaneously secure, decentralized, and human-usable (i.e., not in the form of a 32-character alphanumeric string)    
* Namecoin is used to store URLs, but it can store any information. The core functionality of Namecoin is that it is a name/value store system. Therefore, just as Bitcoin has uses beyond currency, Namecoin has uses beyond DNS for storing information more generally.
* Using the nondomain namespaces of Namecoin, we can store information that would otherwise be hard to securely or conveniently exchange

### Digital Identity Verification

* Decentralized digital verification services take advantage of the fact that all Bitcoin users have a personal wallet, and therefore a wallet address.
    * This could speed access to all aspects of websites, simultaneously improving user experience, anonymity, and security.
    * It can also facilitate ecommerce because customers using Bitcoin-address login are already enabled for purchase.
* With OneName, users can set up a more practical name (like a social media handle) to use for Bitcoin transactions. 
* OneName is an open source protocol built on the Namecoin protocol that puts users in charge of their digital identity verification, rather than allowing centralized social media sites like Facebook, LinkedIn, and Twitter to be the de facto identity verification platform, given that many websites have opted to authenticate users with social media APIs
* A similar project is BitID, which allows users to log in to websites with their Bitcoin address.
    * "Instead of Login with Facebook", you can "Connect with Bitcoin" (your Bitcoin address).
    * BitID is a decentralized authentication protocol that takes advantage of Bitcoin wallets as a form of identification and QR codes for service or platform access points.
    * It enables users to access an online account by verifying themselves with their wallet address and uses a mobile device as the private-key authenticator
* **Bithandle offers short-handle registration, verification, and ecommerce service. Users can register an easy-to-use handle -- for instance, "Coinmaster" -- that is linked to a wallet address via a public or private real-life identity check and a Bitcoin blockchain transaction**
    * The service offers ongoing real-time digital identity verification and one-click auto-enabled ecommerce per "Login with Bitcoin" website access
    * Bithandle gives users the ability to link a short handle to a Bitcoin address, which is confirmed initially with real-life identity and looked up in the blockchain on demand at any future moment.
    * Real-time digital identity verification services could be quite crucial; already the worldwide market size for identity authentication and verification is $11 billion annually
* **How it works**
    * participants register a Bitcoin username, an easy-to-use handle that can then be used to "Login with Bitcoin" to websites
    * it automatically connects to a user's Bitcoin address for proof of identity
    * When a user sets up a Bithandle, his real-life identity is confirmed with Facebook, Twitter, LinkedIn, or other services, and this can be posted publically (like OneName) or not (as OneName does not allow), with the user's Bithandle.
    * "Logging in with Bitcoin" means that a Bithandle is already connected to a Bitcoin address, which securely facilitates ecommerce without the user having to register an account and provide personal identity and financial details
    * the Bithandle service can provide real-time blockchain lookups to confirm user digital identity at any future time on demand -- for example, to reauthorize a user for subsequent purchases.

### Blockchain Neutrality

* a mobile cryptowallet app, Saldo.mx (http://saldo.mx/), which uses the Ripple open source protocol for clearing, and links people living in the United States and Latin America for the remote payment of bills, insurance, airtime, credit, and products.

### Digital Art: Blockchain Attestation Services (Notary, Intellectual Property Protection)