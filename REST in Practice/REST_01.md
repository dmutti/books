The Web As a Platform for Building Distributed Systems
======================================================

-   A resource is anything we expose to the Web, from a document or video clip to a business process or device
-   From a consumer's point of view, a resource is anything with which that consumer interacts while progressing toward some goal
-   A URI uniquely identifies a web resource, and at the same time makes it addressable, or capable of being manipulated using an application protocol such as HTTP
    -   The relationship between URIs and resources is many-to-one
    -   There's no limit on the number of URIs that can refer to a resource
    -   Although several URIs can identify the same resource, the Web doesn't provide any way to compute whether two different URIs actually refer to the same resource
    -   Where such comparisons are important, we should draw on Semantic Web technologies, which offer vocabularies for declaring resource identity sameness
-   Terms used on the Web to refer to identifiers
    -   URI (Uniform Resource Identifier)
    -   IRI (International Resource Identifier)
    -   URN (Uniform Resource Name)
    -   URL (Uniform Resource Locator)
-   **Resource Representations**
    -   Access to a resource is always mediated by way of its representations
    -   web components exchange representations; they never access the underlying resource directly
    -   URIs relate, connect, and associate representations with their resources on the Web
    -   This separation between a resource and its representations promotes loose coupling between backend systems and consuming applications
    -   also helps with scalability, since a representation can be cached and replicated
-   **Representation Formats and URIs**
    -   URIs should be opaque to consumers
    -   Only the issuer of the URI knows how to interpret and map it to a resource
    -   Using extensions is a historical convention that stems from the time when web servers simply mapped URIs directly to files
-   **The Art of Communication**
    -   In contemporary distributed systems thinking, it's a popular idea that the set of verbs supported by HTTP
        -   GET
        -   POST
        -   PUT
        -   DELETE
        -   OPTIONS
        -   HEAD
        -   TRACE
        -   CONNECT
        -   PATCH
-   **From the Web Architecture to the REST Architectural Style**
    -   REST describes the Web as a distributed hypermedia application whose linked resources communicate by exchanging representations of resource state
-   **Hypermedia**
    -   A distributed application makes forward progress by transitioning from one state to another, just like a state machine
    -   The difference from traditional state machines, however, is that the possible states and the transitions between them are not known in advance
    -   Instead, as the application reaches a new state, the next possible transitions are discovered
    -   **hypermedia as the engine of application state or HATEOAS**
-   **Web Friendliness and the Richardson Maturity Model**
    -   a service would be considered "web-friendly" if it correctly implemented the semantics of HTTP GET when exposing resources through URIs
    -   and since GET doesn't make any service-side state changes that a consumer can be held accountable for, representations generated as responses to GET may be cached to increase performance and decrease latency
-   **Level Zero Services**
    -   services that have a single URI, and which use a single HTTP method (typically POST).
-   **Level One Services**
    -   many URIs but only a single HTTP verb
    -   operations are tunneled by inserting operation names and parameters into a URI, and then transmitting that URI to a remote service, typically via HTTP GET.
-   **Level Two Services**
    -   numerous URI-addressable resources
    -   Such services support several of the HTTP verbs on each exposed resource
    -   level two services use HTTP verbs and status codes to coordinate interactions
-   **Level Three Services**
    -   supports the notion of hypermedia as the engine of application state
    -   representations contain URI links to other resources that might be of interest to consumers
    -   The service leads consumers through a trail of resources, causing application state transitions as a result

Basic Web Integration
=====================

URI Tunneling
-------------

-   URI tunneling uses URIs as a means of transferring information across system boundaries by encoding the information within the URI itself
    -   In more robust integration schemes, URIs identify only resources, which can then be manipulated using HTTP verbs and metadata
-   categorized as level one services by Richardson's maturity model
-   Whether we choose GET or POST depends on our intentions: retrieving information should be tunneled through GET, while changing state really ought to use POST.
-   When used properly, GET is both safe and idempotent
    -   safe means that a GET request generates no server-side side effects for which the client can be held responsible. There may still be side effects, but any that do occur are the sole responsibility of the service
-   An idempotent operation is one that generates absolute side effects. Invoking an idempotent operation repeatedly has the same effect as invoking it once
-   URI tunneling isn't web-friendly because URIs are used to encode operations rather than identify resources that can be manipulated through HTTP verbs

Updating a Resource with PUT
============================

-   Use POST to create a resource identified by a service-generated URI.
-   Use POST to append a resource to a collection identified by a service-generated URI.
-   Use PUT to create or overwrite a resource identified by a URI computed by the client.
-   PUT expects the entire resource representation to be supplied to the server, rather than just changes to the resource state.
-   PATCH has been suggested for use in situations—typically involving large resource representations—where only changes are provided
-   Since PUT is idempotent—because service-side state is replaced wholesale by consumer-side state—the consumer can safely repeat the operation as many times as necessary.
-   PUT can only be safely used for absolute updates; it cannot be used for relative updates
-   the only identifier we have for the order comes from the URI itself, extracted via template.
-   There's no order ID embedded in the payload, since it would be superfluous. = DRY

DELETE
======

-   the Allow header is used to convey that GET is the only acceptable verb at this point in time and that requests using any other verb will be met with a 405 Method Not Allowed response
-   The Allow header can be used to convey a comma-separated list of verbs that can be applied to a given resource at an instant.
-   Exemplo de response

```
HTTP/1.1 405 Method Not Allowed
Allow: GET
Date: Tue, 23 Dec 2008 16:23:49 GMT
```

Aligning Resource State
=======================

-   HTTP provides a simple but powerful mechanism for aligning resource state expectations (and preventing race conditions) in the form of entity tags and conditional request headers.
-   ETags are used to compare entities from the same resource.
-   By supplying an entity tag value in a conditional request header—either an If-Match or an If-None-Match request header—a consumer can require the server to test a precondition related to the current resource state before applying the method supplied in the request.
-   consumers that don’t take advantage of ETags are disadvantaged in two ways
    -   consumers will encounter increased response times as services have to perform more computation on their behalf
    -   consumers will discover their state has become out of sync with service state through status codes such as 409 Conflict at inconvenient and unexpected times
-   An If-Match request header instructs the service to apply the consumer's request only if the resource to which the request is directed hasn’t changed since the consumer last retrieved a representation of it.
-   If the entity tag values don't match, the server responds with 412 Precondition Failed.
-   A service can't (and shouldn't) do clever merges of resource state. If two parts of a resource are independently updatable, they should be separately addressable resources.
-   An If-None-Match header instructs the service to process the request only if the associated resource has changed since the consumer last accessed it.
-   If-None-Match is mainly used with conditional GETs, whereas If-Match is typically used with the other request methods, where race conditions between multiple consumers can lead to unpredictable side effects unless properly coordinated.
-   An If-None-Match conditional request that takes a wildcard (\*) entity tag value instructs the service to apply the request method only if the resource doesn't currently exist.
-   Wildcard If-Match requests are useful in situations where the consumer wishes to modify an existing resource using a PUT, but only if the resource hasn't already been deleted.
-   Because timestamps are often cheaper than hashes, If-Modified-Since and If-Unmodified-Since may be preferable in solutions where resources don't change more often than once per second.

CRUD Is Good, but It's Not Great
================================

-   Naively exposing systems that have not been built for network access is a bad idea. Systems have to be designed to accommodate network loads.
