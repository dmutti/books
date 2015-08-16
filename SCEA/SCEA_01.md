Objectives
==========

-   Explain the main advantages of an object-oriented approach to system design, including the effect of encapsulation, inheritance, and use of interfaces on architectural characteristics.
-   Describe how the principle of "separation of concerns" has been applied to the main system tiers of a Java EE application. Tiers include client (both GUI and web), web (web container), business (EJB container), integration, and resource tiers.
-   Describe how the principle of "separation of concerns" has been applied to the layers of a Java EE application. Layers include application, virtual platform (component APIs), application infrastructure (containers), enterprise services (operating system and virtualization), compute and storage, and the networking infrastructure layers.
-   Explain the advantages and disadvantages of two-tier, three-tier, and multi-tier architectures when examined under the following topics: scalability, maintainability, reliability, availability, extensibility, performance, manageability, and security.

Discussion
==========

-   The major theme of architecture is the decomposition of the larger system into smaller components that can be built in relative isolation, as well as provide for the service-level requirements:
    -   scalability, maintainability, reliability, availability, extensibility, performance, manageability, and security

Decomposition Strategies
------------------------

-   can be broken down into ten basic strategies
    -   layering
    -   distribution
    -   exposure
    -   functionality
    -   generality
    -   coupling and cohesion
    -   volatility
    -   configuration
    -   planning and tracking
    -   work assignment

-   For any strategies that are grouped together, you choose one of the strategies and then move on to the next grouping
-   **Group 1** - Layering or Distribution
-   **Group 2** - Exposure, Functionality, or Generality
-   **Group 3** - Coupling and Cohesion or Volatility
-   **Group 4** - Configuration
-   **Group 5** - Planning and Tracking or Work Assignment
-   Grouping the strategies in this manner enables you to combine strategies that are related and will not be typically applied together
    -   example: if you are to decompose by layering, you will not typically decompose by distribution as well

-   **Layering**
    -   Layering decomposition is some ordering of principles, typically abstraction.Layering can be by layers or tiers.usually a top-level decomposition.

-   **Distribution**
    -   Distribution is among computational resources, along the lines of one or more of the following:
        -   Dedicated tasks own their own thread of control, avoiding the problem of a single process or thread going into a wait state and not being able to respond to its other duties
        -   Multiple clients may be required.
        -   Process boundaries can offer greater fault isolation
        -   Distribution for separation may be applied, perhaps with redundancy, for higher reliability

    -   Distribution is a primary technique for building scalable systems
    -   if you decompose by layering, you will not decompose by distribution and vice versa

-   **Exposure**
    -   how the component is exposed and consumes other components
    -   Any given component fundamentally has three different aspects: services, logic, and integration
        -   Services deals with how other components access this component
        -   Logic deals with how the component implements the work necessary to accomplish its task
        -   Integration deals with how it accesses other components services

-   **Functionality**
    -   grouping within the problem space
        -   example order module or customer module

    -   typically done with the operational process in mind

-   **Generality**
    -   determining whether you have a reusable component that can be used across many systems

-   **Coupling and Cohesion**
    -   low coupling and high cohesion
    -   keeping things together that work together (high cohesion), but setting apart things that work together less often (low coupling)

-   **Volatility**
    -   isolating things that are more likely to change
        -   GUI changes are more likely than the underlying business rules

-   **Configuration**
    -   having a target system that must support different configurations, maybe for security, performance, or usability
    -   It's like having multiple architectures with a shared core, and the only thing that changes is the configuration.

-   **Planning and Tracking**
    -   an attempt to develop a finegrained project plan that takes into account ordering dependencies and size
    -   Ordering is understanding the dependencies between packages and realizing which must be completed first
    -   Sizing is breaking down the work into small-enough parts so you can develop in a iterative fashion without an iteration taking several months

-   **Work Assignment**
    -   based on various considerations, including physically distributed teams, skill-set matching, and security areas
        -   select a decomposition strategy from group 1
        -   determine if you have decomposed the architecture sufficiently for it to be built
        -   If not, then you move to group 2 and select a strategy for decomposition and evaluate the architecture again
        -   You continue to decompose using a strategy from each group if it applies until you have the system broken down into small-enough components to start building

Tiers
-----

-   A tier can be logical or physical organization of components into an ordered chain of service providers and consumers
-   Components within a tier typically consume the services of those in an "adjacent" provider tier and provide services to one or more "adjacent" consumer tiers
-   Traditional tiers in an architecture are client, web/presentation, business, integration, and resource
-   **Client**
    -   A client tier is any device or system that manages display and local interaction processing. Enterprises may not have control over the technologies available on the client platform. For this reason, the client tier should be transient and disposable

-   **Web**
    -   consist of services that aggregate and personalize content and services for channel-specific user interfaces
    -   also referred to as the presentation tier

-   **Business**
    -   execute business logic and manage transactions

-   **Integration**
    -   abstract and provide access to external resources
    -   often employs loosely coupled paradigms, such as queuing, publish/subscribe communications, and synchronous and asynchronous point-to-point messaging

-   **Resource**
    -   includes legacy systems, databases, external data feeds, specialized hardware devices such as telecommunication switches or factory automation, and so on
    -   accessed and abstracted by the integration tier
    -   also referred to as the data tier

Layers
------

-   A layer is the hardware and software stack that hosts services within a given tier
-   Whereas tiers represent processing chains across components, **layers represent container/component relationships in implementation and deployment of services**
-   Typical layers are application, virtual platform, application infrastructure, enterprise services, compute and storage, and networking infrastructure
-   **Application**
    -   The application layer combines the user and business functionality of a system on a middleware substrate
    -   The application layer is what makes any particular system unique
    -   It is everything left after relegating shared mechanisms (middleware) to the application infrastructure layer, lower-level general purpose capabilities to the enterprise services layer, and the enabling infrastructure to the compute and storage layer

-   **Virtual Platform (Component APIs)**
    -   contains interfaces to the middleware modules in the application infrastructure layer
    -   Example: component APIs, such as EJBs, Servlets, and the rest of the Java EE APIs
    -   The application is built on top of the virtual platform component APIs

-   **Application Infrastructure (Containers)**
    -   contains middleware products that provide operational and developmental infrastructure for the application.
    -   example: Glassfish
    -   The virtual platform components are housed in an application infrastructure container

-   **Enterprise Services (OS and Virtualization)**
    -   the operating system and virtualization software that runs on top of the compute and storage layer

-   **Compute and Storage**
    -   consists of the physical hardware used in the architecture
    -   Enterprise services run on the compute and storage layer

-   **Networking Infrastructure**
    -   contains the physical network infrastructure, including network interfaces, routers, switches, load balancers, connectivity hardware, and other network elements

Service-Level Requirements
==========================

-   In addition to the business requirements of a system, you must satisfy the service-level or quality of service (QoS) requirements, also known as non-functional requirements
-   The architecture you create must address the following service-level requirements: performance, scalability, reliability, availability, extensibility, maintainability, manageability, and security
-   You will have to make trade-offs between these requirements
-   **Performance**
    -   usually measured in terms of response time for a given screen transaction per user
    -   also measured in transaction throughput
    -   Regardless of the measurement, you need to create an architecture that allows the designers and developers to complete the system without considering the performance measurement

-   **Scalability**
    -   ability to support the required quality of service as the system load increases without changing the system
    -   A system can be considered scalable if, as the load increases, the system still responds within the acceptable limits
    -   To understand scalability, you must first understand the capacity of a system, which is defined as the maximum number of processes or users a system can handle and still maintain the quality of service
    -   Vertical scaling involves adding additional processors, memory, or disks to the current machine(s)
    -   Horizontal scaling involves adding more machines to the environment, thus increasing the overall system capacity
    -   Vertical scaling of a software architecture is easier than the horizontal scaling. Adding more processors or memory typically does not have an impact on your architecture

-   **Reliability**
    -   ensures the integrity and consistency of the application and all its transactions
    -   Reliability can have a negative impact on scalability
    -   If the system cannot maintain the reliability as the load increases, the system is really not scalable.
    -   for a system to truly scale, it must be reliable.

-   **Availability**
    -   ensures that a service/resource is always accessible
    -   By setting up an environment of redundant components and failover, an individual component can fail and have a negative impact on reliability, but the service is still available due to the redundancy

-   **Extensibility**
    -   is the ability to add additional functionality or modify existing functionality without impacting existing system functionality
    -   consider low coupling, interfaces, and encapsulation

-   **Maintainability**
    -   is the ability to correct flaws in the existing functionality without impacting other components of the system
    -   consider low coupling, modularity, and documentation

-   **Manageability**
    -   is the ability to manage the system to ensure the continued health of a system with respect to scalability, reliability, availability, performance, and security
    -   deals with system monitoring of the QoS requirements and the ability to change the system configuration to improve the QoS dynamically without changing the system

-   **Security**
    -   is the ability to ensure that the system cannot be compromised
    -   includes not only issues of confidentiality and integrity, but also relates to Denial-of-Service (DoS) attacks that impact availability
    -   an architecture that is separated into functional components makes it easier to secure the system because you can build security zones around the components

Impact of Dimensions on Service-Level Requirements
==================================================

-   from a system computational point of view, you can think of the layout of an architecture (tiers and layers) as having six independent variables that are expressed as dimensions
    -   Capacity
    -   Redundancy
    -   Modularity
    -   Tolerance
    -   Workload
    -   Heterogeneity

-   **Capacity**
    -   the raw power in an element, perhaps CPU, fast network connection, or large storage capacity
    -   increased through vertical scaling and is sometimes referred to as height
    -   can improve performance, availability, and scalability

-   **Redundancy**
    -   the multiple systems that work on the same job, such as load balancing among several web servers
    -   increased through horizontal scaling and is also known as width
    -   can increase performance, reliability, availability, extensibility, and scalability
    -   can decrease performance, manageability, and security

-   **Modularity**
    -   how you divide a computational problem into separate elements and spread those elements across multiple computer systems
    -   indicates how far into a system you have to go to get the data you need
    -   can increase scalability, extensibility, maintainability, and security
    -   can decrease performance, reliability, availability, and manageability

-   **Tolerance**
    -   is the time available to fulfill a request from a user
    -   is closely bound with the overall perceived performance
    -   can increase performance, scalability, reliability, and manageability

-   **Workload**
    -   is the computational work being performed at a particular point within the system
    -   closely related to capacity in that workload consumes available capacity, which leaves fewer resources available for other tasks
    -   can increase performance, scalability, and availability

-   **Heterogeneity**
    -   is the diversity in technologies that is used within a system or one of its subsystems
    -   can increase performance and scalability
    -   can decrease performance, scalability, availability, extensibility, manageability, and security

Common Practices for Improving Service-Level Requirements
=========================================================

Introducing Redundancy to the System Architecture
-------------------------------------------------

-   The choice depends primarily on the cost of implementation and the requirements, such as performance and scalability

### Load Balancing

-   is a feature that allows server systems to redirect a request to one of several servers based on a predetermined load-balancing algorithm
-   You can implement load balancing to address architectural concerns, such as throughput and scalability
-   supported by a wide variety of products
-   advantage - it lets you distribute the workload across several smaller machines instead of using one large machine to handle all the incoming requests
-   **Load balancers in network switches**
    -   commonly implemented in firmware, which gives them the advantage of speed

-   **Load balancers in cluster management software and application servers**
    -   managed closer to the application components, which gives greater flexibility and manageability

-   **Load balancers based on the server instance DNS configuration**
    -   is configured to distribute the load to multiple server instances that map to the same DNS host name
    -   has the advantage of being simple to set up, but typically it does not address the issue of session affinity

-   Load balancing algorithms
    -   **Round-robin** - Picks each server in turn
    -   **Response-time or first-available** - Constantly monitors the response time of the servers and picks the one that responds the quickest.
    -   **Least-loaded algorithm** - Constantly monitors server load and selects the server that has the most available capacity
    -   **Weighted algorithm** - Specifies a priority on the preceding algorithms, giving some servers more workload than others
    -   **Client DNS-based algorithm** - Distribute the load based on the client's DNS host and domain name information

### Failover

-   is a system configuration that allows one server to assume the identity of a failing system within a network
-   If a server goes down the processes and state of that server are automatically transferred to the failover server
-   One important aspect of failover is available capacity, which can be handled in two ways
    -   **Designing with extra capacity** - you are spending money on extra computing resources that will not be used under normal load and operation conditions
    -   **Maintaining a stand-by server** - you are spending money on a system that does no work whatsoever, unless (or until) it is needed as a failover server.

### Clusters

-   is a group of server systems and support software that is used to manage the server group.
-   provide high availability to system resources
-   Cluster software allows group administration, detects hardware and software failure, handles system failover, and automatically restarts services in the event of failure
-   The following cluster configurations are available
    -   **Two-node clusters** - you can either run both servers at the same time (symmetric), or use one server as a stand-by failover server for the other (asymmetric).
    -   **Clustered pairs** - A configuration that places two machines into a cluster, and then uses two of these clusters to manage independent services. it enables you to manage all four machines as a single cluster. often used for managing highly coupled data services, such as an application server and its supporting database server
    -   **Ring** - allows any individual node to accept the failure of one of its two neighboring nodes
    -   **N+1 (Star)** - provides N independent nodes, plus 1 backup node to which all the other systems fail over.
    -   **Scalable (N-to-N)** - A configuration that has several nodes in the cluster, and all nodes have uniform access to the data storage medium. The data storage medium must support the scalable cluster by providing a sufficient number of simultaneous node connections.

Improving Performance
---------------------

-   The two factors that determine the system performance are as follows
-   **Processing time** - includes the time spent in computing, data marshaling and unmarshaling, buffering, and transporting over a network
-   **Blocked time** - The processing of a request can be blocked due to the contention for resources, or a dependency on other processing.can also be caused by certain resources not available
-   The following practices are commonly used to increase the system performance
    -   Increase the system capacity by adding more raw processing power.
    -   Increase the computation efficiency by using efficient algorithms and appropriate component models technologies

-   Introduce cached copies of data to reduce the computation overhead, as follows
    -   Introduce concurrency to computations that can be executed in parallel
    -   Limit the number of concurrent requests to control the overall system utilization
    -   Introduce intermediate responses to improve the performance perceived by the user

-   apply a timeout to the most of the long-lasting operations, especially those involving the access to an external system

Improving Availability
----------------------

-   The factors that affect the system availability include the following:
    -   **System downtime** - can be caused by a failure in hardware, network, server software, and application component.
    -   **Long response time** - the system can be perceived to be unavailable

-   The most common practice to improve the system availability is through one of the following types of replication.
    -   **Active replication**
        -   The request is sent to all the redundant components, which operate in parallel, and only one of the generated responses is used.
        -   Because all the redundant components receive the same request and perform the same computation, they are automatically synchronized.
        -   the downtime can be short because it involves only component switching

    -   **Passive replication**
        -   Only one of the replicated components (the primary component) responds to the requests.
        -   The states of other components (secondary) are synchronized with the primary component
        -   In the event of a failure, the service can be resumed if a secondary component has a sufficiently fresh state

Improving Extensibility
-----------------------

-   The need for extensibility is typically originated from the change of a requirement.
-   One of the most important goals of the architecture is to facilitate the development of the system that can quickly adapt to the changes.
-   When you create the architecture, consider the following practices for the system extensibility
    -   **Clearly define the scope in the service-level agreement** - Scope change is one of the most common reasons for project failure.
    -   **Anticipate expected changes** - You should identify the commonly changed areas of the system and then isolate these areas into coherent components.
    -   **Design a high-quality object model** - The object model of the system typically has an immediate impact on its extensibility and flexibility.

Improving Scalability
---------------------

-   You can configure scalability in the following two ways
    -   **Vertical scalability** - Adding more processing power to an existing server system, such as processors, memory, and disks
    -   **Horizontal scalability** - Adding additional runtime server instances to host the software system, such as additional application server instances

-   Vertically scaling a system is transparent to system architecture.
    -   the physical limitation of a server system and the high cost of buying more powerful hardware can quickly render this option impractical

-   you must take into account is the impact that horizontal scaling has on the system architecture
    -   not only do you need to use a software system that supports the cluster-based configuration, but you also need to design the application such that the components do not depend on the physical location of others

Tiers in Architecture
=====================

-   When most of the industry is talking about tiers in an architecture, they are referring to the physical tiers such as client, web server, and database server
-   An architecture can have multiple logical tiers, as we previously mentioned, and still be deployed in a two-tier architecture

Two-Tier Systems
----------------

-   traditionally called client/server systems
-   mostly have a thick client that includes both presentation and business logic and a database on the server
-   The presentation and business logic were typically tightly coupled
-   You could also have a browser-based two-tier system with business logic and database on the same server
-   **Advantages**
    -   Security is an advantage as most of these systems are behind the corporate firewall
    -   Performance is usually pretty good unless the company uses extremely old computers that have minimal memory

-   **Disadvantages**
    -   Availability because if one component fails, then the entire system is unavailable
    -   Scalability because the only component you can increase is the database
    -   Extensibility and Maintainability - the addition of new functionality will definitely impact the other components
    -   Manageability - it becomes almost impossible to monitor all the PCs that are running the client code
    -   Reliability - depends on the load of the database

Three- and Multi-Tier Systems
-----------------------------

-   Three-tier systems are comprised of web, business logic, and resources tiers
-   Multi-tier systems have web, business logic, integration, and resource tiers
-   **Advantages**
    -   Scalability is improved over a two-tier system as you move the presentation logic away from the client PC onto a server that can be clustered
    -   Availability is also improved with the ability to cluster tiers and provide failover
    -   Extensibility/maintainability is improved because functionality is separated into different tiers
    -   Manageability is greatly improved because the tiers are deployed on servers, making it easier to monitor the components
    -   Separating the tiers allows for more points to secure the system - could impact performance
    -   Performance Primarily is an advantage because you can spread out the processing over many servers. it can become a disadvantage if you have to transfer large amounts of data between the servers

-   **Disadvantages**
    -   inherently more complex
    -   there are no real disadvantages to have a multi-tier system
    -   **just because you have multiple tiers does not mean you have a great architecture**
