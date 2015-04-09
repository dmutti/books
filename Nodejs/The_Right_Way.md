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

### Switching to JSON Messages

* use `JSON.stringify()` to encode message objects and send them out through `connection.write()`


```js
//...
connection.write(JSON.stringify({
    type: 'watching',
    file: filename
}) + '\n');
//...
connection.write(JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
}) + '\n');
//...
```

### Creating Socket Client Connections

* a client program in Node to receive JSON messages from our `net-watcher-json-service` program

**networking/net-watcher-json-client.js**

```js
"use strict";
const
    net = require('net'),
    client = net.connect({port : 5432});
client.on('data', function(data){
    let message = JSON.parse(data);
    if (message.type === 'watching') {
        console.log("Now watching [" + message.file + "]");
    } else if (message.type === 'changed') {
        let date = new Date(message.timestamp);
        console.log("File [" + message.file + "] changed at [" + date + "]");
    } else {
        throw Error("Unrecognized message type [" + message.type + "]");
    }
});
```

## Testing Network Application Functionality

### Understanding the Message-Boundary Problem

* When you develop networked programs in Node, they'll often communicate by passing messages.
* In the best case, a message will arrive all at once
    * sometimes messages will arrive in pieces, split into distinct data events.
    * To develop networked applications, you'll need to deal with these splits when they happen.
* In the previous example, each line of output corresponds to a single data event in the connected client, i.e, the data event boundaries exactly match up with the message boundaries.
* Consider what would happen if a message were split down the middle, and arrived as two separate data events
    * Such a split could easily happen in the wild, especially for large messages.

### Implementing a Test Service

* Writing robust Node applications means gracefully handling network problems like split inputs, broken connections, and bad data.

**networking/net-watcher-json-test-service.js**

```js
"use strict";

const
    net = require('net'),
    server = net.createServer(function(connection) {
        console.log('Subscriber connected');

        // send the first chunk immediately
        connection.write('{"type":"changed","file":"targ');

        // after a one second delay, send the other chunk
        let timer = setTimeout(function() {
            connection.write('et.txt","timestamp":"234567891011"}' + "\n");
        }, 1000);

        // clear timer when the connection ends
        connection.on('end', new function() {
            clearInterval(timer);
            console.log('Subscriber disconnected');
        });
    });
server.listen(5432, function () {
    console.log('Test server listening for subscribers...');
});
```

* The JavaScript function `setTimeout()` takes two parameters: a function to invoke and an amount of time in milliseconds. After the specified amount of time, the function will be called.
* Finally, whenever the connection ends, we use `clearTimeout()` to unschedule the callback.
    * Unscheduling the callback is necessary since it would fail if it were to execute.
    * After the connection has closed, any calls to `connection.write()` will trigger error events.

* what happens when we connect with the client program?
    * **Unexpected end of input**
    * The error tells us that the message was not complete and valid JSON.

## Extending Core Classes in Custom Modules

* The client program has two jobs to do
    * One is to buffer incoming data into messages
    * The other is to handle each message when it arrives.
* Rather than cramming both of these jobs into one Node program, the right thing to do is to turn at least one of them into a Node module.
    * **create a module that handles the input-buffering piece so that the main program can reliably get full messages.**

### Extending EventEmitter

#### Inheritance in Node

**networking/ldj.js**

```js
//The following code sets up LDJClient to inherit from EventEmitter
const
    events = require('events'),
    util = require('util'),
    //client constructor
    LDJClient = function (stream) {
        events.EventEmitter.call(this);
    };
util.inherits(LDJClient, events.EventEmitter);
```

* LDJClient is a constructor function, which means other code should call new `LDJClient(stream)` to get an instance.
* The stream parameter is an object that emits data events, such as a Socket connection.
* Inside the constructor function, we call the EventEmitter constructor on `this`.
    * That line of code is roughly equivalent to calling `super()` in languages with classical inheritance.
* we call `util.inherits()` to make LDJClient's prototypal parent object the EventEmitter prototype.
    * equivalent of **"class LDJClient inherits from EventEmitter"**
* There are other ways to do inheritance in JavaScript, but this is how Node.js's own modules are structured.
* Code to use LDJClient might look like this:

```js
const client = new LDJClient(networkStream);
client.on('message', function(message) {
  // take action for this message
});
```

* Even though the client object doesn't have an `on()` method directly, its prototypal grandparent, EventEmitter, does.

#### Buffering Data Events

* The goal is to take the incoming raw data from the stream and convert it into `message` events containing the parsed message objects.
* The updated constructor function appends incoming data chunks to a running buffer string and scans for line endings (which should be JSON message boundaries).

```js
LDJClient = function (stream) {
    events.EventEmitter.call(this);
    let self = this,
        buffer = '';
    stream.on('data', function(data) {
        buffer += data;
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
            let input = buffer.substr(0, boundary);
            buffer = buffer.substr(boundary + 1);
            self.emit('message', JSON.parse(input));
            boundary = buffer.indexOf('\n');
        }
    });
};
```

* In JavaScript, the value of `this` is assigned inside each function when it is invoked, at runtime.
    * The value of `this` is not tightly bound to any particular object like in classical languages. It’s more like a special variable.
* Setting a separate variable (`self`) to the same value guarantees that we're referring to the correct object inside our data event handler.
* Inside the data event handler, we append raw data to the end of the buffer and then pull completed messages off the front.

#### Exporting Functionality in a Module

**networking/ldj.js**

```js
//The following code sets up LDJClient to inherit from EventEmitter
"use strict";
const
    events = require('events'),
    util = require('util'),
    //client constructor
    LDJClient = function (stream) {
        events.EventEmitter.call(this);
        let self = this,
            buffer = '';
        stream.on('data', function(data) {
            buffer += data;
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                let input = buffer.substr(0, boundary);
                buffer = buffer.substr(boundary + 1);
                self.emit('message', JSON.parse(input));
                boundary = buffer.indexOf('\n');
            }
        });
    };
util.inherits(LDJClient, events.EventEmitter);

// expose module methods
exports.LDJClient = LDJClient;
exports.connect = function(stream){
    return new LDJClient(stream);
};
```

* In a Node module, the `exports` object is the bridge between the module code and the outside world.
    * Any properties you set on `exports` will be available to code that pulls in the module.
* we export the LDJClient constructor function and a convenience method called `connect()`. This method makes it a little easier for upstream code to create an LDJClient instance.
* Code to use the LDJ module will look something like the following.
* When a path is provided to `require()`, it will attempt to resolve the path relative to the current file.

```js
const
    ldj = require('./ldj.js'),
    client = ldj.connect(networkStream);

client.on('message', function(message) {
    // take action for this message
});
```

#### Importing a Custom Node Module

* instead of sending data buffers directly to `JSON.parse()`, this program relies on the ldj module to produce `message` events.

**networking/net-watcher-ldj-client.js**

```js
"use strict";

const
    net = require('net'),
    ldj = require('./ldj.js'),
    netClient = net.connect({port : 5432}),
    ldjClient = ldj.connect(netClient);

ldjClient.on('message', function (message) {
    if (message.type === 'watching') {
        console.log("Now watching [" + message.file + "]");
    } else if (message.type === 'changed') {
        console.log("File [" + message.file + "] changed at [" + new Date(new Number(message.timestamp)) + "]");
    } else {
        throw Error("Unrecognized message type [" + message.type + "]");
    }
});
```

## Wrapping up

* The LDJClient takes care of two separable concerns: splitting incoming data into lines, and parsing lines as JSON.
    * How would you further separate LDJClient into two modules, one for each of these concerns?

# Robust Messaging Services

## Importing External Modules with npm

* Modules managed by npm can be pure JavaScript or a combination of JavaScript and native addon code.
    * Addons are dynamically linked shared objects - they provide the glue for working with native libraries written in C or C++.

### Installing the ZMQ Base Library

[Install ZMQ guide](https://github.com/jaeheum/qzmq/blob/master/how-to-install-zeromq-czmq.md)

* http://brew.sh/

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install zmq
```

### Installing the zmq Node Module

```sh
mkdir ~/Devel/nodejs/messaging
cd ~/Devel/nodejs/messaging
brew install pkg-config
npm install zmq

#testing it
node --harmony -p -e 'require("zmq")'
```
