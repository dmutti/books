Networking
----------

-   Data center network designs favor redundancy, security, and flexibility far more than networks to the desktop. An application requires some additional work to behave properly in this environment

## Multihomed Servers

-   A server with more than one IP address is a multihomed server; it exists on several networks simultaneously. This architecture improves security by separating administration and monitoring onto its own highly secured network. It improves performance by segmenting high-volume traffic, such as backups, away from the production traffic
-   Because backups transfer huge volumes of data in bursts, they can clog up a production network. Therefore, good network design for the data center partitions the backup traffic onto its own network segment
-   the Java ServerSocket class has four constructors as of Java 5. Three of these constructors bind to every interface on the server. Only the long form of the constructor can take a specific local address to define to which interface it should bind.

```java
InetAddress addr = InetAddress.getByName("alpha.example.com" );
ServerSocket socket = new ServerSocket(80, 50, addr);
Socket local = socket.accept();
```

-   Without the address, ServerSocket will bind to all interfaces, which would allow connections over the backup or administration networks to the production server. Or, conversely, it could allow connections over the production network to the administrative interface!
-   Therefore, server applications that need to listen on sockets must add configurable properties to define to which interfaces the server should bind.

Security
--------

## The Principle of Least Privilege

-   Software that requires execution as root is automatically a target for crackers. Any vulnerability in root-level software automatically becomes a critical issue. Once a cracker has gained root access, the only way to be sure the server is safe is to reformat and reinstall. Worse yet, for horizontally scalable applications, you might have to reinstall the entire cluster

Availability
------------

## Gathering Availability Requirements

-   The proper way to frame the availability decision is in straightforward financial terms: actual cost vs. avoided losses. For example, "98% availability" translates to 864 minutes of downtime each month. That downtime has a direct cost because of lost revenue. Suppose the site brings in $1,500 per hour during the peak of the day—the worst possible time to be down. Then the worst-case loss with 98% availability is about $21,600. Now compare the minutes of downtime avoided by building a more reliable system. Improving the availability to 99.99% reduces the expected cost of downtime to just $108 per month—gaining $21,492 per month over the 98% availability case.

## Documenting Availability Requirements

-   it is better to define the SLAs in terms of specific features or functions of the system
-   It’s best to have some automated system checking the availability of a feature by executing synthetic transactions against it. The SLA should define what device or devices will be monitoring the availability of the feature. Furthermore, it should define how that monitoring device will report problems
-   there must be some definition about what a good response looks like.

## Load Balancing

-   DNS Round-Robin
    -   all the servers in the pool must be "routable." That is, though they can sit behind a firewall, their front-end IP addresses are visible and reachable from clients. These days, that just invites attacks
    -   The DNS server has no information about the health of the web servers, so it can keep vending out IP addresses for web servers that are toast. Furthermore, doling out IP addresses in round-robin style does not guarantee that the load is distributed evenly, just the initial connections
    -   **DNS round-robin load balancing is inappropriate whenever the calling system is another long-running enterprise system. Anything built on Java will cache the first IP address received from DNS, guaranteeing that every future connection targets the same host and completely defeating load balancing**

-   Reverse Proxy
    -   A normal proxy multiplexes many outgoing calls into a single source IP address. A reverse proxy server does the opposite: it demultiplexes calls coming in to a single IP address and fans them out to multiple addresses
    -   Logging the source address of the request (as is done by Apache's "Common" log format) is useless, because it will represent only the proxy server
    -   It is possible, however, to use a custom log format to log the X-Forwarded-For header that Akamai and other well-behaved proxies add to the request. Note that ill-behaved or malicious proxies are unlikely to conform to that part of the standard. As a result, that header will be least reliable when you most need to trace the origin of some traffic, such as an attack. In such cases, you have to rely on correlating your log files with the proxy's log files.

-   Clustering
    -   Fully load-balanced farms scale close to linearly. Load-balanced clusters do not. Clusters incur some communication overhead in heartbeats and state synchronization. As a result of this overhead, the capacity of a cluster scales less than linearly and might flatten out severely as the number of servers increases. This imposes a practical size limit on clusters, though the limit varies depending on the servers being clustered
    -   The cluster server acts like an exoskeleton, running the clustered application as a child process
    -   redundancy is achieved, but scalability is not. I consider cluster servers a Band-Aid for applications that don't do it themselves.

Administration
--------------

-   if your system is difficult or annoying to administer, it will be neglected, deprecated, and probably implemented incorrectly
-   Releases add value

## "Does QA Match Production?"

-   It is easy to ask, very expensive to answer, and guaranteed to find something different such as hostnames and IP addresses, if nothing else
-   configuration discrepancies are usually not the culprit
-   the real culprit is a mismatch in topology between QA and production
-   Keep Them Separated
    -   Often, applications will share hosts in QA that run separately in production. This can lead to hidden dependencies: two applications might expect a directory to have synchronized content
    -   what can you do to avoid this kind of hidden dependency? - **VMWare**

-   Zero, One, Many
    -   If the development team has been working with the firewalls all along, however, they will already have the rules documented.
    -   I've seen hours of downtime result from the presence of firewalls or load balancers in production that did not exist in QA

## Configuration Files

-   Property files suffer from hidden linkages and high complexity
-   It should never be possible for an administrator to break object associations inside the application
-   keep production configuration properties separate from the basic wiring and plumbing of the application
-   Even with strong change management procedures, the rule should be, "Trust, but verify."
-   property names should be clear enough to help the user (the administrator) do her job without making "unforced errors."
-   **name the properties according to their function, not their nature**

## Start-up and Shutdown

-   Build a clean start-up sequence into applications to ensure that components are started in the right order and that the start-up sequence must complete successfully before the application starts accepting work
-   if the connection pool initialization fails because it cannot create any connections, the entire application should be in a failure state.
-   **this is very different from aborting and exiting if something fails during start-up. A running application can be interrogated for its internal state, but a halted one cannot.**
-   each application needs a mode in which it will complete existing transactions but will not accept any new work. Once the in-flight transactions have all completed, then the application can exit. Be sure to moderate this rule with a timeout, however, or shutdown might never finish.

## Administrative Interfaces

-   The net result is that Java GUIs make terrible administrative interfaces for long-term production operation. The best interface for long-term operation is the command line
-   still workable, is the pure HTML administrative GUI

Summary
-------

-   Remember that your application will run on a server with multiple network interfaces. Be sure it binds to the correct address for any sockets it listens to, and be sure that any special routing requirements are set up and documented. Administrative functions should be exposed on the administration and monitoring network, not the production network.
-   Be sure to use virtual IP addresses to access clustered services, such as database servers or web services provided by other systems. Using the VIP allows the service provider to fail over—whether planned or unplanned—without necessitating the reconfiguration of your system
-   Your application's administrators will never know as much about its internals as you will. You can help reduce the likelihood of operator error by making your application obvious to configure. This means separating essential plumbing, such as Spring's beans.xml files, from environment-specific configuration. Mixing them is the equivalent of putting the ejection seat button next to the radio tuner
