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
