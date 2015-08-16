Implementing domain objects with JPA
====================================

-   Java Persistence requires only two pieces of metadata
    -   @javax.persistence.Entity denotes that the class should be mapped to the database
    -   @javax.persistence.Id annotation marks the property in the class that will be used as the primary key

-   The persistence provider will assume that all other properties in your class will map to a column of the same name and of the same type
-   The table name will default to the unqualified name of the bean class
-   If the @Id annotation is on a getter method, all other mapping annotations must be on getter methods in the class.
    -   The provider will also assume that any other getter and setter methods in your class represent persistent properties and will automatically map them based on their base name and type

-   If you place the @Id annotation on a member field of the class.
    -   The persistence provider will also assume that any other member fields of the class are also persistent properties and will automatically map them based on their base name and type
    -   Annotations used with a setter method are ignored by the persistence provider for property-based access

-   you cannot mix and match access types in the same entity or in any entity in the POJO hierarchy
-   Data types allowable for a persisted field/property

| Types                            | Examples                                     |
| ---------------------------------| -------------------------------------------- |
| Java primitives                  | int, double, long                            |
| Java primitives wrappers         | java.lang.Integer, java.lang.Double          |
| String type                      | java.lang.String                             |
| Java API Serializable types      | java.math.BigInteger, java.sql.Date          |
| User-defined Serializable types  | Class that implements java.io.Serializable   |
| Array types                      | byte[], char[]                               |
| Enumerated type                  | {SELLER, BIDDER, CSR, ADMIN}                 |
| Collection of entity types       | Set<Category>                                |
| Embeddable class                 | Classes that are defined @Embeddable         |

-   **XML Mapping File**
    -   By default, the persistence provider will look in the META-INF directory for a file named orm.xml
    -   Alternatively, you can declare the mapping file in the <mapping-file\> element in the persistence.xml deployment descriptor

```xml
<entity-mappings>
   <entity class="com.titan.domain.Customer" access="PROPERTY">
      <attributes>
         <id name="id"/>
      </attributes>
   </entity>
</entity-mappings>
```

The @Table annotation
---------------------

```java
@Target({TYPE}) @Retention(RUNTIME)
public @interface Table {
   String name() default "";
   String catalog() default "";
   String schema() default "";
   UniqueConstraint uniqueConstraints() default {};
}
```
```xml
<entity-mappings>
    <entity class="domain.Sysdate" access="FIELD">
        <table catalog="CATALOG" schema="SCHEMATA" name="TBL_SYSDATE">
            <unique-constraint>
                <column-name>UUID</column-name>
            </unique-constraint>
        </table>
    </entity>
</entity-mappings>
```

The @Column annotation
----------------------

```java
public @interface Column {
   String name( ) default "";
   boolean unique( ) default false;
   boolean nullable( ) default true;
   boolean insertable( ) default true;
   boolean updatable( ) default true;
   String columnDefinition( ) default "";
   String table( ) default "";
   int length( ) default 255;
   int precision( ) default 0;
   int scale( ) default 0;
}
```
```xml
<!-- valores possiveis <id>, <basic>, <temporal>, <lob>, <enumerated> -->
<basic name="lastName">
   <column name=""
           unique="true"
           nullable="true"
           insertable="true"
           updatable="true"
           column-definition=""
           table=""
           length=""
           precision=""
           scale=""
   />
</basic>
```

The @Entity annotation
----------------------

```java
public class User {
    ...
    String userId;
    String username;
    String email;
    ...
}

@Entity
public class Seller extends User { ...

@Entity
public class Bidder extends User { ...
```

-   **User class is not an entity** itself - the value of the inherited properties would be discarded when either Seller or Bidder is persisted
-   all nonabstract entities must have either a public or a protected no-argument constructor. The class may have other constructors.
-   An abstract class may be declared an entity
    -   If an abstract entity is the target of a query, the query operates on all the concrete subclasses of the abstract entity

-   The class must not be declared final. No methods or persistent instance variables must be declared final.
-   If an entity instance be passed by value as a detached object, such as through a session bean’s remote business interface, the class must implement the Serializable interface.
-   Entities may extend both entity and non-entity classes, and non-entity classes may extend entity classes.

The @Id annotation
------------------

```java
package javax.persistence;

@Target({METHOD, FIELD}) @Retention(RUNTIME)
public @interface GeneratedValue {
   GenerationType strategy( ) default AUTO;
   String generator( ) default "";
}

public enum GenerationType {
   TABLE, SEQUENCE, IDENTITY, AUTO
}
```

-   EJB 3 supports primitives, primitive wrappers, and Serializable types like java.lang.String, java.util.Date, and java.sql.Date as identities.
-   you should avoid types such as float, Float, double, and so forth because of the indeterminate nature of type precision
-   avoid choosing as identifier is TimeStamp
-   Persistence providers are required to provide key generation for primitive primary keys
    -   GeneratorType.AUTO strategy is the default
    -   The AUTO strategy tells the persistence provider that you are allowing it to generate the key for you
    -   he IDENTITY strategy uses a special column type for creating primary keys
    -   The TABLE strategy designates a user-defined relational table from which the numeric keys will be generated
    -   The SEQUENCE generator strategy uses the RDBMS' built-in structure to generate IDs sequentially

-   any generator is shared among all entities in the persistence module and therefore each generator must be uniquely named in a persistence module

### @TableGenerator

```sql
-- A tabela é gerada no formato:
create table GENERATOR_TABLE (
    PRIMARY_KEY_COLUMN VARCHAR not null,
    VALUE_COLUMN long not null
);
```
```java
@Entity
public class TabledId {
    @Id @TableGenerator(name="tabled_id_pk")
    @GeneratedValue(strategy=GenerationType.TABLE, generator="tabled_id_pk")
    Long id;
}

package javax.persistence;
@Target({TYPE, METHOD, FIELD}) @Retention(RUNTIME)
public @interface TableGenerator {
    String name( );
    String table( ) default "";
    String catalog( ) default "";
    String schema( ) default "";
    String pkColumnName( ) default "";
    String valueColumnName( ) default "";
    String pkColumnValue( ) default "";
    int allocationSize( ) default 50;
    UniqueConstraint[] uniqueConstraints( ) default {};
}
```
```xml
<entity-mappings>
    <entity class="TabledId" access="FIELD">
        <table-generator name="tabled_id_xml"/>
        <attributes>
            <id name="id">
                <generated-value generator="tabled_id_xml" strategy="TABLE"/>
            </id>
        </attributes>
    </entity>
</entity-mappings>
```

### @SequenceGenerator

```java
@Entity
public class SequencedId {

    @Id
    @SequenceGenerator(name="sequenced_gen")
    @GeneratedValue(generator="sequenced_gen", strategy=GenerationType.SEQUENCE)
    Long id;
}

package javax.persistence;
@Target({METHOD, TYPE, FIELD}) @Retention(RUNTIME)
public @interface SequenceGenerator {
    String name( );
    String sequenceName( ) default "";
    int initialValue( ) default 1;
    int allocationSize( ) default 50;
}
```
```xml
<entity-mappings>
    <entity class="SequencedId" access="FIELD">
        <sequence-generator name="sequenced_id_xml"/>
        <attributes>
            <id name="id">
                <generated-value generator="sequenced_id_xml" strategy="SEQUENCE"/>
            </id>
        </attributes>
    </entity>
</entity-mappings>
```

The @IdClass annotation
-----------------------

```java
public class CategoryPK implements Serializable {
    String name;
    Date createDate;

    public CategoryPK() {}

    public boolean equals(Object other) {
        if (other instanceof CategoryPK) {
            final CategoryPK otherCategoryPK = (CategoryPK)other;
            return (otherCategory.name.equals(name) && otherCategoryPK.createDate.equals(createDate));
        }
        return false;
    }

    public int hashCode() {
        return super.hashCode();
    }
}

@Entity
@IdClass(CategoryPK.class)
public class Category {
    public Category() {}

    @Id protected String name;
    @Id protected Date createDate;
    ...
}
```

-   The Category class has two identity fields marked by the @Id annotation: name and creationDate
-   These two identity fields are mirrored in the CategoryPK class
-   The primary-key class must meet these requirements
    -   It must be serializable
    -   It must have a public no-arg constructor
    -   It must implement the equals() and hashCode() methods

-   **XML Mapping**

```xml
<entity-mappings>
    <entity class="Category" access="FIELD">
        <id-class>CategoryPK</id-class>
        <attributes>
            <id name="name"/>
            <id name="createDate"/>
        </attributes>
    </entity>
</entity-mappings>
```

The @EmbeddedId annotation
--------------------------

```java
@Embeddable
public class CategoryPK {
    @Column String name;
    @Column Long pid;

    public boolean equals(Object other) {...}
    public int hashCode() {...}
}

@Entity
public class Category {
    @EmbeddedId protected CategoryPK categoryPK;
}

/** --------------------- OU ----------------*/
public class CategoryPK {
    String name;
    Long pid;

    public boolean equals(Object other) {...}
    public int hashCode() {...}
}

@Entity
public class Category {
    @EmbeddedId
        @AttributeOverrides({
            @AttributeOverride(name="name", column=@Column(name="cat_name")),
            @AttributeOverride(name="pid", column=@Column(name="cat_pid"))
        })
    CategoryPK pk;
}
```

-   There are two ways to map the properties of your primary-key class to columns in your table.
    -   One is to specify the @Column mappings within the primary-key class source code
    -   the other is to use @AttributeOverrides

-   The @AttributeOverrides annotation is an array list of @AttributeOverride annotations.
    -   The name attribute specifies the property name in the embedded class you are mapping to (**MANDATORY**)
    -   The column attribute allows you to describe the column the property maps to (**MANDATORY**)

-   **XML Mapping**

```xml
<entity-mappings>
    <entity class="Category" access="FIELD">
        <attributes>
            <embedded-id name="pk">
                <attribute-override name="name">
                    <column name="cat_name"/>
                </attribute-override>
                <attribute-override name="pid">
                    <column name="cat_pid"/>
                </attribute-override>
            </embedded-id>
        </attributes>
    </entity>
    <embeddable class="CategoryPK" access="FIELD">
        <attributes>
            <basic name="name"/>
            <basic name="pid"/>
        </attributes>
    </embeddable>
</entity-mappings>
```

The @Embeddable annotation
--------------------------

-   It is illegal for an @Embeddable object to have an identity
-   the EJB 3 API does not support nested embedded objects
-   One of the most useful features of embeddable classes is that they can be shared between entities
    -   the same embedded data could be mapped to columns with different names in two separate tables

```java
@Embeddable
public class Address {
    @Column(name="obj_state") String state;
}

@Entity
public class Customer {
    @Id Long id;
    @Embedded
    @AttributeOverrides(@AttributeOverride(name="state", column=@Column(name="cust_state")))
    Address address;
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id"/>
            <embedded name="address">
                <attribute-override name="state">
                    <column name="cust_state"/>
                </attribute-override>
            </embedded>
        </attributes>
    </entity>
    <embeddable class="Address">
        <attributes>
            <basic name="state">
                <column name="adress_state"/>
            </basic>
        </attributes>
    </embeddable>
</entity-mappings>
```

@Transient
----------

-   the persistence manager assumes that every nontransient property (getter/setter or field) in your bean class is persistent
    -   even if the property does not have any mapping metadata associated with it

-   defining a field with the transient modifier has the same effect as the @Transient annotation
-   um atributo transiente não pode ser mapeado como transiente no XML
-   **XML Mapping**

```xml
<entity-mappings>
    <entity class="Example" access="FIELD">
        <attributes>
            <id name="id"/>
            <transient name="transientField"/>
        </attributes>
    </entity>
</entity-mappings>
```

Using @Enumerated
-----------------

```java
public enum UserType {SELLER, BIDDER, CSR, ADMIN};
```

-   the UserType.SELLER value has an ordinal of 0
-   the UserType.BIDDER value has an ordinal of 1, and so on.
-   By default an enumerated field or property is saved as an ordinal.
-   This would be the case if the @Enumerated annotation is omitted altogether, or no parameter to the annotation is specified

```xml
<entity-mappings>
    <entity class="Example" access="FIELD">
        <attributes>
            <id name="id"/>
            <basic name="meuEnum">
                <enumerated>STRING</enumerated>
            </basic>
        </attributes>
    </entity>
</entity-mappings>
```

Mapping CLOBs and BLOBs and @Basic
----------------------------------

```java
@Lob @Basic(fetch=FetchType.LAZY) protected byte[] picture;
```

-   Whether a field or property designated @Lob is a CLOB or a BLOB is determined by its type.
-   If the data is of type char[] or String, the persistence provider maps the data to a CLOB column.
-   Otherwise, the column is mapped as a BLOB
-   @Basic can be marked on any attribute with direct-to-field mapping
-   the @Basic(fetch=FetchType.LAZY) specification causes data to be loaded from the database only when it is first accessed
-   lazy loading of LOB types is left as optional for vendors by the EJB 3 specification and there is no guarantee that the column will actually be lazily loaded
-   **XML Mapping**

```xml
<entity-mappings>
    <entity class="Example" access="FIELD">
        <attributes>
            <id name="id"/>
            <basic name="picture">
                <lob/>
            </basic>
        </attributes>
    </entity>
</entity-mappings>
```

Mapping temporal types
----------------------

```java
@Temporal(TemporalType.DATE) protected Date creationDate;
```

-   DATE (storing day, month, and year)
-   TIME (storing just time and not day, month, or year)
-   TIMESTAMP (storing time, day, month, and year)
-   @Temporal annotation specifies which of these data types we want to map a java.util.Date or java.util.Calendar persistent data type to
-   If we do not specify a parameter for @Temporal annotation or omit it altogether, the persistence provider will assume the data type mapping to be TIMESTAMP
-   **XML Mapping**

```xml
<entity-mappings>
    <entity class="Example" access="FIELD">
        <attributes>
            <id name="id"/>
            <basic name="date">
                <temporal>DATE</temporal>
            </basic>
        </attributes>
    </entity>
</entity-mappings>
```

@SecondaryTable
---------------

```sql
create table CUSTOMER_TABLE (
    CUST_ID integer Primary Key Not Null,
    FIRST_NAME varchar(20) not null,
    LAST_NAME varchar(50) not null,
    ADDRESS_ID integer
);

create table ADDRESS_TABLE (
   ADDRESS_ID integer primary key not null,
   STREET varchar(255) not null,
   CITY varchar(255) not null,
   STATE varchar(255) not null
);
```
```java
@Entity @Table(name="CUSTOMER_TABLE")
@SecondaryTable(name="ADDRESS_TABLE", pkJoinColumns=@PrimaryKeyJoinColumn(name="ADDRESS_ID"))
public class Customer {
	@Id @Column(name="CUST_ID") private Integer id;
	@Column(name="FIRST_NAME") private String firstName;
	@Column(name="LAST_NAME") private String lastName;
	@Column(name="STATE", table="ADDRESS_TABLE") private String state;
	@Column(name="CITY", table="ADDRESS_TABLE") private String city;
	@Column(name="STREET", table="ADDRESS_TABLE") private String street;
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <table name="CUSTOMER_TABLE"/>
        <secondary-table name="ADDRESS_TABLE">
            <primary-key-join-column name="ADDRESS_ID"/>
        </secondary-table>
        <attributes>
            <id name="id">
                <column name="CUST_ID"/>
            </id>
            <basic name="firstName"/>
            <basic name="lastName"/>
            <basic name="street">
                <column name="STREET" table="ADDRESS_TABLE"/>
            </basic>
            <basic name="city">
                <column name="CITY" table="ADDRESS_TABLE"/>
            </basic>
            <basic name="state">
                <column name="STATE" table="ADDRESS_TABLE"/>
            </basic>
        </attributes>
    </entity>
</entity-mappings>
```

@Version
--------

```java
@Entity
public class Versioned {
    @Id Integer id;
    @Version Integer version;
}
```
```xml
<entity-mappings>
    <entity class="entity.Versioned" access="FIELD">
        <attributes>
            <id name="id"/>
            <version name="version"/>
        </attributes>
    </entity>
</entity-mappings>
```

-   Only a single Version property or field should be used per class
-   The Version property should be mapped to the primary table for the entity class
-   types are supported for version properties
    -   int and Integer
    -   short and Short
    -   long and Long
    -   java.sql.Timestamp
