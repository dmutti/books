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
    private static final boolean verify(String username, char[] password) { return true;
    }
  }
```

### Reading sensitive data from a file

```java
  void readData(){
    ByteBuffer buffer = ByteBuffer.allocateDirect(16 * 1024); try (FileChannel rdr = (new FileInputStream("file")).getChannel()) {
      while (rdr.read(buffer) > 0) {
        // Do something with the buffer
        buffer.clear();
      }
    } catch (Throwable e) {
      // Handle error
    }
  }
```
