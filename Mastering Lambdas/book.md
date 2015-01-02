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

  public class TranslateByOne implements Consumer<Point> {
    @Override
    public void accept(Point t) {
      t.translate(1, 1);
    }
  }

  public static void main(String[] args) {
    List<Point> pointList = Arrays.asList(new Point(1,2), new Point(3,4));
    pointList.forEach(new TranslateByOne());
  }
```
