The Atom Syndication Format
===========================

-   Atom is an XML-based hypermedia format for representing timestamped lists of web content and metadata such as blog postings and news articles
-   it provides a flexible and extensible interoperability format for transferring data between applications

The Format
----------

-   Atom represents data as lists, called feeds
-   Feeds are made up of one or more timestamped entries, which associate document metadata with web content
-   the content of a feed will vary. for computer-to-computer interactions, it might be stock trades, system health notifications or payroll instructions

```xml
<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>urn:uuid:d0b4f914-30e9-418c-8628-7d9b7815060f</id>
    <title type="text">Recent Orders</title>
    <updated>2009-07-01T12:05:00Z</updated>
    <generator uri="http://restbucks.com/order">Order Service</generator>
    <link rel="self" href="http://restbucks.com/order/recent"/>
    <entry>
        <id>urn:uuid:aa990d44-fce0-4823-a971-d23facc8d7c6</id>
        <title type="text">order</title>
        <updated>2009-07-01T11:58:00Z</updated>
        <author>
            <name>Jenny</name>
        </author>
        <link rel="self" href="http://restbucks.com/order/1"/>
        <content type="application/vnd.restbucks+xml">
            <order xmlns="http://schemas.restbucks.com/order">
                <item>
                    <milk>whole</milk>
                    <size>small</size>
                    <drink>latte</drink>
                </item>
                <item>
                    <milk>whole</milk>
                    <size>small</size>
                    <drink>cappuccino</drink>
                </item>
                <location>takeAway</location>
            </order>
        </content>
    </entry>
</feed>
```

-   Feeds have metadata associated with them that allows us to provide friendly descriptions of content, links to other services or resources, and a means of navigating to other feeds
-   the feed metadata includes the following elements
    -   **`<atom:id>`** is a permanent, universally unique identifier for the feed
    -   **`<atom:title>`** provides a human-readable name for the feed
    -   **`<atom:updated>`** indicates when the feed last changed
    -   **`<atom:generated>`** identifies the software agent that created the feed
    -   **`<atom:link>`** contains the canonical URI for retrieving the feed
    -   **`<atom:content>`** elements can contain arbitrary foreign elements, including elements that share the default namespace

Common Uses for Atom
--------------------

-   move business information between providers and consumers
-   Syndicating content - a producer or publisher distributing content to many consumers
-   Representing documents and document-like structures
-   Creating metadata-rich lists of resources such as search results or events, especially if the Atom metadata is useful in the context of our service
    -   **it establishes an event-oriented processing context for each Atom entry's payload**
-   Adding metadata to existing resource representations
    -   we can use Atom metadata elements to surface information related to a resource's publishing life cycle: its author
-   Creating directories of non-hypermedia content
    -   We can use Atom to create entries that link to resources that cannot otherwise be represented in a hypermedia format, such as binary objects
    -   Use the `<atom:content>` element's src attribute to link to the resource, and specify a media type using the element's type attribute

Using Atom for Event-Driven Systems
-----------------------------------

-   with event-driven systems, events are propagated through listeners
-   as an example, we can publish an ordered list of events that readers can poll to consume events
-   Atom-based solutions trade scalability for latency, making Atom often inappropriate for very low-latency notifications
-   Temporal coupling weakens a solution because it requires numerous independent systems to be running correctly at a specific instant in time
-   When multiple servers, networks, and software all need to be functioning to support a single business behavior, the chances for failure increase
-   To reduce coupling between producers and consumers of reference data, we generally recommend that reference data owners publish copies of their data, which consumers can then cache
-   Example
    -   Each consumer maintains a local cache of the reference data, which it then updates in response to notifications from the provider.
    -   Each consumer can continue to function, albeit with possibly stale data, even if the product catalog becomes unavailable
    -   To ensure that updates to the product catalog are propagated in a timely manner, Restbucks uses Atom feeds

### Event-Driven Updates

-   **Example**
    -   Whenever a new product is introduced, an existing product is changed, or a promotion is created or canceled, the product catalog publishes an event.
    -   The systems responsible for distribution, inventory, and order management consume these events and apply the relevant changes to their reference data caches.
    -   Stores poll this feed at regular intervals to receive updates.
    -   When processing a feed, a store first finds the last entry it successfully processed the last time it polled the feed, and then works forward from there
    -   The contents of each feed represent all the changes that occurred during a particular interval.
    -   At any given point in time, only one of these feeds is the working feed
    -   The service creates an entry to represent each event and assigns it to the working feed.
    -   The only thing that differentiates the working feed from an archive feed is the open-ended nature of the working feed's period
-   Event-driven systems in general exhibit a high degree of loose coupling which failure isolation and allows services and consumers to evolve independently of each other
-   An event represents a significant change in the state of a resource at a particular point in time
    -   it carries important metadata, including the event type, the date and time it occurred, and the name of the person or system that triggered it.
    -   Many events also include a payload, which can contain a snapshot of the state of the associated resource at the time the event was generated, or simply a link to some state located elsewhere, thereby encouraging consumers to GET the latest representation of that resource
-   **On URIs**
    -   the division of responsibilities between atom:id, which provides identification (and in combination with atom:updated identifies the latest version of a document), and a feed or entry's self link, which provides addressability
    -   The lessons learned by the Atom authors apply more generally, meaning that you should consider providing identities for your domain resources as well as addressable URIs.
    -   making atom:link a common building block of webfriendly distributed systems.
-   **The Atom specification describes five link relations**
    -   self - Advertises a link whose href identifies a resource equivalent to the current feed or entry
    -   via - Identifies the source for the information in the current feed or entry
    -   alternate - Indicates that the link connects to an alternative representation of the current feed or entry.
    -   enclosure - Indicates that the referenced resource is potentially large in size
    -   related - Indicates that the resource at the href is related to the current feed or entry in some way

### Polling for Recent Events

-   Stores navigate the archive not by constructing URIs, but by following links based on rel attribute values
-   Atom categories provide a simple means of tagging feeds and entries. Consumers can easily search categorized feeds for entries matching one or more categories.
-   by adding feed filters on the server side, we can produce category-specific feeds based on consumer-supplied filter criteria
-   An <atom:category> element must include a term attribute. The value of this term attribute represents the category
-   Categories can also include two optional attributes
    -   label - provides a human-readable representation of the category value
    -   scheme - identifies the scheme to which a category belongs
        -   Schemes group categories and disambiguate them, much as XML and package namespaces disambiguate elements and classes.
        -   This allows entries to be tagged with two categories that have the same terms, but belong to two different schemes

### Navigating the Archive

```xml
<feed xmlns="http://www.w3.org/2005/Atom
    xmlns:fh="http://purl.org/syndication/history/1.0">
    <id>urn:uuid:be21b6b0-57b4-4029-ada4-09585ee74adc</id>
    <title type="text">Product Catalog Notifications</title>
    <updated>2009-07-04T23:52:00Z</updated>
    <author>
        <name>Product Catalog</name>
    </author>
    <generator uri="http://restbucks.com/products">Product Catalog</generator>
    <fh:archive/>
    <link rel="self" href="http://restbucks.com/products/notifications/2009/7/4"/>
    <link rel="prev-archive href="http://restbucks.com/products/notifications/2009/7/3"/>
    <link rel="next-archive href="http://restbucks.com/products/notifications/2009/7/5"/>
</feed>
```

-   Atom doesn't prescribe how a consumer should process the entries in a feed
-   this ability to hand off from one media type processor to another media is called **type composition**
-   The presence of `<fh:archive>` is a further indication that this archive feed will never change and is therefore safe to cache
-   This linking and caching strategy trades efficiency for generalization
    -   Generalization comes from our being able to build hypermedia clients that can navigate feeds using standardized prev-archive and next-archive link relations

### Implementation Considerations

-   Using prev-archive and next-archive links saves us from having to add to each store some specialized knowledge of the product catalog's URI structure and the periodization rules used to generate archives
-   Because they depend instead on hypermedia, stores need never go off the rails; they just follow opaque links based on the semantics encoded in link relations.
-   This allows the catalog to vary its URI structure without forcing changes in the consumers.
-   it allows the server to vary its feed creation rules based on the flow of events
-   **Consumers who choose to infer URIs based on this structure are treading a dangerous path, because the service isn't obliged to honor them**
-   Tag URIs are a way of creating a nonaddressable identifier from an addressable URI scheme such as HTTP.
    -   We use them because events only have to be identifiable, whereas entries have to be addressable.
    -   See <http://diveintomark.org/archives/2004/05/28/howto-atom-id> for more information
-   Broadly speaking, Atom can be used to enrich resource representations with general-purpose metadata, allowing consumers to search, sort, and filter representations without needing to understand their details.

### Summary

-   If all we need is a list, not the feed metadata, we shouldn’t burden our application with Atom's information overhead.
-   If we've no real need for an entry's document metadata, we shouldn't use Atom entries
-   If we find ourselves populating Atom's metadata elements with data that's of no use to clients, or with default or "stub" data, we should consider employing an alternative representation format
-   use metadata extensions for adding generally applicable, application-agnostic metadata to a feed
-   use content extensibility for domain- or application-specific information. In the majority of cases, you're better off going with content extensibility.
-   The more the Atom format itself is customized for a specific domain, the less the resultant feed and entry documents can be consumed and usefully manipulated by a generic Atom client.
-   Add proprietary metadata to the Atom format only when you're certain it has broad reach and applicability

Atom Publishing Protocol
========================

-   AtomPub provides a standard mechanism for creating and editing resources, and resolving any arising conflicts
-   AtomPub extends the Atom format with a number of new publishing-related elements
-   Resources that are generated by a backend process inserting a row in a database table are created off-Web
-   Atom Publishing Protocol, in contrast, uses HTTP to create resources on the Web.
-   AtomPub is a domain application protocol for publishing and editing web content (including binary content) with associated Atom metadata.
-   It implements an optimistic concurrency control mechanism based on HTTP entity tags and validators
-   it provides clients with the ability to control the public visibility of published resources

Overview
--------

-   "an application-level protocol for publishing and editing web resources…based on HTTP transfer of Atom-formatted representations."
-   **key points**
    -   It's an application-level protocol - it governs the interactions between two applications, a client and a server, in the context of a specific goal (to publish web resources).
    -   It's designed for publishing and editing web content - AtomPub is concerned with web resources in general. "Atom" in "Atom Publishing Protocol" refers not to the thing being published, but to the carrier format used to transfer a representation of the thing being published.
    -   It's based on the HTTP transfer of Atom-formatted representations - To create and edit web resources, clients and servers exchange Atom-formatted representations of these resources using HTTP idioms

When to Use AtomPub
-------------------

-   AtomPub addresses a core set of well-understood activities; it covers the bulk of common publishing use cases much as Atom covers the core elements common to an envelope format
-   **Creating and manipulating Atom entries** - A web resource published by AtomPub doesn't have to be an Atom entry; it simply needs to be added to the content of an Atom entry while participating in the protocol
-   **Associating Atom metadata with published web resources** - If we need to record events in a resource's life cycle—when it was published, when it last changed, and so on—or index it by some document attributes (such as author and title), or categorize it
-   **Promoting an interoperable publishing protocol** - wherever we require an unambiguous, interoperable mechanism for creating and editing resources
-   **Underpinning a domain application protocol** - AtomPub acts as a useful foundation for creating higher level domain-specific application protocols

Anatomy of AtomPub
------------------

-   AtomPub servers host collections of published web content
-   When a client submits a piece of content to a collection, the server creates an Atom-formatted member to contain that content and represent its associated Atom metadata.
-   AtomPub's processing model defines four things that are key to building hypermedia applications
    -   Resource representation formats
    -   Hypermedia control markup
    -   The HTTP idioms clients can use to manipulate resources
    -   The link relations servers use to advertise legitimate state transitions
-   Its moving parts include four resources—members, collections, service documents, and category documents—and their representation formats.
    -   Members and collections are abstract names for the things targeted by publishing activities
    -   A member encapsulates a representation of a published web resource, or a representation of a resource that is in a draft state, waiting to be published
    -   A collection is a set of members
    -   a member is represented as an Atom entry, a collection as an Atom feed.
    -   The activities used to manipulate these resources are described in terms of HTTP methods, headers, and status codes

### Collections

-   Collections are defined in service documents
-   The protocol doesn't specify how they are created or deleted
-   To list a collection's members, a client sends a GET to the collection's URI
-   To create a new member, a client POSTs a representation of the prospective member to a collection's URI
    -   The set of acceptable media types supported by a collection is typically specified in a service document
-   Upon successful creation of a member resource
    -   the service responds with a 201 Created status code and a Location header containing the URI of the newly created member.
    -   The body of the response contains an Atom entry representing the new member resource
    -   The new resource's member URI also appears as the value of an edit link in this member's entry in a collection
    -   the server won't touch the contents of member representations

### Members

-   Members in a collection are time-ordered based on the value of their `<app:edited>` element, with the most recently edited member appearing first
-   To get a representation of a member resource, a client sends a GET to the resource's member URI.
-   To update a member resource, a client sends a PUT request to its member URI.
-   To delete a resource, a client sends a DELETE request to its member URI
-   Text-based resource representations can be included directly in a member's <atom:content> element
-   Members that can be represented using Atom entries are called entry resources.
-   Members whose representations can't be included directly in an Atom entry are called media resources
-   In place of a media resource, a proxy resource, known as a media link entry, is inserted in a collection feed
    -   This media link entry contains the media resource's metadata
    -   a link to the media resource itself

### Category and service documents

-   category and service documents describe the overall protocol
-   they
    -   group collections into workspaces
    -   describe which categories and media types belong to each collection
    -   provide discovery mechanisms based on well-known entry points to collections
-   **Category documents**
    -   Category documents contain lists of categories for categorizing collections and members.
    -   A category list can be fixed, meaning it's a closed set, or left open, allowing for subsequent extension
    -   Category documents have their own processing model, with a media type of application/atomcat+xml

```xml
<categories xmlns="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom" scheme="http://restbucks.com/product-catalog/categories/status" fixed="yes">
    <atom:category term="new"/>
    <atom:category term="updated"/>
    <atom:category term="deleted"/>
</categories>
```

-   **Service documents**
    -   acts as a well-known entry point into the collections hosted by a service
    -   From a service document, a client can navigate to the collections provided by the service.
    -   Service documents have their own processing model, with a media type of application/atomsvc+xml.
    -   Collections indicate which media types they support using `<app:accept>` elements

```xml
<service xmlns="http://www.w3.org/2007/app xmlns:atom="http://www.w3.org/2005/Atom">
    <workspace>
        <atom:title>Product Catalog</atom:title>
        <collection href="http://restbucks.com/product-catalog/products">
            <atom:title>Products</atom:title>
            <accept>application/atom+xml;type=entry</accept>
            <categories href="http://restbucks.com/product-catalog/categories/status"/>
        </collection>
        <collection href="http://restbucks.com/product-catalog/promotions">
            <atom:title>Promotions</atom:title>
            <accept>application/atom+xml;type=entry</accept>
            <accept>image/png</accept>
            <accept>image/gif</accept>
            <categories href="http://restbucks.com/product-catalog/categories/status"/>
            <categories href="http://restbucks.com/product-catalog/categories/scope"/>
            <categories scheme="http://restbucks.com/product-catalog/categories/origin" fixed="yes">
                <atom:category term="in-house"/>
                <atom:category term="partner"/>
            </categories>
        </collection>
    </workspace>
</service>
```

### AtomPub Extensions to Atom

-   AtomPub extends Atom in a number of ways
    -   It uses Atom extensibility to add three new entry elements
        -   `<app:edited>`
        -   `<app:control>`
        -   `<app:draft>`
    -   It adds two new link-relation values to the IANA Link Relations registry
        -   edit
        -   edit-media
    -   It adds a type parameter to the Atom media type
-   AtomPub also introduces a new HTTP header, Slug
    -   The header represents a request that the server include the header value in the URI, ID, or title of a new member
    -   A client might use a Slug header to encourage the server to create pretty or human-readable URIs for a particular member
-   **app:edited**
    -   indicates when a member was created or last edited
    -   Every member in a collection must contain exactly one
    -   Members in an AtomPub collection are ordered by `<app:edited>`, with the most recently created or updated members appearing first in the collection
    -   The server changes the value of `<app:edited>` every time the member's metadata or content changes
    -   `<app:edited>` is always under the server's control
-   **app:control and app:draft**
    -   `<app:control>` is used to host publishing controls.
        -   Publishing controls are Atom extension elements dedicated to controlling parts of the publishing life cycle
    -   `<app:draft>` value represents a client's preference regarding the visibility of a member
    -   the server can always ignore the client's request and publish the submitted feed or entry as normal
-   **edit and edit-media link relation values**
    -   Links with these relation values point to editable member entries and editable media resources, respectively
    -   Clients can use edit and edit-media links to GET, PUT, and DELETE the resources with which they are associated.
-   **type parameters**
    -   AtomPub extends the Atom media type of application/atom+xml with a type parameter.
    -   Using this parameter, feeds can be identified as application/atom+xml;type=feed and entries as application/atom+xml;type=entry
    -   Clients designed to handle feeds will usually handle entries as well; applications designed to handle just entries, however, won't necessarily cater to feeds

### Concurrency Control

-   The lost update problem
-   [Detecting the Lost Update Problem Using Unreserved Checkout](http://www.w3.org/1999/04/Editing/)
-   AtomPub implements an unreserved checkout strategy instead of using pessimistic locking to prevent conflicts and lost updates
    -   it means that a resource isn't locked while a client is working with it
-   AtomPub uses entity tags and validators to identify potential conflicts, thereby implementing an optimistic locking scheme
-   When a client POSTs an order to the service, the server responds with 201 Created and an ETag header containing a unique identifier for that particular version of the resource
    -   When a client PUTs a subsequent modification to the server, it adds an If-Match header and the last known ETag entity value to the request
    -   If the resource has changed on the server since the supplied entity tag value was generated, the server responds with 412 Precondition Failed
    -   the client could use a conditional GET to determine whether the resource has changed
        -   there's nothing to stop a second client from changing the resource before the first finally PUTs its changes
        -   **race condition**
    -   Conditional GETs are optional when updating a resource; conditional PUTs aren't

Implementing Order Fulfillment Using AtomPub
--------------------------------------------

### Overview

-   Prior to the drinks being prepared, the order can be modified or canceled
-   a case of competing consumers
    -   multiple receivers process messages from a single point-to-point channel
    -   The success of the pattern relies on there being no temporal dependencies between messages

### Adding an Order to the Fulfillment Pipeline

```xml
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
    <title>Order Fulfillment</title>
    <link rel="self" href="http://internal.restbucks.com/fulfillment"/>
    <updated>2010-03-29T13:00:30Z</updated>
    <generator uri="http://internal.restbucks.com/fulfillment">Order Fulfillment Service</generator>
    <id>urn:uuid:6d2992ae-ec8a-4dac-91b3-d452186ea409</id>
    <app:collection href="http://internal.restbucks.com/fulfillment">
        <title>Order Fulfillment Service</title>
        <app:accept>application/atom+xml;type=entry</app:accept>
    </app:collection>
    <entry>
        <title>order</title>
        <id>urn:uuid:fc2d3d42-7198-4c59-a936-b9b870ef8469</id>
        <updated>2010-03-29T13:00:30Z</updated>
        <app:edited>2010-03-29T13:00:30Z</app:edited>
        <author>
            <name>Cashier</name>
        </author>
        <content type="application/vnd.restbucks+xml">
            <!-- Coloque sua Entidade Aqui -->
        </content>
        <app:control>
            <app:draft>yes</app:draft>
        </app:control>
        <link rel="edit" href="http://internal.restbucks.com/fulfillment/1234"/>
    </entry>
</feed>
```

-   We'll start by assuming a cashier has just taken an order from a customer. Having taken the order, the cashier adds it to a list of unfulfilled orders
-   To advertise its capabilities, the collection includes an `<app:collection>` element whose child `<app:accept>` element indicates that the collection accepts representations of type application/atom+xml;type=entry.
-   In the context of the fulfillment protocol, a draft member is simply one that is not visibly in progress. It represents an order that has not yet been picked up by a barista.
-   To begin the fulfillment process for a new order, the cashier must POST an Atom formatted representation of a new order to the collection
    -   the system then creates a new member with DRAFT status

### The Fulfillment

-   A barista GETs the list of outstanding orders
-   Though not an intrinsic part of the protocol, it's customary for baristas to take the oldest outstanding order, which in this instance is the last member in the collection
-   the barista GETs a full representation of the order using the member's edit link
-   The server replies with a member representation whose `<atom:content>` element contains the order details **and an ETag header**
-   The barista can now use this ETag header to do a conditional PUT back to the member's edit URI
-   Before PUTting the member representation back to the member URI, the barista
    -   updates the member's `<atom:updated>` element
    -   adds its name to the list of contributors
    -   removes its `<app:control>` and `<app:draft>` elements
    -   By removing these two elements, the barista publishes its intention to fulfill the order by doing a **conditional PUT to reserve it**
    -   The server changes a member's `<app:edited>` value every time the resource changes.
-   Draft members represent orders waiting to be fulfilled
    -   "published" members represent orders that are currently being fulfilled
    -   if it receives a "412 Precondition Failed", it just moves to another order
-   Once a barista has exhausted the copy of the list it currently holds, it GETs a fresh copy from <http://internal.restbucks.com/fulfillment>
    -   Newer orders don't become visible to a barista until the backlog has been cleared.
-   After making the customer's drinks, the barista completes the fulfillment protocol by deleting the member

```xml
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
    <title>Order Fulfillment</title>
    <link rel="self" href="http://internal.restbucks.com/fulfillment"/>
    <updated>2010-03-29T13:04:30Z</updated>
    <generator uri="http://internal.restbucks.com/fulfillment">Order Fulfillment Service</generator>
    <id>urn:uuid:6d2992ae-ec8a-4dac-91b3-d452186ea409</id>
    <app:collection href="http://internal.restbucks.com/fulfillment">
        <title>Order Fulfillment Service</title>
        <app:accept>application/atom+xml;type=entry</app:accept>
    </app:collection>
    <entry>
        <title>order</title>
        <id>urn:uuid:e557e51b-c994-44ef-b06d-5331246cccbe</id>
        <updated>2010-03-29T13:04:00Z</updated>
        <app:edited>2010-03-29T13:04:30Z</app:edited>
        <author>
            <name>Cashier</name>
        </author>
        <contributor>
            <name>Barista A</name>
        </contributor>
        <content type="application/vnd.restbucks+xml">
            ...
        </content>
        <link rel="edit" href="http://internal.restbucks.com/fulfillment/9876"/>
    </entry>
    <entry>
        <title>order</title>
        <id>urn:uuid:1b305ebe-9077-42e5-bd95-00792c33ffbf</id>
        <updated>2010-03-29T13:03:30Z</updated>
        <app:edited>2010-03-29T13:03:30Z</app:edited>
        <author>
            <name>Cashier</name>
        </author>
        <content type="application/vnd.restbucks+xml">
            ...
        </content>
        <app:control>
            <app:draft>yes</app:draft>
        </app:control>
        <link rel="edit" href="http://internal.restbucks.com/fulfillment/9999"/>
    </entry>
</feed>
```

### Exceptions

-   If a customer asks to change its order, the cashier must attempt to modify the relevant member in the fulfillment backlog
-   the cashier GETs an up-to-date representation of the member, together with a fresh entity tag
-   The cashier modifies the order details inside atom:content, and then conditionally PUTs the member back to its edit URI
-   If the member is still in a state that allows it to be updated the PUT will succeed. If it's too late to modify this instance of fulfillment it returns 412 Precondition Failed
-   If the cashier PUTs a changed order back to the server after a barista has retrieved a member representation, but before the barista has reserved the enclosed order using its own conditional PUT, the cashier's PUT will succeed and the barista's will fail
-   A barista interprets a failed PUT as meaning another member of the staff has the member and its contained order.
-   This results in the barista discarding the member in favor of a more recent one
-   At some point, one of the baristas will GET an updated version of the orders collection
-   Canceling an order is achieved by sending a DELETE request to the current edit URI
-   Occasionally, a barista will experience a 410 Gone in response to its attempt to complete the fulfillment protocol
    -   this occurs as a result of the order being successfully canceled (the fulfillment resource deleted) while the drinks were being prepared.

### Implementing More Complex Protocols

-   Can AtomPub deal with more complex protocols?
    -   The answer is to compose AtomPub into higher-level protocols
    -   Such protocol implementations still use Atom as a representation format, and AtomPub to coordinate interactions, but they add new link relation values
    -   To progress the protocol, clients need to understand these new values in addition to understanding AtomPub
-   **revised solution**
    -   the fulfillment service exposes several AtomPub collections, each of which represents one or more states in the application protocol
    -   A member moves from one collection to another as a result of clients activating hypermedia controls provided by the server

#### A service document advertising the order fulfillment application state space

```xml
<service xmlns="http://www.w3.org/2007/app" xmlns:atom="http://www.w3.org/2005/Atom">
    <workspace>
        <atom:title>Order Fulfillment</atom:title>
        <collection href="http://internal.restbucks.com/fulfillment">
            <atom:title>Order Fulfillment Service</atom:title>
            <accept>application/atom+xml;type=entry</accept>
        </collection>
        <collection href="http://internal.restbucks.com/fulfillment/fulfilled">
            <atom:title>Fulfilled Orders Service</atom:title>
            <accept>application/atom+xml;type=entry</accept>
        </collection>
    </workspace>
</service>
```

-   This service document has one workspace, which contains two collections
    -   The first collection in the workspace is the entry point into the fulfillment process
    -   The second collection contains members that represent instances of the fulfillment process currently in the fulfilled state.
-   once a barista has successfully reserved a member a fresh GET on a member's member URI returns the representation

```xml
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
    <title>order</title>
    <id>urn:uuid:e557e51b-c994-44ef-b06d-5331246cccbe</id>
    <updated>2010-03-29T13:04:00Z</updated>
    <app:edited>2010-03-29T13:04:30Z</app:edited>
    <author>
        <name>Cashier</name>
    </author>
    <contributor>
        <name>Barista A</name>
    </contributor>
    <content type="application/vnd.restbucks+xml">
        ...
    </content>
    <link rel="http://relations.restbucks.com/fulfilled href="http://internal.restbucks.com/fulfillment/fullfilled"/>
    <link rel="edit" href="http://internal.restbucks.com/fulfillment/9876"/>
</entry>
```

-   representation includes a second <atom:link> element, with a link relation of <http://relations.restbucks.com/fulfilled>
    -   it describes a URI that returns a collection whose members represent fulfilled instances of the fulfillment protocol
-   When a barista finishes making an order, it POSTs the member to the fulfilled collection
-   **If the order is already in a fulfilled state, POSTing a member containing that order to the fulfilled collection results in the server returning 409 Conflict.**
-   What's important to the client is the relationship between the linked resource and the current representation
    -   That relationship is determined by a link relation value
    -   **By matching its intention to its understanding of the link relation values on offer, a client can determine which link to pursue next**
-   The server mints links with proprietary link relation values to guide clients down the correct path
    -   It interprets a client's intentions by attaching different pieces of processing logic to each URI.
    -   It then activates this logic according to the URI chosen by the client.
    -   **The server knows which links to mint based on the current and possible next states of an order resource**
    -   Taken together, these links form a set of legitimate transitions through which clients can change the application state of the fulfillment process.

Summary
-------

-   AtomPub addresses many common publishing use cases
-   it's the closest thing we have to a broadly adopted, interoperable publishing protocol
-   If our solution doesn't require Atom metadata, it's simpler to adopt a plain CRUD protocol
    -   We can always implement AtomPub's optimistic locking strategy (based on entity tags and validators) if the need for some form of concurrency control arises
-   consider separating the publishing of resources from their consumption.
    -   In the case of AtomPub, a collection is dedicated to the publishing needs of a service and any clients that wish to publish resources
    -   not everything published using AtomPub needs to be surfaced as an Atom feed
-   AtomPub can be used to implement common enterprise integration patterns (e.g., pub/sub) without resorting to specialized infrastructure or writing new code.
