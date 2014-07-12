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

* inappropriate use of the `clone()`` method can allow an attacker to exploit vulnerabilities by providing arguments that appear normal but subsequently return unexpected values
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
    * a larger set of concurrency annotations is available from and supported by SureLogic (www.surelogic.com).
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
