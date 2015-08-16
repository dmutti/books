Queries and EJB QL
==================

Query API
---------

```java
package javax.persistence;
public interface Query {
    public List getResultList();
    public Object getSingleResult();
    public int executeUpdate();
    public Query setMaxResults(int maxResult);
    public Query setFirstResult(int startPosition);
    public Query setHint(String hintName, Object value);
    public Query setParameter(String name, Object value);
    public Query setParameter(String name, Date value, TemporalType temporalType);
    public Query setParameter(String name, Calendar value, TemporalType temporalType);
    public Query setParameter(int position, Object value);
    public Query setParameter(int position, Date value, TemporalType temporalType);
    public Query setParameter(int position, Calendar value, TemporalType temporalType);
    public Query setFlushMode(FlushModeType flushMode);
}

package javax.persistence;
public interface EntityManager {
    public Query createQuery(String ejbqlString);
    public Query createNamedQuery(String name);
    public Query createNativeQuery(String sqlString);
    public Query createNativeQuery(String sqlString, Class resultClass);
    public Query createNativeQuery(String sqlString, String resultSetMapping);
}
```

-   **getSingleResult()**
    -   If no result is returned, then the method throws a javax.persistence.EntityNotFoundException runtime exception
    -   If more than one result is found, then a javax.persistence.NonUniqueResultException runtime exception is thrown
    -   These exceptions will not roll back the active transactions
    -   the persistence provider will throw IllegalStateException if Query contains an UPDATE or DELETE statement

### Parameters

```java
/** Named Parameter */
public List findByName(String first, String last) {
    Query query = entityManager.createQuery(
        "from Customer c where c.firstName=:first and c.lastName=:last");
    query.setParameter("first", first);
    query.setParameter("last", last);
    return query.getResultList();
}

/** Positional Parameter */
public List findByName(String first, String last) {
    Query query = entityManager.createQuery(
        "from Customer c where c.firstName=?1 and c.lastName=?2");
    query.setParameter(1, first);
    query.setParameter(2, last);
    return query.getResultList( );
}
```

### Date Parameters

```java
package javax.persistence;
public enum TemporalType {
     DATE, //java.sql.Date
     TIME, //java.sql.Time
     TIMESTAMP //java.sql.Timestamp
}

public interface Query {
    Query setParameter(String name, java.util.Date value, TemporalType temporalType);
    Query setParameter(String name, Calendar value, TemporalType temporalType);
    Query setParameter(int position, Date value, TemporalType temporalType);
    Query setParameter(int position, Calendar value, TemporalType temporalType);
}
```

### Paging

```java
public List getCustomers(int max, int index) {
    Query query = entityManager.createQuery("from Customer c");
    return query.setMaxResults(max)
        .setFirstResult(index)
        .getResultList();
}
```

### Hints

```java
manager.createQuery("from Customer c").setHint("org.hibernate.timeout", 1000);
```

### FlushMode

```java
manager.createQuery("from Customer c").setFlushMode(FlushModeType.COMMIT);
```

-   **AUTO (default)** - The persistence provider is responsible for updates to entities in the persistence context.
-   COMMIT - Updates made to entities in the persistence context are undefined
-   If the Query is set to FlushModeType.COMMIT, the effect of updates made to entities in the persistence context is not defined by the specification
    -   the actual behavior is implementation specific!

EJB QL
------

### Abstract Schema Names

```java
/** Undefined */
package my.pkg;
@Entity public class Customer { }
entityManager.createQuery("SELECT c FROM Customer AS c");

/** Defined */
package my.pkg;
@Entity(name="Cust") public class Customer { }
entityManager.createQuery("SELECT c FROM Cust AS c");
```

-   can be defined by metadata or it can default to a specific value
-   default is the unqualified name of the entity bean class

### Simple Queries

```sql
SELECT OBJECT( c ) FROM Customer AS c
```

-   The AS c part of the clause assigns c as the identifier of the Customer entity
    -   Identifiers can be any length and follow the same rules that are applied to field names in the Java programming language
    -   identifiers cannot be the same as existing abstract schema name values
    -   identification variable names are not case-sensitive
-   The AS operator is optional
-   Identifiers cannot be EJB QL reserved words
    -   SELECT, FROM, WHERE, UPDATE, DELETE, JOIN, OUTER, INNER, GROUP, BY, HAVING, FETCH, DISTINCT, OBJECT, NULL, TRUE, FALSE, NOT, AND, OR, BETWEEN, LIKE, IN, AS, UNKNOWN, EMPTY, MEMBER, OF, IS, AVG, MAX, MIN, SUM COUNT, ORDER ASC, DESC, MOD, UPPER, LOWER, TRIM, POSITION, CHARACTER\_LENGTH, CHAR\_LENGTH, BIT\_LENGTH, CURRENT\_TIME, CURRENT\_DATE, CURRENT\_TIMESTAMP, NEW

### Selecting Entity and Relationship Properties

```java
@Entity
public class Customer {
    private int id;
    private String first;

    @Id public int getId() { return id; }
    public String getFirstName() { return first; }
}
/** Resulta em */ SELECT c.firstName FROM Customer AS c

@Entity
public class Customer {
    @Id int id;
    String first;
}
/** Resulta em */ SELECT c.first FROM Customer AS c
```

-   Paths can be as long as required
-   Paths cannot navigate beyond persistent properties
-   It's illegal to navigate across a collection-based relationship field

### Constructor Expressions

-   you can specify a constructor within the SELECT clause that can allocate plain Java objects (nonentities) and pass in columns you select into that constructor

```sql
SELECT new com.titan.domain.Name(c.firstName, c.lastName) FROM Customer c
```

### INNER JOIN

```sql
SELECT cbn.ship FROM Customer c INNER JOIN c.reservations r [INNER] JOIN r.cabins cbn
```

### LEFT JOIN

```sql
SELECT c.firstName, c.lastName, p.number From Customer c LEFT JOIN c.phoneNumbers p
SELECT c.firstName, c.lastName, p.number From Customer c LEFT OUTER JOIN c.phoneNumbers p
```

-   The LEFT JOIN syntax enables retrieval of a set of entities where matching values in the join statement may not exist
-   For values that do not exist, a null value is placed in the result set

### Fetch Joins

```sql
SELECT c FROM Customer c LEFT JOIN FETCH c.phones
```

-   The JOIN FETCH syntax allows you to preload a returned entity's relationships even if the relationship property has a FetchType of LAZY

### WHERE

-   Almost all types of Java literals such as boolean, float, enum, String, int, and so forth are supported in the WHERE clause
-   You cannot use numeric types such as octal and hexadecimals
-   You cannot use array types such as byte\[\] or char\[\]
-   **Operator Precedence**
    1.  Navigation operator (.)
    2.  Arithmetic operators: +, - (unary); \*, / (multiplication and division); +, - (addition and subtraction)
    3.  Comparison operators: =, &gt;, &gt;=, <, <=, <> (not equal), LIKE, BETWEEN, IN, IS NULL, IS EMPTY, MEMBER OF
    4.  Logical operators: NOT, AND, OR
-   **Logical Operators**
    -   Logical operators evaluate only Boolean expressions, so each operand must evaluate to true, false, or NULL
-   **MEMBER OF**
    -   a powerful tool for determining whether an entity is a member of a specific collection-based relationship
-   **LIKE**
    -   allows the query to select String type fields that match a specified pattern
    -   % (percent) stands for any sequence of characters
    -   \_ (underscore) stands for any single character

### Boolean Operations Involving null

| 1     | Operator | 2    | Result  |
|-------|----------|------|---------|
| TRUE  | AND      | null | UNKNOWN |
| FALSE | AND      | null | FALSE   |
| null  | AND      | null | UNKNOWS |
| TRUE  | OR       | null | TRUE    |
| null  | OR       | null | UNKNOWN |
| FALSE | OR       | null | UNKNOWN |
|       | NOT      | null | UNKNOWN |

### String Functions

| Function                                                                           | Description                                                                                                                                                                       |
|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CONCAT(string1, string2)                                                           | Returns the value of concatenating two strings or literals together.                                                                                                              |
| SUBSTRING(string, position, length)                                                | Returns the substring starting at position that is length long.                                                                                                                   |
| TRIM(\[LEADING | TRAILING | BOTH\] \[trim\_character\] FROM\] string\_to\_trimmed) | Trims the specified character to a new length. The trimming can either be LEADING, TRAILING, or from BOTH ends. If no trim\_character is specified, then a blank space is assumed |
| LOWER(string)                                                                      | Returns the string after converting to lowercase                                                                                                                                  |
| UPPER(string)                                                                      | Returns the string after converting to uppercase                                                                                                                                  |
| LENGTH(string)                                                                     | Returns the length of a string                                                                                                                                                    |
| LOCATE(searchString, stringToBeSearched\[initialPosition\])                        | Returns the position of a given string within another string. The search starts at position 1 if initialPosition is not specified                                                 |

### Arithmetic functions

| Function                                  | Description                                                                 |
|-------------------------------------------|-----------------------------------------------------------------------------|
| ABS(simple\_arithmetic\_expression)       | Returns the absolute value of simple\_arithmetic\_expression                |
| SQRT(simple\_arithmetic\_expression)      | Returns the square root value of simple\_arithmetic\_expression as a double |
| MOD(num, div)                             | Returns the result of executing the modulus operation for num, div          |
| SIZE(collection\_value\_path\_expression) | Returns the number of items in a collection                                 |

### Temporal functions

| Function           | Description               |
|--------------------|---------------------------|
| CURRENT\_DATE      | Returns current date      |
| CURRENT\_TIME      | Returns current time      |
| CURRENT\_TIMESTAMP | Returns current timestamp |

-   **Podem ser usados apenas no WHERE!**

### Aggregate functions

| Function | Description                                                           | Return Type                                  |
|----------|-----------------------------------------------------------------------|----------------------------------------------|
| AVG      | Returns the average value of all values of the field it is applied to | Double                                       |
| COUNT    | Returns the number of results returned by the query                   | Long                                         |
| MAX      | Returns the maximum value of the field it is applied to               | Depends on the type of the persistence field |
| MIN      | Returns the minimum value of the field it is applied to               | Depends on the type of the persistence field |
| SUM      | Returns the sum of all values on the field it is applied to           | May return either Long or Double             |

### ORDER BY

-   You can explicitly specify the order as ascending or descending by using the keywords ASC and DESC
-   default is ASC
-   Null elements will be placed on top or at the bottom of the query result depending on the underlying database

### Subqueries

-   Unlike SQL subqueries, EJB 3 subqueries are not supported in the FROM clause
-   EJB QL supports subqueries in WHERE and HAVING clauses
-   **ALL, ANY, SOME**
    -   When a subquery returns multiple rows, it is possible to quantify the results with the ALL, ANY, and SOME expressions
-   **EXISTS**
    -   The EXISTS operator returns true if the subquery result consists of one or more values

### Bulk UPDATE and DELETE

-   Vendor implementations are required only to execute the update or delete directly on the database
-   They do not have to modify the state of any currently managed entity
-   do these operations within their own transaction or at the beginning of a transaction (before any entities are accessed that might be affected by these bulk operations)
-   or executing EntityManager.flush() and EntityManager.clear() before executing a bulk operation will keep you safe

Native Queries
--------------

-   The EntityManager interface has three methods for creating native queries
    -   one for returning scalar values
        -   **Query createNativeQuery(String sql)**
    -   one for returning one entity type
        -   **Query createNativeQuery(String sql, Class entityClass)**
        -   takes an SQL statement and implicitly maps it to one entity based on the mapping metadata you declared for that entity
        -   It expects that the columns returned in the result set of the native query will match perfectly with the entity's O/R mapping
        -   All the properties of the entities must be pulled
    -   one for defining a complex result set that can map to a mix of multiple entities and scalar values.
        -   **Query createNativeQuery(String sql, String mappingName)**
        -   The mappingName parameter references a declared @javax.persistence.SqlResultSetMapping
        -   This annotation is used to define how the native SQL results hook back into your O/R model
        -   If your returned column names don't match the parallel annotated property mapping, you can provide a field-to-column mapping for them using @javax.persistence.FieldResult

Named Queries
-------------

```java
@Entity
@NamedQueries({
    @NamedQuery(name="pessoaByDoc", query="from Pessoa p where p.doc = :doc", hints=@QueryHint(name="hint.name", value="hint.value")),
    @NamedQuery(name="aniversarianteDoDia", query="from Pessoa p where p.nascimento = CURRENT_DATE")
})
public class Pessoa {
    @Id Long id;
    String doc;
    @Temporal(TemporalType.DATE) Date nascimento;
```
```xml
<entity-mappings>
    <entity class="Pessoa" access="FIELD">
        <named-query name="byDoc">
            <query>from Pessoa p where p.doc = :doc</query>
            <hint name="hint.name" value="hint.value"/>
        </named-query>
        <named-query name="aniversarianteDoDia">
            <query>from Pessoa p where p.nascimento = CURRENT_DATE</query>
        </named-query>
    </entity>
</entity-mappings>
```

### Named Native Queries

```java
@Entity
@NamedNativeQuery(name="sysdateFromDual",
    query="select hour(curtime()) as hour," +
          "       minute(curtime()) as minute," +
          "       second(curtime()) as second," +
          "       day(curdate()) as day," +
          "       month(curdate()) as month," +
          "       year(curdate()) as year," +
          "       uuid() as uuid",
    resultClass=Sysdate.class)
public class Sysdate {

    @Id @Column(name="uuid") String uuid;
    @Column(name="hour") Short hour;
    @Column(name="minute") Short minute;
    @Column(name="second") Short second;
    @Column(name="day") Short day;
    @Column(name="month") Short month;
    @Column(name="year") Short year;
}

Sysdate result = (Sysdate) em.createNamedQuery("sysdateFromDual").getSingleResult();
```
```xml
<entity-mappings>
    <entity class="domain.Sysdate" access="FIELD">
        <named-native-query name="sysdateFromMySQL" result-class="domain.Sysdate">
            <query>select hour(curtime()) as hour,
                minute(curtime()) as minute,
                second(curtime()) as second,
                day(curdate()) as day,
                month(curdate()) as month,
                year(curdate()) as year,
                uuid() as uuid
            </query>
        </named-native-query>
        <attributes>
            <id name="uuid"/>
        </attributes>
    </entity>
</entity-mappings>
```
