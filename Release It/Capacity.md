Trampled by Your Own Customers
------------------------------

## Aiming for QA

-   The more common result is that both sides of the integration end up aiming at a moving target
-   Conway's Law
    -   "Organizations which design systems are constrained to produce designs whose structure are copies of the communication structures of these organizations." - "If you have four teams working on a compiler, you will get a four-pass compiler"

-   I did what any good developer does: I added a level of indirection
-   Load testing is both art and science. It is impossible to duplicate real production traffic, so you use traffic analysis, experience, and intuition to achieve as close a simulation of reality as possible
-   Unless you are building a pure two-tier client/server system where users connect directly to the database, the concurrent user is fiction
-   The number of active sessions is one of the most important measurements about a web system, but it should not be confused with counting users.

## Murder by the Masses

-   Search engines spidering the site - Some of the spiders (particularly for the lesser-known search engines) do not keep track of cookies, for legitimate reasons. They do not want to influence marketing data or advertising revenue. The spiders generally expect the site to support session tracking via URL

rewriting. Without the cookies, however, they were creating a new session on each page request. That session was then going resident in memory until it expired (thirty minutes). We found one search engine that was creating up to ten sessions per second.

## The Testing Gap

-   **we tested the application the way it was meant to be used**
-   Most testers I've known are perverse enough that if you tell them the "happy path" through the application, that's the last thing they'll do. It should be the same with load testing. "Noise" might just bleed away some amount of your capacity, but it could bring your site down.

Introducing Capacity
--------------------

## Defining Capacity

-   Performance measures how fast the system processes a single transaction. This can be measured in isolation or under load. The system's performance has a major impact on its throughput. **Customers are interested in either throughput or capacity**
-   Throughput describes the number of transactions the system can process in a given time span
-   Optimizing performance of any nonbottleneck part of the system will not increase throughput.
-   A graph of requests per second versus response time measures scalability
-   the maximum throughput a system can sustain, for a given workload, while maintaining an acceptable response time for each individual transaction is its capacity
-   the definition of capacity includes several important variables. If the workload changes then your capacity might be dramatically different.

## Constraints

-   In every system, exactly one constraint determines the system's capacity. This constraint is whatever limiting factor hits its ceiling first. Once the constraint is reached, all other parts of the system will begin to either queue up work or drop it on the floor.
-   Any nonconstraint metric is useless for projecting or increasing capacity. Once you have found the constraint, you can reliably predict capacity improvements based on changes to that constraint. If memory is the constraint, then increasing the memory will increase capacity, until, of course, something else becomes the constraint.

## Scalability

-   Web servers are perfectly horizontally scalable. So are Ruby on Rails servers. J2EE application servers such as WebSphere, WebLogic, and JBoss are horizontally scalable via clustering
-   Sometimes, it's impractical or impossible to add more servers in parallel. When that happens, each individual server needs to be as large as possible. Database servers, for example, get very unwieldy when you try to cluster three or more redundant servers. It's better to run a beefy pair with failover

## Myths About Capacity

-   CPU Is Cheap
    -   Today, however, a CPU typically costs less than half a days worth of programmer time. So, why bother spending the programmers' time optimizing for CPU usage?
    -   The silicon microchips themselves might be cheap but **CPU cycles are not cheap. Every CPU cycle consumes clock time. Clock time is latency.** A wasteful application makes its users wait longer than they need to, and if there's anything users hate, it's waiting
    -   The longer a request-handling thread is checked out from the pool, the higher the probability that an incoming request must be queued instead of executing immediately
    -   Latency in the application servers harms the web servers. While a web server is waiting for the application server to respond, it's holding certain idle resources.
    -   Application server CPU usage directly drives web server memory usage.
    -   You want to be sure that there are no wasted cycles before laying down a million dollars

-   Storage Is Cheap
    -   **Storage is a service, not a device.**
    -   Storage is the entire managed system of drives, interconnects, allocation, redundancy, and backups needed to deliver high levels of service at efficient costs. Storage is more of a service than a piece of commodity hardware in today's large enterprise. It begins with drives, but it does not end there
    -   A gigabyte of data on local storage costs less than one dollar. In the enterprise, however, managed storage can be charged back at rates of up to $7 per gigabyte. It's very important to discuss storage and storage management with your company's IT group when designing for production.

-   Bandwidth Is Cheap
    -   the more users you have on broadband, the worse your bandwidth looks. TCP/IP handshaking guarantees that they will try to pull data as fast as they can receive it. Because they can receive data faster than dial-up users, broadband users will each use a larger share of your available bandwidth
    -   Back-of-the-envelope calculations say you could service thirteen times as many dial-up users as cable-modem users.
    -   Dynamically generated pages

tend to have a lot of junk characters in them. Suppose each page has just 1,024 bytes of junk in it. For a million pages per day, you are sending 1,024,000,000 excess bytes. That's just short of one gigabyte of unnecessary transfers

## Summary

-   Always look for the multiplier effects. These will dominate your costs.
-   Understand the effects that one layer has on another.
-   Improving nonconstraint metrics will not improve capacity.
-   Try to do the most work when nobody is waiting for it.
-   Place safety limits on everything: timeouts, maximum memory consumption, maximum number of connections, and so on.
-   Protect request-handling threads.
-   Monitor capacity continuously. Each application release can affect scalability and performance. Changes in user demand or traffic patterns change the system's workload.

Capacity Antipatterns
---------------------

## Resource Pool Contention

-   database connection pools are a necessary evil
-   Left untended, resource pools can quickly become the biggest bottleneck in an application.
-   Ideally, every thread immediately gets the resource it needs. To guarantee this, make the resource pool size equal to the number of threads. Although this alleviates the contention in the application server, it might shift the problem to the database server
-   Each application server is configured differently, so it pays to become expert in your particular resource pool's behavior
    -   The Jakarta Commons' BasicDataSource supports this via the maxWait property. JBoss uses the <blocking-timeout-millis\> element in its data source configuration files

-   At runtime, you want to know how often callers are blocking, what's the highest number of resources checked out since start-up is (the high-water mark), and how many resources have been created and destroyed
-   **Remember This**
    -   If possible, size resource pools to the request thread pool - If there's always a resource ready when a request-handling thread needs it, then you have no efficiency loss to overhead. For database connections, the added connections mainly consume RAM on the database server, which, while expensive, is less costly than lost revenue. Be careful, however, that a single database server can handle the maximum number of connections. During a failover situation, one node of a database cluster must serve all the queries—and all the connections.
    -   Watch for the Blocked Threads pattern

## Excessive JSP Fragments

-   compiled JSPs are loaded into the JVMs permanent generation
-   **Remember This**
    -   Don't use code for content - If you have enough JSP files, you will fill the permanent generation. Even if you don't, it's a waste of otherwise useful memory to keep a class in memory when it might not be accessed again before you restart the application server.

## AJAX Overkill

-   The individual requests will tend to be smaller, and since the response typically consists of a partial page instead of a full page, the responses will be smaller as well. The combined effect depends greatly on the specific way you employ AJAX techniques.
-   Used well, it can reduce your bandwidth costs. Used poorly, AJAX techniques will place more burden on the web server and application server layers.
-   Session Trashing
    -   Be sure to configure session affinity so the AJAX requests go to the same application server that the user's session resides on. Avoid unnecessary session failover

-   Response Formatting
    -   Do not return HTML pages or fragments. HTML is needlessly verbose; it wastes bandwidth. Instead, return just the data—without formatting—that the client can use to dynamically update the elements on the page. **Use JavaScript object notation (JSON) for data, rather than XML**

-   **Remember This**
    -   Avoid needless requests - Don't use polling requests for fizzy features such as autocompletion. If you must have autocompletion send a request only when the input field actually changes.
    -   Respect your session architecture - Make sure your AJAX requests include a session ID cookie or query parameter. If you don’t, your application server will create a new, wasted session for every AJAX request
    -   Minimize the size of replies - Return the least amount of data necessary. Reply with XML or JSON, not HTML
    -   Increase the size of your web tier - Be sure to increase the maximum number of connections your web tier can handle

## Overstaying Sessions

-   Abundant free memory is critical to the stability and performance of Java-based applications. Therefore, sessions residing in memory are a direct threat to the health and well-being of the system. They are a threat to the system in direct proportion to their tenure in memory.
-   A good bet is to set the session timeout to one standard deviation past the average of that delay. In practice, this will be about ten minutes for a retail site, five for a media gateway, and up to twenty for travel-industry sites
-   **An even better bet is to make the session itself unnecessary**
-   if everything in the session is just an in-memory copy of persistent state, then the session can be discarded and re-created anytime.the session is purely an in-memory cache.
-   **Remember This**
    -   Curtail session retention - Keep sessions in memory for as short a time as reasonable
    -   Remember that users don't understand sessions
    -   Keep keys, not whole objects - do it with soft references. Keep keys to persistent objects instead

## Wasted Space in HTML

-   The larger the page, the longer the browser and web server keep their connection open. While that connection is open, obviously no other request can use it. But, the web server can handle only a finite number of connections! The same way that threads can contend for database connections, end users can contend for web server connections. When a user can't get a web server connection, your site might as well be down.
-   All current browser versions support Cascading Style Sheets (CSS). Clever use of CSS and styles can provide every bit as much control over formatting as tables. The capacity difference is striking. Table structures must be sent on every page, every time the page is served. A style sheet has to be downloaded only once.
-   **Remember This**
    -   Omit needless characters - Eliminate whitespace to save your users' time and your company's money.
    -   Remove whitespace
    -   Replace HTML tables with CSS layout

## The Reload Button

-   make sure your site is fast enough that users don't click it
-   **Remember This**
    -   Make the Reload button irrelevant - Fast sites don't provoke the user into hitting the Reload button

## Handcrafted SQL

-   why do I call it a capacity killer? It's mainly because object-oriented developers do weird, wonderful, and torturous things to a perfectly innocent database.
-   What makes these handcrafted SQL queries so bad?
    -   they often join on nonindexed columns
    -   they usually join too many tables
    -   developers try to treat SQL as if it were either a procedural language or an object-oriented language instead of the set-based relational language it really is

-   Dynamically generated SQL from an ORM tool is just fine, because it is predictable
-   You can tune the database to respond well only to certain predictable access patterns. You cannot make it respond well to every possible query
-   **Remember This**
    -   Minimize handcrafted SQL
    -   See whether the DBA laughs at the queries
    -   Verify gains against real data

## Database Eutrophication

-   eutrophication - the slow buildup of sludge from dead microbes, rotting fish, and algae. In advanced stages, the sludge removes enough oxygen from the water that nothing can live in the lake any more, and the lake dies. The same thing can happen to your database, only it will be your system that goes belly-up.
-   In development and QA, testing typically proceeds with data sets ranging from tiny to laughably miniscule
-   Indexing
    -   any column that is the target of an association in the ORM mapping should be indexed
    -   Database schemas are often designed well in advanced of the application code that will use the schema. As a result, indexes created during design might not match the actual access patterns implemented in the application

-   Partitioning
    -   the ability to keep the database well-structured during production operations
    -   Mapping the logical tables to physical storage well has a tremendous impact on the long-term performance of the database
    -   Another solution would be to segment or partition the tables
    -   Each partition can be reorganized or moved to another physical extent separately, even while another partition of the table is in heavy use. This permits restructuring of the storage underneath the table without taking downtime

-   Historical Data
    -   The data should be only that needed to process the users' transactions
    -   you don't need to keep all historical data online in the same database
    -   Data mining, reporting, or any other kind of analysis should be done in a true warehouse anyway. The OLTP schema is no good for data
        -   OLTP: online transaction processing. This is a schema optimized for fast inserts of transactional records. This is typically very bad for producing reports or performing ad-hoc queries.

    -   a rigorous regimen of data purging is vital to the long-term stability and performance of your system.

-   **Remember This**
    -   Create indexes; it's not just the DBA's responsibility - You know your application's intentions better than the DBA
    -   Purge sludge - Old data just slows down queries and inserts
    -   Keep reports out of production

## Integration Point Latency

-   A remote call takes at least 1,000 times as long as a local call
-   the caller takes at least as long to respond as the remote system.
-   "location transparency" philosophy has been widely discredited for two major reasons
    -   remote calls exhibit different failure modes than local calls. They are vulnerable to network failures, failure in the remote process, and version mismatch between the caller and server, to name a few
    -   location transparency leads developers to design remote object interfaces the same way they would design local objects, resulting in a chatty interface. Such designs use multiple method calls for a single interaction. Each method call incurs its own latency penalty. The cumulative effect is a very slow response time

-   More abstractly, there is an opportunity cost to having a blocked thread wait for response from an integration point. It cannot do other work, even if other work is queued and waiting for a thread to process it
-   **Remember This**
    -   Expose yourself to latency as seldom as possible - Integration point latency is like the house advantage in blackjack. Avoid chatty remote protocols

## Cookie Monsters

-   HTTP cookies stand right there with bottle rockets in the "things that invite you to blow yourself up" category
-   Several developers have independently discovered the antipattern of storing anonymous persistent data via cookies.
-   Serialization makes IOException a routine part of doing business
-   And what if the browser just lies? HTTP, like any protocol, is nothing but an agreement about how two parties should interact. Either side of that interaction can be subversive or malicious. Given a sophisticated enough attacker, armed with information about the company's software platform, it might be possible to use a serialized Cart object to subvert a lot of business rules about pricing and promotions. Even if the cookie is just data, don't trust it! Plenty of tools out there let users monkey around with HTTP requests and responses (Firefox extensions, smart HTTP proxies, session replay, and so on)
-   It hurts the user too. Even broadband users typically have much less upstream bandwidth than downstream. Uploading the extra 4KB on each request adds up.
-   As a general mechanism, cookies produce some cool effects. Just remember that the client can lie, might send back stale or broken cookies, and might not send the cookies back at all.
-   **Remember This**
    -   Serve small cookies - Use cookies for identifiers, not entire objects

Summary
-------

-   Without that experience, programmers are likely to re-create many of the capacity killers discussed in this section, either through ignorance or misguided intentions. These issues certainly aren't covered in colleges and universities, where optimization refers to tweaking up some search algorithm.

Capacity Patterns
-----------------

-   C.A.R. Hoare famously said, "Premature optimization is the root of all evil". This has often been misused as an excuse for sloppy design. Hoare's full quote said, "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil". His true warning was against chasing small gains at the expense of complexity and development time.
-   **Choosing a better design or an architecture optimized for scaling effects is the opposite of premature optimization; it obviates the need for optimization altogether**

## Pool Connections

-   resource pools can dramatically improve capacity. Resource pools eliminate connection setup time.
-   Connection pooling does impose some considerations. Connections can get into a bad state. When that happens, every request that attempts to use the connection will get an error. The bad connection will get checked out, cause an error, and get thrown back into the pool. The good connections get used for actual work, so they stay checked out longer. As a result, the bad connection is more likely to be available when a request comes in. It therefore causes a disproportionate number of errors. One bad connection out of ten will cause more than 10% of requests to error out.
-   An undersized connection pool leads to resource pool contention. An oversized connection pool can cause excess stress on the database servers
-   For a web-based system, several strategies are possible. The simplest is the "per-page" model: a connection is checked out for the entire page. It is checked in when the page is completed. When multiple connection pools are involved, this model tends to be safer against deadlocks, since the same order of connection checkout and checkin can be enforced on all requests. On the other hand, this model does require a higher ratio of connections to request-handling threads, since each connection will be checked out for longer periods
-   The "per-fragment" approach allows each fragment to check out its own connection, do some work, and check the connection back in to the pool. This model is more susceptible to deadlock but can achieve higher throughput than the "per-page" model. Fewer connections per request-handling thread are required, because the individual connections are checked in faster. The main advantage is individual fragments do not require global knowledge about the transaction context. Each can operate independently.
-   **Remember This**
    -   Pool connections
    -   Protect request-handling threads - Do not allow callers to block forever. Make sure that any checkout call has a timeout and that the caller knows what to do when it doesn't get a connection back
    -   Size the pools for maximum throughput

## Use Caching Carefully

-   The maximum memory usage of all application-level caches should be configurable. Caches that do not limit maximum memory consumption will eventually eat away at the memory available for the system. When that happens, the garbage collector will spend more and more time attempting to recover enough memory to process requests. The cache, by consuming memory needed for other tasks, will actually cause a serious slowdown.
-   No matter what memory size you set on the cache, you need to monitor hit rates for the cached items to see whether most items are being used from cache. If hit rates are very low, then the cache is not buying any performance gains and might actually be slower than not using the cache. Keeping something in cache is a bet that the cost of generating it once, plus the cost of hashing and lookups, is less than the cost of generating it every time it is needed. If a particular cached object is used only once during the lifetime of a server, then caching it is of no help.
-   In Java, caches should be built using SoftReference objects to hold the cached item itself. If memory gets low, the garbage collector is permitted to reap any object that is reachable only via soft references. As a result, caches that use soft references will help the garbage collector reclaim memory instead of preventing it
-   Precomputing results can reduce or eliminate the need for caching
-   **Remember This**
    -   Limit cache sizes - Unbounded caches consume memory that is better spent handling requests
    -   Build a flush mechanism - every cache needs to be flushed sooner or later
    -   Don't cache trivial objects
    -   Compare access and change frequency - Don't cache things that are likely to change before they get used again.

## Precompute Content

-   Why spend time rendering the HTML at all? If you can identify sections of the site where the content changes much less often than pages are generated, it's worth precomputing the rendered HTML fragments. This is especially valuable when you can identify the precise point in time when the content changes. Regenerate the precomputed content at that time, and then just serve that up as it is, instead of recomputing the same HTML millions of times.
-   Precomputing content does have some costs of its own. It requires storage space for each piece of computed content. There is some runtime cost to mapping an identifier to a file and reading the file. For commonly used content, this cost might motivate you to cache the content itself in memory. The cost of generating the content mainly occurs when the content changes. If the content gets used many times before it changes, then precomputing it is worthwhile.
-   **Remember This**
    -   Precompute content that changes infrequently

## Tune the Garbage Collector

-   Once you can see the garbage collection patterns, tuning the garbage collector is largely a matter of ensuring sufficient heap size and adjusting the ratios that control the relative sizes of the generations
-   Reserve object pooling for objects that really are expensive to create, such as network connections, database connections, and worker threads
-   **Remember This**
    -   **Tune the garbage collector in production** - User access patterns make a huge difference in the optimal settings, so you can't tune the garbage collector in development or QA.
    -   Keep it up - You will need to tune the garbage collector after each major application release
    -   Don't pool ordinary objects
