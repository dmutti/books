# Getting Started

## How Node Applications Work

* Node.js couples JavaScript with an event loop for quickly dispatching operations when events occur.
* Node's philosophy is to give you low-level access to the event loop and to system resources.

![The Node.js event loop](The_Right_Way_fig_3.png "The Node.js event loop")

* As long as there's something left to do, Node's event loop will keep spinning. Whenever an event occurs, Node invokes any callbacks (event handlers) that are listening for that event.
* **Any number of callbacks can respond to any event, but only one callback function will ever be executing at any time.**
    * Your application code will never be executed at the same time as anything else. It will always have the full attention of Node's JavaScript engine while it's running.
    * Node is a single-threaded environment. At most, only one line of your code will ever be executing at any time.


# Wrangling the File System

### Watching a File for Changes

**file-system/watcher.js**

```js
//sets up a variable with a constant value.
//The require() function pulls in a Node module and returns it.
const fs = require('fs');

fs.watch('./target.txt', function() {
    console.log("File 'target.txt' just changed!")
});
console.log("Now watching target.txt for changes...");
```

* Launch the watcher program using node, like so: `$ node --harmony watcher.js`

### Reading Command-Line Arguments

* This program uses `process.argv` to access the incoming command-line arguments.
`argv` stands for argument vector; it's an array containing node and the full path to the `watcher-argv.js` as its first two elements.
The third element (that is, at index 2) is target.txt, the name of our target file.
* Any unhandled exception thrown in Node will halt the process. The exception output shows the offending file, and the line number and position of the exception.

```js
const
    fs = require('fs'),
    filename = process.argv[2];

if (!filename) {
    throw Error("A file to watch must be specified!")
}

fs.watch(filename, function() {
    console.log("File [" + filename + "] just changed!")
});
console.log("Now watching [" + filename + "] for changes...");
```

## Spawning a Child Process

```js
"use strict"
const
    fs = require('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2];

if (!filename) {
    throw Error('A file to watch must be specified')
}

fs.watch(filename, function() {
    let ls = spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});
console.log("Now watching " + filename + " for changes...");
```

* Strict mode was introduced in ECMAScript version 5
    * it disables certain problematic JavaScript language features and makes others throw exceptions.
    * Generally speaking, it's a good idea to use strict mode.

* Strict mode is also required to use certain ECMAScript Harmony features in Node,
* `let` declares a variable, but a variable declared with `let` can be assigned a value more than once.
* by using Harmony features (like `let`), your code will require the `--harmony` flag until these features become enabled by default.
* The first parameter to `spawn()` is the name of the program we wish to execute
    * The second parameter is an array of command-line arguments. It contains the flags and the target file name.
    * The object returned by `spawn()` is a [ChildProcess]("http://nodejs.org/api/child_process.html"). Its stdin, stdout, and stderr properties are Streams that can be used to read or write data.
    * the `pipe()` method sends the standard output from the child process directly to our own standard output stream.

## Capturing Data from an EventEmitter

* [EventEmitter]("http://nodejs.org/api/events.html") provides a channel for events to be dispatched and listeners notified.
    * Many objects -- like Streams -- inherit from EventEmitter
* let's modify our previous program to capture the child process's output by listening for events on the stream

```js
"use strict"
const
    fs = require('fs'),
    spawn = require('child_process').spawn,
    filename = process.argv[2];

if (!filename) {
    throw Error('A file to watch must be specified')
}

fs.watch(filename, function() {
    let
        ls = spawn('ls', ['-lh', filename]),
        output = '';
        ls.stdout.on('data', function(chunk) {
            output += chunk.toString();
        });

        ls.on('close', function() {
            let parts = output.split(/\s+/);
            console.dir([parts[0], parts[4], parts[8]]);
        })
});
console.log("Now watching " + filename + " for changes...");
```

* The `on()` method adds a listener for the specified event type.
    * **We listen for data events because we're interested in data coming out of the stream.**
    * Events can send along extra information, which arrives in the form of parameters to the callbacks.
    * Data events in particular pass along a [buffer]("http://nodejs.org/api/buffer.html") object.

## Reading and Writing Files Asynchronously

* two common error-handling patterns in Node
    * error events on EventEmitters
    * and err callback arguments

**file-system/read-simple.js**
`$ node --harmony read-simple.js`

```js
//whole-file-at-once approach
const fs = require('fs');
fs.readFile('./target.txt', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data.toString());
});
```

* If `readFile()` is successful, then err will be false
    * Otherwise the err parameter will contain an Error object
    * This is a common error-reporting pattern in Node, especially for built-in modules

**file-system/write-simple.js**
`$ node --harmony write-simple.js`

```js
const fs = require('fs');
fs.writeFile('./target.txt', 'blah', function(err) {
    if (err) {
        throw err;
    }
    console.log("File saved!");
});
```

### Creating Read and Write Streams

* You create
    * a read stream by using `fs.createReadStream()`
    * a write stream by using `fs.createWriteStream()`

**file-system/cat.js**

```js
#!/usr/bin/env node --harmony
require('fs').createReadStream(process.argv[2]).pipe(process.stdout);
```

* The `require()` function returns a module object, so we can call methods on it directly
* You can also listen for data events from the file stream instead of calling `pipe()`.

**file-system/read-stream.js**

```js
const fs = require('fs');
stream = fs.createReadStream(process.argv[2]);
stream.on('data', function(chunk) {
    process.stdout.writeln(chunk);
});
stream.on('err', function(err) {
    process.stderr.writeln("ERROR: " + err.message);
});
```

* When working with an EventEmitter, the way to handle errors is to listen for error events.
* If you don’t listen for error events, but one happens anyway, Node will throw an exception.
    * And as we saw before, an uncaught exception will cause the process to terminate.

### Blocking the Event Loop with Synchronous File Access

* The file-access methods we've discussed in this chapter so far are asynchronous
    * They perform their I/O duties - waiting as necessary - completely in the background, only to invoke callbacks later.
    * This is by far the preferred way to do I/O in Node
* many of the methods in the `fs` module have synchronous versions as well.
    * These end in `*Sync`, like `readFileSync()`
* When you use the `*Sync` methods, the Node.js process **will block until the I/O finishes**
    * Node won’t execute any other code, won’t trigger any callbacks, won’t process any events, won’t accept any connections
    * It'll just sit there indefinitely waiting for the operation to complete.
    * synchronous methods are simpler to use since they lack the callback step. They either return successfully or throw an exception, without the need for a callback function.

```js
const
    fs = require('fs'),
    data = fs.readFileSync('target.txt');
process.stdout.write(data.toString());
```

### Performing Other File-System Operations

* The `fs` module has many other methods that map nicely onto POSIX conventions.
* To name a few examples
    * you can `copy()` files and `unlink()` (delete) them.
    * You can use `chmod()` to change permissions and `mkdir()` to create directories.
* They’re all asynchronous by default, but many come with equivalent `*Sync` versions.

## The Two Phases of a Node Program

* To understand when it's OK to use synchronous file-access methods, you can think of Node programs as having two phases.
* In the initialization phase, the program is getting set up, bringing in libraries, reading configuration parameters, and doing other mission-critical tasks. If something goes wrong at this early stage, not much can be done, and it’s best to fail fast.
    * **The only time you should consider synchronous file access is during the initialization phase of your program.**

# Networking with Sockets

## Listening for Socket Connections

* Networked services exist to do two things: connect endpoints and transmit information between them
* No matter what kind of information is transmitted, a connection must first be made.

### Binding a Server to a TCP Port

* In Node.js, the bind and connect operations are provided by the net module.

```js
"use strict"
const
    net = require('net'),
    server = net.createServer(function(connection) {
        //use connection object for data transfer
    });
    server.listen(5432);
```

* Node invokes the callback function whenever another endpoint connects
* The connection parameter is a Socket object that you can use to send or receive data.

### Writing Data to a Socket

**networking/net-watcher.js**

```js
'use strict';
const
    fs = require('fs'),
    net = require('net'),

    filename = process.argv[2],

    server = net.createServer(function(connection) {
        console.log('Subscriber connected.');
        connection.write("Now watching [" + filename + "] for changes...\n");

        let watcher = fs.watch(filename, function() {
            connection.write("File [" + filename + "] changed: " + new Date().toLocaleString() + "\n");
        });

        connection.on('close', function() {
            console.log('Subscriber disconnected.');
            watcher.close();
        });
    });

if (!filename) {
    throw Error('No target filename was specified!');
}

server.listen(5432, function() {
    console.log('Listening for subscribers...');
});
```

### Listening on Unix Sockets

```js
//client: nc -U /tmp/watcher.sock
server.listen('/tmp/watcher.sock', function() {
    console.log('Listening for subscribers...');
});
```

* Unix sockets can be faster than TCP sockets because they don’t require invoking network hardware. However, they’re local to the machine.

## Implementing a Messaging Protocol
