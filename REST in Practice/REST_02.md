Hypermedia Services
===================

Hypermedia As the Engine of Application State HATEOAS
-----------------------------------------------------

-   hypermedia systems transform application state
-   A hypermedia system is characterized by the transfer of links in the resource representations exchanged by the participants in an application protocol
-   On each interaction, the service and consumer exchange representations of **resource** state, **not application state**
-   The current state of a resource is a combination of
    -   The values of information items belonging to that resource
    -   Links to related resources
    -   Links that represent a transition to a possible future state of the current resource
    -   The results of evaluating any business rules that relate the resource to other local resources
-   the rules that control the state of a resource are internal to the service that governs the resource: they’re not made available to consumers
-   Business rules that relate a resource to other resources should refer only to locally owned resource
    -   This allows us to identify and prevent circular dependencies
-   A service enforces a protocol—a domain application protocol, or DAP — by advertising legitimate interactions with relevant resources

Loose Coupling
--------------

-   When developing a service we abstract away implementation details from consumers, thereby decreasing coupling
-   no matter the degree of loose coupling, consumers must have enough information available in order to interact with our service
-   Web contracts are expressed in media types and link relations
    -   Accepting a media type means you understand how to process that format when interacting with a service
    -   Using the media types and link relations supported by the service, we can extend a contract over the Web at runtime by advertising new valid links and state transitions
-   To describe a link's purpose, we annotate it
    -   We call such annotated links hypermedia controls, reflecting their enhanced capabilities over raw URIs

Hypermedia Dead Ends
--------------------

-   The use of plain XML leaves the consumer without a guide—a protocol—for successfully completing the business transaction it has initiated
-   We can, of course, communicate protocol information to the developers of a consumer application using written documentation, or static contracts such as Web Services Description Language (WSDL), WADL, or URI templates
-   Publishing URI template details outside a service's boundary exposes too much information about the service's implementation
-   If the implementation of the ordering and payment services were to change there'd be an increased risk that consumers built to the (now defunct) template would break
-   Generally, it's better to expose only stable URIs. These stable URIs act as entry points to services, after which hypermedia takes over

Selecting a Hypermedia Format
-----------------------------

-   Different hypermedia formats suit different services.
-   The choice depends on a trade-off between reach and utility—between the ability to leverage existing widely deployed software agents and the degree to which a format matches our domain's needs.

Domain-specific hypermedia formats
----------------------------------

```xml
<order xmlns="http://schemas.restbucks.com">
    <location>takeAway</location>
    <item>
        <name>latte</name>
        <quantity>1</quantity>
        <milk>whole</milk>
        <size>small</size>
    </item>
    <cost>2.0</cost>
    <status>payment-expected</status>
    <payment>https://restbucks.com/payment/1234</payment>
</order>
```

-   In a hypermedia format, hypermedia controls represent protocol information. A hypermedia control includes the address of a linked resource together with some semantic markup
-   <payment> bears the joint responsibility of being both a link and a semantic annotation.
-   If we added a <cancel> element to our scheme, this new element would have exactly the same link semantic as <payment>, but a wholly different protocol semantic
-   **Our preferred approach is to separate concerns by distinguishing between the act of linking and the act of adding meaning to links**
-   Linking is a repeatable process. The meanings we attach to links, however, change from context to context.
-   To achieve this separation of concerns, we define a <link> element to convey the domain-agnostic link function, and a rel attribute to represent the application semantics associated with a particular link.

```xml
<order xmlns="http://schemas.restbucks.com">
    <location>takeAway</location>
    <item>
        <name>latte</name>
        <quantity>1</quantity>
        <milk>whole</milk>
        <size>small</size>
    </item>
    <cost>2.0</cost>
    <status>payment-expected</status>
    <link rel="http://relations.restbucks.com/payment" href="https://restbucks.com/payment/1234" />
</order>
```

Media Types
-----------

-   Media types are one of three key components of DAPs. The other two components are
    -   link relation values, which describe the roles of linked resources
    -   and HTTP idioms, which manipulate resources participating in the protocol
-   A media type value helps a consumer understand what is at the end of a link
-   The how of interacting with a resource is realized by HTTP constructs such as GET, PUT, and POST (and their conditional counterparts) and the control alternatives suggested by the HTTP status codes.
-   The media type declaration used in the Content-Type header for interactions with Restbucks is application/vnd.restbucks+xml
    -   The vnd.restbucks part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is restbucks
    -   The +xml part declares XML is used for the document formatting
-   **Why application/xml doesn't help**
    -   The Content-Type header sets the context for how the payloads should be processed
    -   Suggesting that the payload is just XML gives the wrong indication to software agents about the content and processing model for a representation
    -   Treating content and its hypermedia control format as plain XML simply leads to a hypermedia dead end
    -   By treating XML hypermedia formats as plain XML, we skip many of their benefits.
    -   the payload would be treated simply as structured data
    -   The protocol information (the <link> elements) will appear as odd-looking business information.
    -   XML thinking encourages us to separate protocol and data—usually to our detriment
    -   **Content-Type headers, not XML namespaces, declare how a representation is to be processed: that's the convention on the Web**

Contracts
---------

-   critical part of any distributed system since they prescribe how disparate parts of an application should interact
-   The Web breaks away from the traditional way of thinking about upfront agreement on all aspects of interaction for a distributed application
-   the Web is a platform of well-defined building blocks from which distributed applications can be composed
-   **Hypermedia can act as instant and strong composition glue**
-   contracts are a composition of a number of aspects, with media types at their core
-   Protocols extend the capabilities of a media type into a specific domain
-   As developers, we have to read protocol and media type specifications in order to implement applications based on contracts.
-   **Extending Contracts with Protocols**
    -   protocols extend the base functionality of a media type by adding new link relations and processing models
-   **HTTP Idioms**
    -   contracts define which HTTP idioms—methods, headers, and status codes—consumers should use to interact with a linked resource in a specific context
    -   When neither the current payload nor the processing context indicates which idioms to use, OPTIONS can be used on the linked resource's URI
-   In a resource-oriented distributed application, an application protocol can be thought of as a function of one or more resource life cycles and the business rules that connect these resources
-   Because of its resource-centric nature there's no workflow or business logic for the application protocol as such
-   the service governs the life cycles of the orders and payments participating in the application protocol
-   PATCH has only recently become an Internet standard (as RFC5789) and is not yet widely supported. Until that situation changes, continue to send partial updates to a service using POST

Advertising Protocols with Hypermedia
-------------------------------------

```xml
<order xmlns="http://schemas.restbucks.com"
    "xmlns:dap="http://schemas.restbucks.com/dap">
    <dap:link mediaType="application/vnd.restbucks+xml"
        uri="http://restbucks.com/order/1234"
    rel="http://relations.restbucks.com/cancel"/>
    <dap:link mediaType="application/vnd.restbucks+xml"
        uri="http://restbucks.com/payment/1234"
    rel="http://relations.restbucks.com/payment"/>
    <dap:link mediaType="application/vnd.restbucks+xml"
    uri="http://restbucks.com/order/1234" rel="http://relations.restbucks.com/update"/>
    <dap:link mediaType="application/vnd.restbucks+xml"
    uri="http://rescks.com/order/1234" rel="self"/>
    <item>
        <milk>semi</milk>
        <size>large</size>
        <drink>cappuccino</drink>
    </item>
    <location>takeAway</location>
    <cost>2.0</cost>
    <status>unpaid</status>
</order>
```

-   payment - Initiating payment involves PUTting an appropriate resource representation to the specified URI
-   update - Consumers can change the order using a POST to transfer a representation to the linked resource
-   cancel - This is the uri to be used to DELETE the order resource should the consumer wish to cancel the order

Dynamically Extending the Application Protocol
----------------------------------------------

-   Customers that don't understand the semantics of the new optional link are free to ignore it
-   Customers who do understand the semantics of the new relation can issue a simple GET request to the URI identified by the link
-   It's safe for us to add links to representations for optional parts of a business process.
-   Nonparticipating consumers will just ignore the optional hypermedia controls and proceed as normal.
-   The benefit of using a closed set of hypermedia control definitions with an open set of link relation values is that consumers can recognize the presence of a hypermedia control even if they don't understand what it means
-   This can encourage the consumer development team to discover the significance of the additional functionality associated with the link

Data Modeling Versus Protocol Hypermedia
----------------------------------------

-   Breaking information into hypermedia-linked structures reduces the load on a service by reducing the amount of data that has to be served
-   Instead of downloading the entire information model, the application transfers only the parts pertinent to the user
-   Not only does this laziness reduce the load on web servers, but the partitioning of data across pages on the Web allows the network infrastructure itself to cache information
-   hypermedia allows sharing of information in a lazy and cacheable manner

```xml
<!-- Restbucks menu in a network-friendly manner -->
<menu xmlns="http://schemas.restbucks.com"
    xmlns:dap="http://schemas.restbucks.com/dap">
    <drink name="latte">
        <dap:link rel="http://relations.restbucks.com/description"
        uri="http://restbucks.com/description/latte"/>
        <dap:link rel="http://relations.restbucks.com/pricing"
        uri="http://restbucks.com/pricing/latte"/>
        <dap:link rel="http://relations.restbucks.com/image"
        uri="http://restbucks.com/images/latte.png"/>
    </drink>
    <!-- More coffees, removed for brevity -->
</menu>

<!-- A resource linked from the Restbucks menu -->
<drink xmlns="http://schemas.restbucks.com"
    xmlns:dap="http://schemas.restbucks.com/dap" name="latte">
    <description>
        Classic Italian-style coffee with 1/3 espresso, 1/3 steamed milk,
        and 1/3 foamed milk
    </description>
    <dap:link rel="http://relations.restbucks.com/image"
    uri="http://restbucks.com/images/latte.png"/>
</drink>
```

-   The decision on what should be decomposed into separate, or even overlapping, resources is part of the design process for a service
-   we need to consider
    -   Size of the representation - How large is the payload going to be? Is it worth decomposing into multiple resources to optimize network access and caching?
    -   Atomicity - Is there a chance that the application might enter an inconsistent state because a resource is in a composite relationship with other resources? Does the entire representation of a resource need to be packaged together in the same payload?
    -   Importance of the information - Do we really need to send all the information as an atomic block? Can we allow consumers to decide which of the linked resources they need to request?
    -   Performance/scalability - Is the resource going to be accessed frequently? Is it computationally or transactionally expensive to generate its representation?
    -   Cacheability - Can resource representations be cached and replicated? Do different information items associated with the resource change at different rates?

Scaling Out
===========

GET Back to Basics
------------------

-   Because GET has no impact on resource state, it is possible to optimize the network to take advantage of its safe and idempotent characteristics
-   For these requests, it makes sense to store responses closer to consumers, where they can be reused to satisfy subsequent requests.
-   This optimization is baked into the Web through caching
-   A cached representation remains fresh for a specific period of time, which is called its freshness lifetime.
-   Representations can become invalid during their freshness lifetime without the cache knowing

Caching and the Statelessness Constraint
----------------------------------------

-   One of the Web's key architectural tenets is that servers and services should not preserve application state
-   The statelessness constraint helps make distributed applications fault-tolerant and horizontally scalable
-   **Downsides**
    -   because application state is not persisted on the server, consumers and services must exchange application state information with each request and response
        -   addition to the size of the message and the bandwidth consumed by the interaction
    -   because the constraint requires services to forget about clients between requests, it prevents the use of the classical publish-subscribe pattern
    -   To receive notifications, consumers must instead frequently poll services to determine whether a resource has changed, adding to the load on the server
-   Caching helps mitigate the consequences of applying the statelessness constraint
-   If we write our applications with caching in mind, and expose most of our business logic through domain application protocols using GET and caching headers, we can offload much of the processing and bandwidth load to caches without any special coding or middleware

Reasons for Not Caching
-----------------------

-   When GET requests generate server-side side effects that have a business impact on the service.
-   When consumers cannot tolerate any discrepancy between the state of a resource as conveyed in a response and the actual state of that resource at the moment the request was satisfied.
-   When a response contains sensitive or personal data particular to a consumer
    -   Security and caching can coexist to a certain extent
        -   local and proxy caches can sometimes cache encrypted responses
        -   it is possible to cache responses in a way that requires the cache to authorize them with the origin server with every request
        -   in many circumstances, regulatory or organizational requirements will dictate that responses must not be cached
    -   When the data changes so frequently that caching and revalidating a response adds more overhead than the origin server simply generating a fresh response with each request

Types of Caches
---------------

-   Reverse proxy
    -   A reverse proxy, or accelerator, stores representations from one origin server on behalf of many consumers
    -   Reverse proxies are located in front of an application or web server.
    -   Clusters of reverse proxies improve redundancy and prevent popular resources from becoming server hotspots

Making Content Cacheable
------------------------

-   Responses to GET requests are cacheable by default
-   Responses to POST requests are not cacheable by default, but can be made cacheable if either an Expires header, or a Cache-Control header with a directive that explicitly allows caching, is added to the response.
-   Responses to PUT and DELETE requests are not cacheable at all

Response Headers Used for Caching
---------------------------------

-   **Expires** - specifies an absolute expiry time for a cached representation.
    -   A service can indicate that a representation has already expired by including an Expires value equal to the Date header value (the representation expires now), or a value of 0
    -   To indicate that a representation never expires, a service can include a time up to one year in the future
-   **Cache-Control** - can be used in both requests and responses to control the caching behavior of the response
    -   The header value comprises one or more comma-separated directives.
    -   These directives determine whether a response is cacheable, and if so, by whom, and for how long
-   If we can determine an absolute expiry time for a cached response, we should use an Expires header
-   to indicate how long the response can be considered fresh once it has left the origin server, we should use a Cache-Control header, adding a max-age or s-maxage directive to specify a relative Time to Live
-   Cacheable responses (whether to a GET or to a POST request) should also include a validator—either an ETag or a Last-Modified header
-   **ETag** - an opaque string token that a server associates with a resource to uniquely identify the state of the resource over its lifetime
    -   When the resource changes, the entity tag changes accordingly
-   **Last-Modified** - indicates when the associated resource last changed
    -   cannot be later than the Date value
-   If a consumer wants to revalidate a response, it should include a Cache-Control: no-cache directive in its request.
    -   This ensures that the conditional request travels all the way to the origin server, rather than being satisfied by an intermediary

Using Caching Directives in Responses
-------------------------------------

-   Cache-Control directives serve three functions when used in a response
    -   make normally uncacheable responses cacheable
    -   make normally cacheable responses uncacheable
    -   do not affect the cacheability of a response at all; rather, they determine the freshness of an already cacheable response
-   **max-age=`<delta-seconds>`**
    -   controls both cacheability and freshness
    -   It makes a response capable of being cached by local and shared caches (proxies and reverse proxies), as well as specifying a freshness lifetime in seconds.
    -   A max-age value overrides any Expiry value supplied in a response
-   **s-maxage=`<delta-seconds>`**
    -   this directive serves two functions
        -   it makes responses cacheable, but only by shared caches
        -   it specifies a freshness lifetime in seconds
-   **public**
    -   makes a response capable of being cached by local and shared caches, but doesn’t determine a freshness value
    -   it takes precedence over authorization headers
    -   Normally, if a request includes an Authorization header, the response cannot be cached. If the response includes a public directive, it can be cached.
-   **private**
    -   makes a response capable of being cached by local caches only (i.e., within the consumer implementation)
    -   it also prevents normally cacheable responses from being cached by shared caches
-   **must-revalidate**
    -   makes normally uncacheable responses cacheable, but requires caches to revalidate stale responses with the origin server
    -   Only if the stale response is successfully validated with the origin server can the cached content be used to satisfy the request
    -   useful in balancing consistency with reduced bandwidth and computing resource consumption
-   **proxy-revalidate**
    -   similar to must-revalidate, but it only applies to shared caches
-   **no-cache**
    -   requires caches to revalidate a cached response with the origin server with every request
    -   If the request is successfully validated with the origin server, the cached content can be used to satisfy the request
    -   only works for responses that have been made cacheable using another header or directive
-   **no-store**
    -   makes normally cacheable content uncacheable by all caches
-   **stale-while-revalidate=`<delta-seconds>`**
    -   In situations where a cache is able to release a stale response, this directive allows the cache to release the response immediately, but instructs it to also revalidate it in the background
    -   nonblocking!
    -   favors reduced latency over consistency
    -   If a stale representation is not revalidated before delta-seconds have passed, however, the cache should stop serving it
-   **stale-if-error=`<delta-seconds>`**
    -   allows a cache to release a stale response if it encounters an error while contacting the origin server
    -   If a response is staler than the stale window specified by delta-seconds, it should not be released
    -   favors availability over consistency
-   Example: Caching authorized responses **Cache-Control: public, max-age=0**
    -   public makes the response cacheable by both local and shared caches
    -   max-age=0 requires a cache to revalidate a cached representation with the origin server (using a conditional GET request) before releasing it.
    -   Ideal: no-cache. some caches treat no-cache as an instruction to not cache at all
    -   The combination public, max-age=0 differs from must-revalidate in that it allows caching of responses to requests that contain Authorization headers

Consistency
-----------

-   weak consistency is a feature of all web-based distributed applications
-   a service has no way of notifying consumers when a resource changes. In consequence, consumers sometimes act on stale data.
-   The moment we introduce caching, we should assume that consumers will become inconsistent with services, and just deal with it.
-   The three techniques for improving consistency are
    -   **Invalidation**
        -   involves notifying consumers and caches of changes to resources for which they hold cached representations.
        -   the server must maintain a list of recipients to be contacted whenever a resource changes
        -   **goes against the requirement that services not maintain application state.**
    -   **Validation**
        -   consumers and caches can verify a local copy with the origin server
        -   requires the consumer to make a validation request of the service
        -   servers do not have to maintain a list of consumers to be contacted whenever a resource changes
        -   validation is a relatively efficient, low-bandwidth way of keeping data up-to-date
        -   helps improve scalability and performance, and reduce latency
    -   **Expiration**
        -   involves specifying an explicit TTL for each cacheable representation
        -   Cached representations older than this TTL are considered stale, and must usually be revalidated or replaced
-   With a pure validation-based approach (using, for example, a no-cache directive), consumers and caches revalidate with every request, thereby ensuring that they always have an up-to-date version of a representation. With this strategy, we must assess the trade-offs between increased consistency and the resultant rise in bandwidth and load on the server.
-   an exclusively expiration-based approach reduces bandwidth usage and the load on the origin server, but at the risk of there being newer versions of a resource on the server while older (but still fresh) representations are being served from caches.
-   By using expiration and validation together, we get the best of both worlds. This approach helps reduce bandwidth usage and server load.
-   There's still the possibility, however, that representations that remain fresh in a cache become inconsistent with resource state on the origin server.

### Using Validation

-   A conditional GET tries to conserve bandwidth by sending and receiving just HTTP headers rather than headers and entity bodies
-   A conditional GET only exchanges entity bodies when a cached resource representation is out of date
-   To revalidate a representation, a consumer or cache uses a previously received ETag value with an If-None-Match header, or a previously supplied Last-Modified value with an If-Modified-Since header
-   If the resource hasn't changed the service replies with 304 Not Modified
-   When a service replies with 304 Not Modified, it can also include Expires, Cache-Control, and Vary headers
-   Caches can update their cached representation with any new values in these headers
-   **ETag**
    -   Consumers should always treat ETags as opaque string tokens
    -   consider when implementing ETags in a service
        -   computation
        -   storage
    -   If an entity tag value can be computed on the fly in a relatively cheap manner, there's very little point in storing the value with the resource
    -   If generating an entity tag value is a relatively expensive operation, it's worth persisting the computed value with the resource
    -   avoid including header values containing machine identity
    -   caches will end up with multiple copies of a representation differing only by origin server
    -   If assembling an ETag representation is expensive, it may be better to use version numbers, even if it involves fetching them from a backing store.
    -   As an optimization, we might consider caching precomputed entity tag values in an in-memory structure

### Using Expiration

-   Consumers can influence cache behavior by sending Cache-Control directives in requests
-   it expresses express their preference for representations that fall within particular freshness bounds, or their tolerance for stale representations
-   **max-age=`<delta-seconds>`**
    -   Indicates that the consumer will only accept cached representations that are not older than the specified age, delta-seconds
    -   maxage=0 causes an end-to-end revalidation all the way to the origin server
-   **max-stale=`<delta-seconds>`**
    -   Indicates that the consumer is prepared to accept representations that have been stale for up to the specified number of seconds
    -   the consumer indicates it is prepared to accept a stale response of any age by omitting delta-seconds value
-   **min-fresh=`<delta-seconds>`**
    -   the consumer wants only cached representations that will still be fresh when the current age of the cached object is added to the supplied delta-seconds value
-   **only-if-cached**
    -   Tells a cache to return only a cached representation
    -   it returns 504 Gateway Timeout If the cache doesn't have a representation of the requested resource
-   **no-cache**
    -   generates an end-to-end reload (all intermediaries on the response path obtain fresh copies of the requested representation) because it instructs a cache not to use a cached representation
-   **no-store**
    -   Requires caches not to store the request or the response, and not to return a cached representation
-   **Example** - after a failed conditional PUT or POST, the consumer GETs the current state of the resource before retrying the operation
    -   use a Cache-Control: no-cache directive with the request

### Using Invalidation

-   consumer-driven or server-driven
-   Server-driven invalidation falls outside HTTP's capabilities because it would require to keep application state which undermines scalability
-   consumer-driven invalidation is intrinsic to HTTP
-   According to the HTTP specification
    -   DELETE, PUT, and POST requests should invalidate any cached representations belonging to the request URI
    -   if the response contains a Location or Content-Location header, representations associated with either of these header values should also be invalidated
    -   this technique can only guarantee to invalidate caches on the immediate request path
    -   Caches that are not on the request path will not necessarily be invalidated
-   Because of the generally web-unfriendly nature of server-driven invalidation, expiration and validation are by far the most common methods of ensuring eventual consistency between services and consumers

### Extending Freshness

-   When deciding on the freshness lifetime of a representation, we must balance server control with scalability concerns
-   short expiration values
    -   the service retains a relatively high degree of control over the representations it releases
    -   causes frequent reloads and revalidations, both of which use network resources and place load on the origin server
-   Longer expiration values
    -   conserve bandwidth and reduce the number of requests that reach the origin server
    -   they increase the likelihood that a cached representation will become inconsistent with resource state on the server
-   Instead of seeking to invalidate entries, we can extend their freshness lifetime

### Cache Channels

-   [Cache Channels](http://www.mnot.net/blog/2008/01/04/cache_channels)
-   Cache channels implement a technique for extending the freshness lifetimes of cached representations
-   Caches that don't understand the cache channel protocol will continue to expire representations the moment they become stale
-   Caches that understand the protocol treat a normally stale representation as still fresh, until they hear otherwise
-   use two new Cache-Control
-   **channel**
    -   supplies the absolute URI of a channel that a cache can subscribe to in order to fetch events associated with a cached representation
    -   supplies an absolute URI that can be used to group multiple cached representations
    -   Events that apply to a group ID can be applied to all the cached representations belonging to that group
-   Example HTTP Response:
    -   HTTP/1.1 200 OK
    -   **Cache-Control: max-age=3600, channel="http://internal.restbucks.com/productcatalog/cache-channel/", group="<urn:uuid:1f80b2a1-660a-4874-92c4-45732e03087b>"**
    -   The max-age directive specifies that this representation will remain fresh for up to an hour, after which it must be revalidated with the origin server
    -   any cache on the response path can continue to extend the freshness lifetime of this representation as long as two conditions hold
        -   The cache continues to poll the channel at least as often as a precision value specified by the channel itself
        -   The channel doesn't issue a "stale" event for either the URI of the cached representation or the group URI with which the representation is associated
-   If a cache performs a GET on the channel specified in the channel extension, it receives the cache channel feed below

```xml
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:cc="http://purl.org/syndication/cache-channel">
    <title>Invalidations for restbucks.com</title>
    <id>urn:uuid:d2faab5a-2743-44b1-a979-8e60248dcc8e</id>
    <link rel="self" href="http://internal.restbucks.com/product-catalog/cache-channel/"/>
    <updated>2010-03-26T09:00:00Z</updated>
    <author>
        <name>Product Catalog Service</name>
    </author>
    <cc:precision>900</cc:precision>
    <cc:lifetime>86400</cc:lifetime>
</feed>
```

-   `<cc:precision>` specifies a precision in seconds
    -   caches that subscribe to this feed must poll it at least as often as every 15 minutes if they want to extend the freshness lifetimes of any representations associated with this channel
-   `<cc:lifetime>` indicates that events in this feed will be available for at least a day after they have been issued
-   As long as the cache continues to poll the channel at least every 15 minutes, it can continue to serve the cached product representation well beyond its original freshness lifetime of an hour
-   If the resource does change on the origin server the cache that polls the channel it will receive

```xml
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:cc="http://purl.org/syndication/cache-channel">
    <title>Invalidations for restbucks.com</title>
    <id>urn:uuid:d2faab5a-2743-44b1-a979-8e60248dcc8e</id>
    <link rel="self" href="http://internal.restbucks.com/product-catalog/cache-channel/"/>
    <updated>2010-03-26T13:10:05Z</updated>
    <author>
        <name>Product Catalog Service</name>
    </author>
    <cc:precision>900</cc:precision>
    <cc:lifetime>86400</cc:lifetime>
    <entry>
        <title>stale</title>
        <id>urn:uuid:d8b4cd04-d448-4c26-85a6-b08363de8e87</id>
        <updated>2010-03-26T13:10:05Z</updated>
        <link href="urn:uuid:1f80b2a1-660a-4874-92c4-45732e03087b" rel="alternate"/>
        <cc:stale/>
    </entry>
</feed>
```

-   Each event has its own ID, which has nothing to do with the identifiers of any cached representations
-   the `<link>` element's href value associates the event with a group or particular representation
-   the cache stops extending the freshness lifetime of any representations belonging to this group and next time a consumer issues a request the cache will revalidate its stale representation with the origin server
-   If a cache can't connect to the channel, it can no longer continue to extend the freshness lifetime
-   **Using small freshness lifetimes together with cache channels, we can reduce the time it takes for the overall distributed application to reach a consistent state**

### Summary

-   we must always remember that we cannot guarantee that a representation of resource state as received by a consumer reflects the current state of the resource as held by the service
