Distribution and Scaling
------------------------

-   J2EE solutions are built around the network
-   security is not obtained by hiding algorithms and techniques; it is obtained by peer-reviewed solutions that don’t depend on hiding the implementation to attain their goals

## Localizing Data

-   Background
    -   the easiest implementation for a simple J2EE solution will place the data for that solution in the same location as the code that operates on the data. In the extreme, this could mean static variables, local files, and/or Entity Beans. Once data is localized, it may be hard to delocalize it

-   Symptoms and Consequences
    -   You are storing data in static variables
    -   You are storing data in files on the local system
    -   Data is only available to one machine
    -   You are storing data in a singleton
    -   You may be going against document package restrictions - you are expressly not supposed to use the file application programming interfaces (APIs) in EJBs. A server might even prevent you from doing so, which could break your solution when you upgrade your server.

-   Refactorings
    -   Plan for Scaling
    -   Choose the Right Data Architecture

-   Known Exceptions
    -   The real issue is whether or not you have to scale access to the data. If the data is going to be part of an application that might grow, you need to rethink your solution.

## Misunderstanding Data Requirements

-   Background
    -   can affect the final solution in terms of both the size of data and the performance requirements for parsing and operating on it
    -   if you don’t know what the data will really look like, your design is based on invalid assumptions
    -   can then affect your entire distributed solution by changing the amount of network bandwidth used

-   General Form
    -   developers might use small data sets for development because they are easy to manage, but upon deployment, the real data sets may be much larger = bad performance on the network and in specific applications
    -   more data is passed around the network than is actually needed.

-   Symptoms and Consequences
    -   come into play when you really deploy your solution
    -   Parts of your solution may end up getting more data than they need (ex: XML)
    -   Big, unexpected changes in performance from the test environment to the deployment

-   Typical Causes
    -   Bad data architecture - relies on messages carrying all of the data
    -   Bad planning or research - might end up with a solution that expects small data chunks when it will really see large ones, or vice versa

-   Refactorings
    -   understand the data requirements
    -   look at what information each part of a distributed application really needs
    -   pick the right data architecture from these requirements

## Miscalculating Bandwidth Requirements

-   General Form
    -   generally appears when the size of the data that is sent between nodes or tiers in a solution is large
    -   Filling up the network will slow the overall performance of the application and all others distributed on the same network

-   Symptoms and Consequences
    -   Message throughput, or transaction times are very high when bandwidth is limited or overwhelmed
    -   When messages can’t be delivered, they might be lost - **can happen on systems that support persistent store and forward methods** (occurs when the persistence mechanism runs out of space).
    -   A single application that has very high bandwidth requirements might affect other applications on the network

-   Typical Causes
    -   Unexpected message sizes
    -   Unexpected message volumes
    -   Not planning for hubs. Example: in a process automation design, each step in a business process result in a network call and response, rather than a single call. This doubles the number of messages, although not necessarily the bandwidth requirements, since one direction doesn’t necessarily use the same size messages as the other.
    -   Overworked networks
    -   Overworked machines - numerous J2EE services on one machine.
    -   Not planning for latency

-   Known Exceptions
    -   never acceptable, but it may not be applicable for simple solutions on fast networks. planning is important.

-   Refactorings
    -   perform reliable bandwidth analysis at design time - "How big is the biggest message or document?", "What does the peak message traffic look like?"
    -   buy a faster network
    -   Could the customer data go into a database?
        -   the first node in the system would store data in the database. Other nodes would grab only the data they needed from the database.

## Overworked Hubs

-   Background
    -   one piece of software is acting as a hub for data or processing destined for other software in the solution
    -   a database or rules engine will often be a hub
    -   the biggest task, from the start, is finding your hubs
    -   second form of an overworked hub occurs when a single node has to process a lot of data. it may not have a lot of connections, but its data requirements may be so high that even a few connections can overload it

-   Symptoms and Consequences
    -   When a hub is overworked it may slow the system down
    -   An overworked hub can lose data if it is not transactionally sound - hub that supports transactions could be at risk of losing data if it is so overworked that it breaks down the operating system’s standard behaviors by causing system crashes or the exhaustion of disk space
    -   When a single hub is overworked, the endpoints that connect to it may begin to show slow message delivery or dropped messages
    -   Overworked hubs that deal with real-time user input = bad user experience

-   Typical Causes
    -   Changing requirements - some machines that have been acting as hubs may be unable to keep up with the new requirements
    -   Budget constraints
    -   Adding new clients to messaging, database, application, and Web servers

-   Known Exceptions
    -   total distribution is likely to create much higher and possibly less-controlled bandwidth requirements
    -   systems that are highly distributed are harder to maintain and back up

-   Refactorings
    -   avoid the problem during design time
    -   fix the problem when it arises.
        -   add hubs
        -   partitioning data.

    -   When all of your hubs are equal, you throw hardware at the problem, which is perhaps the easiest solution

## The Man with the Axe

-   General Form
    -   The man with the axe’s job is to break your network

-   Symptoms and Consequences
    -   The application stops working
    -   A machine is not reachable

-   Typical Causes
    -   Failing hardware
    -   Bad software
    -   Overworked resources
    -   Crackers

-   Refactorings
    -   Be Paranoid
    -   Plan Ahead

Persistence
-----------

## Dredge (Deep Query)

-   General Form
    -   session or DTOFactory façades that create large, deep graphs of Entity Bean instances in order to support the listing requirements of an application

-   Symptoms and Consequences
    -   Depleted resources and degraded performance
    -   Increased hardware expenses
    -   Loss of user confidence

-   Typical Causes
    -   Inexperience - Only an experienced architect, designer, or developer can understand that it is sometimes necessary to bypass the component framework or even denormalize database tables in order to achieve the kind of performance and scalability his or her customers require

-   Refactorings
    -   Light Query

-   Related Solutions
    -   using a façade that implements some relatively lightweight query mechanism for retrieving the desired information

## Crush

-   General Form
    -   applications that have long-running, transactional use cases with no discernable realization of these use cases in code
    -   such use cases are implemented without ever considering how they can ever be executed in a transactional manner

-   Symptoms and Consequences
    -   Intermittent data loss
    -   Loss of user confidence - only when the application is used by multiple concurrent users, that the probability of collisions increases enough to raise suspicion

-   Typical Causes
    -   Inexperience
        -   Some transactions occur naturally in business—yet cannot be readily implemented in any one particular place
        -   Solution **workflow engines**

-   Refactorings
    -   Version

-   Related Solutions
    -   enforce an optimistic locking strategy
    -   stale data overwrites must be detected and avoided

## DataVision

-   Background
    -   A database schema should never be used to drive an application component model
    -   relational database design and object-oriented design are distinctly different ways to view the world
    -   Relational database design encompasses data, while object-oriented design encompasses both data (that is, state) and behavior
    -   the database schema should primarily be designed to meet the data and behavioral demands of the component model

-   General Form
    -   usually contrived inventions that have no mapping to the business domain or any reasonable design construct

-   Symptoms and Consequences
    -   Abundance of pseudocomponents
    -   Dysfunctional component object model - overly complicated and confusing component object model that is difficult to maintain
    -   Increased maintenance costs

-   Typical Causes
    -   Ongoing battles between DBAs and OO developers
        -   Organizations that fail to respect the complexities of both the data and object-oriented worlds stand a very good chance of falling prey to this AntiPattern
        -   both worlds must be designed by their respective practitioners, with the overall goal of complementing, reflecting, and supporting each other

-   Refactorings
    -   Component View

Service-Based Architecture
--------------------------

-   service orientation
    -   within J2EE systems enhances reuse across related J2EE applications
    -   facilitates the structure and principles needed to effectively vend business functionality as Web Services

## Multiservice

-   Background
    -   identify core business entities and the key processes that operate on them
    -   A common AntiPattern is to map a broad set of processes and functions associated with several different entities or abstractions into a single service
    -   results in a service which implements multiple abstractions, with poor cohesion between the set of methods

-   General Form
    -   multiple abstractions are being supported through a single service
    -   different methods are operating on different core abstractions

-   Symptoms and Consequences
    -   A service has a large number of methods (20-30)
    -   Multiple core abstractions or data types are exchanged in a single service
    -   There are few (or possibly one) services within the system - pathological case of this is having only one, God Object service that implements every core process
    -   The service implementation artifacts are being modified concurrently by multiple developers
    -   Many client artifacts need to be rebuilt/redeployed when the service changes
    -   Unit testing of the service is time-consuming
    -   Deployment of the Multiservice may require special configuration, to support appropriate performance, pooling, and so on

-   Typical Causes
    -   Nonexistent, thin, or poorly structured requirements - identification of distinct abstractions and processes is very dependent on the set of requirements that serve as the starting point
    -   Incorrect application of the Session Façade pattern - inexperience or misunderstanding of the pattern can lead to creating a façade that is simply a mechanical aggregation of methods into a larger interface, without creating effective subsystem layers, and so on
    -   Principles of high cohesion and low coupling not understood or applied adequately
    -   Purely mechanical creation of service(s) to support the Web Services interface

-   Known Exceptions
    -   integration and usage of an external legacy system within a J2EE application

-   Refactorings
    -   repartitioning the service’s inappropriate interface methods to other services, to result in a single, well-defined abstraction

## Tiny Service

-   Background
    -   extreme: every individual responsibility and sequence of process is mapped into a separate service
    -   The application of the Command pattern may also contribute to this, when developers decide that they should have individual components or services, each of which implements a command

-   General Form
    -   tiny service is one that incompletely represents an abstraction, only implementing a subset of the necessary methods
    -   usually multiple services that, taken together, completely implement the abstraction
    -   manifested as many small, specific services, with just a few methods, that implement just a subset of the overall processes for an abstraction or entity

-   Symptoms and Consequences
    -   most significant issue - multiple services are required to support one, core business abstraction, and without tying all the p rocesses together into one service, developers need to know all the different services to use, and how they should be coordinated and sequenced to support one overall business process workflow
    -   A service interface has few methods (possibly only one)
    -   Multiple services support methods against the same core abstraction - createOrder in one service and approveOrder in another
    -   Implementation and maintenance of a particular area of application requirements requires changes to multiple services
    -   Developers must know what multiple services are used for a specific business or technical area, and they must know how they operate together
    -   Testing and validating a business abstraction requires testing of multiple services
    -   Performance may suffer with a large number of services

-   Typical Causes
    -   Mapping of individual use cases into separate services - sometimes the mapping isn’t done quite right, and each use case is mapped to a separate service.
        -   correct approach is **map each use case to a public method, and combine all the associated use cases or methods that deal with one abstraction into the same service**

    -   Use of the EJB Command pattern to define services - a service could be thought of as a verb-type, large-grained, pluggable component, it may be tempting to apply the EJB Command pattern

-   Refactorings
    -   Interface Consolidation
    -   examining the methods across a number of services, to determine what abstraction they are, in fact, operating against, and collecting these together into a single service

## Stovepipe Service

-   Background
    -   other technical requirements, such as workflow execution, auditing, email notification, and so on, must be implemented on top of J2EE
    -   the most natural approach is to create one or more technical services or components that implement these requirements, and develop a multilayered SBA
    -   AntiPattern: business services end up implementing a lot of nonfunctional, technical requirements - **business services that contain some duplicated private methods**

-   General Form
    -   the implementation classes and components behind the interface will contain a number of protected or private methods that do not seem to implement functionality for the abstraction

-   Symptoms and Consequences - Services are intended to be the basis of encapsulated, shared implementation of core (middle-tier) requirements within a system
    -   Service implementation is large, for example, with a lot of private methods
    -   Infrastructure and utility functions are implemented inconsistently
    -   Development time is considerably greater for stovepipe services

-   Typical Causes - lack of communication and collaborative review during concurrent implementation
    -   Inexperience in developing multilayered architectures - The conceptual move to a middle tier that only encapsulates the business and infrastructure logic is itself a significant leap
    -   Insufficient communication, design/code reviews during service implementation - If there is little communication there will be little opportunity to recognize common implementation requirements and refactor them into other services. **It is important to perform group design and code reviews during service implementation**
    -   No after-the-fact implementation refactoring

-   Refactorings
    -   factor out the similar common private methods into lower-layer technical services or utility classes
    -   Technical Services Layer

-   Related Solutions
    -   refactor the common technical functions into a generic abstract superclass that all services are derived from
        -   limits the use of the functionality to services only

## Client Completes Service

-   Background
    -   **Services should be self-contained, encapsulated units of functionality that can stand on their own, and be usable by a variety of client types and application contexts**
    -   if the [user input] validation is not also done in the service, then other clients of the service will be able to pass bad data or have to replicate data validation code
    -   **a service should always be complete and self-contained at any rate**

-   General Form
    -   Nonfunctional requirements, such as data validation, security checking, event auditing, and so on, need to be implemented by the client using the service

-   Symptoms and Consequences - the replication of similar, nonfunctional code in different client components and contexts
    -   Client artifacts (JSPs, servlets, front controller, and so on) contain code to perform nonclient, server-side functions
    -   Some client interfaces (such as Business-to-Business (B2B) ) may be able to pass bad data and perform unauthorized data access and manipulation
    -   In some cases, data validation and so on, functionality is implemented in multiple client components
    -   Potentially different application behaviors when performing a function interactively vs. through a B2B component
    -   Unit tests for out-of-bounds conditions regarding data ranges and authorizations fail
    -   Unit test components need to implement a lot of code to properly test a service - unit test clients should only need to do a minimum of setup and then invoke the service method, and all the actual functionality should be provided by the service itself

-   Typical Causes
    -   Web-centric approach to development
    -   Poor communications between team members during development

-   Refactorings
    -   Cross-Tier Refactoring - client code that performs data validation, security checking, and so on is moved to or replicated in some form down to the service implementation

JSP Use and Misuse
------------------

## Ignoring Reality

-   General Form
    -   a JSP without an error page directive

-   Symptoms and Consequences
    -   Stack Traces in Web Browsers

-   Typical Causes
    -   Lack of understanding of error processing

-   Refactorings
    -   Introduce Error Page

## Too Much Code

-   Background
    -   building JSPs, the focus should be on writing the user interface and not the application proper
    -   play mostly when developers fail to maintain that separation of concerns between the Model, View, and Controller

-   Symptoms and Consequences
    -   Bugs in scriptlet code
    -   Difficulty maintaining a JSP
    -   Compiler errors while deploying a JSP - Any code in a JSP should be minimal single-line scriptlets that are very unlikely to have compiler errors
    -   Impossible to reuse functionality

-   Typical Causes
    -   Lack of undersanding of the role of JSPs

-   Refactorings
    -   Beanify
    -   Introduce Delegate Controller
    -   Introduce Traffic Cop

## Embedded Navigational Information

-   Background
    -   A JSP that contains the names of files that can be navigated to is brittle with respect to change
    -   Whenever a change is made to a filename, every single JSP that references it must also be updated

-   General Form
    -   highly coupled JSPs that are hard to rearrange

-   Symptoms and Consequences
    -   Page Not Found errors
    -   Difficult to modify application flow

-   Typical Causes
    -   lack of experience or knowledge

-   Refactored Solutions
    -   Introduce Traffic Cop

## Copy and Paste JSP

-   Background
    -   tendency of developers to copy and paste HTML and scriptlet code from JSP to JSP because they want to achieve consistency in their user interfaces

-   Symptoms and Consequences
    -   Subtle inconsistencies
    -   Maintenance nightmares

-   Typical Causes
    -   Demo creep - demo application becoming the real application

-   Refactorings
    -   Introduce Template

## Too Much Data in Session

-   Background
    -   worst case is when alternate JSPs write different kinds of data into the session with the same key.
    -   violates the fundamental principal of encapsulation inherent in object-oriented programming
    -   Applications stuck in this AntiPattern have their data in the session and the behavior in the JSP

-   General Form
    -   typical JSP caught in the Too Much Data in Session AntiPattern uses the session as a place to put data between invocations or to pass state from JSP to JSP

-   Symptoms and Consequences
    -   Problems keeping track of keys
    -   Bugs galore
    -   Performance problems - especially in clustered environments where the entire session state must be copied into each session in the cluster

-   Refactorings
    -   Beanify

## Ad Lib TagLibs

-   Background
    -   TagLibs try to be model and controller in addition to view
    -   borne from a misunderstanding of the role of TagLibs in the architectural landscape of J2EE

-   General Form
    -   big or very big class implementing each tag

-   Symptoms and Consequences
    -   Problems finding and fixing bugs
    -   Inability to use new UI technologies - it will be difficult to put a new kind of user interface on the application because the business problem the application is supposed to solve is coded in part of the UI
    -   Difficulty in reuse
    -   Large number of attributes on the TagLib
    -   Adding functionality introduces bugs

Entity Beans
------------

## DTO Explosion

-   Background
    -   The use of DTOs in the public interface and creation methods of Entity Beans and homes is a deprecated, EJB 1.x pattern
    -   negative impact on the overall maintainability of systems, because a distinct DTO class must be created and maintained for each Entity Bean class in the system
    -   Keeping the Entity Beans and their associated DTOs synchronized becomes a significant challenge as the underlying Entity Bean model evolves
    -   their use often makes the lower-level domain tier dependent on the higher-level application logic tier

-   General Form
    -   the presence of a large, often unwieldy, number of DTO classes
        -   huge effort is required to maintain their synchronization with respective Entity Bean classes

    -   the presence of Entity Beans that have been scarred by the imprints of view-based DTOs
        -   These unfortunate Entity Beans have dramatically reduced prospects for reusability because they have been coupled to a specific application’s view requirements

-   Symptoms and Consequences
    -   An excessive amount of effort expended to keep DTOs synchronized with the entity layer is often a symptom of the DTO Explosion AntiPattern

-   Typical Causes
    -   Failure to understand the impact of intertier coupling - Inexperienced designers and developers often underestimate the negative impact of excessive coupling, especially between architecture tiers

-   Refactorings
    -   Local Motion
    -   Exodus

Session EJBs
------------

-   One of the core design approaches when using sessions for business applications is to implement a session/entity pair, where the entity implements the data aspects of a business abstraction or document, and the session implements the various business processes and the workflows associated to that entity
-   This layering of session over entity is done to improve performance (by reducing client-to-Entity-Bean remote invocations), but also, more importantly, to organize and associate processes with data

## Sessions A-Plenty

-   Background
    -   This behaviour affects development by creating an unnecessarily large and complex set of implementation artifacts, and affects startup and runtime performance by using heavier-weight components in cases where they are not required

-   General Form
    -   the overuse of sessions results in a middle tier that is made up of a lot of sessions that vary widely in size
        -   there are also other sessions that basically support algorithmic processes that are not transactional

    -   These algorithm-oriented sessions may be accessed exclusively by other sessions or server-side components, and accessed via local interfaces, or they may be remotely accessed by clients as well

-   Symptoms and Consequences
    -   middle tier contains a large number of sessions
    -   Sessions that support purely algorithmic processes
    -   There are a number of sessions with one or two public methods - may indicate trivial or algorithmic sessions, which are better implemented using other approaches (exception: command pattern)
    -   Session EJBs are prescribed as the default for processing components

-   Refactorings
    -   Replace Session with Object

## Bloated Session (The God Object)

-   Background
    -   Deciding the set of distinct sessions that are required, and how the methods should be mapped to them, can have a significant effect on development and operation of the system
    -   well-organized sessions should be based on general OO principles of analysis and design
    -   good approach is to define a session for each core abstraction (for example, entity), and collect together the methods that operate on that abstraction
    -   A common AntiPattern is to aggregate a lot of methods into a single bloated session that implements many methods against several different core business entities

-   General Form
    -   one that implements methods that operate against multiple abstractions
    -   because multiple abstractions are being supported by a single session, there will typically be just a few sessions, or in some case, only one

-   Symptoms and Consequences
    -   Session methods act on multiple abstractions or entities
    -   Session has a large number of methods
    -   Few sessions
    -   The session is harder to understand and use
    -   The session is harder to reuse

-   Typical Causes
    -   Nonexistent, thin, or poorly structured requirements
    -   Incorrect application of the Session Façade pattern - When developers define a façade over entities to implement workflow, they may create a single Session façade to contain many (or all) processes/workflows in the system
    -   Purely mechanical creation of session(s) to support a Web Service interface

-   Refactorings
    -   Interface Partitioning

-   Variations
    -   **bloated Stateful Session Beans**
    -   a number of stateless methods are included within a Stateful Session Bean = poor performance

## Thin Session

-   Background
    -   if this mapping process is not guided by understanding and experience of OO principles, the result may be far from this ideal
    -   there are many sessions that each implement just a few (or one) method, resulting in a large number of very fine-grained sessions
    -   consequence is that a particular abstraction is implemented by a number of different sessions

-   General Form
    -   contains a few (or possibly only one) methods related to a particular abstraction (entity)
    -   the whole collection of thin sessions must be used together wherever that abstraction is to be reused in others

-   Symptoms and Consequences
    -   Multiple sessions support methods that operate against the same entity
    -   Sessions have one or a few methods
    -   There are a large number of sessions
    -   Session name is a verb or verblike
    -   Application clients must always use multiple sessions

-   Typical Causes
    -   Mapping each use case to a separate session
    -   Inappropriate application of the Command pattern to define sessions
    -   Excessive process or subsystem layering - each process is essentially its own layer
    -   Stovepipe development

-   Refactorings
    -   Interface Consolidation

## Large Transaction

-   Background
    -   transactional methods effectively lock any transactional resources that they use (for example, Entity Beans and JDBC connections)
    -   If multiple session instances attempt to access a shared transactional resource the EJB container will effectively serialize the invocation of those methods and instances
    -   keep transactional methods relatively short
    -   keep the granularity of the process small enough that the set of resources involved is not too large

-   General Form
    -   the top-level method of a wide and/or deep graph of transactional method calls

-   Symptoms and Consequences
    -   Slow execution of application
    -   Some requests fail due to transaction timeouts

-   Typical Causes
    -   The process is actually a chained sequence of separate processes - usually can be broken up into separate methods and transactions without violating the transactional integrity of the system

-   Refactorings
    -   Split Large Process

    1.  Refactoring the LargeTransaction method into a nontransactional sequence of separate transactions
    2.  implementing transaction-result monitoring across the sequence of separate transactions, catching transaction failures, and implementating compensating actions against completed transactional changes earlier in the sequence after errors occur

-   Related Solutions
    -   **define a standard order of access to a set of transactional resources**
    -   implement a single-threaded, but asynchronous, processing model using JMS

Message-Driven Beans
--------------------

## Misunderstanding JMS

-   Background
    -   JMS provides two models for messaging
        -   point-to-point, is like TCP/IP to the hard-core network developers. one sender, and one receiver
        -   public-subscribe, is more like UDP/IP for the hard-core network folks. one sender and many receivers

    -   Persistence makes sure that each message is received - using the concept of a persistent queue. Messages to the queue are stored until they are read. Once read, in the simplest case, they are removed.
    -   Publish-subscribe messaging in JMS is accomplished via something called a topic (**not, by definition, persistent**). Instead, the subscriber might want to be treated persistently, so it can create a durable subscription. until you register the durable subscriber, the server won’t know to save its messages. So you might have to **register a subscriber before turning the clients on**.
    -   Both queues and topics are called “destinations” in the JMS world

-   General Form
    -   a queue with multiple receivers. Conceptually, a queue guarantees once and only once delivery, but with two receivers you can get the situation where each subscriber is missing messages.
    -   one receiver but you use a topic - it requires that you use a durable subscriber to get the expected behavior.
    -   misusing persistence
        -   one of the durable subscribers is never told to process messages. The JMS provider will have to store those messages in anticipation of the broken subscriber’s return
        -   when you don’t preregister durable subscribers and they miss messages. **make sure the subscriptions are registered before you start sending.**

-   Symptoms and Consequences
    -   A queue is used instead of a topic - receivers will miss messages
    -   A topic is used instead of a queue - you have to use a durable subscriber for the topic to get the same behavior as a queue
    -   Durable subscribers are registered late - **you can lose messages**
    -   Registering too many durable subscribers - The provider will hold messages for durable subscribers until they are read or expire. If you have extra subscribers that aren't reading messages and acknowledging those reads, you can create a storage problem for the JMS provider
    -   Using the wrong subscribers - If you want guaranteed messaging for the publish-subscribe method, you have to use durable subscribers. Otherwise, some subscribers may lose messages.

-   Typical Causes
    -   Subscriptions that were being used aren’t any more
    -   There was just one listener and now there are several
    -   Applications are launched manually

-   Known Exceptions
    -   **you want to have multiple receivers on a queue for load balancing**

-   Refactorings
    -   Architect the Solution

## Overloading Destinations

-   Background
    -   Each destination represents two things
        -   a destination provides a rendezvous point for senders to find receivers
        -   the destination has an implicit, according to JMS, job of associating a data format with the communications

    -   the sender and receiver need an agreed-upon data model
    -   it is up to the developer to handle message validation and the underlying data model

-   General Form
    -   that one destination is receiving multiple message types or formats
    -   the receiver's code will contain if or switch statements that key off of data in the message to determine what to do with it

-   Symptoms and Consequences
    -   similar to that of the object-oriented design problem of creating classes with too many methods
    -   Overloaded destinations require the message-driven beans and custom JMS code to perform checks for each message type and handle it appropriately
    -   Once developers get in the habit of destinations with multiple message types they will not hesitate to add new types
    -   Depending on the messages and how they can be identified, overloading can create performance problems

-   Refactorings
    -   Don't do it

## Overimplementing Reliability

-   Background
    -   One of the primary benefits of messaging over other networking technologies is the availability of persistence and reliability
    -   messages sent to a JMS destination can be marked persistent, using DeliveryMode.PERSISTENT, or not persistent using DeliveryMode.NON\_PERSISTENT
        -   For queues, this is sufficient to gain persistence
        -   For topics, you also need to use durable subscribers

    -   JMS supports three levels of acknowledgement
        -   sessions can be set to automatically acknowledge each message as it is read
        -   sessions can be set to only acknowledge messages when the developer does it manually
        -   sessions can be set to acknowledge lazily

    -   JMS also provides the idea of transactional acknowledgement and transaction send

-   General Form
    -   three primary forms
        -   occurs when the client underuses the JMS server by storing information from messages before sending them - a client might save the data for a new customer entry in a file, then send a message containing the same data to a message-driven bean that will put the data in a database
        -   fail to acknowledge, or delay acknowledgement of, messages - The same thing can happen when you wrap acknowledgements into a transaction. If the transaction scope is too big, it may be easy to have it fail and leave messages in the persistent store. Missed acknowledgements not only affect the persistent store, they also require the client to handle duplicate messages.
        -   the lack of expirations on messages - By leveraging the expiration settings on messages in JMS you can ensure that old messages are cleaned up when they lack usefulness

-   Symptoms and Consequences
    -   Duplicate messages will often indicate some form of overreliability
    -   JMS senders that store data in a persistent store before sending the message are often overpersisting the data
    -   Failure to acknowledge messages can result in duplicate messages

-   Typical Causes
    -   Exceptions in the message-handling code - One of the common problems occurs when a message is handled but not acknowledged = **duplicate messages**
    -   Failure to acknowledge manually
    -   Including more information than necessary in a message

-   Refactorings
    -   Architect the Solution

Web Services
------------

## Web Services Will Fix Our Problems

-   Background
    -   SOA defines an architecture that is structured as a set of application-independent Web Services that each implement a specific business or technical function
        -   allows applications to be more rapidly created by enabling a compositional style of development, whereby loosely coupled services can be selected, extended, and aggregated in various ways to form unique applications

    -   **an architecture organized around services (or at least, reasonably cohesive abstractions) is important**
    -   poor maintainability, extensibility, and reuse cannot be fixed by just implementing Web Services, because the underlying implementation behind the Web Services is really the problem.

-   General Form
    -   a number of Web Service interfaces are implemented on top of an existing, poorly architected or structured system
    -   Most commonly manifested as bloated Web Services or many thin Web Services
    -   Web Services are really just an interface mechanism on top of another implementation

-   Symptoms and Consequences
    -   Decision to implement Web Services is made by high-level managers, not by project architects
    -   Implementing Web Service interfaces causes a major refactoring in the underlying system - or, more commonly, business logic is copied and pasted into Web Service implementation artifacts, creating a maintenance nightmare
    -   The resulting Web Services are highly coupled to each other, limiting reusability for other applications
    -   Copied and pasted business logic creates a maintenance issue

-   Typical Causes
    -   Two-tier application architecture
    -   Poor middle tier architecture and design - A middle tier that is not at least somewhat structured as a set of service abstractions will be harder to attempt to fit a services orientation on top of

-   Refactorings
    -   An alternate process-oriented refactoring is to decide not to use Web Services at all - **If heterogeneous interoperability is not a requirement, then there really is no justification for using Web Services at all**

## When in Doubt, Make It a Web Service

-   Background
    -   a Web Service interchange involves significant runtime performance
    -   XML is certainly not a compact data format, and the transmission, marshaling, and unmarshaling of XML can take considerable time, certainly more time than serialized Java objects transmitted over RMI
    -   In cases where there are many small interactions that happen frequently using a Web Service is probably going to be prohibitive in terms of performance
    -   a Web Services approach should usually be done when services or functions are being accessed by heterogeneous client platforms, or when there are firewall restrictions in which interchanges are restricted to HTTP
    -   The result is lower performance than would have been achieved with native J2EE approaches, and additional development time being spent to understand, implement, and deploy additional Web Services artifacts
    -   everything looks like it should be implemented as a Web Service

-   General Form
    -   a J2EE system with many Web Services implemented for all sorts of different functionality, including services used exclusively by internal application clients
    -   In many of these services, there is no justification for implementing them as Web Services, and doing so just adds development complexity and time, additional development artifacts to deal with, and reduced performance in some cases
    -   Systems that only interact with other Java components have no need for Web Services at all
    -   fine-grained, frequently accessed algorithmic type functions that are implemented as Web Services may represent a form of this AntiPattern

-   Symptoms and Consequences
    -   Intrasystem communication only - Functionality behind a Web Service that is only accessed by other J2EE system components
    -   Many Web Services
    -   Algorithm-type Web Services - prohibitive in terms of performance
    -   Poorer system performance in general
    -   More development, testing, and debugging time

-   Typical Causes
    -   Excessive interest in using a new technology - **Everything looks like a nail when you want to use a hammer**
    -   Incomplete understanding of functional and operational requirements
    -   Building for unspecified future requirements - Building for future, fuzzy requirements is usually a bad idea, and especially so for Web Services, because there is a high likelihood that changes will occur to the technology and tools, which will require changes to the Web Services

-   Refactorings
    -   performance is usually better using standard J2EE mechanisms for vending and interacting with server-based functionality
    -   Replace Web Service with J2EE Component
    -   **it is prohibitive in terms of performance**

## The God Object Web Service

-   Background
    -   Developers may see Web Services as simply a better mechanism to enable interoperation between clients and server-based functions
        -   ignores the general structuring principles regarding well-defined services, abstractions, and more, and can lead to a hodge-podge of unrelated operations in a single Web Service

    -   the result will be a single Web Service that vends all external functions and with which all clients interact
    -   the interface details of the Web Service inevitably change over time, and when a single Web Service implements a lot of operations, many clients will be affected by the change
    -   When many clients are utilizing one interface, and several developers work on one underlying implementation, there are bound to be issues of breakage in clients and developer contention for changes to server-side implementation artifacts

-   General Form
    -   a single Web Service that vends a large number of operations, and those operations exchange different core business abstractions or documents
    -   In some cases, the underlying system architecture may be reasonably structured and tiered, but many of those underlying components are then vended out through a single Web Service

-   Symptoms and Consequences
    -   Multiple types of documents exchanged - will support operations on many different document types, for example, orders, invoices, and payments
    -   A large number of operations in the Web Service, as defined in the WSDL - 20,30
    -   Higher likelihood of blocked developers and clobbered code changes - high likelihood of contention when they attempt to update the Web Service implementation artifacts and possible clobbering of changes if the code repository is not managed very well
    -   Client interactions fail more often, due to frequent changes in the Web Service definition
    -   Reuse is more difficult - If a Web Service exposes a broad range of operations, this implies considerable dependency and coupling to the variety of data types and implementations for each of those operations. Hence, reusing the Web Service in other contexts requires all those dependencies to come along for the ride, when all that is wanted is to use a particular operation.

-   Typical Causes
    -   Purely technical perspective on Web Services
    -   The underlying system architecture is monolithic
    -   Continuous, mechanical additions to an initially small Web Service

-   Refactorings
    -   Interface Partitioning
    -   CRUD-type operations, and possibly other related operations, such as status changes, should all be placed together

-   Related Solutions
    -   **Web Services may also be layered, especially if the lower-level subprocesses are themselves operations that external clients should have access to. Thus, some clients will access higher-level Web Services, with coarse-grained process operations, while others will utilize the lower-level, finer-grained processes**

## Fine-Grained/Chatty Web Service

-   Background
    -   Acommon problem with developers new to Web Services is that they create operations and messages that are too fine-grained
    -   **You shouldn't create an operation for every Java method** - each operation should clearly represent an action or business process
    -   the situation where a client must interact with multiple operations to do anything meaningful needs to be avoided
    -   performance issues will likely be more pronounced due to the additional bandwidth and processing requirements for XML-based messages, and the larger size of the data passed when doing document-style exchanges

-   General Form
    -   they have many fine-grained operations
    -   a client ultimately needs to execute multiple interactions with the Web Service to complete a meaningful process
    -   this requires clients to have too much knowledge of the Web Services' details, which they have to coordinate in the proper way.

-   Symptoms and Consequences
    -   Multiple different Web Service operations are required to execute one overall process
    -   Web Service operations are basically attribute-level setters or getters
    -   A Web Service may have many operations defined on it
    -   A Web Service interface may be similar to the interface or implementation methods of underlying component(s) implementing the Web Service
    -   Business logic is implemented in the client, limiting reuse
    -   Confusing interface - it is not known in what order to invoke them
    -   Poor performance
    -   Nontransactional processes - implementing an overall process this way will generally not have transactional integrity

-   Typical Causes
    -   Direct generation of Web Services from sessions or Java classes
    -   Inexperience with n-tier architecture

-   Refactorings
    -   Session Façade produces a coarser-grained, more efficient interface

## Maybe It's Not RPC

-   Background
    -   two flavors that can be done
        -   RPC-style interactions (remote method call)
        -   document-style interactions (electronic document interchange)

    -   there are specific situations in which the document-style approach is called for
    -   there may be some interactions that may be more function and procedure oriented, but that may still benefit from a document-style interaction approach
    -   **occurs when attempting to shoehorn an RPC approach into something that is inherently document-oriented** - document-oriented interactions exchange instances of significant business entities, such as Purchase Orders, Invoices, and more. In these cases, the **action or goal around the exchange is essentially a create, read, update, and delete (CRUD) operation**
    -   Using an RPC approach to implementing CRUD operations on entities or business documents results in operations that have a lot of parameters with custom types, SOAP document fragments, and so on
    -   RPC-style interactions are synchronous while Document-style interactions are often asynchronous, because clients usually do not need an immediate response

-   General Form
    -   a Web Service implements one or more RPC-style operations that essentially support CRUD-type actions for significant business entities
    -   Alternately, a document exchange process may be implemented through RPC by attaching the document as a SOAP attachment

-   Symptoms and Consequences
    -   The Web Service operation implements CRUD operations
    -   A Web Service operation has a large number of parameters that are derived from a single object
    -   A number of the parameters may be custom types or SOAP document fragments, reflecting that they are document components or subdocument parts
    -   The client may have significant implementation associated with creating or consuming the parameter values
    -   Significant client implementation

-   Typical Causes
    -   When embarking on a Web Service operation interface, a key determination should be whether the operation is supporting CRUD-type operations on a specific document or entity instance, or whether it is instead just an invocation of an operation, algorithm, or so on

-   Refactorings
    -   RPC to Document Style

-   Related Solutions
    -   send all the information as a MIME attachment and not as separate RPC arguments

## SOAPY Business Logic

-   Background
    -   implementing core business logic within a servlet (or a Web Service endpoint component) is usually a bad idea for any kind of significant enterprise application - **This severely limits reuse by binding the business logic to tier-specific interfaces, classes, and data types**
    -   If a J2EE system has to support interactive end-user access (through Web-tier components) and automated client access (through Web Services), the common core business logic that supports both of these is typically factored out into a decoupled middle tier
    -   The basic gist of this AntiPattern is letting Web-Service-specific implementation types bleed into business logic components, limiting their reuse for other client types and contexts

-   General Form
    -   a Web Service endpoint implements business logic, but is also coupled specifically to Web Service data types and/or contains an implementation that explicitly deals with SOAP/XML processing, severely reducing the reuse potential for the business logic
    -   a servlet or Session Bean that has business logic implementation, but is also defined specifically as a Web Service endpoint

-   Symptoms and Consequences
    -   Web-Service-specific data types are passed to business logic components
    -   Middle-tier business logic components perform XML-based processing
    -   Nonreusable business logic
    -   Redundant implementations of business logic

-   Refactorings
    -   Business Delegate
    -   Web Service Business Delegate

J2EE Services
-------------

## Hard-Coded Location Identifiers

-   Background
    -   the idea of externalizing strings, or parameterizing the application, is extremely important as J2EE applications move through the testing and production stages
    -   Storing the connection information for a database in the code itself will result in recompiles during staging
    -   **Recompiling is an opportunity to introduce errors and should be avoided whenever a system is being moved from test to production.**
    -   hardcoding location identifiers, while easy to do and commonplace, can lead to instability

-   General Form
    -   generally occur in applications that are built from prototypes or built quickly

-   Symptoms and Consequences
    -   You are storing location identifiers in Java code
    -   Identifiers are in JNDI but JNDI connection information is hard-coded - Just because the JMS connection information is in JNDI doesn’t mean that you can hard-code the JNDI information safely. What it means is that you have less connection information to load dynamically
    -   Changes to connection information require a recompile
    -   Configurations can't be resold. In a consulting

-   Typical Causes
    -   JNDI is seen as a buffer - people think of JNDI as a buffer against hard-coding locations. While this is true, JNDI itself involves location identifiers that should be parameterized
    -   Marginalizing locations - **Every location that you hard-code could result in a problem**

-   Refactorings
    -   Parameterize Your Application

## Choosing the Wrong Level of Detail

-   Background
    -   When connecting two programs, you can use HTTP, JRMI, CORBA, sockets, email, datagram sockets, or JMS, etc...
    -   Given all of these options, it is easy for a developer to become reliant on one technology or another out of habit, preference, or external pressure
    -   **But not every technology is necessarily the best for each situation**
    -   By sticking to the lower levels of the Java pyramid, developers can lose out on a lot of useful and powerful choices

-   General Form
    -   using one technology when another would be better

-   Symptoms and Consequences
    -   You use raw sockets
    -   Low-level programs have to implement the hard features themselves - JMS provides once-and-only-once semantics with guaranteed delivery. Sockets do not. With sockets, you have to solve the hard problems yourself. Moreover, you will often have to solve them every time you implement a new application
    -   Your client choices are limited - Applications that use a very high-level communication mechanism, such as JMS, are limiting the clients that they can support
    -   Higher-level communication mechanisms often rely on servers

-   Refactorings
    -   Fully leverage J2EE technology

-   Variations
    -   you can do so with data storage options
    -   you could write a custom file format or use XML. Or you could leverage a database that writes the files for you.

## Not Leveraging EJB Containers

-   Background
    -   EJBs are really a formalization of the customization part more than a concept all their own
    -   When developers don't leverage the code that the application server developers wrote, they are falling into an AntiPattern

-   General Form
    -   when the developers implement code that they could leverage

-   Symptoms and Consequences
    -   You have custom distribution in your applications
    -   Custom servers require more maintenance

-   Typical Causes
    -   "Not invented here attitude."

-   Refactorings
    -   Rewrite the custom servers as EJBs
