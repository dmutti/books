Phenomenal Cosmic Powers, Itty-Bitty Living Space
-------------------------------------------------

-   Traffic at online stores can increase by 1,000%. This is the real load test, the only one that matters.

Transparency
------------

-   Our systems are not so naturally exposed. They run in faceless boxes
-   If we are to get the kind of "environmental awareness" that the shipboard engineers naturally acquire, we must facilitate that awareness by building transparency into our systems
-   Transparency refers to the qualities that allow operators, developers, and business sponsors to gain understanding of the system's historical trends, present conditions, instantaneous state, and future projections. Transparent systems communicate, and in communicating, they train their attendant humans
-   transparent systems will mature faster than opaque ones
-   When you have to add capacity, you are totally dependent on data collected from the existing infrastructure. You will need a combination of technical data and business metrics to understand the past and present state of your system in order to predict the future. Good data enables good decision making. In the absence of trusted data, decisions will be made for you
-   If administrators do not know what it is doing, it cannot be tuned and optimized. If developers do not know what works and does not work in production, they cannot increase its reliability or resilience over time
-   **Systems can mature well if, and only if, they have some degree of transparency**

## Perspectives

-   Historical Trending
    -   The historical perspective can be represented by spreadsheets, charts, Microsoft PowerPoint presentations, or analysis reports. It lacks the immediacy of the present and is usually not appropriate for a dashboard view
    -   it's possible to develop "good enough" models by finding correlations in past data, which can then be used—within a certain domain of applicability—to make predictions. These correlative models can be built into spreadsheets to allow less technical users to perform "what if" scenarios
    -   Projections into the future tend to be sensitive information. They also do not have the urgency of immediate data. Therefore, they should generally not be built into a dashboard

-   Present Status
    -   "Present status" describes the overall state of the system. should include the state of each piece of hardware and every application server, application, and batch job
        -   Memory - Minimum heap size, maximum heap size, generation sizes
        -   Garbage collection - Type, frequency, memory reclaimed, size of request
        -   Worker threads, for each thread pool - Number of threads, threads busy, threads busy more than five seconds, high-water mark (maximum concurrent threads in use), low-water mark, number of times a thread was not available, request backlog
        -   Database connection pools, for each pool - Number of connections, connections in use, high-water mark, lowwater mark, number of times a connection was not available, request backlog
        -   Traffic statistics, for each request channel - Total requests processed, average response time, requests aborted, requests per second, time of last request, accepting traffic or not
        -   Business transaction, for each type - Number processed, number aborted, conversion rate, completion rate
        -   Users - Demographics or classification, technographics, number of users, usage patterns, errors encountered
        -   Integration points - Current state, manual override applied, number of times used, average response time from remote system, number of failures
        -   Circuit breakers - Current state, manual override applied, number of failed calls, time of last successful call, number of state transitions

    -   For most traffic-driven metrics, the time period that shows the most stable correlation will be the "hour of the week"—that is, 2 p.m. on Tuesday. The day of the month means little. In certain industries—such as travel, floral, and sports—the most relevant measurement is counting backward from a holiday or event. For a retailer, the "day of week" pattern will be overlaid on a strong "week of year" cycle. There is no one right answer for all organizations

-   The Infamous Dashboard
    -   the dashboard should know the linkages between these different views
    -   Whatever the purpose, those jobs become just as much a part of the system as the web or database servers. Their execution falls in the category of "required expected events." The dashboard should be able to represent those expected events, whether or not they've occurred, and whether they succeeded or not.

-   Instantaneous Behavior
    -   Instantaneous behavior answers the question, "What the \*\*\*\* is going on?" People will be most interested in instantaneous behavior when an incident is already underway
    -   Instantaneous behavior is the realm of monitoring systems. monitoring systems sit outside your system, watching like Big Brother for conformance to the plan

## Designing for Transparency

-   Transparency arises from deliberate design and architecture. "Adding transparency" late in development is about as effective as "adding quality." Maybe it can be done, but only with greater effort and cost than if it had been built in from the beginning
-   Visibility inside one application or server is not enough. Strictly local visibility leads to strictly local optimization
-   Visibility into one application at a time can also mask problems with scaling effects
-   The monitoring and reporting systems should be like an exoskeleton built around your system, not woven into it. In particular, decisions about what metrics should trigger alerts, where to set the thresholds, and how to "roll up" state variables into an overall system health status should all be left outside of the application itself

## Enabling Technologies

-   a process running on a server is totally opaque
-   Like Schrodinger's cat, it is impossible to tell whether the process is alive or dead until you look at it
-   A black-box technology sits outside the process, examining it through externally observable things. Black-box technologies can be implemented after the system is delivered, usually by operations. Even though black-box technologies are unknown to the system being observed, there are still helpful things you can do during development to facilitate the use of these tools.
-   By contrast, white-box technology runs inside the thing being observed—either a process or a whole system. The system deliberately exposes itself through these tools. These must be integrated during development. White-box technologies necessarily have tighter coupling to the system than black-box technologies.

## Logging

-   good old log files are still the most reliable, versatile information vehicle
-   they reveal the instantaneous behavior of that application
-   Nothing is more loosely coupled than log files; every framework or tool that exists can scrape log files
-   Logging Levels
    -   Most developers implement logging as though they are the primary consumer of the log files. In fact, administrators and engineers in operations will spend far more time with these log files than developers will.
    -   anything logged at level "ERROR" or "SEVERE" should be something that requires action on the part of operations
    -   Log errors in business logic or user input as warnings (if at all). Reserve "ERROR" for a serious system problem

-   Catalog of Messages
    -   a few hours with the internationalization tools in IDEs such as Eclipse, IDEA, and NetBeans are all it takes to externalize all the log messages

-   Human Factors
    -   The format should be as readable as possible

-   Final Notes
    -   Messages should include an identifier that can be used to trace the steps of a transaction. This might be a user's ID, a session ID, a transaction ID, or even an arbitrary number assigned when the request comes in

## Monitoring Systems

-   Dead processes log no tales. Neither do hung processes
-   Unanticipated or novel behavior might not be detected, unless it triggers one of these events.
    -   if one type of error isn't logged or is logged with a different format, then the monitoring system cannot catch it.

-   the agents themselves are at risk. Should the entire host go down, the agent surely goes with it. Therefore, monitoring systems always use some kind of heartbeat to detect a failed agent—or a network failure between the agent and the mothership
-   In small-to-mediumsized corporate deployments, monitoring traffic sometimes crosses the same network segments as production traffic. This is a bad idea. they should not cross VLANs that carry public traffic.
-   Gaps in Commercial Systems
    -   It is no longer acceptable—and, indeed, was never a good idea—to divorce the operation of production systems from business results
    -   So far, the major systems do not represent an individual user's perspective on the system; they just represent the system’s view of itself. There are some newer products that put themselves in the users' perspective

## Standards, De Jure and De Facto

-   Simple Network Management Protocol
    -   SNMP's essential concept is "Everything is a variable." Everything a node can report on or do is a variable. There are no commands, just variable assignments
    -   Using any of these platforms automatically brings a high degree of SNMP support and, therefore, immediate transparency. Using an SNMP-based monitoring system together with SNMP-supporting platforms provides immediate exposure for thousands of variables. The monitoring system will also allow you to define the thresholds and policies about alerts that reveal both instantaneous behavior and abnormal status.

-   In the Java community, SNMP compatibility is best achieved by writing application code to support the Java Management Extensions (JMX) and by using a JMX-to-SNMP connector.
-   JMX
    -   Every JVM running Java 5 or later will automatically be JMX-enabled
    -   These dynamic, whizzy features really pay off for platform developers—the open source crew working on JBoss, the hordes of true-blue WebSphere developers in IBM—but they have little value for application developers. Odds are, if you're that far into JMX, you’ve gotten lost in the weeds. Back up, take a cleansing breath, and start working on a story card instead of polishing JMX's tail fins
    -   make your application's administrative functions scriptable
    -   What to Expose - Within the application, the ideal is to expose every state variable, counter, and metric. Since you don't know what you'll need down the road, expose everything. Since you can't predict what the thresholds should be or how to react when they're breached, you should stick to providing visibility. Leave the policy for later. Provide universal visibility now, but externalize the policy so you can defer those decisions
        -   Traffic indicators - Page requests total, page requests, transaction counts, concurrent sessions
        -   Resource pool health - Enabled state, total resources, resources checked out, highwater mark, number of resources created, number of resources destroyed, number of times checked out, number of threads blocked waiting for a resource, number of times a thread has blocked waiting
        -   Database connection health - Number of SQLExceptions thrown, number of queries, average response time to queries
        -   Integration point health - State of circuit breaker, number of timeouts, number of requests, average response time, number of good responses, number of network errors, number of protocol errors, number of application errors, actual IP address of the remote endpoint, current number of concurrent requests, concurrent request high-water mark
        -   Cache health - Items in cache, memory used by cache, cache hit rate, items flushed by garbage collector, configured upper limit, time spent creating items

## Operations Database

-   Whereas logging provides visibility into a single application, the broader view of the OpsDb unifies status and metrics reporting across the entire system

## Supporting Processes

-   An effective feedback process can be described as "acting responsively to meaningful data." Transparency in the systems only provides access to the data. Humans in the loop still need to view and interpret the information.
    -   Examine the system: current state, historical patterns, and future projections.
    -   Interpret the data. This always occurs within the context of some person's mental model of the system.
    -   Evaluate potential actions, including the costs of each and, perhaps, taking no action at all.
    -   Decide on a course of action.
    -   Implement the chosen course of action.
    -   Observe the new state of the system.

Adaptation
----------

## Releases Shouldn't Hurt

-   Timing Releases
    -   The customer cares that the system is available and that it works without too many bugs
    -   Don't risk customers for an arbitrary release date.

-   Zero Downtime Deployments
    -   Whether that's an hour or a day, calling it "planned downtime" doesn't remove the cost
    -   Why do application releases seem to require downtime? it's exactly because of the same architecture feature that is supposed to increase uptime: redundancy
    -   The fact that multiple servers handle incoming requests means that during the deployment itself there will always be some servers on the new version of the code and some on the old version. All these external references leave plenty of opportunities for version conflict. The easiest approach is to just take downtime for the deployment.
    -   **The key is to break up the deployment into phases - add the new items early, with ways to ensure forward compatibility for the old version of the code**
    -   **after the release is rolled out, remove stuff that is no longer referenced, and add any new constraints that would have broken the old version**

-   Expansion
    -   The first step is to add new "stuff." The stuff consists of URL-based assets, web service endpoints, database tables and columns, and so on
    -   URL-based resources, such as style sheets, images, animations, or JavaScript files, should be given a new URL for each new revision
    -   For web services, each revision of the interface should be given a new endpoint name
    -   for remote object interfaces, defining a new interface name for each version
    -   For socket-based protocols, the protocol itself should contain a version identifier - it requires that the receiving applications must be updated before the senders and that the receiving application must support multiple versions of the protocol.
    -   If it's simply impractical to support multiple protocol revisions, another option is to define multiple service pools in the load balancer on different ports
    -   break schema changes into phases
        -   tables and columns get added
        -   referential integrity rules and any columns that will eventually be NOT NULL are added as nullable - later, constraints will be added

-   Rollout
    -   While both versions are in use, it might be helpful to create two service pools in the load balancers in order to keep request or session failover confined to the group of servers on the same version as the original session
    -   there is enough time for an orderly shutdown - avoiding the user frustration that accompanies abrupt shutdown

-   Cleanup
    -   removing the bridging triggers and extra service pools
    -   Any columns or tables that are no longer being used can be removed
    -   Old versions of static files can be removed
    -   time to convert columns to NOT NULL that need it, as well as to add referential integrity relations
    -   drop any columns and tables that are no longer needed
