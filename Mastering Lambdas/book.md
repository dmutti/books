# Taking Java to the Next Level

## From External to Internal Iteration

```java
List<Point> pointList = Arrays.asList(new Point(1,2), new Point(2,3));
Iterator pointItr = pointList.iterator();
while (pointItr.hasNext()) {
    ((Point) pointItr.next()).translate(1,1);
}
```

*  When the Java Collections Framework was designed in 1998, it seemed perfectly reasonable to dictate the access order of list elements in this way
* **What has changed since then?**
    * Part of the answer lies in how hardware has been evolving.
    * Since it wasn’t possible to offer a 6 GHz core, the chip vendors instead began to offer dual-core processors, each core running at 3 GHz
    * Adaptation would mean providing developers with an accessible way of making use of the processing power of multiple cores by distributing tasks over them to be executed in parallel.
* The need for change is shown by the code at the start of this section, which could only access list elements one at a time in the order dictated by the iterator.
* We ought to be able to tell collections what should be done to each element they contain, rather than specifying how, as external iteration does
* The change from external to internal iteration may seem a small one, simply a matter of moving the work of iteration across the client-library boundary.
    * The parallelization work that we require can now be defined in the collection class instead of repeatedly in every client method that must iterate over the collection.
    * Moreover, the implementation is free to use additional techniques such as laziness and out-of-order execution
* Argument of `forEach()`

```java
public interface java.util.function.Consumer<T> {
    void accept(T t);
}

public static void main(String[] args) {
    List<Point> pointList = Arrays.asList(new Point(1,2), new Point(3,4));
    pointList.forEach(new Consumer<Point>() {
        public void accept(Point t) {
            t.translate(1, 1);
        }
    });
}
```

### Lambda Expressions

```java
List<Point> pointList = Arrays.asList(new Point(1,2), new Point(3,4));
pointList.forEach(p -> p.translate(1, 1));
```

* If you are unused to reading lambda expressions, you may find it helpful for the moment to continue to think of them as an abbreviation for a method declaration
    * mentally mapping the parameter list of the lambda to that of the imaginary method
    * and its body (often preceded by an added return) to the method body

## From Collections to Streams

* In real-life programs, it’s common to process collections in a number of stages
    * a collection is iteratively processed to produce a new collection, which in turn is iteratively processed, and so on.

```java
/* Apply a transformation to each one of a collection of Integer instances to produce a Point,
then find the greatest distance of any of these Points from the origin. */
List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5);
List<Point> pointList = new ArrayList<>();
for (Integer i : intList) {
    pointList.add(new Point(i % 3, i / 1));
}
double maxDistance = Double.MIN_VALUE;
for (Point p : pointList) {
    maxDistance = Math.max(p.distance(0, 0), maxDistance);
}
```

* Streams differ from collections in that
    * they provide an (optionally) ordered sequence of values without providing any storage for those values;
    * they are "data in motion", **a means for expressing bulk data operations**.
* In the Java 8 collections API, streams are represented by interfaces -- `Stream` for reference values, and `IntStream`, `LongStream`, and `DoubleStream` for streams of primitive values -- in the package `java.util.stream`.
* an intermediate operation, called `map` transforms each stream element using a systematic rule
    * an intermediate operation is one that is not only defined on a stream, but that also returns a stream as its output
* Terminal operations consume a stream, optionally returning a single value, or -- if the stream is empty -- nothing, represented by an empty `Optional` or one of its specializations.
* The values flowing into streams can be supplied by a variety of sources -- collections, arrays, or generating functions.
    * In practice, a common use case will be feeding the contents of a collection into a stream

```java
java.util.List<Integer> intList = java.util.Arrays.asList(1, 2, 3, 4, 5);
java.util.OptionalDouble maxDistance = intList.stream()
    .map(i -> new java.awt.Point(i % 3, i / 1))
    .mapToDouble(p -> p.distance(0, 0))
    .max();
```

* The performance overhead of creating and managing intermediate collections has disappeared;
  * executed sequentially, the stream code is more than twice as fast as the loop version
  * executed in parallel, virtually perfect speedup is achieved on large data sets

## From Sequential to Parallel

* The Java fork/join framework uses the **recursive decomposition** pattern, allocating threads from its pool to new subtasks rather than creating new ones
    * from Java 8 onward, the collections library classes will be able to use the fork/join framework in this way, so that client developers can put parallelization

```java
List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5);
OptionalDouble maxDistance = intList.parallelStream()
    .map(i -> new Point(i % 3, i / 1))
    .mapToDouble(p -> p.distance(0, 0))
    .max();
```

* Parallel execution is achieved by
    * breaking the initial list of Integer values down recursively until the sublists are small enough
    * then executing the entire pipeline serially
    * and finally combining the results with max
* **The process for deciding what is "small enough" takes into account the number of cores available and, sometimes, characteristics of the list**

## Composing Behaviors

* Lambda expressions look like functions, so it’s natural to ask whether we can make them behave like functions
    * That change of perspective will encourage us to think about working with behaviors rather than objects
* Suppose, for example, that we want to sort a list of Point instances in order of their x coordinate


```java
//The standard Java idiom for a "custom" sort 4 is to create a Comparator
Comparator<Point> byX = new Comparator<Point>() {
    public int compare(Point o1, Point o2) {
        return Double.compare(o1.getX(), o2.getX());
    }
};

//Substituting a lambda expression for the anonymous inner class declaration, improves the readability of the code
Comparator<Point> byX = (p1, p2) -> Double.compare(p1.getX(), p2.getX());
```

* Comparator is actually carrying out two functions -- extracting sort keys from its arguments and then comparing those keys

```java
Function<Point, Double> keyExtractor = p -> p.getX();
Comparator<Double> keyComparer = (d1, d2) -> Double.compare(d1, d2);

Comparator<Point> compareByX = (p1, p2) ->
    keyComparer.compare(keyExtractor.apply(p1), keyExtractor.apply(p2));
```

* in the special but very common case where keyComparer expresses the natural ordering on the extracted keys; it then can be rewritten as

```java
Comparator<Point> compareByX = (p1, p2) ->
    keyExtractor.apply(p1).compareTo(keyExtractor.apply(p2));
```

* noticing the importance of this special case, the platform library designers added a static method comparing to the interface Comparator:
    * given a key extractor, it creates the corresponding Comparator using natural ordering on the keys
    * `Comparator<Point> compareByX = Comparator.comparing(p -> p.getX());`

```java
import static java.util.Comparator.comparing;
import java.awt.Point;
import java.util.Arrays;
import java.util.List;

public class ComparatorExample1 {

    public static void main(String[] args) {
        List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5);
        intList.stream()
        .map(i -> new Point(i % 3, i / 1))
        .sorted(comparing(p -> p.distance(0,0)))
        .forEach(p -> System.out.printf("(%f, %f)", p.getX(), p.getY()));
    }
}
```

# The Basics of Java Lambda Expressions

## What Is a Lambda Expression?

* a lambda expression is a function: for some or all combinations of input values it specifies an output value
* Until now, there has been no way to write a freestanding function in Java
    * Methods have often been used to stand in for functions, but always as part of an object or a class
    * Lambda expressions now provide a closer approach to the idea of freestanding functions
* A lambda expression in Java consists of a parameter list separated from a body by a function arrow: `->`
* Except for lambdas that have a single parameter, parameter lists must be surrounded by parentheses

```java
p -> p.translate(1,1);
(x,y) -> x + y;
() -> 23;
```

* If you supply any types explicitly, you must supply all of them, and the parameter list must be enclosed in parentheses
    * `Comparator<Point> byX = comparing((Point p) -> p.distance(0,0));`
    * explicitly typed parameters can be modified in the same way as method parameters;  they can be declared final and annotated
* The rules for using or omitting `return` in a lambda block body are the same as those for an ordinary method body
    * `return` is required whenever an expression within the body is to return a value, or can instead be used without an argument to terminate execution of the body immediately
    * If the lambda returns void, then `return` may be omitted or used without an argument;
* **Lambda expressions are neither required nor allowed to use a throws clause to declare the exceptions they might throw**

## Lambdas vs. Anonymous Inner Classes
