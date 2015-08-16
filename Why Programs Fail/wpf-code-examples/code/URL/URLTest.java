import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import java.net.URL;

public class URLTest extends TestCase {

    private URL askigor_url;

    // Create new test
    public URLTest(String name) {
        super(name);
    }

    // Assign a name to this test case
    public String toString() {
        return getName();
    }

    // Setup environment
    // will be called before any testXXX() method
    protected void setUp() throws java.net.MalformedURLException {
        askigor_url = new URL("http://www.askigor.org/status.php?id=sample");
    }

    // Release environment
    protected void tearDown() {
        askigor_url = null;
    }

    // Test for protocol (http, ftp, etc.)
    public void testProtocol() {
        assertEquals(askigor_url.getProtocol(), "http");
    }

    // Test for host
    public void testHost() {
        int noPort = -1;
        assertEquals(askigor_url.getHost(), "www.askigor.org");
        assertEquals(askigor_url.getPort(), noPort);
    }

    // Test for path
    public void testPath() {
        assertEquals(askigor_url.getPath(), "/status.php");
    }

    // Test for query part
    public void testQuery() {
        assertEquals(askigor_url.getQuery(), "id=sample");
    }

    // Set up a suite of tests
    public static TestSuite suite() {
        TestSuite suite = new TestSuite(URLTest.class);
        return suite;
    }

    // Main method: Invokes GUI
    public static void main(String args[]) {
        String[] testCaseName = 
            { URLTest.class.getName() };
        // junit.textui.TestRunner.main(testCaseName);
        junit.swingui.TestRunner.main(testCaseName);
        // junit.awtui.TestRunner.main(testCaseName);
    }
}
