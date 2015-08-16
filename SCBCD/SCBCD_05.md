One To One
==========

Unidirectional
--------------

### @JoinColumn

```java
@Entity
public class Customer {
    @OneToOne @JoinColumn(name="ADDRESS_ID")
    Address address;
}

public @interface OneToOne {
    Class targetEntity( ) default void.class;
    CascadeType[] cascade( ) default {};
    FetchType fetch( ) default EAGER;
    boolean optional( ) default true;
    String mappedBy( ) default "";
}

public @interface JoinColumn {
    String name( ) default "";
    String referencedColumnName( ) default "";
    boolean unique( ) default false;
    boolean nullable( ) default true;
    boolean insertable( ) default true;
    boolean updatable( ) default true;
    String columnDefinition( ) default "";
    String table( ) default "";
}

public @interface @JoinColumns {
   JoinColumn[] value( );
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id" />
            <one-to-one name="address" target-entity="Address">
                <join-column name="ADDRESS_ID"/>
            </one-to-one>
        </attributes>
    </entity>
    <entity class="Address" access="FIELD">
        <attributes>
            <id name="id"/>
        </attributes>
    </entity>
</entity-mappings>
```

-   It defines the column in the Customer's table that references the primary key of the ADDRESS table
-   If you are joining on something other than the primary-key column of the ADDRESS table, then you must use the referencedColumnName
    -   **This referencedColumnName must be unique, since this is a one-to-one relationship**

-   use the @JoinColumns annotation if you need to map a one-to-one relationship in which the related entity has multiple foreign-key columns

### @PrimaryKeyJoinColumn

```java
@Entity
public class Customer {
    @OneToOne @PrimaryKeyJoinColumn
    Address address;
}

public @interface PrimaryKeyJoinColumn {
   String name( ) default "";
   String referencedColumnName( ) default "";
   String columnDefinition( ) default "";
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id" />
            <one-to-one name="address" target-entity="Address">
                <primary-key-join-column/>
            </one-to-one>
        </attributes>
    </entity>
    <entity class="Address" access="FIELD">
        <attributes>
            <id name="id"/>
        </attributes>
    </entity>
</entity-mappings>
```

-   **Quando usar: Address possui apenas uma chave: CUSTOMER\_ID.**
-   The name attribute refers to the primary-key column name of the entity the annotation is applied to
-   The referencedColumnName is the column to join to on the related entity
-   If the names of both the primary key and foreign key columns are the same, you may omit the referencedColumnName

Bidirectional
-------------

```java
@Entity
public class CreditCard {
    @Id int id;
    Date expiration;
    String number;
    String name;
    @OneToOne(mappedBy="creditCard") Customer customer;
}

@Entity
public class Customer {
    @OneToOne @JoinColumn(name="CREDIT_CARD_ID") CreditCard creditCard;
    ...
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id" />
            <one-to-one name="creditCard" target-entity="CreditCard">
                <join-column name="CREDIT_CARD_ID"/>
            </one-to-one>
        </attributes>
    </entity>
    <entity class="CreditCard">
        <attributes>
            <id name="id"/>
            <basic name="expiration">
                <temporal>DATE</temporal>
            </basic>
            <one-to-one name="customer" target-entity="Customer" mapped-by="creditCard"/>
        </attributes>
    </entity>
</entity-mappings>
```

OneToMany Unidirectional
========================

```java
public @interface OneToMany {
   Class targetEntity( ) default void.class;
   CascadeType[] cascade( ) default {};
   FetchType fetch( ) default LAZY;
   String mappedBy( ) default "";
}
```

Com Chave Estrangeira
---------------------

```java
@Entity
public class Customer {
    ...
    @OneToMany @JoinColumn(name="CUSTOMER_ID") Collection<Phone> phones = new ArrayList<Phone>( );
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id"/>
            <one-to-many name="phones">
                <join-column name="CUSTOMER_ID"/>
            </one-to-many>
        </attributes>
    </entity>
    <entity class="Phone">
        <attributes>
            <id name="id"/>
        </attributes>
    </entity>
</entity-mappings>
```

-   If you did not use a Generic Collection, then you would have to specify the @OneToMany.targetEntity attribute.

Com JoinTable
-------------

```java
@Entity
public class Customer {
    @OneToMany
    @JoinTable(name="CUSTOMER_PHONE"),
        joinColumns=@JoinColumn(name="CUSTOMER_ID"),
        inverseJoinColumns=@JoinColumn(name="PHONE_ID"))
    Collection<Phone> phones;
}

public @interface JoinTable {
    String name( ) default "";
    String catalog( ) default "";
    String schema( ) default "";
    JoinColumn[] joinColumns( ) default {};
    JoinColumn[] inverseJoinColumns( ) default {};
    UniqueConstraint[] uniqueConstraints( ) default {};
}
```
```xml
<entity-mappings>
    <entity class="Customer" access="FIELD">
        <attributes>
            <id name="id"/>
            <one-to-many name="phones">
                <join-table name="CUSTOMER_PHONE">
                    <join-column name="CUSTOMER_ID"/>
                    <inverse-join-column name="PHONE_ID"/>
                </join-table>
            </one-to-many>
        </attributes>
    </entity>
</entity-mappings>
```

-   The joinColumns attribute should define a foreign key mapping to the primary key of the owning side of the relationship.
-   The inverseJoinColumns attribute maps the nonowning side

ManyToOne Unidirectional
========================

```sql
CREATE TABLE SHIP (
    ID INT PRIMARY KEY NOT NULL,
    NAME CHAR(30),
    TONNAGE DECIMAL (8,2)
)

CREATE TABLE CRUISE (
    ID INT PRIMARY KEY NOT NULL,
    NAME CHAR(30),
    SHIP_ID INT
)
```
```java
@Entity
public class Ship {
    @Id @Column(name="SHIP_ID") Long id;
    String name;
}

@Entity
public class Cruise {
    @Id Long id;
    @ManyToOne @JoinColumn(name="SHIP_ID") Ship ship;
}

public @interface ManyToOne {
    Class targetEntity( default void.class;
    CascadeType[] cascade() default {};
    FetchType fetch() default EAGER;
    boolean optional() default true;
}
```
```xml
<entity-mappings>
    <entity class="Ship" access="FIELD">
        <attributes>
            <id name="id">
                <column name="SHIP_ID"/>
            </id>
            <basic name="name"/>
        </attributes>
    </entity>
    <entity class="Cruise" access="FIELD">
        <attributes>
            <id name="id"/>
            <many-to-one name="ship">
                <join-column name="SHIP_ID"/>
            </many-to-one>
        </attributes>
    </entity>
</entity-mappings>
```

OneToMany Bidirectional
=======================

@OneToMany and @ManyToOne
-------------------------

```java
@Entity
public class Cruise {
    @Id Long id;
    @ManyToOne @JoinColumn(name="SHIP_ID") Ship ship;
}

@Entity
public class Ship {
    @Id Long id;
    String name;
    @OneToMany(mappedBy="ship") Collection<Cruise> cruises;
}
```
```xml
<entity-mappings>
    <entity class="Ship" access="FIELD">
        <attributes>
            <id name="id"/>
            <one-to-many name="cruises" mapped-by="ship" target-entity="Cruise"/>
        </attributes>
    </entity>
    <entity class="Cruise" access="FIELD">
        <attributes>
            <id name="id"/>
            <many-to-one name="ship">
                <join-column name="SHIP_ID"/>
            </many-to-one>
        </attributes>
    </entity>
</entity-mappings>
```

-   The @ManyToOne annotation on the item variable tells the persistence provider that more than one Cruise entity could hold references to the same Ship instance
-   **For bidirectional one-to-many relationships, ManyToOne is always the owning side of the relationship**
    -   the mappedBy element does not exist in the definition of the @ManyToOne annotation

-   In a bidirectional one-to-many relationship, the owner of the relationship is the entity side that stores the foreign key - that is, the many side of the relationship

Many To Many
============

Bidirectional
-------------

@ManyToMany
-----------

```java
@Entity
public class Category {

    @Id @Column(name="id") Long categoryId;
    @ManyToMany
    @JoinTable(joinColumns=@JoinColumn(name="category_id", referencedColumnName="id"),
	    inverseJoinColumns=@JoinColumn(name="item_id", referencedColumnName="id"))
    Set<Item> items;
}

@Entity
public class Item {

    @Id @Column(name="id") Long itemId;
    @ManyToMany(mappedBy="items") Set<Category> categories;
}
```
```xml
<entity-mappings>
    <entity class="Category" access="FIELD">
        <attributes>
            <id name="categoryId">
                <column name="id"/>
            </id>
            <many-to-many name="items">
                <join-table>
                    <join-column name="category_id" referenced-column-name="id"/>
                    <inverse-join-column name="item_id" referenced-column-name="id"/>
                </join-table>
            </many-to-many>
        </attributes>
    </entity>

    <entity class="Item" access="FIELD">
        <attributes>
            <id name="itemId">
                <column name="id"/>
            </id>
            <many-to-many name="categories" mapped-by="items"/>
        </attributes>
    </entity>
</entity-mappings>
```

-   As in the case of one-to-many relationships, the @ManyToMany annotation is missing the optional attribute
-   This is because an empty Set or List implicitly means an optional relationship, meaning that the entity can exist even if no associations do
-   if using the persistence provider's auto schema generation facilities, there is no need to specify a @JoinTable mapping
-   the distinction of the owning side of the relationship is purely arbitrary

Summary
=======

| Element       | @OneToOne | @OneToMany | @ManyToOne | @ManyToMany |
| --------------|-----------|------------|------------|-------------|
| targetEntity  | Yes       | Yes        | Yes        | Yes         |
| cascade       | Yes       | Yes        | Yes        | Yes         |
| fetch         | Yes       | Yes        | Yes        | Yes         |
| optional      | Yes       | No         | Yes        | No          |
| mappedBy      | Yes       | Yes        | No         | Yes         |
