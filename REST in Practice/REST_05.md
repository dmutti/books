The Web and WS-\*
=================

Are Web Services Evil?
----------------------

-   When SOAP-based Web Services became popular in 2000 they were a disruptive technology
-   it changed the enterprise integration landscape utterly by using Internet protocols and XML to connect systems without proprietary middleware, private APIs, or integration specialists
-   Web Services did the community a huge service as they became part and parcel of modern development platforms and championed the notion of heterogeneous interoperability

SOAP: The Whole Truth
---------------------

-   SOAP — is lightweight
-   All it describes is an XML envelope and a processing model for transferring messages across a network.
-   SOAP doesn't try to solve larger problems such as security or transactions
-   it doesn't try to impose application-level semantics or messaging patterns on SOAP messages

### The SOAP Processing Model

-   the SOAP envelope consists of a placeholder for headers that contain metadata for setting processing context
-   Headers can also be used to convey information specific to a higher-level protocol (e.g., transactions)
-   SOAP messages can be routed through any number of intermediaries (both on the network and within services), which process SOAP headers as each message passes through
-   SOAP only defines an envelope and a means of transferring that envelope over the network
    -   **HTTP is an application protocol** while SOAP is a low-level messaging protocol
    -   Application semantics are maintained entirely within service boundaries and are determined by message payloads
-   it leaves the interpretation of messages to the services that receive them

### Make Love, Not War

-   SOAP is normally used to transport an HTTP-like envelope over an HTTP connection
-   since the Web already provides an extensible envelope, metadata, entity body, and support for intermediaries, SOAP merely adds verbosity, latency, and complexity to the stack
-   SOAP messages are tunneled through HTTP POST
    -   **caching is not possible**

WSDL: Just Another Object IDL
-----------------------------

-   Web Services Description Language (WSDL)
-   it is mostly used as nothing more than a verbose object interface definition language
-   and forces an unsuitable RPC-like model of parameters, return values, and exceptions onto Web Services.
-   Parameters, return values, and exceptions may be great abstractions for Java or .NET programming, but on the Internet these abstractions don't make much sense
-   Since tooling allows any type to be exposed as a Web Service, if we make a change to the domain model of our service that change will ripple through the system to the service's endpoint and surface in the WSDL, likely breaking any existing consumers
-   we'd inadvertently started to share a domain model between systems that should be decoupled
-   when the normal tooling-centric approach is used for developing Web Services
    -   Encapsulation is violated as the service's internal domain model is exposed via WSDL
    -   Any consumers that in turn use this WSDL to generate their own domain model become tightly coupled to the service's implementation
    -   this makes changes significantly more difficult, expensive, and risky

#### The Service Model

-   It's straightforward to design loosely coupled services by building a "service model" between the domain model and the framework code that connects services to the network
-   The service model provides a faithful view of the underlying messaging behavior of the system so that we can explicitly code for high latencies and low reliability in the network
-   It also provides a mechanism to map information from messages into and out of domain objects
-   most prominent in the Spring Web Services approach where developers are expected to interact with SOAP messages via an XML-based API that forces loose coupling between the messages and domain model
    -   this approach tends to lack metadata to support the generation of client and server-side bindings, and so places a programming burden on the developer
-   **Benefits**
    -   We explicitly decouple our external contract and internal domain model
    -   We explicitly code for messages and so take time to understand the latencies and failure modes so that we can handle them gracefully and produce a robust service
    -   Proper separation of concerns makes the codebase maintainable for the long term
-   In hiding the remote aspects of a distributed system, we hide necessary complexity to the extent that we can't build services that are tolerant of their inherent latencies, failure characteristics, and ownership boundaries
-   WSDL is unable to cope with the typical use case where services exchange messages in arbitrary ways to match the problem at hand, and move beyond trivial request-response plus faults
-   WSDL's limited metadata means you can't tell in which order the operations defined in a WSDL interface should be invoked, since those operations convey only a single request, single response, and faults—with no dependencies among them
-   The conversation state of the Web Service is hidden and so consumers have to be directed to an external source for conversation such as an abstract BPEL or WS-Choreography description
-   **WSDL makes doing the wrong things easy and makes doing the right things difficult**

Two Wrongs Don't Make a Right
-----------------------------

-   WADL was created with the best of intentions: to make building and consuming webbased services accessible to a wide community of programmers
-   WADL takes a static view of the web application by presenting the available resources, schemas, operations, and faults upfront, where the Web uses media types and links for contracts
-   WADL tooling promotes tight coupling of client and service-side abstractions
-   WADL offers no clues about ordering of interactions with resources it advertises
    -   A consumer doesn't know from WADL alone how the service expects interactions to occur.
-   WADL often duplicates the metadata that is available from the resources themselves (e.g., via OPTIONS, HEAD).
-   WADL introduces an opportunity for inconsistency where resource metadata and WADL are different

Secure, Reliable, Transacted
----------------------------

### Web Services Security

-   Web Services security encompasses a suite of XML cryptographic techniques to provide a secure end-to-end mechanism for transferring SOAP messages between services
-   the WS-Security model is truly end-to-end, based on public key cryptography
-   WS-Security works at the transfer protocol (message) level rather than the transport protocol level
    -   confidentiality and tamper proofing are supported from the sender through to the ultimate recipient
    -   this approach reduces the attack surface of the system considerably
-   Unlike transport-level security such as HTTPS, applying cryptographic techniques at the message level makes it possible to sign and/or encrypt only certain parts of the message
    -   **more computationally efficient than encrypting all of a message**
    -   it allows headers to be seen by intermediaries for routing and so on
-   in practice, encryption is often applied at the envelope level, preventing processing by intermediaries.
-   **Securing long-lived conversations**
    -   the cost of public key cryptography for multiple message exchanges can become expensive very quickly
    -   WS-SecureConversation uses WS-Security to bootstrap a secure, long-lived conversation with a Web Service
    -   WS-SecureConversation allows communicating Web Services to establish a shared key using a single public key exchange and then subsequently use that shared key to transfer multiple messages
    -   allows the services to mutate the key as each message is exchanged!
-   **WS-Federation**
    -   services in one organization may access Web Services in other organizations, using local credentials to access remote services
-   The WS-Security stack is smart enough not to reimplement cryptographic primitives
-   it reuses mature cryptography techniques from the XML security arena
-   WS-Security also delivers more powerful techniques such as conversations, trust, and federated identity

### Web Security

-   Unlike WS-Security HTTPS creates a secure transport channel and so obfuscates the entire HTTP envelope
-   the HTTP metadata is only available to the client and server and not to the underlying web infrastructure
-   it inhibits scalability because only client-side caching can be used
-   **Federated authentication on the Web**
    -   OpenID
        -   it uses the same mature cryptographic algorithms as the WS-Security stack
    -   OAuth
        -   provides authorization to interact with resources on the Web for a given authenticated user for a certain time period

### Reliable Messaging

-   One of the pains inherent in building distributed applications is failure of the communications infrastructure that links components together
-   WS-ReliableMessaging is the dominant protocol supported by the major platforms and vendors
    -   At most once - Duplicate messages will not be delivered, but messages may still be dropped.
    -   At least once - Every message will be delivered, but duplication may occur.
    -   Exactly once - Every message will be delivered once and once only.
    -   In order - Messages will be received in the same order they were sent.

### Reliability on the Web

-   GET and PUT are idempotent and therefore safe to retry in failure cases
-   the stateless, synchronous request/response interaction model of the Web ensures ordering by default
-   we are specifically interested in the following interaction patterns
    -   In order - the Web is inherently synchronous
        -   HTTP does in fact allow asynchrony in the form of pipelined requests. Pipelining allows a client to send multiple requests over a persistent connection without waiting for each response. By convention pipelined requests should only include safe requests. If an error occurs the entire sequence can be retried
    -   At least once, At most once, Exactly once
        -   If we PUT a representation, it’s safe to retry the operation until we get a 200 or 201 response.
        -   The other idempotent verbs, such as GET and DELETE, follow a similar scheme
        -   we also need to prevent multiple POST operations from creating unintended side effects.
        -   Mark Nottingham's "POST Once Exactly": the server will return a 405 Method Not Allowed in response to duplicate POST requests

### Transactions

-   To achieve end-to-end reliability in a distributed system, we need to be confident that at the end of an application scope or business process each service involved has a consistent view of the outcome.
-   to achieve consistent outcomes across parties we use coordination/transaction protocols to drive consensus.
-   we use transactions to ensure a consistent outcome even in the event of failures
-   Transactions involve a lot of work to arrive at an agreed-upon outcome between components, and implementing the necessary infrastructure to support them can be nontrivial
-   the Web Services arena has the broadly accepted WS-BusinessActivity protocol
    -   a derivate of the two-phase commit pattern
-   The Web Services transaction protocols don't uphold full ACID semantics that we expect from classic transactions
    -   these protocols are better described as two-phase consensus protocols since they only try to agree on a globally shared view of an outcome and don't dictate what to do in response to that outcome (e.g., commit or roll back)
    -   services are allowed to make their own business-level decisions regarding the outcome rather than relying on strict two-phase locking

### Web Transactions

-   the Web lacks any standard transaction models or media types to support transactions natively
-   we could choose to reuse the same two-phase pattern with HTTP interactions
-   As we would expect, web-based service transactions begin with the creation of a transaction by a client application.
    -   In this case, we POST a request for a new transaction to a transaction manager to request the creation of a new transaction context as a resource
    -   Once we have created a resource to represent our transaction, the next stage is for the URI of that transaction to be shared with other (transactional) resources
    -   To achieve this, we embed a transaction context in the form of a URI in an HTTP header that is propagated to any resources we interact with in the scope of the transaction
        -   Transaction-Id: <http://transaction.example.org/1234>
    -   Once a transaction identifier has reached a resource, the next step for the receiving resource is to register as a participant resource in the transaction
        -   It does this by POSTing to the transaction resource with its participant resource URI
    -   As the application proceeds, a participant resource is created for each transactional resource that has registered
    -   the client application will attempt to finish the transaction, at which point it will initialize the outcome protocol with the registered participants by updating the status of the transaction resource
    -   Once the client application has initiated transaction completion, the transaction resource gathers votes from its registered participants by PUTting the prepare state onto each
        -   In response, the participants may answer with a 200 OK status indicating that the resource is happy to go ahead with the work
        -   or a 409 Conflict to indicate that it is not able to honor the unit of work and wishes to roll back or compensate
    -   Once all the votes have been gathered, the transaction resource PUTs the final outcome of the transaction to each participant and informs the client application of the outcome
    -   On receipt of the outcome, each resource either makes permanent any state changes that have occurred during the transaction or undoes them
        -   To deregister from a transaction—assuming that it hasn’t yet voted and the security policy is not violated—a resource owner or client application can simply DELETE the participant
        -   to discover which resources are registered with a transaction at any point, we can GET the parent transaction resource and expect to see a set of URIs for each registered participant
-   If the transaction manager and its participant resources are able to recover from crashes we can be confident we'll get a coordinated outcome even in the presence of all but the nastiest of failures
-   The downside of this pattern is that it is simply a pattern, not a standard or implementation

#### Un-transactions

-   transactions aren't necessary when dealing with web-based services
-   web-based business processes build consensus as they execute rather than waiting until the end
-   A consumer driving a protocol through hypermedia spanning any number of services knows at each step in that protocol whether it's safe to continue, or whether it needs to attempt some kind of error recovery after every interaction
-   Receiving a 200 or 201 status code as the result of an interaction with a resource is an invitation to continue
-   Status codes are coordination metadata, and are as valuable to the Web as transactional coordination is to the enterprise
-   the Web doesn't rely on a shared, trusted coordinator
    -   Since coordinators have to be available for the entirety of the work they risk becoming a scalability and reliability bottleneck

#### Respecting boundaries

-   transactions might be used within a service implementation
-   While it might make sense for a service implementation to use transactions for its own internal consistency, that's **an implementation detail**
-   Don't be tempted to involve consumers in your transactions by allowing such life-cycle information to leak past your service boundary
    -   it tightly couples consumers to your service's implementation
-   In brownfield service development the challenge of a designer is
    -   to minimize the time that transactions spend holding resources
    -   to map the execution of transactions cleanly onto the steps in the DAP(s) that your service supports
-   The scope of the transaction is limited to the backend, and runs for as short a duration as possible to avoid causing contention
-   At no point is the consumer aware that the service executed a transaction on its behalf, since that is the service's implementation detail and not something that needs to be shared.
-   **Allowing transactions to span multiple interactions with a consumer is not a good idea since it effectively allows those consumers to control when resources are released which may cause inadvertent denial-of-service attacks**

A Requiem for Web Services?
---------------------------

-   The SOAP model means we can focus on the capabilities we need now and defer introducing any other protocols until we are driven to do so
-   the WS-\* stack has failed to leave WSDL behind and move to more sophisticated metadata formats
    -   This has left a legacy of WSDL-centric tooling, which limits the approach to RPC-like communication between services

Building the Case for the Web
=============================

No More Silver Bullets
----------------------

-   If we position the Web as another silver bullet, it is similarly doomed to fail
-   the Web is not a silver bullet and is not suitable for each and every problem domain

Building and Running Web-Based Services
---------------------------------------

-   As system designers and developers, our primary concern is to deliver a working system that satisfies the functional and nonfunctional requirements placed upon it.
-   we have to select frameworks and components to support our implementation and accelerate delivery.
-   If services need to advertise sophisticated protocols to consumers the Web's focus on hypermedia and hypermedia-friendly media types allows services to declare contracts that include protocol behavior
    -   such behavior can be readily changed and versioned by changing the links that join resources

No Architecture Without Measurement
-----------------------------------

-   A web-based system designed in the absence of careful measurements and empirical data is as likely to fail as any other solution designed without diligence.
-   But the Web encourages the decomposition of systems into interacting services
-   the Web offers visibility, which supports effective planning and design
-   **If you try to hide distribution in a distributed system, the abstractions will leak at inconvenient times and cause significant problems**
    -   the Web does not try to hide distribution. HTTP offers a universal application protocol for coordinating interactions among distributed resources
-   Distributed systems tend to have much more intricate failure characteristics and nonfunctional requirements than centralized systems
    -   Taking control of nonfunctional requirements is a critical factor in making a solution successful
-   The nonfunctional characteristic that is most obvious and easiest to measure is performance
    -   We have to learn the permitted latencies a service can reasonably operate within
    -   and understand trade-offs between latency and throughput as volumes rise
    -   we must understand how the service is expected to react under large loads
    -   **and how it is expected to fail once its parameters are exceeded**
    -   *Should it fail gracefully or noisily? Should it degrade or halt?*
-   **Example**
    -   in one compute-intensive system, we used the HTTP status code 413 Request Entity Too Large to reject a representation on the basis that it probably wouldn't be processed within the agreed SLA
    -   Consumers of that particular service then push the workload through an alternative "safety valve" route and avoid overloading a service that is working near capacity

