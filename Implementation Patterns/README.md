A Theory Of Programming
-----------------------

-   Simplicidade
    -   The best programs offer many options for future extension, contain no extraneous elements, and are easy to read and understand.
    -   Three values that are consistent with excellence in programming are communication, simplicity, and flexibility. While these three sometimes conflict, more often they complement each other.
    -   Code communicates well when a reader can understand it, modify it, or use it.
    -   It is this excess complexity that removes value from software, both by making the software less likely to run correctly and more difficult to change successfully in the future.
    -   Format code so no code can be deleted without losing information.

-   Flexibilidade
    -   flexibility is the justification used for the most ineffective coding and design practices. Programs should be flexible, but only in ways they change.
    -   flexibility of simplicity and extensive tests is more effective than the flexibility offered by speculative design
    -   Choose patterns that encourage flexibility and bring immediate benefits. For patterns with immediate costs and only deferred benefits, often patience is the best strategy.
    -   Enhancing the communicability of software also adds to flexibility. The more people who can quickly read, understand, and modify the code, the more options your organization has for future change.

-   Princípios
    -   Structure the code so changes have local consequences
    -   Parallel class hierarchies are also repetitive, and break the principle of local consequences.

-   Logic and Data Together
    -   Another principle corollary to the principle of local consequences is keeping logic and data together. Put logic and the data it operates on near each other, in the same method if possible, or the same object, or at least the same package. To make a change, the logic and data are likely to have to change at the same time. If they are together, then the consequences of changing them will remain local.

-   Motivation
    -   The premature attempts to make the code general enough to meet future needs often interfere with the unanticipated changes that turn out to be necessary.

-   The immediate benefits of clear code are fewer defects, easier sharing of code, and smoother development.

Classes
-------

-   Class—Use a class to say, "This data goes together and this logic goes with it."
-   Value Object—Write an object that acts like a mathematical value.
-   Library Class—Represent a bundle of functionality that doesn’t fit into any object as a set of static methods.
-   Organizing classes into hierarchies is a form of compression that leaves the code more difficult to read. You have to understand the context of the superclass to be able to understand the subclass.
-   A class should do something significant. Reducing the number of classes in a system is an improvement, as long as the remaining classes do not become bloated.
    -   Look for one-word names for important classes.

-   Abstract Interface
    -   Maximizing the number of interfaces doesn’t minimize the cost of software.
    -   combine speculating about where to introduce interfaces with adding them when flexibility is required.]

-   requirements change in unpredictable ways and technology changes in unpredictable ways. This doesn’t relieve us from the responsibility to do our best to develop the system customers need right now, but it suggests that there are limits to the value of “future-proofing” software through speculation.
-   the time to introduce flexibility is when it is definitely needed

-   Limitações da Herança
    -   it’s a card you can only play once
    -   you have to understand the superclass before you can understand the subclass. As the superclasses become more complicated this becomes more of a limitation.
    -   changes to a superclass are risky, since subclasses can rely on subtle properties of the superclass's implementation.
    -   it cannot be used to express changing logic. The variation you want must be known when you create an object and can’t be changed thereafter. You’ll need to use conditionals or delegation to express logic that changes.

-   One key to achieving useful subclasses is to thoroughly factor the logic in the superclass into methods that do one job.
-   When writing a subclass, you should be able to override exactly one method. If the superclass methods are too big, you’ll have to copy code and edit it

Métodos
-------

-   Method Object
    -   The code in the new class is easy to refactor.
    -   To create a method object, look for a long method with lots of parameters and temporary variables.

1.  Create a class named after the method.
2.  Create a field in the new class for each parameter, local variable, and field used in the method. Give these fields the same names as they have in the original method (you can fix names later).
3.  Create a constructor that takes as parameters the method parameters of the original method and the fields of the original object used by the method.
4.  Copy the method into a new method in the new class. The parameters, locals, and fields used in the old method become field references in the new object.
5.  Replace the body of the original method with code that creates an instance of the new class and invokes the method.
6.  Make sure the refactored code works just like the old code did.

-   Superclass methods that are too large create a dilemma: copy code down to the subclass and edit it or find another way to express the variation? The problem with copying is that someone can come along later and change the superclass code you’ve copied, breaking your code without you (or them) knowing it.

-   Overloaded methods should all serve the same purpose, with the variation only in the parameter types. Different return types for different overloaded methods make reading the code too difficult. Better to find a new name for the new intention.

-   Many comments are completely redundant in code written to communicate. The cost of writing them and maintaining their consistency with the code is not worth the value they bring.

-   Constructors commit clients to a concrete class. If you want to make your code more abstract, introduce a factory method.
    -   Even if you have a factory method, provide a complete constructor beneath it so curious readers can quickly understand what parameters are needed to create an object.
    -   When implementing a complete constructor, funnel all the constructors to a single master constructor that does all the initialization. This ensures that all the variant constructors will create objects that satisfy all invariants required for proper operation and communicates those invariants to future modifiers of the class.

-   providing a getting method for the collection gives maximum flexibility but creates a variety of problems.
    -   One alternative is to wrap the collection in an unmodifiable collection before returning it. An exception is thrown if anyone tries to modify the wrapped collection. Debugging such an error, is expensive.
    -   offer methods that provide limited, meaningful access to the information in the collection.
    -   provide a method that returns an iterator

-   Using a setting method as part of the interface lets the implementation leak out: paragraph.setJustification(Paragraph.CENTERED);
    -   Naming the interface after the purpose of the method helps the code speak: paragraph.centered();

Collections
-----------

-   Collections are important because they are a way of expressing the variation of number.
    -   Variation in logic is expressed with conditionals or polymorphic messages.
    -   Variation in the cardinality of data is expressed by putting the data into a collection.

-   it is best to pick a simple implementation to begin with and then tune based on experience.

-   ArrayList
    -   Potential performance problem with contains(Object) and other operations that rely on it like remove(Object). Time proportional to the size of the collection.
    -   consider replacing your ArrayList with a HashSet (não suporta elementos duplicados).
    -   ArrayList is fast at accessing elements and slow at adding and removing elements
    -   LinkedList is slow at accessing elements and fast at adding and removing elements

-   If you have a single element and you need to pass it to an interface that expects a collection, you can quickly convert it by calling Collections.singleton()
    -   para retornar List, Collections.singletonList()
    -   para retornar Map, Collections.singletonMap(chave, valor)
    -   para retornar List vazia, Collections.emptyList()
