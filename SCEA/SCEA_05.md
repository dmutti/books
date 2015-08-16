Objectives
==========

-   Explain the client-side security model for the Java SE environment, including the Web Start and applet deployment modes
-   Given an architectural system specification, select appropriate locations for implementation of specified security features, and select suitable technologies for implementation of those features
-   Identify and classify potential threats to a system and describe how a given architecture will address the threats
-   Describe the commonly used declarative and programmatic methods used to secure applications built on the Java EE platform - for example, use of deployment descriptors and JAAS

Introduction
============

-   you must understand the Java security model not just on the server, but on the client as well
-   The primary security-related objectives of any JEE system are as follows
    -   **Confidentiality** - Ensure that the system data and functions are protected from unauthorized access
    -   **Integrity** - Ensure (provably) that system data has not been modified or interfered with by a third party (malicious or not)
    -   **Authentication** - Ensure that the identity of a user or a remote system accessing the system is valid and correct and has not been impersonated or compromised in any way
    -   **Authorization** - Ensure that a valid, authenticated user or remote system has the appropriate rights to access system data or execute system functions.
    -   **Non-Repudiation** - Ensure that all actions, once performed, cannot be denied by the user or the system itself

Prerequisite
============

-   The [JAAS](http://download.oracle.com/javase/1.5.0/docs/guide/security/jaas/JAASRefGuide.html) API

JRE
---

-   The sandbox of the Java Runtime Environment is a fundamental property of the Java runtime environment and is the basis for all other security layers in the Java programming model
-   provided with higher-level security APIs and abstractions
-   Basics provided by the JRE/Java programming language include
    -   automatic memory management
    -   strong typing
    -   bytecode verification
    -   secure class loading
-   focus your revision and study efforts on the security APIs and capabilities built on top of these basic capabilities in the JEE platform, including the **difference between sandboxed applets and regular Java applications**

JAAS
----

-   Java Authentication and Authorization Service
-   the general mechanism supplied by the Java Virtual Machine (JVM), allowing Java code to identify users and roles before allowing or denying access to resources or functionality controlled by the JVM
-   required by the JEE 5 specification.
-   supports pluggable authentication and authorization modules

Credential
----------

-   is a container of information used to authenticate a principal to the System under Development
-   vary significantly depending on the authentication protocol or system used
-   a credential is a structured set of information that an authentication module uses to either allow or deny access to the SuD

Principal
---------

-   is an entity (a person or system that can be uniquely identified) that can be authenticated by a JEE security module before SuD system access is allowed or denied

Authentication
--------------

-   the process by which the SuD examines the credentials of a named principal in order to recognize that principal as a named user of the SuD.
-   JEE 5 requires that all application servers support three specific authentication methods
    -   HTTP basic authentication
    -   SSL mutual authentication
    -   form-based login

Authorization
-------------

-   is the process by which a (already authenticated) named principal is allowed or disallowed access to a protected SuD named resource based on the permissions granted either directly to them or indirectly through group or role membership

Java Web Start
--------------

-   **How can I enable my application to gain unrestricted access to the system?**
    -   An application requesting unrestricted system access must be digitally signed.
-   **How is the Java Web Start secure sandbox more flexible than the applet sandbox?**
    -   All applications, by default, are run in a sandboxed environment, similar to the applet sandbox. However, Java Web Start provides a secure API that enables an application to import and export files from the local disk under the user's control. The API includes dialog boxes for operations such as saving a file and opening a file that are actually rendered by Java Web Start, and not by the application itself.
    -   This sandbox design is similar to what you can do with HTML. A file input field in an HTML form enables a user to pick a file from the local disk and submit the name (excluding path) and content to the web server. Similarly, most browsers support the 'Save as...' option.
-   **What is a secure sandbox?**
    -   Applications in the secure sandbox have restricted access to local computing resources such as the disk and network.
-   **How secure is Java Web Start?**
    -   Security is a key consideration of the Java Web Start design. In Java Web Start all applications are launched by default in a secure "sandbox."
-   **Does it matter how I launch an application?**
    -   No, applications launch in the same manner no matter which method you use: from a web page, from the shortcut on the desktop, from the Start menu, or through the Java Application Cache Viewer.
    -   If the application you are using has not been digitally signed, Java Web Start will launch it in a restricted and secure execution environment. An application that is not signed, or one that you do not trust, will never be run with unrestricted access to your local system or network.

Applets
-------

-   More examples [here](http://docstore.mik.ua/orelly/java-ent/jfc/ch07_03.htm)

### Unsigned Applets

-   **Unsigned applets can perform the following operations**
    -   can make network connections to the host they came from
    -   can display HTML documents
    -   can invoke public methods of other applets on the same page
    -   if loaded from the local file system have none of the restrictions that applets loaded over the network do
    -   can read secure system properties
-   **Unsigned applets cannot perform the following operations**
    -   cannot access client resources such as the local filesystem, executable files, system clipboard, and printers
    -   cannot connect to or retrieve resources from any third party server
    -   cannot load native libraries
    -   cannot change the SecurityManager
    -   cannot create a ClassLoader
    -   cannot read certain system properties

### Unsigned Applets launched by using JNLP

-   can open, read, and save files on the client
-   can access the shared system-wide clipboard
-   can access printing functions
-   can store data on the client, decide how applets should be downloaded and cached, and much more

### Signed Applets

-   do not have the security restrictions that are imposed on unsigned applets and can run outside the security sandbox
-   When a signed applet is accessed from JavaScript code in an HTML page, the applet is executed within the security sandbox. This implies that the signed applet essentially behaves likes an unsigned applet

Discussion
==========

Client-Side Security
--------------------

-   consider applets run by the browser via the Java plug-in and applications deployed via Java Web Start or installed directly on the machine
-   Both Web Start applications and applets run inside a sandbox environment
    -   allows the end user to control what client-side resources the code can and cannot access or modify
    -   Compiled Java bytecode must be signed before it can request access to these resources
    -   all code attempting to access client-side resources will prompt the end user with a modal dialog to permit or deny the operation
-   Java applications installed directly onto a client machine do not run inside a sandbox, and no permissions are checked before an operation is executed
-   architect's job is to ensure that sensitive data passed between the server and the client is encrypted and impenetrable to malicious entities
-   The easiest way - encrypt all data using Secure Sockets Layer (SSL)
    -   RMI over SSL
    -   HTTP over SSL, or HTTPS

Server-Side Security
--------------------

### EJB Container

-   provides two methods on the EJBContext interface to allow developers to programmatically check a user's permission before invoking a method containing potentially sensitive business logic
    -   isCallerInRole
    -   getCallerPrincipal
-   enables the developer to define a "run as" capability, whereby the original identity of the caller is substituted in favor of an identity defined declaratively.
-   @RolesAllowed

### Web Container

-   the HttpServletRequest have access to security information at runtime to decide whether to allow or deny access to incoming requests
    -   isUserInRole
    -   getUserPrincipal
-   Many JEE applications are designed around the premise that the web layer does most, if not all, of the security work
-   **URL authorization**
    -   the URLs of the application are defined to have a specific security meaning that can be ascertained using regular expressions
    -   sequence of events
        -   On the first attempt to access a secured resource, the user is redirected to a login page by the web server, which detects that the user in question has not been authenticated or authorized
        -   The user fills in a form that collects the required authentication data
        -   This form is posted back to the web server where the user is validated by the web server
        -   The web server sets a credential for the user for the duration of the session to determine what resources can and cannot be accessed or invoked by the user in question

### Putting the EJB Container and Web Container Together

-   The EJB container and web container maintain separate security contexts, each derived at runtime from information contained in the EJB and web deployment descriptors
-   when a web resource attempts to invoke an EJB resource to complete a business action, the EJB container first uses the security context/credential associated with the JSP call to authorize (or reject) the request
-   If the request is authorized, the web container passes control of the request to the EJB container
-   when completed, the result of the operation is returned to the web container for further processing, and ultimately to be displayed to the end user

### Web Service Security

-   Web services security is defined in the WS-Security standards controlled by OASIS
-   WS-Security addresses the topic of web services security as follows
    -   Authentication and authorization Using credentials
    -   Message-level data integrity Using XML signatures
    -   Message-level and transport confidentiality Using encryption
-   all JEE 5-compliant servers with an implementation of the XML/HTTP binding must support
    -   HTTP basic authentication using two properties to configure authentication information (javax.xml.ws.security.auth.username and javax.xml.ws.security.auth.password)
    -   transport-level encryption
    -   message-level encryption is not supported or required in a standard implementation

How Security Behavior Is Defined
--------------------------------

### Declarative Security

-   the JVM is instructed on the valid users and roles for the system under consideration via a well-formed XML file (the deployment descriptor)
-   This method has a number of advantages over programmatic security
    -   The security configuration is obvious, self-evident, and contained in one place
    -   The security configuration can be modified at deployment time without needing to recompile source code, making the application more configurable
-   Instead of needing to compose a large and often-complex EJB or web deployment descriptor, the programmer can simply use annotations such as javax.annotation.security.RolesAllowed
    -   This is not the same as programmatic security
-   annotations are a more programmer-friendly way of defining security in a declarative fashion
    -   the application assembler can override it

### Programmatic Security

-   In addition to or instead of declarative security, the JVM can also execute security checks that are not defined in an external deployment descriptor, but defined in the running code itself
-   In practice, most applications use a combination of both declarative and programmatic security checks to provide a higher level of security than either approach alone.
-   The key methods to be aware of that provide access to security information are the following
    -   isCallerInRole (EJBContext)
    -   getCallerPrincipal (EJBContext)
    -   isUserInRole (HttpServletRequest)
    -   getUserPrincipal (HttpServletRequest)

### Commonly Encountered Security Threats

#### Man in the middle attacks

-   the malicious party intercepts messages sent between the client and server as part of a valid conversation or transaction
    -   to gain access to unauthorized information or to achieve an outcome favorable to the malicious party
-   Solution - Encrypt all network traffic using strong SSL

#### Session hijacking (replaying data)

-   the malicious party inspects the SuD and identifies how the server recognizes connected clients
-   The malicious party then steals the identity of a real client and uses that to interact with the server
    -   to gain unauthorized access to data or to achieve an outcome desirable to the malicious party and undesirable to the trusted party
-   Solution
    -   Strong data encryption helps
    -   ensure that no sensitive information is used in the application URL that would help a hacker to hijack a session

#### Password cracking

-   An attack where brute force is used to repeatedly attempt to login as a valid user by guessing their password
-   Solution
    -   business logic that places minimum complexity rules on passwords selected by users
    -   shut the user out of the system if more than a specified number of login attempts fail

#### Phishing

-   users are misdirected to a false or hoax version of the SuD and tricked into releasing sensitive information
    -   The valid information is then used by the malicious party to gain access to the SuD
-   Solution
    -   educate the user
    -   monitoring for unusual SuD activity on the part of users

#### Social hacking

-   social engineering often involving members of the opposite sex are used to gain unauthorized access to the SuD

#### Network sniffing

-   unencrypted data is simply read from the network using a sniffing tool.
    -   used on man in the middle, session hijack attacks, and so on
-   Solution
    -   Strong data encryption

#### XSS Type 0, 1, and 2 attacks

-   introduced by rich internet applications (RIAs)

### Defining a Security Model

-   the JEE architect is well advised to create and maintain a security model
    -   a roadmap or blueprint that explains how their JEE application enforces security
    -   it will serve to ensure that the architect considers the threats faced and the measures employed to counteract them
-   the model should cover the following
    -   Underlying system infrastructure (hardware, including the networking layer and components)
    -   User authentication
    -   User authorization
    -   Auditing
    -   Data encryption
    -   System hardening against specific attacks (detailed in the previous section)

Review Your Progress
====================

Question
--------

-   Which two checks are made possible in the byte-code verification?
    -   a. Memory usage is controlled
    -   b. Access to some files is checked
    -   c. Digital signatures are verified
    -   d. Data type conversions are checked/controlled
    -   e. The language access restrictions (for example, private or protected) are respected
-   Answers: C and E.
    -   a - Java applications can run out of memory
    -   b - access to a given file can be denied at runtime
    -   d - casting exceptions can also occur at runtime

Question
--------

-   Security restrictions in a use-case require that the behavior of an EJB business method vary according to the role of the user. How should this be achieved?
    -   a. The deployment descriptor is written using the roles determined by the programmer.
    -   b. The programmer determines a role reference and uses it in the code. This is mapped to a role in the deployment descriptor.
    -   c. The business method determines the role of the user using JNDI and configuration information in the deployment descriptor.
    -   d. The business method determines the role of the user using JAAS and configuration information in the deployment descriptor.
-   Answer - D uses the JAAS framework in the manner in which it was intended
    -   to ascertain at runtime the role of the current principal and to match it to the roles authorized to execute the EJB method in question

