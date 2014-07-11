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
