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
