Entity Manager
==============

-   the EntityManager is the central service for all persistence actions
-   Entities are plain Java objects that are allocated just like any other Java object
-   The EntityManager manages the O/R mapping between a fixed set of entity classes and an underlying data source
-   **The lifecycle of an entity**
    -   An entity that the EntityManager is keeping track of is considered attached or managed.
    -   when an EntityManager stops managing an entity, the entity is said to be detached.
    -   An entity that was never managed at any point is called transient or new. attached.

Persistence Context
-------------------

-   A persistence context is a set of managed entity object instances
-   The entity manager tracks all entity objects within a paersistence context for changes and updates made, and flushes these changes to the database
-   When a persistence context is closed, all managed entity objects become detached and are unmanaged.
-   Once an object is detached from a persistence context, it can no longer be managed by an entity manager, and any state changes to this object instance will not be synchronized with the database
-   An entity can become attached to the EntityManager’s context when you
    -   pass the entity to the **persist, merge, or refresh method**.
    -   retrieve using the **find method or a query within a transaction**
-   A managed entity becomes **detached when it is out of scope, removed, serialized, or cloned**
-   Unlike entities explicitly created using the new operator, an entity retrieved from the database using the EntityManager’s find method or a query is attached if retrieved within a transactional context. A retrieved instance of the entity becomes detached immediately if there is no associated transaction

Transaction-scoped EntityManager
--------------------------------

-   An EntityManager associated with a transaction-scoped persistence context is known as a transaction-scoped EntityManager
-   entities attached during a transaction are automatically detached when the transaction ends.
-   All persistence operations that may result in data changes must be performed inside a transaction, no matter what the persistence scope is.

Extended EntityManager
----------------------

-   The life span of the extended EntityManager lasts across multiple transactions
-   may be created and managed by application code (J2SE)
-   An extended EntityManager can only be used with stateful session beans and lasts as long as the bean instance is alive
-   for a stateful session bean, an EntityManager with extended scope will keep managing all attached entities until the EntityManager is closed as the bean itself is destroyed

Packaging a Persistence Unit
----------------------------

-   An EntityManager maps a fixed set of classes (called a persistence unit) to a particular database
-   A persistence unit is defined in a persistence.xml file
    -   This file is a required deployment descriptor
    -   is located in the META-INF directory of
        -   A plain JAR file within the classpath of a regular Java SE program
        -   An EJB-JAR file. A persistence unit can be included with an EJB deployment
        -   A JAR file in the WEB-INF/lib directory in a web archive file (.war)
        -   A JAR file in the root of an enterprise archive (.ear)
        -   A JAR file in the EAR lib directory.
-   Each persistence unit must have an identity, although the empty string is a valid name
-   The set of classes that belong to the persistence unit can be specified
-   the persistence provider can scan the JAR file automatically for the set of classes with the @javax.persistence.Entity annotation to deploy as entities
-   Each persistence unit is tied to one and only one data source
-   The root of the persistence.xml XML schema is the <persistence> element, which contains one or more <persistence-unit> elements.
-   Each <persistence-unit> has two attributes: name (required) and transaction-type (optional).
    -   The transaction-type attribute defines whether you want your persistence unit to be managed by and integrated with Java EE transactions (JTA) or you want to use the resource local (RESOURCE\_LOCAL).
    -   This attribute defaults to JTA in Java EE environments and to RESOURCE\_LOCAL in SE environments.
-   The subelements of <persistence-unit> are
    -   <description> (optional)
    -   <provider> (optional)
    -   <jta-data-source> (optional)
    -   <non-jta-data-source> (optional)
    -   <mapping-file> (optional)
    -   <jar-file> (optional)
    -   <class> (optional)
    -   <properties> (optional)
    -   <exclude-unlisted-classes> (optional).

### The Persistence Unit Class Set

```xml
<persistence>
    <persistence-unit name="pu">
        <jta-data-source>jdbc/entities</jta-data-source>
        <jar-file>../lib/otherEntities.jar</jar-file>
        <mapping-file>META-INF/orm.xml</mapping-file>
    </persistence-unit>
</persistence>
```

-   You can specify additional JARs that you want to be scanned using the <jar-file> element
    -   The value of this element is a path relative to the JAR file that contains persistence.xml
-   If you do not want the persistence.xml's JAR file to be scanned, then you can use the <exclude-unlisted-classes> element.
-   The final set of classes is determined by a union of all of the following metadata:
    -   Classes annotated with @Entity in the persistence.xml file's JAR file (unless <exclude-unlisted-classes> is specified)
    -   Classes annotated with @Entity that are contained within any JARs listed with any <jar-file> elements
    -   Classes mapped in the META-INF/orm.xml file if it exists
    -   Classes mapped in any XML files referenced with the <mapping-file> element
    -   Classes listed with any <class> elements

Obtaining an EntityManager
==========================

-   unless otherwise specified, injected EntityManagers have transaction scope

EntityManagerFactory
--------------------

-   EntityManagers may be created or obtained from an EntityManagerFactory.
-   In a Java SE application, you must use an EntityManagerFactory to create instances of an EntityManager
-   Using the factory isn't a requirement in Java EE
-   The createEntityManager() methods return application-managed EntityManager instances that manage a distinct extended persistence context

### Getting an EntityManagerFactory in Java SE

```java
/** the javax.persistence.Persistence class is responsible for bootstrapping an EntityManagerFactory */
public class Persistence {
    public static EntityManagerFactory createEntityManagerFactory(String unitName);
    public static EntityManagerFactory createEntityManagerFactory(String unitName, java.util.Map props);
```

-   The class looks for persistence.xml deployment descriptors within your Java classpath
-   The unitName parameter you pass in will allow the Persistence implementation to locate an EntityManagerFactory that matches the given name
-   In Java SE, it is recommended that you close() the EntityManagerFactory
-   **application-managed EntityManagers do not automatically participate in an enclosing transaction**
-   they must be asked to join an enclosing JTA transaction by calling EntityManager.joinTransaction()
    -   This method is specifically geared to using application-managed EntityManagers inside a container, where JTA transactions are usually available

```java
// JTA transaction is used
...
EntityManager em = emf.createEntityManager();
ut.begin();
em.joinTransaction();
em.persist(customer);
ut.commit();
em.close();
...
```

### Getting an EntityManagerFactory in Java EE

```java
package javax.persistence;
@Target({METHOD, FIELD, TYPE}) @Retention(RUNTIME)
public @interface PersistenceUnit {
   String name( ) default "";
   String unitName( ) default "";
}

@Stateless
public MyBean implements MyBusinessInterface {
   @PersistenceUnit
   private EntityManagerFactory factory;
}
```

-   It can be injected directly into a field or setter method of your EJBs using the @javax.persistence.PersistenceUnit annotation
-   an injected EntityManagerFactory is automatically closed by the EJB container when the instance is discarded
-   if you call close() on an injected EntityManagerFactory, an IllegalStateException is thrown
-   The unitName() is the identity of the PersistenceUnit
-   When the PersistenceUnit is used, it not only injects the EntityManagerFactory, it also registers a reference to it within the JNDI ENC of the EJB.

Obtaining a Persistence Context
-------------------------------

-   A persistence context can be created by calling the EntityManagerFactory.createEntityManager() method.
    -   The returned EntityManager instance represents an extended persistence context.
-   EntityManager.joinTransaction() is required to be invoked only when an EntityManager is created explicitly using an EntityManagerFactory.
-   If you are using EJB container managed persistence contexts, then you do not need to perform this extra step.
-   An EntityManager can be injected directly into an EJB using the @javax.persistence.PersistenceContext annotation

```java
@Stateless
public class RepositoryBean implements Repository {
    @PersistenceContext private EntityManager em;
}

@Stateful
public class StatefulBean implements Service {
    @PersistenceContext(type=PersistenceContextType.EXTENDED) private EntityManager em;
}

public enum PersistenceContextType {
    TRANSACTION, EXTENDED
}

public @interface PersistenceProperty {
    String name();
    String value();
}

@Target({METHOD, TYPE, FIELD}) @Retention(RUNTIME)
public @interface PersistenceContext {
    String name() default "";
    String unitName() default "";
    PersistenceContextType type( ) default TRANSACTION;
    PersistenceProperty[] properties( ) default {};
}
```

-   The unitName() attribute identifies the persistence
-   By default, a transaction-scoped persistence context is injected when using this annotation
-   When you access this **transaction-scoped Entity-Manager**, a persistence context becomes associated with the transaction until it finishes.
-   This means that if you interact with any entity managers within the context of a transaction, no matter if they are different instances that are injected into different beans, the same persistence context will be used
-   You must never call close( ) on an injected entity manager
    -   If you close an entity manager, an IllegalStateException is thrown.
-   An EXTENDED entity manager can only be injected into a stateful session bean
    -   The persistence context has the same life span as the bean
    -   When the stateful session bean is removed, the persistence context is closed
    -   **any entity object instances remain attached and managed as long as the stateful session bean is active**

Interacting with an EntityManager
=================================

```java
package javax.persistence;

public interface EntityManager {
    public void persist(Object entity);
    public <T> T find(Class <T> entityClass, Object primaryKey);
    public <T> T getReference(Class <T> entityClass, Object primaryKey);
    public <T> T merge(T entity);
    public void remove(Object entity);
    public void lock(Object entity, LockModeType lockMode);

    public void refresh(Object entity);
    public boolean contains(Object entity);
    public void clear();

    public void joinTransaction();
    public void flush();
    public FlushModeType getFlushMode();
    public void setFlushMode(FlushModeType type);

    public Query createQuery(String queryString);
    public Query createNamedQuery(String name);
    public Query createNativeQuery(String sqlString);
    public Query createNativeQuery(String sqlString, String resultSetMapping);
    public Query createNativeQuery(String sqlString, Class resultClass);

    public Object getDelegate();

    public void close();
    public boolean isOpen();
}
```

Persisting Entities
-------------------

-   You persist entities that have not yet been created in the database
-   When EntityManager.persist() is called, the entity manager queues the argument for insertion into the database, and the object instance becomes managed
-   When the actual insertion happens depends on a few variables.
    -   If persist() is called within a transaction, the insert may happen immediately, or it may be queued until the end of the transaction, depending on the flush mode
    -   You can always force the insertion manually within a transaction by calling the flush() method
-   You may call persist() outside of a transaction if and only if the entity manager is an EXTENDED persistence context
-   When you call persist() outside of a transaction with an EXTENDED persistence context, the insert is queued until the persistence context is associated with a transaction
-   An injected extended persistence context is automatically associated with a JTA transaction by the EJB container
-   other extended contexts created manually with the EntityManagerFactor API, you must call Entity.Manager.joinTransaction() to perform the transaction association
-   The persist() method throws an IllegalArgumentException if its parameter is not an entity type
-   TransactionRequiredException is thrown if this method is invoked on a transaction-scoped persistence context
-   if the entity manager is an extended persistence context, it is legal to call persist() outside of a transaction scope; the insert is queued until the persistence context interacts with a transaction
-   If you try to persist an entity that violates the database's integrity constraint, the persistence provider will throw javax.persistence.PersistenceException, which wraps the database exception

Finding Entities
----------------

-   **find()**
    -   returns null if the entity is not found in the database
    -   initializes the state based on the lazy-loading policies of each property
-   **getReference()**
    -   The getReference() method is used to get an instance, whose state may be lazily fetched.
    -   The implementation may construct a hollow entity and return it to you instead.
        -   The state only gets loaded when you attempt to access a persistent field.
        -   At that time, the implementation may throw an EntityNotFoundException if it discovers that the entity does not exist in the datastore.
    -   The implementation may also throw an EntityNotFoundException from the getReference method itself.
-   Both find() and getReference() throw an IllegalArgumentException if their parameters are not an entity type
-   You are allowed to invoke them outside the scope of a transaction.
    -   In this case, any object returned is detached if the EntityManager is transaction-scoped but remains managed if it is an extended persistence context
-   An EntityManager with extended persistence context uses same persistence context across multiple transaction boundaries.
    -   As long as the same EntityManager is used (whether inside or outside of a transaction), returns the same object reference when find() method is invoked as the entities remain managed even after the outside the transaction boundaries as well.

Updating Entities
-----------------

-   Once you have located an entity bean entity bean instance remains managed by the persistence context until the context is closed
-   During this period, you can change the state of the entity bean instance as you would any other object, and the updates will be synchronized automatically
-   or if you call the flush() method directly

Merging Entities
----------------

```java
@TransactionAttribute(REQUIRED)
public void updateCabin(Cabin cabin) {
    Cabin copy = entityManager.merge(cabin);
}
```

-   merge state changes made to a detached entity back into persistence storage
-   The following rules apply when merging
    -   **If the entity manager isn't already managing a Cabin instance with the same ID**
        -   a full copy of the cabin parameter is made and returned from the merge( ) method
        -   This copy is managed by the entity manager, and any additional setter methods called on this copy will be synchronized with the database when the EntityManager decides to flush
        -   The cabin parameter remains detached and unmanaged.
    -   **If the entity manager is already managing a Cabin instance with the same primary key**
        -   the contents of the cabin parameter are copied into this managed object instance
        -   The merge( ) operation will return this managed instance.
        -   The cabin parameter remains detached and unmanaged.
-   The merge( ) method will throw an IllegalArgumentException if its parameter is not an entity type.
-   The transactionRequiredException is thrown if this method is invoked on a transaction-scoped persistence context.
-   if the entity manager is an extended persistence context, it is legal to invoke this method outside of a transaction scope and the update will be queued until the persistence context interacts with a transaction.

Removing Entities
-----------------

-   The remove() operation does not immediately delete the entity from the database.
-   When the entity manager decides to flush, based on the flush rules described later in this chapter
-   The remove() method will throw an IllegalArgumentException if its parameter is not an entity type.
-   The transactionRequiredException is thrown if this method is invoked on a transaction-scoped persistence context.
-   if the entity manager is an extended persistence context, it is legal to invoke this method outside of a transaction scope and the update will be queued until the persistence context interacts with a transaction.

refresh()
---------

-   The refresh() method refreshes the state of the entity from the database, overwriting any changes made to that entity
-   The refresh() method will throw an IllegalArgumentException if its parameter is not an entity type.
-   The transactionRequiredException is thrown if this method is invoked on a transaction-scoped persistence context.
-   if the entity manager is an extended persistence context, it is legal to invoke this method outside of a transaction scope
-   If the object is no longer in the database because another thread or process removed it, then this method will throw an EntityNotFoundException

contains() and clear()
----------------------

-   The contains() method takes an entity instance as a parameter.
-   If this particular object instance is currently being managed by the persistence context, it returns true.
-   It throws an IllegalArgumentException if the parameter is not an entity.
-   clear() detach all managed entity instances from a persistence context

Lazy vs Eager Loading of Related Entities
=========================================

| Relationship Type | Default Fetch Behavior | Number of Entities Retrieved     |
|-------------------|------------------------|----------------------------------|
| One-to-one        | EAGER                  | Single entity retrieved          |
| One-to-many       | LAZY                   | Collection of entities retrieved |
| Many-to-one       | EAGER                  | Single entity retrieved          |
| Many-to-many      | LAZY                   | Collection of entities retrieved |

Entity Callbacks and Listeners
==============================

Callback Events
---------------

-   @javax.persistence.PrePersist
    -   occurs immediately when the EntityManager.persist() call is invoked
    -   or whenever an entity instance is scheduled to be inserted into the database (as with a cascaded merge).
-   @javax.persistence.PostPersist
    -   not triggered until the actual database insert.
-   @javax.persistence.PostLoad
    -   triggered after an entity instance has been loaded by a find() or getreference() method call on the EntityManager interface, or when an EJB QL query is executed
    -   also called after the refresh() method is invoked
-   @javax.persistence.PreUpdate
    -   triggered just before the state of the entity is synchronized with the database
-   @javax.persistence.PostUpdate
    -   happens after the state of the entity is synchronized with the database
-   @javax.persistence.PreRemove
    -   triggered whenever EntityManager.remove() is invoked on the entity bean, directly or because of a cascade
-   @javax.persistence.PostRemove
    -   happens immediately after the actual database delete occurs

Callbacks on Entity Classes
---------------------------

-   entity listener callback methods follow the form **public, private, protected, or package-protected void <METHOD>(Object)** and throw no checked exceptions
-   If the lifecycle callback method throws a runtime exception, the intercepted persistence operation is aborted

```java
@Entity
public class Pessoa {
    @Id String doc;
    @Temporal(TemporalType.DATE) Date nascimento;

    @PrePersist
    public void before() {
    if (nascimento == null || new Date().before(nascimento)) {
        throw new RuntimeException("data invalida");
    }
    }
}
```
```xml
<entity-mappings>
    <entity class="domain.Pessoa" access="FIELD">
        <pre-persist method-name="before"/>
        <attributes>
            <id name="id"/>
            <basic name="doc"/>
            <basic name="nascimento">
                <temporal>DATE</temporal>
            </basic>
        </attributes>
    </entity>
</entity-mappings>
```

Entity Listeners
----------------

-   Entity listeners are classes that can generically intercept entity callback events
-   The entity listener class must have a public no-arg constructor
-   entity listener callback methods follow the form *' void <METHOD>(Object)*'
-   If the lifecycle callback method throws a runtime exception, the intercepted persistence operation is aborted
-   if you have a listener class to validate that all entity data is present before persisting an entity, you could abort the persistence operation if needed by throwing a runtime exception
-   entity listener classes do not support dependency injection

```java
public class DomainEntityListener {

    @PostPersist
    public void afterSave(Object o) {
    System.out.println("Inserted entity: " + o.getClass().getName());
    }

    @PrePersist
    public void beforeSave(Object o) {
    System.out.println("Inserting entity: " + o.getClass().getName());
    }
}

@Entity
@EntityListeners(DomainEntityListener.class)
public class Pessoa {
    @Id String doc;
}
```
```xml
<!-- Para aplicar a apenas uma classe -->
<entity-mappings>
    <entity class="domain.Pessoa" access="FIELD">
        <entity-listeners>
            <entity-listener class="domain.DomainEntityListener"/>
        </entity-listeners>
        <attributes>
            <id name="doc"/>
        </attributes>
    </entity>
</entity-mappings>
```

Default Listener Class
----------------------

```java
public class DomainEntityListener {

    public void afterSave(Object o) {
    System.out.println("Inserted entity: " + o.getClass().getName());
    }

    public void beforeSave(Object o) {
    System.out.println("Inserting entity: " + o.getClass().getName());
    }
}

public class Pessoa {
    String doc;
}
```
```xml
<entity-mappings>
    <persistence-unit-metadata>
        <persistence-unit-defaults>
            <entity-listeners>
                <entity-listener class="domain.DomainEntityListener">
                    <pre-persist method-name="beforeSave"/>
                    <post-persist method-name="afterSave"/>
                </entity-listener>
            </entity-listeners>
        </persistence-unit-defaults>
    </persistence-unit-metadata>

    <entity class="domain.Pessoa" access="FIELD">
        <attributes>
            <id name="doc"/>
        </attributes>
    </entity>
    <entity class="domain.Cliente" access="FIELD">
        <exclude-default-listeners/>
    </entity>
</entity-mappings>
```

-   If you want to turn off default entity listeners to a particular entity class, you can use the @javax.persistence.ExcludeDefaultListeners annotation

Inheritance and Listeners
-------------------------

-   **Entity listeners applied to a base class happen before any listeners attached to a subclass.**
-   **Callback methods defined directly in an entity class happen last.**
-   You can turn off inherited entity listeners
    -   using @javax.persistence.ExcludeSuperclassListeners

```xml
<entity-mappings>
    <entity class="domain.Cliente" access="FIELD">
        <exclude-superclass-listeners/>
    </entity>
</entity-mappings>
```
