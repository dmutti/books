Backward compatibility and interoperability with EJB 2
======================================================

Packaging EJB 2 and EJB 3 together
----------------------------------

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ejb-jar version="3.0">
...
</ejb-jar>
`

-   If you specify a version other than 3.0 (e.g., 2.1), then the EJB container will assume the EJB module is an older version and won't scan for annotations
    -   won't detect EJB 3 beans
    -   won't detect the persistence unit containing entities packaged in the EJB module
-   Make sure that version is either set to 3.0 or not specified at all

Invoking EJB 2 from EJB 3
-------------------------

```java
@Stateful
public PlaceOrderBean implements PlaceOrder {
    @EJB public ChargeCreditHome creditHome; /** Home Interface */

    void chargeCreditCard(){
        /** Remote Interface */
        ChargeCredit chargeCredit = creditHome.create();
        String confirmationNo = chargeCredit.add(billingInfo, amount);
    }
}
```

```xml
<?xml version="1.0"?>
<ejb-jar version="3.0">
    <enterprise-beans>
        <session>
            <ejb-name>ServiceBean</ejb-name>
            <business-local>bean.Service</business-local>
            <ejb-class>bean.ServiceBean</ejb-class>
            <session-type>Stateless</session-type>
            <!-- Só precisa se não injetar com @EJB -->
            <ejb-local-ref>
                <ejb-ref-name>AdviceBean</ejb-ref-name>
                <ejb-ref-type>Session</ejb-ref-type>
                <local-home>oldschool.AdviceHome</local-home>
                <local>oldschool.AdviceLocal</local>
                <injection-target>
                    <injection-target-class>bean.ServiceBean</injection-target-class>
                    <injection-target-name>adviceHome</injection-target-name>
                </injection-target>
            </ejb-local-ref>
            <!-- Só precisa se não injetar com @EJB -->
        </session>
        <session>
            <ejb-name>AdviceBean</ejb-name>
            <local-home>oldschool.AdviceHome</local-home>
            <local>oldschool.Advice</local>
            <business-local>oldschool.AdviceBusiness</business-local>
            <ejb-class>oldschool.AdviceBean</ejb-class>
            <session-type>Stateless</session-type>
        </session>
</ejb-jar>
```

Using EJB 3 from EJB 2
----------------------

```java
public class AdviceBean implements SessionBean, AdviceBusiness {
    public String getAdvice() {
        Service svc = (Service) new InitialContext().lookup("java:comp/env/ServiceBean");
        return svc.foo();
    }
}
```

```xml
<?xml version="1.0"?>
<ejb-jar version="3.0">
    <enterprise-beans>
        <session>
            <ejb-name>ServiceBean</ejb-name>
            <business-local>bean.Service</business-local>
            <ejb-class>bean.ServiceBean</ejb-class>
            <session-type>Stateless</session-type>
        </session>
        <session>
            <ejb-name>AdviceBean</ejb-name>
            <local-home>oldschool.AdviceHome</local-home>
            <local>oldschool.Advice</local>
            <business-local>oldschool.AdviceBusiness</business-local>
            <ejb-class>oldschool.AdviceBean</ejb-class>
            <session-type>Stateless</session-type>
            <ejb-local-ref>
                <ejb-ref-name>ServiceBean</ejb-ref-name>
                <ejb-ref-type>Session</ejb-ref-type>
                <local>bean.Service</local>
            </ejb-local-ref>
        </session>
</ejb-jar>
```

-   the ejb-local-ref element does not have a local-home element

Using EntityManager from EJB 2
------------------------------

```java
public class AdviceBean implements SessionBean, AdviceBusiness {
    @Override
    public String getAdvice() {
        EntityManager em = (EntityManager) new InitialContext().lookup("java:comp/env/AdviceEntityManager");
        return String.valueOf(em.isOpen());
    }
}
```

```xml
<?xml version="1.0"?>
<ejb-jar version="3.0">
    <enterprise-beans>
        <session>
            <ejb-name>AdviceBean</ejb-name>
            <local-home>oldschool.AdviceHome</local-home>
            <local>oldschool.Advice</local>
            <business-local>oldschool.AdviceBusiness</business-local>
            <ejb-class>oldschool.AdviceBean</ejb-class>
            <session-type>Stateless</session-type>
            <persistence-context-ref>
                <persistence-context-ref-name>AdviceEntityManager</persistence-context-ref-name>
                <persistence-unit-name>pu</persistence-unit-name>
            </persistence-context-ref>
        </session>
    </enterprise-beans>
</ejb-jar>
```

-   The only special thing you would have to do is
    -   package a persistence.xml that describes the persistence unit
    -   set version="3.0" in the ejb-jar.xml

Migrating session beans
-----------------------

-   If you decide to use a deployment descriptor instead of annotationsyou must remove the home or local-home element and not have a home interface
-   otherwise, your EJB module will fail to deploy

Maintaining backward compatibility with EJB 2 clients
-----------------------------------------------------

```java
import javax.rmi.RemoteException;
import javax.ejb.*;
public interface PlaceBidHome extends EJBHome {
    public PlaceBid create() throws CreateException, RemoteException;
}

@Stateless(name="PlaceBid") @RemoteHome(PlaceBidHome.class)
public class PlaceBidBean implements PlaceBid {
}
```

-   Client applications of EJB 2 session beans use the create method on the home interface to create an EJB object instance.
    1.  add a home interface and expose a create method in the home interface
    2.  Then use the @RemoteHome annotation on the bean class to mark this as a remote home interface
-   If you want to maintain backward compatibility with local EJB 2 clients, then you can use the @LocalHome annotation
    -   remember that it's **only** possible to use @javax.ejb.LocalHome and @javax.ejb.RemoteHome annotations in the bean classes.
