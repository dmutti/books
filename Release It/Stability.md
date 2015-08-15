Introduction
------------

## Use the Force

-   Your early decisions make the biggest impact on the eventual shape of your system. The earliest decisions you make can be the hardest ones to reverse later. These early decisions about the system boundary and decomposition into subsystems get crystallized into the team structure, funding allocation, program management structure, and even timesheet codes.
-   Since different alternatives often have similar implementation costs but radically different lifecycle costs, it is important to consider the effects of each decision on availability, capacity, and flexibility.

The Exception That Grounded an Airline
--------------------------------------

-   As much as I like RMI’s programming model, it's really dangerous because calls cannot be made to time out. As a result, the caller is vulnerable to problems in the remote server.
-   the JDBC specification allows java.sql.Statement.close() to throw SQLException, so your code has to handle it.

## Getting Thread Dumps

-   One catch about the thread dumps: they always come out on "standard out." Many canned start-up scripts do not capture standard out, or they send it to /dev/null. (For example, Gentoo Linux's JBoss package sets JBOSS\_CONSOLE to /dev/null by default.) Log files produced with Log4J or java.util.logging cannot show thread dumps. You might have to experiment with your application server’s start-up scripts to get thread dumps.

Introducing Stability
---------------------

-   Enterprise software must be cynical. Cynical software expects bad things to happen and is never surprised when they do. Cynical software doesn't even trust itself, so it puts up internal barriers to protect itself from failures. It refuses to get too intimate with other systems, because it could get hurt.

## Defining Stability

-   A transaction is an abstract unit of work processed by the system. This is not the same as a database transaction.
-   A resilient system keeps processing transactions, even when there are transient impulses, persistent stresses, or component failures disrupting normal processing. This is what most people mean when they just say stability. It’s not just that your individual servers or applications stay up and running but rather that the user can still get work done.
-   The terms impulse and stress come from mechanical engineering. An impulse is a rapid shock to the system. An impulse to the system is when something whacks it with a hammer. In contrast, stress to the system is a force applied to the system over an extended period.
-   The stress from the credit card processor will cause strain to propagate to other parts of the system, which can produce odd effects. It could manifest as higher RAM usage on the web servers or excess I/O rates on the database server or as some other far distant effect.

## Failure Modes

-   The major dangers to your system's longevity are memory leaks and data growth. Both kinds of sludge will kill your system in production. Both are rarely caught during testing.
-   Testing makes problems visible so you can fix them (which is I why I always thank my testers when they find bugs). Following Murphy's law, whatever you do not test against will happen. Therefore, if you do not test for crashes right after midnight or out-of-memory errors in the application's forty-ninth hour of uptime, those crashes will happen. If you do not test formemory leaks that show up only after seven days, you will have memory leaks after seven days.
-   The trouble is that applications never run long enough in the development environment to reveal their longevity bugs. How long do you usually keep an application server running in your development environment? I'll bet the average life span is less than the length of a sitcom on TiVo. In QA, it might run a little longer but is probably still getting recycled at least daily, if not more often. Even when it is up and running, it’s not under continuous load. These environments are not conducive to longrunning tests, such as leaving the server running for a month under daily traffic.
-   These sorts of bugs usually aren’t caught by load testing either. A load test runs for a specified period of time and then quits. Load-testing vendors charge large dollars per hour, so nobody asks them to keep the load running for a week at a time. Your development team probably shares the corporate network, so you cannot disrupt such vital corporate activities as email and web browsing for days at a time.
-   So, how do you find these kinds of bugs? The only way you can catch them before they bite you in production is to run your own longevity tests. If you can, set aside a developer machine. Have it run JMeter, Marathon, or some other load-testing tool. Don't hit the system hard; just keep driving requests all the time. (Also, be sure to have the scripts slack for a few hours a day to simulate the slow period during the middle of the night. That will catch connection pool and firewall timeouts.)
-   Sometimes the economics don't justify setting up a complete environment. If not, at least try to test important parts while stubbing out the rest. It's still better than nothing.
-   If all else fails, production becomes your longevity testing environment by default. You'll definitely find the bugs there, but it's not a recipe for a happy lifestyle.

## Cracks Propagate

-   The more tightly coupled the architecture, the greater the chance that this coding error can propagate. Conversely, the less coupled architectures act as shock absorbers, diminishing the effects of this error instead of amplifying them.

## Chain of Failure

-   A failure in one point or layer actually increases the probability of other failures. If the database gets slow, then the application servers are more likely to run out of memory. Because the layers are coupled, the events are not independent.
-   Tight coupling accelerates cracks.

Stability Antipatterns
----------------------

-   As we integrate the world, tightly coupled systems are the rule rather than the exception.
-   In your systems, tight coupling can appear within application code, in calls between systems, or anyplace a resource has multiple consumers.
-   Antipatterns create, accelerate, or multiply cracks in the system.

## Integration Points

-   Integration points are the number-one killer of systems. Every single one of those feeds presents a stability risk. Every socket, process, pipe, or remote procedure call can and will hang. Even database calls can hang, in ways obvious and subtle. Every feed into the system can hang it, crash it, or generate other impulses at the worst possible time.
-   Socket-Based Protocols
    -   Slow failures, such as a dropped ACK, let threads block for minutes before throwing exceptions. The blocked thread can't process other transactions, so overall capacity is reduced. If all threads end up getting blocked, then for all practical purposes, the server is down. Clearly, a slow response is a lot worse than no response.

-   The 5 a.m. Problem
    -   Once established, a TCP connection can exist for days without a single packet being sent by either side. As long as both computers have that socket state in memory, the "connection" is still valid. Routes can change, and physical links can be severed and reconnected. It doesn't matter; the "connection" persists as long as the two computers at the endpoints think it does.
    -   When I decompiled the resource pool class, I saw that it used a last-in, first-out strategy. During the slow overnight times, traffic volume was light enough that one single database connection would get checked out of the pool, used, and checked back in. Then the next request would get the same connection, leaving the thirty-nine others to sit idle until traffic started to ramp up. They were idle well over the one-hour idle connection timeout configured into the firewall.
    -   Oracle has a feature called dead connection detection that you can enable to discover when clients have crashed. When enabled, the database server sends a ping packet to the client at some periodic interval. If the client responds, then the database knows it is still alive. If the client fails to respond after a few retries, the database server assumes the client has crashed and frees up all the resources held by that connection. Dead connection detection kept the connection alive.

-   HTTP Protocols
    -   A cynical system would never put up with such an unprotected call. Fortunately, other available HTTP clients allow much more control. For example, the Apache Jakarta Common's HttpClient package offers granular control over both the connection and read timeouts, not to mention request headers, response headers, and cookie policies.

-   Vendor API Libraries
    -   The prime stability killer with vendor API libraries is all about blocking. Whether it’s an internal resource pool, socket read calls, HTTP connections,

or just plain old Java serialization, vendor API libraries are peppered with unsafe coding practices.

-   **Remember This**
    -   Beware this necessary evil - Every integration point will eventually fail in some way, and you need to be prepared for that failure.
    -   Prepare for the many forms of failure - Integration point failures take several forms, ranging from various network errors to semantic errors. You will not get nice error responses delivered through the defined protocol; instead, you'll see some kind of protocol violation, slow response, or outright hang.
    -   Know when to open up abstractions - Debugging integration point failures usually requires peeling back a layer of abstraction. Failures are often difficult to debug at the application layer, because most of them violate the high-level protocols. Packet sniffers and other network diagnostics can help.
    -   Failures propagate quickly - Failure in a remote system quickly becomes your problem, usually as a cascading failure when your code isn't defensive enough.
    -   Apply patterns to avert Integration Points problems - Defensive programming via Circuit Breaker, Timeouts, Decoupling Middleware, and Handshaking will all help you avoid the dangers of Integration Points.

## Chain Reactions

-   If your system scales horizontally, then you will have load-balanced farms or clusters where each server runs the same applications. The multiplicity of machines provides you with fault tolerance through redundancy. A single machine or process can completely bonk while the remainder continues serving transactions.
-   **Remember This**
    -   One server down jeopardizes the rest - A chain reaction happens because the death of one server makes the others pick up the slack. The increased load makes them more likely to fail. A chain reaction will quickly bring an entire layer down. Other layers that depend on it must protect themselves, or they will go down in a cascading failure.
    -   Hunt for resource leaks - Most of the time, a chain reaction happens when your application has a memory leak. As one server runs out of memory and goes down, the other servers pick up the dead one's burden. The increased traffic means they leak memory faster.
    -   Defend with Bulkheads - Partitioning servers, with Bulkheads, can prevent Chain Reactions from taking out the entire service—though they won't help the callers of whichever partition does go down. Use Circuit Breaker on the calling side for that.

## Cascading Failures

-   Cascading failures often result from resource pools that get drained because of a failure in a lower layer. Integration Points without Timeouts is a surefire way to create Cascading Failures.
-   **Remember This**
    -   Stop cracks from jumping the gap - A cascading failure occurs when cracks jump from one system or layer to another, usually because of insufficiently paranoid integration points. A cascading failure can also happen after a chain reaction in a lower layer. Your system surely calls out to other enterprise systems; make sure you can stay up when they go down.
    -   Defend with Timeouts and Circuit Breaker - A cascading failure happens after something else has already gone wrong. Circuit Breaker protects your system by avoiding calls out to the troubled integration point. Using Timeouts ensures that you can come back from a call out to the troubled one.

## Users

-   Traffic
    -   Your best bet is to keep as little in the session as possible. it's a bad idea to keep an entire set of search results in the session for pagination. It's better if you requery the search engine for each new page of results.
    -   java.lang.ref.SoftReference objects hold a reference to some other payload object.
    -   When memory gets low, the garbage collector is allowed to reclaim any "softly reachable" objects. An object is softly reachable if the only references to it are held by SoftReference objects.
    -   The only guarantee is this: all softly reachable objects will be reclaimed before an OutOfMemoryError is thrown.
    -   After the payload gets garbage collected, any calls to SoftReference.get() will return null. Any code that uses the payload object must be prepared to deal with a null payload. It can choose to recompute the expensive result, redirect the user to some other activity, or take any other protective action.
    -   SoftReference is a useful way to respond to changing memory conditions, but it does add complexity. Generally, it's best to just keep things out of the session. Use the SoftReference approach when you cannot keep large or expensive objects out of the session. SoftReferences let you serve more users with the same amount of memory.

-   Expensive to Serve
    -   more buyers don't just increase the stability risk for the front-end system, they can place back-end or downstream systems at risk too
    -   The best thing you can do about expensive users is test aggressively. Identify whatever your most expensive transactions are, and double or triple the proportion of those transactions. If your retail system expects a 2% conversion rate (which is about standard for retailers), then your load tests should test for a 4%, 6%, or 10% conversion rate.

-   Unwanted Users
    -   Once again, we see that sessions are the Achilles heel of web applications. Want to bring down nearly any dynamic web application? Pick a deep link from the site, and start requesting it, without sending cookies. Don't even wait for the response; just drop the socket connection as soon as you've sent the request. Web servers never tell the application servers that the end user stopped listening for an answer. The application server just keeps on processing the request. It sends the response back to the web server, which funnels it into the bit bucket. In the meantime, the 100 bytes of the HTTP request causes the application server to create a session (which may consume several kilobytes of memory in the application server). Even a desktop machine on a broadband connection can generate hundreds of thousands of sessions on the application servers.

-   Malicious Users
    -   As you have seen before, session management is the most vulnerable point of a J2EE- or Rails-based web application. Application servers are particularly fragile when hit with a DDoS, so saturating the bandwidth might not even be the worst issue you have to deal with. A specialized Circuit Breaker can help to limit the damage done by any particular host. This also helps protect you from the accidental traffic floods too.

-   **Remember This**
    -   Users consume memory - Each user's session requires some memory. Minimize that memory to improve your capacity. Use a session only for caching so you can purge the session's contents if memory gets tight.
    -   Users do weird, random things - Users in the real world do things that you won't predict (or sometimes understand). If there's a weak spot in your application, they'll find it through sheer numbers. Test scripts are useful for functional testing but too predictable for stability testing. Hire a bunch of chimpanzees to hammer on keyboards for more realistic testing.
    -   Users will gang up on you - Sometimes they come in really, really big mobs. Picture the Slashdot editors giggling as they point toward your site, saying, "Release the legions!" Large mobs can trigger hangs, deadlocks, and obscure race conditions. Run special stress tests to hammer deep links or hot URLs.

## Blocked Threads

-   Error conditions and exceptions create too many permutations to test exhaustively.
-   Developers never hit their application with 10,000 concurrent requests.
-   If you are using Java 5 and you are not using the primitives in java.util.concurrent, then shame on you. If you are not using Java 5, then download the util.concurrent library from [http://gee.cs.oswego.edu/dl/classes/EDU/oswego/cs/dl/util/concurrent/intro.html.](http://gee.cs.oswego.edu/dl/classes/EDU/oswego/cs/dl/util/concurrent/intro.html. "http://gee.cs.oswego.edu/dl/classes/EDU/oswego/cs/dl/util/concurrent/intro.html.") It's the same library before adoption into the JCP
-   If you find yourself synchronizing methods on your domain objects, you should probably rethink the design. Find a way that each thread can get its own copy of the object in question. This is important for two reasons. First, if you are synchronizing the methods to ensure data integrity, then your application will break when it runs on more than one server. In-memory coherence doesn’t matter if there’s another server out there changing the data. Second, your application will scale better if requesthandling threads never block each other.
-   Spot the Blocking
    -   In Java, it is possible for a subclass to declare a method synchronized that is unsynchronized in its superclass or interface definition. Object oriented purists will tell you that this violates the Liskov Substitution principle. They are correct.
    -   You should hear mental alarm bells when you see the "synchronized" keyword on a method
    -   The lack of timeouts in the integration points caused the failure in one layer to become a cascading failure. Ultimately, this combination of forces brought down the entire site.

-   Third-Party Libraries
    -   Third-party libraries are notorious sources of blocking threads
    -   I recommend writing some small test cases that deliberately try to break the library
    -   If the library allows you to set timeouts, use them. If not, you might have to resort to some complex structure such as a pool of worker threads external to the vendor library that the request-handling thread can ask to execute the dangerous operation. If the call makes it through the library in time, then the worker thread and the original request handling-thread rendezvous on a result object. If the call does not complete in time, the request-handling thread abandons the call, even though the worker thread might eventually complete

-   **Remember This**
    -   The Blocked Threads antipattern is the proximate cause of most failures - Application failures nearly always relate to Blocked Threads in one way or another, including the ever-popular "gradual slowdown" and "hung server." The Blocked Threads antipattern leads to Chain Reactions and Cascading Failures.
    -   Scrutinize resource pools - Like Cascading Failures, the Blocked Threads antipattern usually happens around resource pools, particularly database connection pools. A deadlock in the database can cause connections to be lost forever, and so can incorrect exception handling
    -   Defend with Timeouts - **You cannot prove that your code has no deadlocks in it, but you can make sure that no deadlock lasts forever**

## Attacks of Self-Denial

-   A self-denial attack describes any situation in which the system—or the extended system that includes humans—conspires against itself
-   Any special offer meant for a group of 10,000 users is guaranteed to attract millions
-   if a lock manager that provides pessimistic locking is not available, the application can fall back to using optimistic locking.
-   **Remember This**
    -   Keep the lines of communication open- Attacks of Self-Denial originate inside your own organization, when clever marketers cause self-inflicted wounds by creating their own flash mobs and traffic spikes. You can aid and abet these marketing efforts and protect your system at the same time, but only if you know what's coming. Make sure nobody sends mass emails with deep links. Create static "landing zone" pages for the first click from these offers. Watch out for embedded session IDs in URLs.
    -   Protect shared resources - Programming errors, unexpected scaling effects, and shared resources all create risks when traffic surges. Watch out for Fight Club bugs, where increased front-end load causes exponentially increasing back-end processing.

## Scaling Effects

-   every application looks like one server. In QA, pretty much every system looks like one or two servers. When you get to production, though, some applications are really, really small, and some are medium, large, or humongous. Because the development and test environments rarely replicate production sizing, it can be hard to see where scaling effects will bite you.
-   As the number of servers grows, then a different communication strategy is needed. Depending on your infrastructure, you can replace point-to-point communication with the following:
    -   UDP broadcasts
    -   TCP or UDP multicast
    -   Publish/subscribe messaging
    -   Message queues

-   Shared Resources
    -   When the shared resource is redundant and nonexclusive—meaning it can service several of its consumers at once—then there is no problem. If it saturates, you can add more, thus scaling the bottleneck.

-   **Remember This**
    -   Watch out for point-to-point communication - Point-to-point communication scales badly, since the number of connections increases as the square of the number of participants. Consider how large your system can grow while still using pointto- point connections—it might be sufficient. Once you're dealing with tens of servers, you will probably need to replace it with some kind of one-to-many communication.
    -   Watch out for shared resources - Shared resources can be a bottleneck, a capacity constraint, and a threat to stability. If your system must use some sort of shared resource, stress test it heavily. Also, be sure its clients will keep working if the shared resource gets slow or locks up.

## Unbalanced Capacities

-   So if you can't build the scheduling system large enough to meet the potentially overwhelming demand from the front end, then you must build both the front and back ends to be resilient in the face of a tsunami of requests. For the front end, Circuit Breaker will help by relieving the pressure on the back end when responses get slow or connections get refused. For the back end, use Handshaking to inform the front end to throttle back on the requests. Also consider Bulkheads to reserve capacity on the back end for other transaction types.
-   Drive Out Through Testing
    -   Unbalanced capacities is another problem rarely observed during QA.
    -   don't just test your system with normal workloads. See what happens if you take the number of calls the front end could possibly make, double it, and direct it all against your most expensive transaction. If your system is resilient, it might slow down—even start to Fail Fast if it can't process transactions within the allowed time—but it should recover once the load goes down. Crashing, hung threads, empty responses, or nonsense replies all indicate that your system won't survive and might just start a cascading failure

-   **Remember This**
    -   Examine server and thread counts - Check the ratio of front-end to back-end servers, along with the number of threads each side can handle, in production compared to QA.
    -   Stress both sides of the interface - If you provide the back-end system, see what happens if it suddenly gets ten times the highest ever demand, hitting the most expensive transaction. Does it fail completely? Does it slow down and recover? If you provide the front-end system, see what happens if calls to the back end stop responding or get very slow

## Slow Responses

-   generating a slow response is worse than refusing a connection or returning an error, particularly in the context of middle-layer services in an SOA.
-   A quick failure allows the calling system to finish processing the transaction rapidly. Whether that is ultimately a success or a failure depends on the application logic. A slow response, on the other hand, ties up resources in the calling system and the called system.
-   Memory leaks often manifest via Slow Responses, as the virtual machine works harder and harder to reclaim enough space to process a transaction. This will appear as a high CPU utilization, but it is all due to garbage collection, not work on the transactions themselves.
-   **Remember This**
    -   Slow Responses triggers Cascading Failures - Upstream systems experiencing Slow Responses will themselves slow down and might be vulnerable to stability problems when the response times exceed their own timeouts.
    -   For websites, Slow Responses causes more traffic - Users waiting for pages frequently hit the Reload button, generating even more traffic to your already overloaded system.

## SLA Inversion

-   Features that require third-party services can have only whatever service-level agreement the third party offers, degraded by the probability of a failure in your own system. This is the IT equivalent of the Second Law of Thermodynamics: service levels only go down.
-   **Remember This**
    -   Don't make empty promises - An SLA inversion means you are operating on wishful thinking: you've committed to a service level that you can achieve only through luck.
    -   Decouple your SLAs - Be sure you can maintain service even when your dependencies go down. If you fail whenever they do, then it's a mathematical certainty that your availability will always be less than theirs.

## Unbounded Result Sets

-   **Remember This**
    -   Use realistic data volumes - Typical development and test data sets are too small to exhibit this problem. You need production-sized data sets to see what happens when your query returns a million rows that you turn into objects. As a side benefit, you'll also get better information from your performance testing when you use production-sized test data.
    -   Don't rely on the data producers - Even if you think a query will never have more than a handful of results, beware: it could change without warning because of some other part of the system. The only sensible numbers are "zero", "one" and "lots", so unless your query selects exactly one row, it has the potential to return too many. Don't rely on the data producers to create a limited amount of data. Sooner or later, they’ll go berserk and fill up a table for no reason, and then where will you be?
    -   Put limits into other application-level protocols - Web service calls, RMI, DCOM, XML-RPC: all are vulnerable to returning huge collections of objects, thereby consuming too much memory

Stability Patterns
------------------

## Use Timeouts

-   **Hope is not a design method.**
-   Well-placed timeouts provide fault isolation; a problem in some other system, subsystem, or device does not have to become your problem.
-   **Now and forever, networks will always be unreliable**
-   Also beware of java.lang.Object.wait(). Use the form that takes a timeout argument, instead of the simpler no-argument form. The same goes for classes in the new java.util.concurrent library. Always use the form of poll(), offer(), or tryLock() that can take a timeout argument. If you don’t, you might end up waiting forever
-   create a QueryObject (see Patterns of Enterprise Application Architecture [Fow03]) to represent the part of the interaction that changes
-   Is All This Clutter Really Necessary?
    -   You may think, as I did when porting the sockets library, that handling all the possible timeouts creates undue complexity in your code. It certainly adds complexity. You may find that half your code is devoted to error handling instead of providing features. I argue, however, that the essence of aiming for production—instead of aiming for QA—is handling the slings and arrows of outrageous fortune. That error-handling code, if done well, adds resilience. Your users may not thank you for it, because nobody notices when a system doesn't go down, but you will sleep better at night.

-   From the client's perspective, making me wait longer is a very bad thing. If you cannot complete an operation because of some timeout, it is better for you to return a result. It can be a failure, a success, or a note that you've queued the work for later execution (if I should care about the distinction). In any case, just come back with an answer.
-   The Timeouts and Fail Fast patterns both address latency problems. The Timeouts pattern is useful when you need to protect your system from someone else's failure. Fail Fast is useful when you need to report why you won't be able to process some transaction. Fail Fast applies to incoming requests, whereas the Timeouts pattern applies primarily to outbound requests.
-   **Remember This**
    -   Apply to Integration Points, Blocked Threads, and Slow Responses
    -   Apply to recover from unexpected failures
    -   Consider delayed retries - Most of the time, you should queue the operation and retry it later.

## Circuit Breaker

-   This differs from retries, in that circuit breakers exist to prevent operations rather than reexecute them.
-   When the circuit is "open", calls to the circuit breaker fail immediately, without any attempt to execute the real operation. After a suitable amount of time, the circuit breaker decides that the operation has a chance of succeeding, so it goes into the "half-open" state. In this state, the next call to the circuit breaker is allowed to execute the dangerous operation. Should the call succeed, the circuit breaker resets and returns to the "closed" state, ready for more routine operation. If this trial call fails, however, the circuit breaker returns to the "open" state until another timeout elapses.
-   Therefore, it is essential to involve the system's stakeholders when deciding how to handle calls made when the circuit is open
-   **Remember This**
    -   Don't do it if it hurts - When there's a difficulty with Integration Points, stop calling it!
    -   Use together with Timeouts
    -   Expose, track, and report state changes - **Popping a Circuit Breaker always indicates there is a serious problem. It should be visible to operations. It should be reported, recorded, trended, and correlated**

## Bulkheads

-   Physical redundancy is the most common form of bulkheads
-   a mission-critical service might be implemented as several independent farms of servers, with certain farms reserved for use by critical applications and

others available for noncritical uses

-   You can partition the threads inside a single process, with separate thread groups dedicated to different functions. For example, it is often helpful to reserve a pool of request-handling threads for administrative use
-   **Remember This**
    -   Pick a useful granularity - You can partition thread pools inside an application, CPUs in a server, or servers in a cluster
    -   Very important with shared services models - **In a service-oriented architecture, there may be many enterprise systems dependent on your application. If your application goes down because of Chain Reactions, does the entire company come to a halt? Then you'd better put in some Bulkheads**

## Steady State

-   The Steady State pattern says, for every mechanism that accumulates a resource, some other mechanism must recycle that resource. You'll look at several types of sludge that can accumulate and how to avoid the need for fiddling.
-   Data purging never makes it into the first release, but it should
-   In-Memory Caching
    -   Therefore, when building any sort of cache, it's vital to ask two questions:
        -   Is the space of possible keys finite or infinite?
        -   Do the cached items ever change?

    -   Improper use of caching is the major cause of memory leaks, which in turn lead to horrors like daily server restarts. Nothing gets administrators in the habit of being logged on to production like daily (or nightly) chores

-   **Remember This**
    -   Purge data with application logic - **DBAs can create scripts to purge data, but they don't always know how the application behaves when data is removed. Maintaining logical integrity, especially if you use an ORM tool, requires the application to purge its own data**
    -   Limit caching - In-memory caching speeds up applications, until it slows them down. Limit the amount of memory a cache can consume

## Fail Fast

-   In any service-oriented architecture, the application can tell from the service requested roughly what database connections and external integration points will be needed. The service can very quickly check out the connections it will need and verify the state of the circuit breakers around the integration points. It can tell the transaction manager to start a transaction. If any of the resources are not available, it can fail immediately.
-   Another way to fail fast in a web application is to perform basic parameter-checking in the servlet or controller that receives the request, before loading EJBs or domain objects. Be cautious, however, that you do not violate encapsulation of the domain objects. If you are checking for more than null/not-null or number formatting, you should move those validity checks into the domain objects or an application facade
-   Even when failing fast, be sure to report a system failure (resources not available) differently than an application failure (parameter violations or invalid state). Reporting a generic "error" message may cause an upstream system to trip a circuit breaker just because some user entered bad data and hit Reload three or four times
-   **Remember This**
    -   Reserve resources, verify Integration Points early - **don't do useless work**
    -   Use for input validation

## Test Harness

-   Integration test environments can verify only what the system does when its dependencies are working correctly
-   every system will eventually end up operating outside of spec; therefore, it's vital to test the local system's behavior when the remote system goes wonky. Unless the designers of the remote system built in modes that simulate the whole range of out-of-spec failures that can occur naturally in production, there will be behaviors that integration testing does not verify.
-   A test harnesses differs from mock objects, in that a mock object can be trained to produce behavior that conforms only to the defined interface. A test harnesses runs as a separate server, so it is not obliged to conform to any interface. It can provoke network errors, protocol errors, or application-level errors. If all low-level errors were guaranteed to be recognized, caught, and thrown as the right type of exception, there would be no need for test harnesses.
-   A test harness "knows" that it is meant for testing; it has no other role to play. Whereas the real application would not be written to call the low-level network APIs directly, the test harness can. Therefore, it is able to send bytes too quickly, or very slowly. It can set up extremely deep listen queues. It can bind to a socket and then never service a single connection attempt. The test harness should act like a little hacker, trying all kinds of bad behavior to break callers.
-   One trick I like is to have different port numbers indicate different kinds of misbehavior. On port 10200, it would accept connections but never reply. Port 10201 gets a connection and a reply, but the reply will be copied from /dev/random. Port 10202 will open a connection, then drop it immediately, and so on. A single test harness can break many applications. It can even help with functional testing in the development environment by letting multiple developers hit the test harness from their workstations.
-   **Remember This**
    -   Emulate out-of-spec failures - Calling real applications lets you test only those errors that the real application can deliberately produce. A good Test Harness lets you simulate all sorts of messy, real-world failure modes
    -   Stress the caller - produce slow responses, no responses, or garbage responses

## Decoupling Middleware

-   Middleware is a graceless name for tools that inhabit a singularly messy space—integrating systems that were never meant to work together
-   Tightly coupled middleware amplifies shocks to the system. Synchronous calls are particularly vicious amplifiers that facilitate cascading failures
-   Message-oriented middleware decouples the endpoints in both space and time. Because the requesting system doesn't just sit around waiting for a reply, this form of middleware cannot produce a cascading failure.
-   **Remember This**
    -   Decide at the last responsible moment - This is one of those nearly irreversible decisions that should be made early rather than late
    -   Avoid many failure modes through total decoupling - decoupled applications are also more adaptable, since you can change any of the participants independently of the others
