Objectives
==========

-   State the benefits and drawbacks of adopting a web framework in designing a Java EE application.
-   Explain standard uses for JSPs and Servlets in a typical Java EE application
-   Explain standard uses for JSF components in a typical Java EE application
-   Given a system requirements definition, explain and justify your rationale for choosing a web-centric or EJB-centric implementation to solve the requirements.
    -   **Web-centric means that you are providing a solution that does not use EJBs**
    -   **An EJB-centric solution will require an application server that supports EJBs**

Prerequisite
============

Model View Controller (MVC)
---------------------------

-   everyone agrees that three fundamental concepts should be decoupled and kept separate
    -   the data, the business logic that operates on that data, and the presentation of that data to the end user

-   In the earliest releases of the specification, references were made to Model 1 and Model 2 architectures
-   all mainstream frameworks now embrace Model 2 exclusively where views forward to a central controller which invokes a named handler for the page or action before forwarding the user to a welldefined page to render the outcome of the request

Web Container
-------------

-   provides services to presentation and control components provided by the developer, implemented as JSPs, JSF components, Servlets, filters, web event listeners, and plain old Java classes (POJOs).
-   These services include concurrency control, access to user-managed transactions, configuration, and security management

Servlets
--------

-   server-side component designed to handle inbound service requests from remote clients
-   the Servlet model is designed to accommodate any protocol that is predicated around a request/response model
-   Servlet developers must implement the javax.servlet.Servlet interface, and specifically for HTTP Servlet developers, the javax.servlet.HttpServlet interface
-   the SingleThreadedModel tagging interface has been deprecated, as it results in systems that do not scale
-   Most developers simply override three methods to add required behavior
    -   init()
    -   doGet()/doPost()
    -   destroy()

Filters
-------

-   server-side components hosted by the web container that receive an inbound request before it is received by any other component
-   used to pre-process requests
-   can be used to perform dedicated processing after a request has been received and processed

Listeners
---------

-   server-side components hosted by the web container that are notified about specific events that occur during a Servlet's lifecycle
-   used to take actions based on these events
-   The event model is well-defined, consisting solely of notifications
    -   on the web context
        -   Servlet initialization and destruction
        -   attribute adds/edits/deletes

    -   and session activity
        -   creation, invalidation and timeout
        -   attribute adds/edits/deletes

JavaServer Pages (JSP)
----------------------

-   are HTML pages with embedded mark-up that is evaluated at runtime by the web container to create complete HTML pages, which are sent to the client for rendering to the end user
-   key elements added since its inception have been the JSTL (Java Standard Tag Library) and the Unified Expression Language (EL)

![](Arquivo:Scea_ch3_fig3_3.png)

Java Standard Tag Library (JSTL)
--------------------------------

-   is a set of tag libraries that forms part of the JSP specification
-   The JSTL brought much needed standardization to the tag library space

Unified Expression Language (EL)
--------------------------------

-   introduced in the JSP 2.0 specification
-   the addition of an EL provides developers with the ability to banish Java scriptlets from JSP pages completely
-   There are two constructs to represent EL expressions
    -   ${expr} - indicates that the expr is evaluated immediately
    -   1.  {expr} - indicates to the container that evaluation should be deferred

-   The container also makes a number of useful implicit objects available to an executing EL snippet
-   the code is often more readable, elegant, and easier to maintain
-   The single biggest danger when developers need to code Java in JSPs is that they implement not only presentation logic, but business logic as well, violating the core tenet of the MVC design pattern

Managing Sessions
-----------------

-   The Servlet specification provides an elegant way to allow a client-server conversation to manage session state over the HTTP protocol, which is essentially stateless
-   The web container provides access to a simple map, called the HttpSession
-   storing large objects, such as collections of search results, is a known performance and scalability anti-pattern

JavaServer Faces (JSF)
----------------------

-   a UI framework for web applications based on the JEE platform
-   JSF is designed to allow developers to stop thinking in terms of HTTP requests and responses and instead to think about UI development in terms of userand system-generated events.
-   JSF components are re-usable, improving developer productivity, software quality, and system maintainability
-   the clear intent of the JSF specification is that the technology be toolable
-

Templating Frameworks
---------------------

-   example: Velocity and FreeMarker
-   **the mandated way to build presentation logic in the JEE platform is either using JSP or JSF**

Web Frameworks
--------------

-   fill the gap between the JSP/Servlet/JSF specification and what an architect needs in order to build a consistent, high-quality web application in the UI platform
-   a good web framework provides the architect and developer with a clear roadmap on exactly how to implement core features such as action handlers, client and server-side validation, how to handle transactions in a sensible manner, integrate security, manage session state, and build a maintainable and understandable web UI.
-   **If you choose not to specify or use a web framework in Part II of the exam, be prepared to clearly justify your decision**

Discussion
==========

JSPs and Servlets - Standard Uses
---------------------------------

-   JSPs handle the presentation of data to the end user. They should contain no business
-   **rule of thumb**
    -   minimize or eliminate entirely all Java code from JSPs
    -   replace it instead with either EL, the JSTL, or a custom/third-party tag

-   **JSP is the V in MVC**

JSF - Standard Uses
-------------------

-   The standard uses for JSF are the same as for JSP
-   make a choice
    -   continue to use JSP with JSTL and a good MVC framework
    -   or use JSF

-   they are not mutually exclusive
    -   It is perfectly possible to add tags to a JSP page that represent a specific JSF UI component, resulting in a hybrid solution

Web-Centric Implementations
---------------------------

-   JEE applications that do not use EJBs
-   you must clearly understand why that decision is mandated and the impact of that decision on your developers as they implement the business logic
-   **Scenarios that have a strong messaging, transaction, or security management component are all candidates where an EJB-centric implementation is warranted and indeed necessary**
-   Scenarios where ease of development is key, where an existing application is already web-centric, or where transactions are not key to the business (read-only or read mostly) mean that you should choose a web-centric answer
-   **stand-out reasons where using EJB is simply not warranted**
    -   CRUD application built using Struts to organize and control the presentation and business logic tiers, and Hibernate plus a DAO access layer to implement the persistence tier
    -   Assuming that there are no asynchronous messaging requirements or JMS queues or topics to access
    -   and that the functionality contained in the web container for concurrency control, security, and session management is sufficient

EJB-Centric Implementations
---------------------------

-   assuming that the internal bank systems can be accessed by a non-EJB solution, it is possible to achieve a solution that will meet the NFRs using only a web-centric solution
-   But you will need to commit your team to writing entire modules of custom code to replace features that you get from an EJB container for free
-   it is likely that you will also need to take advantage of vendor-specific libraries/mechanisms to implement these modules.
-   **there is no right or wrong answer - just more correct and less correct**
-   examine the possible solutions and select the most correct solution, taking into account the vagaries of the known set of business requirements

Rationale for Choosing Between EJB-Centric and Web-entric Implementations
-------------------------------------------------------------------------

-   a web-centric or an EJB-centric architecture is always right or always wrong
-   In order of decreasing importance, the pertinent facets to consider are as follows
    -   Transaction requirements - The more onerous, the bigger the reason to select EJB
    -   Security requirements - The more onerous, the bigger the reason to select EJB.
    -   Messaging requirements - Need to integrate with an asynchronous messaging system - if present, MDBs (EJB-centric approach)
    -   Performance
    -   Ease of development
    -   Scalability
    -   Existing team skills or existing project implementation

-   The last four facets listed are not reasons in themselves that will conclusively force you to choose one approach over the other
-   Assuming an efficient container implementation, stateless session beans should be as efficient as Servlets/Action handlers in executing business logic on the server side as a proxy for the client
    -   **exception stateful session beans**
    -   poor scaling design choice, suitable only for a small subset of applications with very specific requirements

The Future of Client-Server Communication
-----------------------------------------

-   the exam contains material on AJAX
-   Architects must understand the benefits of AJAX as they relate to providing an enhanced end-user experience and how the JEE 5 platform allows server-side components to service AJAX requests from browsers

Essential Points
================

-   If you are a JSP-centric architect, beef up on JSF because you need to know it
-   The exam tests your understanding of the best UI technologies to use in the JEE platform by presenting a series of scenarios
-   As a JEE architect, one of your key skills is the ability to analyze application requirements and choose the best combination of JEE technologies - especially at the web tier - to meet those requirements, while not over-engineering the solution
