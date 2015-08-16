Using JAX-WS
============

-   An EJB endpoint is a stateless session bean that is exposed as a web service
-   In addition to the remote and local component interfaces, there is another component interface, called the service endpoint interface

@WebService
-----------

```java
package javax.jws;
@Target({TYPE}) @Retention(value=RetentionPolicy.RUNTIME)
public @interface WebService {
    String name() default "";
    String targetNamespace() default "";
    String serviceName() default "";
    String wsdlLocation() default "";
    String portName() default "";
    String endpointInterface() default "";
}
`

-   @javax.jws.WebService must be placed on the stateless session bean implementation class in order to expose it as a web service
-   The name() attribute is the name of the web service and it is used as the name of the portType when mapped to WSDL
    -   defaults to the short name of the Java class or Java interface to which you are applying it
-   The targetNamespace() attribute specifies the XML namespace used for the WSDL and XML elements that are generated from this annotation.
    -   The default value is generated from the package name of the annotated type
-   The wsdlLocation() attribute defines the URL of the WSDL document that represents this web service. You need this attribute only if you are mapping your service to a preexisting WSDL document
-   The endpointInterface() attribute is used to externalize the contract of the web service by specifying that contract in the form of a Java interface
-   portName() attribute specifies which WSDL port you will use

@WebMethod
----------

```java
package javax.jws;
@Target({ElementType.METHOD}) @Retention(value = RetentionPolicy.RUNTIME)
public @interface WebMethod {
    String operationName() default "";
    String action() default "";
}
`

-   If a stateless session bean is annotated with @java.jws.WebService, and it contains no methods that are annotated with @javax.jws.WebMethod, then all methods are made available to the web service
-   Otherwise, only those methods that are annotated with @javax.jws.WebMethod will be made available
-   operationName() attribute is used to define the WSDL operation that the annotated method implements.
    -   If it is not specified, the literal Java method name is used
-   The action() attribute is used to set the SOAPAction hint that corresponds with this operation

The Service Endpoint Interface
------------------------------

-   MUST be an outer public interface
-   MUST include a @WebService annotation, indicating that it is defining the contract for a Web Service
-   **MUST extend java.rmi.Remote**
-   must not include constant (as public final static) declarations
-   All of the methods on the service endpoint interface are mapped to WSDL operations, regardless of whether they include a @WebMethod annotation
    -   A method MAY include a @WebMethod annotation to customize the mapping to WSDL, but is not REQUIRED to do so.
    -   A method throws clauses must include the java.rmi.RemoteException and may additionally include application exceptions
