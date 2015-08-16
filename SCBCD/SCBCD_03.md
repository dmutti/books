Transactions
============

Session Synchronization
-----------------------

-   you can be notified about the transaction's lifecycle events
-   CMT bean implement the javax.ejb.SessionSynchronization interface
    -   **void afterBegin()** — Called right after the container creates a new transaction and before the business method is invoked.
    -   **void beforeCompletion()** — Invoked after a business method returns but right before the container ends a transaction
        -   If the transaction is rolled back, the beforeCompletion() method will not be invoked, avoiding the pointless effort of writing changes that won't be committed to the database

    -   **void afterCompletion(boolean committed)** — Called after the transaction finishes. The boolean committed flag indicates whether a method was committed or rolled back.
        -   always invoked, whether the transaction ended successfully with a commit or unsuccessfully with a rollback

-   only available to @Stateful beans
-   A stateful session bean cannot be removed while it is involved in a transaction
    -   invoking an @Remove annotated method while the SessionSynchronization bean is in the middle of a transaction will cause an error to be thrown

Understanding transactions
--------------------------

-   **A**tomicity
-   **C**onsistency
-   **I**solation
-   **D**urability

### Transaction management in EJB

-   only session beans and MDBs support BMT and CMT
-   Java Persistence API is not directly dependent on either CMT or BMT
-   JTA - Java Transaction API defines application transaction services as well as the interactions among the application server, the transaction manager, and resource managers
-   If you do not specify any @transactionAttribute and there is no XML deployment descriptor, the default transaction attribute will be REQUIRED and CMT
-   **If the annotation is applied at the bean level, all business methods in the bean inherit the transaction attribute value specified by it.**

```java
@Stateless
/** ou TransactionManagementType.BEAN - CONTAINER eh o default*/
@TransactionManagement(TransactionManagementType.CONTAINER)
public class OrderManagerBean {
    @Resource private SessionContext context;
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void placeSnagItOrder(Item item, Customer customer){
        try {
            if (!bidsExisting(item)){
                validateCredit(customer);
                chargeCustomer(customer, item);
                removeItemFromBidding(item);
            }
        } catch (CreditValidationException cve) {
            context.setRollbackOnly();
        } catch (CreditProcessingException cpe){
            context.setRollbackOnly();
        } catch (DatabaseException de) {
            context.setRollbackOnly();
        }
    }
}
```
```xml
<ejb-jar version="3.0">
    <assembly-descriptor>
        <container-transaction>
            <method>
                <ejb-name>ServiceBean</ejb-name>
                <method-name>*</method-name>
            </method>
            <trans-attribute>RequiresNew</trans-attribute>
        </container-transaction>
        <container-transaction>
            <method>
                <ejb-name>EventConsumer</ejb-name>
                <method-name>executa</method-name>
            </method>
            <trans-attribute>NotSupported</trans-attribute>
        </container-transaction>
    </assembly-descriptor>
</ejb-jar>
```

### The @TransactionAttribute annotation

| Transaction Attribute | Caller Transaction Exists? | Effect |
|-----------------------|----------------------------|---------------------------------------------------------------------------------------|
| REQUIRED | No | Container creates a new transaction |
|  | Yes | Method joins the caller's transaction |
| REQUIRES_NEW | No | Container creates a new transaction. |
|  | Yes | Container creates a new transaction and the caller's transaction is suspended. |
| SUPPORTS | No | No transaction is used. |
|  | Yes | Method joins the caller's transaction. |
| MANDATORY | No | javax.ejb.EJBTransactionRequiredException is thrown. |
|  | Yes | Method joins the caller's transaction. |
| NOT_SUPPORTED | No | No transaction is used. |
|  | Yes | The caller's transaction is suspended and the method is called without a transaction. |
| NEVER | No | No transaction is used. |
|  | Yes | javax.ejb.EJBException is thrown. |

-   **REQUIRED**
    -   the default
    -   In case of transactions propagated from the client, if our method indicates that the transaction should be rolled back, the container will roll back the transaction and throw a javax.transaction.RollbackException back to the client

-   **REQUIRES\_NEW**
    -   the success or failure of our new transaction has no effect on the existing client transaction

-   **Transaction attributes and MDBs**
    -   MDBs only support the REQUIRED and NOT\_SUPPORTED
    -   because it is the container that invokes MDB methods when it receives an incoming message

### Marking a CMT for rollback

```java
@Resource private SessionContext context;

public void placeSnagItOrder(Item item, Customer customer){
    try {
        validateCredit(customer);
    } catch (CreditValidationException cve) {
        context.setRollbackOnly();
    }
}
```

-   the transaction is not rolled back immediately, but a flag is set for the container to do the actual rollback when it is time to end the transaction
-   The setRollbackOnly and getRollbackOnly methods can only be invoked in an EJB using CMT with these transaction attributes: REQUIRED, REQUIRES\_NEW, or MANDATORY
-   Otherwise, the container will throw a java.lang.IllegalStateException.

### Transaction and exception handling

```java
public void placeSnagItOrder(Item item, Customer customer) throws CreditValidationException, CreditProcessingException, DatabaseException {
    if (!bidsExisting(item)){
        validateCredit(customer);
        chargeCustomer(customer, item);
        removeItemFromBidding(item);
    }
}
@ApplicationException(rollback=true)
public class CreditValidationException extends Exception { }

@ApplicationException(rollback=true)
public class CreditProcessingException extends Exception { }

@ApplicationException(rollback=false)
public class DatabaseException extends RuntimeException { }
```
```xml
<ejb-jar version="3.0">
    <assembly-descriptor>
        <application-exception>
            <exception-class>java.lang.IllegalArgumentException</exception-class>
            <rollback>true</rollback>
        </application-exception>
    </assembly-descriptor>
</ejb-jar>
```

### System Exceptions

-   System exceptions include java.lang.RuntimeException, javax.ejb.EJBException and java.rmi.RemoteException
-   all exceptions that inherit from either java.rmi.RemoteExceptions or java.lang.RuntimeException are assumed to be system exceptions
-   it is not assumed that system exceptions are expected by the client.
-   The container handles system exceptions automatically and it will always do the following
    -   Roll back the transaction
    -   Log the exception to alert the system administrator
    -   Discard the EJB instance
        -   If the client started the transaction, which was then propagated to the EJB, a system exception will be caught by the container and rethrown as a javax.ejb.EJBTransactionRolledbackException
        -   If the client did not propagate a transaction to the EJB, the system exception will be caught and rethrown as an EJBException

-   With message-driven beans, a system exception thrown by the onMessage() method or one of the callback methods (@PostConstruct or @PreDestroy ) will cause the bean instance to be discarded

### Application exceptions

-   Application exceptions are always delivered directly to the client without being repackaged as an EJBException
-   By default
    -   they do not cause a transaction to roll back
    -   all checked exceptions except for java.rmi.RemoteException are assumed to be application exceptions.

-   the @javax.ejb.ApplicationException annotation
    -   may be used to force an application exception to roll back the transaction automatically
    -   identifies a Java checked or unchecked exception as an application exception.
    -   can also be used on subclasses of java.lang.RuntimeException and java.rmi.RemoteException

-   Applying @ApplicationException to a RuntimeException causes it to be treated as an application exception instead
-   By default, application exceptions do not cause an automatic CMT rollback since the rollback element is defaulted to false
    -   setting the element to true tells the container that it should roll back the transaction before the exception is passed on to the client

### Programmatic Locking

```java
package javax.persistence;
public enum LockModeType{
   READ, WRITE
}

public interface EntityManager {
   void lock(Object entity, LockModeType type);
}
```

-   LockModeType.READ ensures that no dirty and nonrepeatable reads can occur on the locked entity
-   LockModeType.WRITE ensures that
    -   no dirty and nonrepeatable reads can occur
    -   it also forces an increment of the entity's @Version property

Bean-managed transactions
-------------------------

```java
@Stateless @TransactionManagement(TransactionManagementType.BEAN)
public class OrderManagerBean {

    /** injeta o UserTransaction */
    @Resource private javax.transaction.UserTransaction userTransaction;
    public void placeSnagItOrder(Item item, Customer customer){
        try {
            userTransaction.begin();
            if (!bidsExisting(item)){
                validateCredit(customer);
                chargeCustomer(customer, item);
                removeItemFromBidding(item);
            }
            userTransaction.commit();
        } catch (CreditValidationException cve) {
            userTransaction.rollback();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

-   With stateless session beans, transactions that are managed using UserTransaction must be started and completed within the same method
-   With stateful session beans, however, a transaction can begin in one method and be committed in another because a stateful session bean is used by only one client.
    -   a stateful session bean can associate itself with a transaction across several different client-invoked methods

-   Message-driven beans also have the option of managing their own transactions
    -   the scope of the transaction must begin and end within the onMessage()

-   **Message-driven beans and bean-managed transactions**
    -   in a BMT, the message consumed by the MDB is not part of the transaction.
    -   When an MDB uses container-managed transactions, the message it is handling is a part of the transaction, so if the transaction is rolled back, the consumption of the message is also rolled back, forcing the JMS provider to redeliver the message
    -   with bean-managed transactions, the message is not part of the transaction, so if the BMT is rolled back, the JMS provider will not be aware of the transaction's failure
    -   If redelivery of a message is important when a transaction fails, your best course of action is to ensure that the onMessage() method throws an EJBException so that the container will not acknowledge the message received from the JMS provider

### Getting a UserTransaction

```java
/** JNDI lookup */
Context context = new InitialContext();
UserTransaction userTransaction = (UserTransaction) context.lookup("java:comp/UserTransaction");
userTransaction.begin();
// Perform transacted tasks.
userTransaction.commit();


Context context = new InitialContext();
UserTransaction userTransaction = (UserTransaction) context.lookup("java:comp/env/UserTransaction");
userTransaction.begin();
// Perform transacted tasks.
userTransaction.commit();

/** EJBContext */
@Resource private SessionContext context;
...
UserTransaction userTransaction = context.getUserTransaction();
userTransaction.begin();
// Perform transacted tasks.
userTransaction.commit();
```

-   **EJBContext**
    -   You can also get a UserTransaction by invoking the getUserTransaction method of the EJBContext
    -   Calling getUserTransaction in a CMT environment will cause the context to throw a java.lang.IllegalStateException
    -   you cannot use the EJBContext getRollbackOnly and setRollbackOnly methods in BMT - the container will throw an IllegalStateException

### Using UserTransaction

```java
public interface UserTransaction {
    void begin() throws NotSupportedException, SystemException;
    void commit() throws RollbackException, HeuristicMixedException, HeuristicRollbackException, SecurityException, IllegalStateException, SystemException;
    void rollback() throws IllegalStateException, SecurityException, SystemException;
    void setRollbackOnly() throws IllegalStateException, SystemException;
    int getStatus() throws SystemException;
    void setTransactionTimeout(int seconds) throws SystemException;
}
```

-   The begin method creates a new low-level transaction behind the scenes and associates it with the current thread
-   if you call the begin method twice before calling rollback or commit throws a NotSupportedException since Java EE doesn't support nested transactions

| Status | Description |
|--------|-------------|
| STATUS_ACTIVE | The associated transaction is in an active state. |
| STATUS_MARKED_ROLLBACK | The associated transaction is marked for rollback, possibly due to invocation of the setRollbackOnly method |
| STATUS_PREPARED | The associated transaction is in the prepared state because all resources have agreed to commit |
| STATUS_COMMITTED | The associated transaction has been committed. |
| STATUS_ROLLEDBACK | The associated transaction has been rolled back. |
| STATUS_UNKNOWN | The status for associated transaction is not known |
| STATUS_NO_TRANSACTION | There is no associated transaction in the current thread |
| STATUS_PREPARING | The associated transaction is preparing to be committed and awaiting response from subordinate resources |
| STATUS_COMMITTING | The transaction is in the process of committing. |
| STATUS_ROLLING\_BACK | The transaction is in the process of rolling back. |

### The pros and cons of BMT

-   A drawback for BMT is the fact that it can never join an existing transaction.
-   Existing transactions are always suspended when calling a BMT method, significantly limiting flexible component reuse.

Transactions and persistence context propagation
------------------------------------------------

-   When a transaction-scoped entity manager is invoked outside the scope of a transaction, it creates a persistence context for the duration of that method call. After the method call completes, any managed objects produced by the call are immediately detached
-   If a transaction-scoped entity manager is invoked from within a transaction, a new persistence context is created if there isn't one already and associated with that transaction
-   If an entity manager is invoked upon and a persistence context is already associated with the transaction, use that persistence context. The persistence context is propagated between EJB invocations in the same transaction. This means that if an EJB interacts with an injected entity manager within a transaction and then invokes on another EJB within that same transaction, that EJB call will use the same enlisted persistence context.
-   If an EJB with a transaction-scoped persistence context invokes on a stateful session bean that uses an extended persistence context, an error is thrown
-   If a stateful session bean with an extended persistence context calls another EJB that has injected a transaction-scoped persistence context, the extended persistence context is propagated
-   If an EJB calls another EJB with a different transaction scope, the persistence context, whether it is extended or not, is not propagated.
-   If a stateful session bean with an extended persistence context calls another noninjected stateful session bean with an extended persistence context, an error is thrown.
    -   if you manually create a stateful session, there is no sharing of persistence contexts

Exploring EJB security
======================

Authorization
-------------

-   Authorization is performed in Java EE and EJB by associating one or more roles with a given user and then assigning method permissions based on that role
-   In EJB, you assign access control on a per-method basis
-   You assign these permissions on a per-role basis

### Assigning Method Permissions

-   To assign method permissions to an EJB's methods, use the @javax.annotation.security.RolesAllowed
-   The @javax.annotation.security.PermitAll annotation specifies that any authenticated user is permitted to invoke the method.
-   @PermitAll is also the default value if no default or explicit security metadata is provided for a method

```java
@Stateless @RolesAllowed("admin")
public class ServiceBean implements Service {
    private SessionContext sessionContext;

    @PermitAll
    public String foo() {
	return "foo " + sessionContext.getCallerPrincipal().getName();
    }

    @RolesAllowed("users")
    public String bar() {
        return "bar " + sessionContext.getCallerPrincipal().getName();
    }

    public String baz() {
        return "baz " + sessionContext.getCallerPrincipal().getName();
    }

    @DenyAll
    public String forbidden() {
        return "no no no";
    }
}
```
```xml
<ejb-jar version="3.0">
    <assembly-descriptor>
        <security-role>
            <role-name>admin</role-name>
        </security-role>
        <security-role>
            <role-name>users</role-name>
        </security-role>
        <method-permission>
            <role-name>admin</role-name>
            <method>
                <ejb-name>ServiceBean</ejb-name>
                <method-name>*</method-name>
            </method>
        </method-permission>
        <method-permission>
            <unchecked/>
            <method>
                <ejb-name>ServiceBean</ejb-name>
                <method-name>foo</method-name>
            </method>
        </method-permission>
        <method-permission>
            <role-name>users</role-name>
            <method>
                <ejb-name>ServiceBean</ejb-name>
                <method-name>bar</method-name>
            </method>
        </method-permission>
        <exclude-list>
            <method>
                <ejb-name>ServiceBean</ejb-name>
                <method-name>forbidden</method-name>
            </method>
        </exclude-list>
    </assembly-descriptor>
</ejb-jar>
```

The RunAs Security Identity
---------------------------

-   runAs specifies the role under which the method will run
-   the runAs role is used as the enterprise bean's identity when it tries to invoke methods on other beans and this identity isn't necessarily the same as the identity that's currently accessing the bean
-   Although they are not allowed to use method permissions, message-driven beans can use the @RunsAs feature
-   To specify that an enterprise bean will execute under the caller's identity rather than a propagated run-as identity, the <security-identity\> role contains a single empty element, <use-caller-identity/\>
-   The use of <security-identity\> applies to session beans
-   Message-driven beans have only a runAs identity; they never execute under the caller identity because there is no "caller"
-   With no caller identity to propagate, message-driven beans must always specify a runAs security identity if they interact with other secured session beans

```java
@RunAs("admin")
public class EventConsumer {
    private MessageDrivenContext ctx;
    @EJB Service service;
    public void onMessage(Message message) {
        service.foo();
    }
}
```
```xml
<ejb-jar version="3.0">
    <enterprise-beans>
        <message-driven>
            <ejb-name>EventConsumer</ejb-name>
            <mapped-name>jms/events</mapped-name>
            <ejb-class>event.EventConsumer</ejb-class>
            <messaging-type>javax.jms.MessageListener</messaging-type>
            <security-identity>
                <run-as>
                    <role-name>admin</role-name>
                </run-as>
            </security-identity>
        </message-driven>
    </enterprise-beans>
</ejb-jar>
```

Programmatic Security
---------------------

-   getCallerPrincipal() method returns a standard Java SE javax.security.Principal security interface
    -   A Principal object represents the individual user that is currently invoking on the EJB

-   The EJBContext.isCallerInRole() method allows you to determine whether the current calling user belongs to a certain role
-   To make the EJB container's job easier, you must declare all programmatic role access using the @javax.annotation.security.DeclareRoles annotation
-   If you do not use the @DeclareRoles annotation, then you must use the <security-role-ref\> element within the session bean's declaration
-   The <security-role-ref\> element is defined within a <session\> or <message-driven\> element. It has one subelement, <role-name\>, which names the role that is being referenced

```java
package javax.ejb;
public interface EJBContext {
   javax.security.Principal getCallerPrincipal();
   boolean isCallerInRole(String roleName);
}

@Stateless @DeclareRoles({"admin","users"})
public class ServiceBean implements Service {
    private SessionContext sessionContext;

    public String bar() {
        return "bar " + sessionContext.getCallerPrincipal().getName();
    }
}
```
```xml
<ejb-jar version="3.0">
    <enterprise-beans>
        <session>
            <ejb-name>ServiceBean</ejb-name>
            <security-role-ref>
                <role-name>ADMINISTRATOR</role-name>
            </security-role-ref>
        </session>
    </enterprise-beans>
</ejb-jar>
```

Declarative security
--------------------

-   **Declaring roles**
    -   There are a few ways of declaring roles
    -   one of which is through the @DeclareRoles annotation at either the method or the class level and consists of an array of role name
    -   If we never declare roles, the container will automatically build a list of roles by inspecting the @RolesAllowed annotation
    -   the local system administrator must map each role to groups defined in the runtime security environment

-   **Specifying authenticated roles**
    -   @RolesAllowed can be applied to either an EJB business method or an entire class
    -   When applied to an entire EJB, it tells the container which roles are allowed to access any EJB method
    -   **you can override class-level settings by reapplying the annotation at the method level (for example, to restrict access further for certain methods)**

-   **@PermitAll and @DenyAll**
    -   We can use the @PermitAll annotation to mark an EJB class or a method to be invoked by any role
    -   The @DenyAll annotation does exactly the opposite of @PermitAll
    -   **The three security annotations, @PermitAll, @DenyAll, and @RoleAllowed, cannot simultaneously be applied to the same class or the same method**

-   **@RunAs**
    -   The @RunAs annotation comes in handy if you need to dynamically assign a new role to the existing Principal in the scope of an EJB method invocation
    -   if you're invoking another EJB within your method but the other EJB requires a role that is different from the current Principal's role

Using interceptors for programmatic security
--------------------------------------------

```java
public class SecurityInterceptor {
    @AroundInvoke
    public Object checkUserRole(InvocationContext context) throws Exception {
        if (!context.getEJBContext().isCallerInRole("CSR")) {
            throw new SecurityException("No permissions to cancel bid");
        }
        return context.proceed();
    }
}


@Stateless
public class BidManagerBean implements BidManager {

    @Interceptors(actionbazaar.security.SecurityInterceptor.class)
    public void cancelBid(Bid bid, Item item) { ... }
}
```
