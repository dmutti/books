# Java Coding Guidelines: 75 Recommendations for Reliable and Secure Programs

---

# 1.Security

## 1. Limit the lifetime of sensitive data

* don't use objects to store sensitive data whose contents are not cleared or garbage- collected after use
* don't hold sensitive data in a buffer (such as BufferedReader)
    * it retains copies of the data in the OS cache or in memory
* programs must minimize the lifetime of sensitive data

### Reading a Password

* The Console.readPassword() method allows the password to be returned as a sequence of characters rather than as a String object.
* Consequently, the programmer can clear the password from the array immediately after use

```java
class Password {
    public static void main (String args[]) throws IOException {
        Console c = System.console();
        if (c == null) {
            System.err.println("No console.");
            System.exit(1);
        }
        String username = c.readLine("Enter your user name: ");
        char[] password = c.readPassword("Enter your password: ");
        if (!verify(username, password)) {
            throw new SecurityException("Invalid Credentials");
        }

        // Clear the password
        Arrays.fill(password, ' ');
    }

    // Dummy verify method, always returns true
    private static final boolean verify(String username, char[] password) {
        return true;
    }
}
```

### Reading sensitive data from a file

* The data can be cleared immediately after use and is not cached or buffered in multiple locations.
    * It exists only in the system memory.
* manual clearing of the buffer data is mandatory because direct buffers are not garbage collected

```java
    void readData(){
        ByteBuffer buffer = ByteBuffer.allocateDirect(16 * 1024);
        try (FileChannel rdr = (new FileInputStream("file")).getChannel()) {
            while (rdr.read(buffer) > 0) {
                // Do something with the buffer
                buffer.clear();
            }
        } catch (Throwable e) {
            // Handle error
        }
    }
```

## 2. Do not store unencrypted sensitive information on the client side

* When building an application that uses a client-server model, storing sensitive information, such as user credentials, on the client side may result in its unauthorized disclosure if the client is vulnerable to attack
* For web applications, the most common mitigation to this problem is to provide the client with a cookie and store the sensitive information on the server.
* If a cookie contains sensitive information, that information should be encrypted.

## 3. Provide sensitive mutable classes with unmodifiable wrappers

* Immutability of fields prevents inadvertent modification as well as malicious tampering
    * defensive copying while accepting input or returning values is unnecessary
* some sensitive classes cannot be immutable
    * grant untrusted code read-only access to mutable classes using unmodifiable wrappers

```java

class Mutable {
    private int[] array = new int[10];

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] i) {
        array = i;
    }
}

class MutableProtector extends Mutable {
    @Override
    public int[] getArray() {
        return super.getArray().clone();
    }

    @Override
    public void setArray(int[] i) {
        throw new UnsupportedOperationException();
    }
}
```

## 4. Ensure that security-sensitive methods are called with validated arguments

* Application code that calls security-sensitive methods must validate the arguments being passed to the methods
* `null` values may be interpreted as benign by certain security-sensitive methods but may override default settings
* Security-sensitive methods must be thoroughly understood and their parameters validated to prevent corner cases with unexpected argument values (such as null arguments)
* If unexpected argument values are passed to security-sensitive methods, arbitrary code execution becomes possible, and privilege escalation becomes likely.

## 5. Prevent arbitrary file upload

* Java applications that accept file uploads must ensure that an attacker cannot upload or transfer malicious files
    * an application that permits HTML files to be uploaded could allow mali- cious code to be executed
    * a valid HTML file with a cross-site scripting (XSS) payload that will execute in the absence of an output-escaping routine.
* An application that restricts only the Content-Type field in the HTTP header could be vulnerable to such an attack
* The file upload must succeed only when the content type matches the actual content of the file
    * a file with an image header must contain only an image and must not contain executable code
* solution based on Apache Tika

```java
public class UploadAction extends ActionSupport {

    private File uploadedFile;
    // setter and getter for uploadedFile

    public String execute() {
        try {
            // File path and file name are hardcoded for illustration
            File fileToCreate = new File("filepath", "filename");
            boolean textPlain = checkMetaData(uploadedFile, "text/plain");
            boolean img = checkMetaData(uploadedFile, "image/JPEG");
            boolean textHtml = checkMetaData(uploadedFile, "text/html");
            if (!textPlain || !img || !textHtml) {
                return "ERROR";
            }
            // Copy temporary file content to this file
            FileUtils.copyFile(uploadedFile, fileToCreate);
            return "SUCCESS";
        } catch (Throwable e) {
            addActionError(e.getMessage());
            return "ERROR";
        }
    }

    public static boolean checkMetaData(File f, String getContentType) {
        try (InputStream is = new FileInputStream(f)) {
            ContentHandler contenthandler = new BodyContentHandler();
            Metadata metadata = new Metadata();
            metadata.set(Metadata.RESOURCE_NAME_KEY, f.getName());
            Parser parser = new AutoDetectParser();
            try {
                parser.parse(is, contenthandler, metadata, new ParseContext());
            } catch (SAXException | TikaException e) {
                // Handle error
                return false;
            }
            if (metadata.get(Metadata.CONTENT_TYPE).equalsIgnoreCase( getContentType)) {
                return true;
            } else {
                return false;
            }
        } catch (IOException e) {
            // Handle error
            return false;
        }
    }
}
```

## 6. Properly encode or escape output

* Proper input sanitization can prevent insertion of malicious data into a subsystem such as a database
    * different subsystems require different types of sanitization
* Data sent to an output subsystem may appear to originate from a trusted source
    * it is dangerous to assume that output sanitization is unnecessary
    * data may indirectly originate from an untrusted source and may include malicious content
* Failure to properly sanitize data passed to an output subsystem can allow several types of attacks
* **data should be normalized before sanitizing it for malicious characters**
* This compliant solution defines a ValidateOutput class that normalizes the output to a known character set, performs output sanitization using a whitelist, and encodes any unspecified data values to enforce a double-checking mechanism
    * Output encoding and escaping is mandatory when accepting dangerous characters such as double quotes and angle braces
    * Even when input is whitelisted to disallow such characters, output escaping is recommended because it provides a second level of defense
* preventing XSS attacks (www.owasp.org/index.php/XSS_Prevention_Cheat_Sheet)

```java
public class ValidateOutput {
    // Allows only alphanumeric characters and spaces
    private static final Pattern pattern = Pattern.compile("^[a-zA-Z0-9\\s]{0,20}$");

    // Validates and encodes the input field based on a whitelist
    public String validate(String name, String input) throws ValidationException {
        String canonical = normalize(input);
        if (!pattern.matcher(canonical).matches()) {
            throw new ValidationException("Improper format in " + name + " field");
        }
        // Performs output encoding for nonvalid characters
        canonical = HTMLEntityEncode(canonical);
        return canonical;
    }

    // Normalizes to known instances
    private String normalize(String input) {
        String canonical = java.text.Normalizer.normalize(input, Normalizer.Form.NFKC);
        return canonical;
    }

    // Encodes nonvalid data
    private static String HTMLEntityEncode(String input) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);
            if (Character.isLetterOrDigit(ch) || Character.isWhitespace(ch)) {
                sb.append(ch);
            } else {
                sb.append("&#" + (int)ch + ";");
            }
        }
        return sb.toString(); }
    }
}
```

## 7. Prevent code injection

* occurs when untrusted input is injected into dynamically constructed code.
* Misuse of the `javax.script` API permits an attacker to execute arbitrary code on the target system
* A possible approach is to create a secure sandbox using a security manager
    * The two-argument form of doPrivileged() can be used to lower privileges when the application must operate with higher privileges, but the scripting engine must not

```java
class ACC {
    private static class RestrictedAccessControlContext {
        private static final AccessControlContext INSTANCE;
        static {
            INSTANCE = new AccessControlContext(new ProtectionDomain[] {
                new ProtectionDomain(null, null) // No permissions
            });
        }
    }

    private static void evalScript(final String firstName) throws ScriptException {
        ScriptEngineManager manager = new ScriptEngineManager();
        final ScriptEngine engine = manager.getEngineByName("javascript");
        // Restrict permission using the two-argument // form of doPrivileged()
        try {
            AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {
                public Object run() throws ScriptException {
                    engine.eval("print('" + firstName + "')");
                    return null;
                }
            },
            // From nested class
            RestrictedAccessControlContext.INSTANCE);
        } catch (PrivilegedActionException pae) {
            // Handle error
        }
    }
}
```

## 8. Prevent XPath injection

* occurs when data supplied to an XPath retrieval routine to retrieve data from an XML document is used without proper sanitization
* Treat all user input as untrusted, and perform appropriate sanitization
* When sanitizing user input, verify the correctness of the data type, length, format, and content
* In a client-server application, perform validation at both the client and the server sides
* According to OWASP, the following characters must be removed
    * < > / ' = " to prevent straight parameter injection
    * XPath queries should not contain any meta characters (such as ' = * ? // or similar)
    *

## 10. Do not use the clone() method to copy untrusted method parameters

* inappropriate use of the `clone()` method can allow an attacker to exploit vulnerabilities by providing arguments that appear normal but subsequently return unexpected values
* do not use the `clone()` method of non-final classes to make defensive copies
* The noncompliant code example defines a validateValue() method that validates a time value
    * The `storeDateInDB()` method accepts an untrusted date argument and attempts to make a defensive copy using its `clone()` method
    * This allows an attacker to take control of the program by creating a malicious date class that extends Date

```java
class MaliciousDate extends java.util.Date {
    @Override
    public MaliciousDate clone() {
        // malicious code goes here
    }
}

class Persistence {
    private Boolean validateValue(long time) {
        // Perform validation
        return true; // If the time is valid
    }

    private void storeDateInDB(java.util.Date date) throws SQLException {
        final java.util.Date copy = (java.util.Date) date.clone();
        if (validateValue(copy.getTime())) {
            Connection con = DriverManager.getConnection("jdbc:microsoft:sqlserver://<HOST>:1433", "<UID>", "<PWD>");
            PreparedStatement pstmt = con.prepareStatement("UPDATE ACCESSDB SET TIME = ?");
            pstmt.setLong(1, copy.getTime());
            // ...
        }
    }
}
```

## 12. Do not use insecure or weak cryptographic algorithms

* Security-intensive applications must avoid use of insecure or weak cryptographic primitives.

## 13. Store passwords using a hash function

* An acceptable technique for limiting the exposure of passwords is the use of hash functions
* programs to indirectly compare an input password to the original password string without storing a cleartext or decryptable version of the password
* always append a salt to the password being hashed
    * a unique (often sequential) or randomly generated piece of data that is stored along with the hash value
    * The use of a salt helps prevent brute-force attacks against the hash value
        * provided that the salt is long enough to generate sufficient entropy (shorter salt values cannot significantly slow down a brute-force attack)
* Each password should have its own salt associated with it
    * If a single salt were used for more than one password, two users would be able to see whether their passwords are the same.

```java
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class Password {
    private void setPassword(byte[] pass) throws Exception {
        byte[] salt = generateSalt(12);
        byte[] input = appendArrays(pass, salt);
        MessageDigest msgDigest = MessageDigest.getInstance("SHA-256"); // Encode the string and salt
        byte[] hashVal = msgDigest.digest(input); clearArray(pass);
        clearArray(input);
        saveBytes(salt, "salt.bin");
        // Save the hash value to password.bin
        saveBytes(hashVal,"password.bin");
        clearArray(salt);
        clearArray(hashVal);
    }

    boolean checkPassword(byte[] pass) throws Exception {
        byte[] salt = loadBytes("salt.bin");
        byte[] input = appendArrays(pass, salt);
        MessageDigest msgDigest = MessageDigest.getInstance("SHA-256"); // Encode the string and salt
        byte[] hashVal1 = msgDigest.digest(input);
        clearArray(pass);
        clearArray(input);
        // Load the hash value stored in password.bin
        byte[] hashVal2 = loadBytes("password.bin");
        boolean arraysEqual = Arrays.equals(hashVal1, hashVal2);
        clearArray(hashVal1);
        clearArray(hashVal2);
        return arraysEqual;
    }

    private byte[] generateSalt(int n) {
        // Generate a random byte array of length n
    }

    private byte[] appendArrays(byte[] a, byte[] b) {
        // Return a new array of a[] appended to b[]
    }

    private void clearArray(byte[] a) {
        for (int i = 0; i < a.length; i++) {
            a[i] = 0;
        }
    }
}
```

* In both the `setPassword()` and `checkPassword()` methods, the cleartext representation of the password is erased immediately after it is converted into a hash value.

## 14. Ensure that SecureRandom is properly seeded

* An adversary should not be able to determine the original seed given several samples of random numbers.
    * If this restriction is violated, all future random numbers may be successfully predicted by the adversary
* Prefer the no-argument constructor of SecureRandom that uses the system-specified seed value

##  15. Do not rely on methods that can be overridden by untrusted code

* Untrusted code can misuse APIs provided by trusted code to override methods such as `Object.equals()`, `Object.hashCode()`, and `Thread.run()`
* These are valuable targets because they are commonly used behind the scenes and may interact with components in a way that is not easily discernible
* Compliant solution
    * declare the class final so that its methods cannot be overridden

# 2. Defensive Programming

## 22. Minimize the scope of variables
* Scope minimization
    * helps developers avoid common programming errors
    * improves code readability by connecting the declaration and actual use of a variable
    * improves maintainability because unused variables are more easily detected and removed
    * allow objects to be recovered by the garbage collector more quickly

## 23. Minimize the scope of the `@SuppressWarnings` annotation

* narrow the annotation scope so that only those warnings that occur in the narrower scope are suppressed
* if a class is annotated
    * all unchecked warnings within the class are suppressed
    * which can result in a ClassCastException at runtime

```java
/* Non Compliant Code */
    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        if (a.length < size) {
            // Produces unchecked warning
            return (T[]) Arrays.copyOf(elements, size, a.getClass());
        }
        //...
    }


/* Compliant Code */
    @SuppressWarnings("unchecked")
    T[] result = (T[]) Arrays.copyOf(elements, size, a.getClass());
    return result;
// ...
```

## 24. Minimize the accessibility of classes and their members

* Classes and class members must be given the minimum possible access so that malicious code has the least opportunity to compromise security.
* classes should avoid exposing methods that contain (or invoke) sensitive code through interfaces
    * interfaces allow only publicly accessible methods, and such methods are part of the public application programming interface (API) of the class.
* Methods that perform all necessary security checks and sanitize all inputs may be exposed through interfaces
* Fields of nonfinal public classes should rarely be declared ￼protected
    * untrusted code in another package can subclass the class, and access the member
    * protected members are part of the API of the class, and consequently require continued support
* If a class, interface, method, or field is part of a published API, such as a web service endpoint, it may be declared public

## 25. Document thread-safety and use annotations where applicable

* Two sets of concurrency annotations are freely available and licensed for use in any code
    * four annotations described in Java Concurrency in Practice (http://jcip.net)
    * a larger set of concurrency annotations is available from and supported by SureLogic (http://surelogic.com/promises/).
* The `@ThreadSafe` annotation is applied to a class to indicate that it is thread-safe
    * no sequences of accesses (reads and writes to public fields, calls to public methods) can leave the object in an inconsistent state, regardless of the interleaving of these accesses by the runtime or any external synchronization or coordination on the part of the caller.
    * `@Region` and `@RegionLock` annotations document the locking policy upon which the promise of thread-safety is predicated
* The `@Immutable annotation is applied to immutable classes
    * inherently thread-safe
* The `@NotThreadSafe` annotation is applied to classes that are not thread-safe
* It is important to document all the locks that are being used to protect shared state.
    * JCIP provides the `@GuardedBy` annotation
    * SureLogic provides the `@RegionLock` annotation

## 26. Always provide feedback about the resulting value of a method

* Methods should be designed to return a value that
    * allows the developer to learn about the current state of the object
    * and/or the result of an operation
* Feedback can also be provided by throwing either standard or custom exception objects derived from the Exception class
    * the exception should provide a detailed account of the abnormal condition at the appropriate abstraction level
* A method must not return a value that can hold both valid return data and an error code
    * alternatively, an object can provide a state-testing method that checks whether the object is in a consistent state
    * the object’s state cannot be modified by external threads
* A return value that might be null is an in-band error indicator (a value that can hold both valid return data and an error code)

## 27. Identify files using multiple file attributes

* Attackers frequently exploit file-related vulnerabilities to cause programs to access an unintended file.
    * **Proper file identification is necessary to prevent exploitation**
* File names provide no information regarding the nature of the file object itself
* the binding of a file name to a file object is reevaluated each time the file name is used in an operation
    * This reevaluation can introduce a time-of-check, time-of-use race condition into an application
    * Objects of type java.io.File and of type java.nio.file.Path are bound to underlying file objects by the operating system only when the file is accessed
* files can often be identified by other attributes in addition to the file name
    * by comparing file creation times or modification times
* Noncompliant solution
    * the Java API lacks any guarantee that the `Files.isSameFile()` method actually checks whether the files are the same file
    * from the API, isSameFile() may simply check that the paths to the two files are the same and cannot detect if the file at that path had been replaced by a different file between the two open operations

```java
    /**
        Compliant Solution (POSIX fileKey Attribute)
    */
    public void processFile(String filename) throws IOException{
        // Identify a file by its path
        Path file1 = Paths.get(filename);
        BasicFileAttributes attr1 = Files.readAttributes(file1, BasicFileAttributes.class);
        Object key1 = attr1.fileKey();
        // Open the file for writing
        try (BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(Files.newOutputStream(file1)))) {
            // Write to file
        } catch (IOException e) {
            // Handle error
        }
        // Reopen the file for reading
        Path file2 = Paths.get(filename);
        BasicFileAttributes attr2 = Files.readAttributes(file2, BasicFileAttributes.class);
        Object key2 = attr2.fileKey();
        if ( !key1.equals(key2) ) {
            System.out.println("File tampered with");
            // File was tampered with, handle error
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(Files.newInputStream(file2)))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            // Handle error
        }
    }

    /**
        Compliant Solution (RandomAccessFile)
    */
    public void processFile(String filename) throws IOException{
        // Identify a file by its path
        try (RandomAccessFile file = new RandomAccessFile(filename, "rw")) {
            // Write to file...
            // Go back to beginning and read contents
            file.seek(0);
            String line;
            while ((line = file.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
```

## 28. Do not attach significance to the ordinal associated with an enum

* Java language enumeration types have an `ordinal()` method that returns the numerical position of each enumeration constant in its class declaration
* attaching external significance to the `ordinal()` value of an **enum** constant is error prone and should be avoided for defensive programming

## 30. Enable compile-time type checking of variable arity parameter types

* A variable arity (aka varargs) method is a method that can take a variable number of arguments
* compile-time type checking is ineffective when Object or generic parameter types are used
* Enable strong compile-time type checking of variable arity methods by using the most specific type possible for the method parameter
* Be as specific as possible when declaring parameter types; avoid Object and imprecise generic types in variable arity methods
* Variable arity signatures using Object and imprecise generic types are acceptable when the body of the method lacks both casts and autoboxing, and it also compiles without error

```java
/** Noncompliant Code */
<T> double sum(T... args) {
    // ...
}

/** Compliant Code */
<T extends Number> double sum(T... args) {
    // ...
}

<T> Collection<T> assembleCollection(T... args) {
    return new HashSet<T>(Arrays.asList(args));
}
```

## 31. Do not apply public final to constants whose value might change in later releases

* constants that can change over the lifetime of a program should not be declared public final
* The JLS allows implementations to insert the value of any public final field inline in any compilation unit that reads the field
    * compilation units that read the public final field could still see the old value until they are recompiled
* If the read-only nature of final is required, a better choice is to declare a private static variable and a suitable accessor method to get its value.
* Constants declared using the enum type are permitted to violate this guideline

```java
class Foo {
    private static int version = 1;
    public static final int getVersion() {
        return version;
    }
    // ...
}
```

##  32. Avoid cyclic dependencies between packages

* dependency structure of a package must never contain cycles; that is, it must be representable as a directed acyclic graph
* advantages
    * **Testing and maintainability** - Cyclic dependencies magnify the repercussions of changes or patches to source code
    * **Reusability** - Cyclic dependencies between packages require that the packages be released and upgraded in lockstep
    * **Releases and builds** - Avoiding cycles also helps to steer the development toward an environment that fosters modularization
    * **Deployment** - Avoiding cyclic dependencies between packages reduces coupling between packages
* Cyclic dependencies between packages can result in fragile builds
    * A security vulnerability in a package can easily percolate to other packages

## 33. Prefer user-defined exceptions over more general exception types

* Because an exception is caught by its type, it is better to define exceptions for specific purposes than to use general exception types for multiple purposes
* Throwing general exception types
    * makes code hard to understand and maintain
    * defeats much of the advantage of the Java exception-handling mechanism

## 34. Try to gracefully recover from system errors

* Unchecked exception (java.lang.RuntimeException and java.lang.Error) classes are not subject to compile-time checking
* even when recovery is impossible, the Java Virtual Machine (JVM) allows a graceful exit and a chance to at least log the error
    * made possible by using `try-catch(Throwable)`
    * when code must avoid leaking potentially sensitive information, catching Throwable is permitted
* Where cleanup operations such as releasing system resources can be performed, code should use a `finally` block to release the resources or a try-with-resources statement

```java
public class StackOverflow {
    public static void main(String[] args) {
        try {
            infiniteRun();
        } catch (Throwable t) {
            // Forward to handler

        } finally {
            // Free cache, release resources
        }
        // ...
    }
    private static void infiniteRun() {
        infiniteRun();
    }
}
```

* Forward to handler code must operate correctly in constrained memory conditions because the stack or heap may be nearly exhausted
* Allowing a system error to abruptly terminate a Java program may result in a denial-of-service vulnerability
* In the event of actually running out of memory
    * it is likely that some program data will be in an inconsistent state
    * it might be best to restart the process
    * If an attempt is made to carry on, reducing the number of threads may be an effective workaround
* The methods `Thread.setUncaughtExceptionHandler()` and `ThreadGroup.uncaughtException()` can be used to help deal with an OutOfMemoryError in threads

## 35. Carefully design interfaces before releasing them

* Interface changes resulting from fixes can severely impair the contracts of the implementing classes
    * The client may be prevented from implementing the fix because the new interface may impose additional implementation burden on it.
* If there is a security flaw in a public API, it will persist throughout the lifetime of the API, affecting the security of any application or library that uses it
    * Even after the security flaw is mitigated, applications and libraries may continue using the insecure version until they are also updated.
* An alternative idea is to prefer abstract classes for dealing with constant evolution
    * that comes at the cost of flexibility that interfaces offer
    * One notable pattern is for the provider to distribute an `abstract` skeletal class that implements the evolving interface
    * If a new method is added to the interface, the skeletal class can provide a non-abstract default implementation that the extending class can optionally override
    * this pattern may be insecure because a provider who is unaware of the extending class’s code may choose an implementation that introduces security weaknesses in the client API

## 36. Write garbage collection–friendly code

* a malicious attacker can launch a denial-of-service (DoS) attack against the GC, such as by inducing abnormal heap memory allocation or abnormally prolonged object retention
* use short-lived immutable objects
    * Improved garbage collection algorithms have reduced the cost of garbage collection so that **it is proportional to the number of live objects in the younger generation**, rather than to the number of objects allocated since the last garbage collection.
    * With generational GCs, use of short-lived immutable objects is generally more efficient than use of long-lived mutable objects
    * object pools are an appropriate design choice when the objects represent scarce resources, such as thread pools and database connections
* avoid large objects
    * frequent allocation of large objects of different sizes can cause fragmentation issues or compacting collect operations
* do not explicitly invoke the garbage collector
    * Irresponsible use of this feature can severely degrade system performance by triggering garbage collection at inopportune moments

# 3. Reliability

* **reliability**
    * the ability of a system or component to perform its required functions under stated conditions for a specified period of time
    * the capability of the software product to maintain a specified level of performance when used under specified conditions
* Limitations in reliability are the results of faults in requirements, design, and implementation

## 37. Do not shadow or obscure identifiers in subscopes

* Reuse of identifier names in subscopes leads to obscuration or shadowing
* a variable can obscure a type or a package, and a type can obscure a package name
* Shadowing refers to one variable rendering another variable inaccessible in a containing scope. One type can also shadow another type

## 38. Do not declare more than one variable per declaration

* Declaring multiple variables in a single declaration could cause confusion about the types of variables and their initial values
* do not declare any of the following in a single declaration
    * Variables of different types
    * A mixture of initialized and uninitialized variables

## 39. Use meaningful symbolic constants to represent literal values in program logic

* Java supports the use of various types of literals
    * integers, floating-point numbers, characters, booleans, and strings
* Extensive use of literals in a program can lead to two problems
    * the meaning of the literal is often obscured or unclear from the context
    * changing a frequently used literal requires searching the entire program source for that literal and distinguishing the uses that must be modified from those that should remain unmodified
* Avoid these problems by
    * declaring class variables with meaningfully named constants
    * setting their values to the desired literals
    * and referencing the constants instead of the literals throughout the program
* Constants should be declared as `static final`
    * However, **constants should not be declared public and final if their values might change**

## 40. Properly encode relationships in constant definitions

* The definitions of constant expressions should be related exactly when the values they express are also related.

```java
    /**
        Noncompliant code
        OUT_STR_LEN must always be exactly two greater than IN_STR_LEN
    */
    public static final int IN_STR_LEN = 18;
    public static final int OUT_STR_LEN = 20;

    /**
        Compliant code
        OUT_STR_LEN must always be exactly two greater than IN_STR_LEN
    */
    public static final int IN_STR_LEN = 18;
    public static final int OUT_STR_LEN = IN_STR_LEN + 2;
```

## 41. Return an empty array or collection instead of a null value for methods that return an array or collection

* Some APIs intentionally return a null reference to indicate that instances are unavailable
* This practice can lead to denial-of-service vulnerabilities when the client code fails to explicitly handle the null return value case

## 42. Use exceptions only for exceptional conditions

* Exceptions should be used only to denote exceptional conditions; **they should not be used for ordinary control flow purposes**
* Catching a generic object such as Throwable is likely to catch unexpected errors
* <del>Using a catch clause to handle an exception that occurs in a distant known location is a poor solution; it is preferable to handle the error as soon as it occurs or to prevent it, if possible</del>
* Relying on catching exceptions for control flow also complicates debugging
    * exceptions indicate a jump in control flow from the throw statement to the catch clause
* exceptions need not be highly optimized as it is assumed that they are thrown only in exceptional circumstances
* Throwing and catching an exception frequently has worse performance than handling the error with some other mechanism

## 43. Use a try-with-resources statement to safely handle closeable resources

* `try-with-resources` simplifies correct use of resources that implement the `java.lang.AutoCloseable` interface, including those that implement the `java.io.Closeable` interface
* Using the try-with-resources statement prevents problems that can arise when closing resources with an ordinary try-catch-finally block such as
    * failing to close a resource because an exception is thrown as a result of closing another resource
    * masking an important exception when a resource is closed
* Failing to correctly handle all failure cases when working with closeable resources may result in some resources not being closed or in important exceptions being masked, possibly resulting in a denial of service

```java
    public void processFile(String inPath, String outPath) throws IOException{
        try (BufferedReader br = new BufferedReader(new FileReader(inPath));
             BufferedWriter bw = new BufferedWriter(new FileWriter(outPath));) {
                 // Process the input and produce the output
        } catch (IOException ex) {
            // Print out all exceptions, including suppressed ones
            System.err.println("thrown exception: " + ex.toString());
            Throwable[] suppressed = ex.getSuppressed();
            for (int i = 0; i < suppressed.length; i++) {
                System.err.println("suppressed exception: " + suppressed[i].toString());
            }
        }
    }
```

## 44. Do not use assertions to verify the absence of runtime errors

* Diagnostic tests can be incorporated into programs by using the `assert` statement
* primarily intended for use during debugging, assertions should be used to protect against incorrect programmer assumptions, and not for runtime error checking
* Assertions should never be used to verify the absence of runtime (as opposed to logic) errors, such as
    * Invalid user input
    * File errors
    * Network errors
    * Out-of-memory conditions
    * System resource exhaustion
    * System call errors
    * Invalid permissions
* **Those cannot be implemented as assertions because they must be present in the deployed executable**

## 45. Use the same type for the second and third operands in conditional expressions

* The general form of a Java conditional expression is `operand1 ? operand2 : operand3`
* The JLS rules for determining the result type of a conditional expression are complicated
* The complexity of the rules that determine the result type of a conditional expression can result in unintended type conversions.
    * Consequently, the second and third operands of each conditional expression should have identical types.
    * This recommendation also applies to boxed primitives

## 46. Do not serialize direct handles to system resources

* Serialized objects can be altered outside of any Java program unless they are protected using mechanisms such as sealing and signing
* example
    * an attacker may modify a serialized file handle to refer to an arbitrary file on the system
    * In the absence of a security manager, any operations that use the file handle will be carried out using the attacker-supplied file path and file name

```java
final class Ser implements Serializable {
    transient File f;
    public Ser() throws FileNotFoundException {
        f = new File("c:\\filepath\\filename");
    }
}
```
* The file path is not serialized with the rest of the class, and is consequently not exposed to attackers

## 47. Prefer using iterators over enumerations

* Using Enumeration when performing remove operations on an iterable Collection may cause unexpected program behavior.
* Iterators allow the caller to remove elements from the underlying collection during the iteration with well-defined semantics

```java
class BankOperations {
    private static void removeAccounts(Vector v, String name) {
        Iterator i = v.iterator();
        while (i.hasNext()) {
            String s = (String) i.next();
            if (s.equals(name)) {
                i.remove(); // Correctly removes all instances of the name Harry
            }
        }
        // Display current account holders
        System.out.println("The names are:");
        i = v.iterator();
        while (i.hasNext()) {
            System.out.println(i.next());
            // Prints Dick, Tom only
        }
    }

    public static void main(String args[]) {
        List list = new ArrayList(Arrays.asList(new String[] {"Dick", "Harry", "Harry", "Tom"}));
        Vector v = new Vector(list);
        remove(v, "Harry");
    }
}
```

## 48. Do not use direct buffers for short-lived, infrequently used objects

* The new I/O (NIO) classes in java.nio allow the creation and use of direct buffers
    * increase throughput for repeated I/O activities
* **their creation and reclamation is more expensive** than the creation and reclamation of heap-based non-direct buffers
    * because direct buffers are managed using OS-specific native code!
* direct buffers
    * are a poor choice for single-use or infrequently used cases
    * outside the scope of Java’s garbage collector
    * **can cause memory leaks**
    * frequent allocation of large direct buffers can cause an `OutOfMemoryError`
    * should be allocated only when their use provides a significant gain in performance

```java
    // Use rarelyUsedBuffer once
    ByteBuffer rarelyUsedBuffer = ByteBuffer.allocate(8192);

    // Use heavilyUsedBuffer many times
    ByteBuffer heavilyUsedBuffer = ByteBuffer.allocateDirect(8192);
```

## 49. Remove short-lived objects from long-lived container objects

* Leaving short-lived objects in long-lived container objects may consume memory that cannot be recovered by the garbage collector, leading to memory exhaustion and possible denial of service attacks.
* Always remove short-lived objects from long-lived container objects when the task is over
    * example: objects attached to a `java.nio.channels.SelectionKey` object must be removed when they are no longer needed
    * example: the programmer assigns null to ArrayList elements that have become irrelevant
* When using the Null Object pattern, the null object must be a singleton and must be final
     * the state of the null object should be immutable after creation

# 4. Program Understandability

* the ease with which the program can be understood
* the ability to determine what a program does and how it works by reading its source code and accompanying documentation
* software maintainers are less likely to introduce defects into code that is clear and comprehensible

## 50. Be careful using visually misleading identifiers and literals

* Use visually distinct identifiers that are unlikely to be misread during development and review of code
* Depending on the fonts used, certain characters are visually similar or even identical and can be misinterpreted
* use only ASCII or Latin-1 characters in identifiers

## 51. Avoid ambiguous overloading of variable arity methods

* variable arity (varargs)
    * support methods that accept a variable number of arguments
* use [variable arity methods] sparingly, only when the benefit is truly compelling
* do not overload a varargs method, or it will be difficult for programmers to figure out which overloading gets called

```java
/**
*  Noncompliant Code
*/
class Varargs {
    private static void displayBooleans(boolean... bool) {
        System.out.print("Number of arguments: " + bool.length + ", Contents: ");
        for (boolean b : bool) {
            System.out.print("[" + b + "]");
        }
    }
    private static void displayBooleans(boolean bool1, boolean bool2) {
        System.out.println("Overloaded method invoked");
    }
    public static void main(String[] args) {
        displayBooleans(true, false);
    }
}
```
* **To avoid overloading variable arity methods, use distinct method names to ensure that the intended method is invoked**

## 52. Avoid in-band error indicators

* An in-band error indicator is a value returned by a method that indicates either
    * a legitimate return value or
    * an illegitimate value that denotes an error
* examples
    * A valid object or a null reference
    * An integer indicating a positive value, or −1 to indicate that an error occurred
    * An array of valid objects or a null reference indicating the absence of valid objects
* In-band error indicators **require the caller to check for the error**
    * however, this checking is often overlooked
    * it also has the effect of propagating invalid values that may subsequently be treated as valid in later computations
* the best way to indicate an exceptional situation is by throwing an exception rather than by returning an error code
    * Exceptions are propagated across scopes and cannot be ignored as easily as error codes can
* returning an object that may be null can be acceptable under some circumstances

## 53. Do not perform assignments in conditional expressions

* Using the assignment operator in conditional expressions frequently indicates
    * programmer error
    * and can result in unexpected behavior

```java
public void assignNocontrol(BufferedReader reader) throws IOException {
    String line;
    while ((line = reader.readLine()) != null) {
        // ... Work with line
    }
}
```

## 54. Use braces for the body of an if, for, or while statement

* Use opening and closing braces for if, for, and while statements even when the body contains only a single statement
* Braces improve the uniformity and readability of code

## 55. Do not place a semicolon immediately following an if, for, or while condition

* Placing a semicolon immediately following an if, for, or while condition may result in unexpected behavior.

```java
/**
* Noncompliant Code
*/
if (a == b); {
    /* ... */
}
// The statements in the apparent body of the if statement are always evaluated,
// regardless of the result of the condition expression
```

## 56. Finish every set of statements associated with a case label with a break statement

* Statements that follow each case label must end with a break statement
    * which is responsible for transferring the control to the end of the switch block
* When omitted, the statements in the subsequent case label are executed

## 57. Avoid inadvertent wrapping of loop counters

* a while or for loop may execute forever, or until the counter wraps around and reaches its final value
* use a numerical comparison operator (that is, `<, <=, >, or >=`) to terminate the loop
* Incorrect termination of loops may result in infinite loops, poor performance, incorrect results, and other problems
    * If any of the conditions used to terminate a loop can be influenced by an attacker, these errors can be exploited to cause a denial of service or other attack

```java
/**
* Noncompliant Code
*/
for (i = 1; i <= Integer.MAX_VALUE; i++) {
    // ...
    // this loop will never terminate because i can never be greater than Integer.MAX_VALUE
}
```

## 58. Use parentheses for precedence of operation

* Programmers frequently make errors regarding the precedence of operators because of the unintuitive low precedence levels of `&, |, ^, <<, and >>`
* Avoid mistakes regarding precedence through the suitable use of parentheses, which also improves code readability

## 59. Do not make assumptions about file creation

* Although creating a file is usually accomplished with a single method call, this single action raises multiple security-related questions
    * What should be done if the file can- not be created?
    * What should be done if the file already exists?
    * What should be the file’s initial attributes, such as permissions?

```java
public void createFile(String filename) throws FileNotFoundException {
    try (OutputStream out = new BufferedOutputStream(
        Files.newOutputStream(Paths.get(filename), StandardOpenOption.CREATE_NEW))) {
            // Work with out
    } catch (IOException x) {
            // File not writable...Handle error
    }
}
// This solution uses the java.nio.file.Files.newOutputStream()
// method to atomically create the file,
// and throw an exception if the file already exists
```

## 60. Convert integers to floating-point for floating-point operations
