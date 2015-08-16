Entity Inheritance
==================

```java
package javax.persistence;
@Target(TYPE) @Retention(RUNTIME)
public @interface Inheritance {
    InheritanceType strategy( ) default SINGLE_TABLE;
}

public enum InheritanceType {
    SINGLE_TABLE, JOINED, TABLE_PER_CLASS
}
```

Single Table per Class Hierarchy
--------------------------------

```java
@Entity
@Table(name="pessoa")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo", discriminatorType=DiscriminatorType.CHAR)
public class Pessoa {
    @Id String documento;
}

@Entity
@DiscriminatorValue("J")
public class PessoaJuridica extends Pessoa {
}

@Entity
@DiscriminatorValue("F")
public class PessoaFisica extends Pessoa {
}
```
```xml
<entity-mappings>
    <entity class="Pessoa" access="FIELD">
        <table name="pessoa"/>
        <inheritance strategy="SINGLE_TABLE"/>
        <discriminator-column discriminator-type="STRING" name="tipo" length="2"/>
        <attributes>
            <id name="documento"/>
        </attributes>
    </entity>
    <entity class="PessoaFisica">
        <discriminator-value>PF</discriminator-value>
    </entity>
    <entity class="PessoaJuridica">
        <discriminator-value>PJ</discriminator-value>
    </entity>
</entity-mappings>
```

-   one database table represents every class of a given hierarchy
-   If you don't specify a discriminator value for a subclass, the value is assumed to be the name of the subclass ("PessoaFisica","PessoaJuridica")
-   Single table is the default inheritance strategy
-   problem \#1 - **all columns of subclass properties must be nullable**
-   problem \#2 - because subclass property columns may be unused, the SINGLE\_TABLE strategy is not normalized

Joined-tables Strategy (Table per Subclass)
-------------------------------------------

```java
@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@Table(name="pessoa")
@DiscriminatorColumn(name="tipo")
public class Pessoa {
    @Id String doc;
    @Embedded Endereco endereco;
}
@Entity
public class PessoaFisica extends Pessoa {
    String rg;
}
@Embeddable
public class Endereco {
    String rua;
    int numero;
    String bairro;
    String estado;
}
```
```xml
<entity-mappings>
    <entity class="Pessoa" access="FIELD">
        <inheritance strategy="JOINED"/>
        <discriminator-column name="tipo"/>
        <attributes>
            <id name="doc"/>
            <embedded name="endereco"/>
        </attributes>
    </entity>
    <entity class="PessoaFisica">
        <attributes>
            <basic name="rg"/>
        </attributes>
    </entity>
    <embeddable class="Endereco">
        <attributes>
            <basic name="rua"/>
            <basic name="numero"/>
            <basic name="bairro"/>
            <basic name="estado"/>
        </attributes>
    </embeddable>
</entity-mappings>
```

-   In the joined-tables strategy, the parent of the hierarchy contains only columns common to its children
-   The discriminator column is still used, primarily as a way of easily differentiating data types in the hierarchy

Table per Concrete Class Strategy
---------------------------------

-   **implementing this strategy has been made optional for the provider by the EJB 3 specification.**
-   primary keys in all tables must be mutually exclusive for this scheme to work

```java
@Entity
@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS)
public class Pessoa {
}

@Entity
public class PessoaFisica extends Pessoa {
}

@Entity
public class Cliente extends PessoaFisica {
}
```
```xml
<entity-mappings>
    <entity class="Pessoa" access="FIELD">
        <inheritance strategy="TABLE_PER_CLASS"/>
        <attributes>
            <id name="doc"/>
        </attributes>
    </entity>
    <entity class="PessoaFisica"/>
    <entity class="Cliente"/>
</entity-mappings>
```

Nonentity Base Classes
----------------------

-   JPA allows an entity to inherit from a nonentity class
-   **a mapped superclass does not have an associated table**

```java
@MappedSuperclass
public class Pessoa {
    @Id String doc;
    @Temporal(TemporalType.DATE) Date nascimento;
}

@Entity
public class Cliente extends Pessoa {
    String nome;
}
```

```xml
<entity-mappings>
    <mapped-superclass class="Pessoa" access="FIELD">
        <attributes>
            <id name="doc"/>
            <basic name="nascimento">
                <temporal>DATE</temporal>
            </basic>
        </attributes>
    </mapped-superclass>
    <entity class="Cliente" access="FIELD">
        <attributes>
            <basic name="nome"/>
        </attributes>
    </entity>
</entity-mappings>
```
