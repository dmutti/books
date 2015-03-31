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

## Programming for the Node.js Event Loop

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

### Spawning a Child Process

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

### Capturing Data from an EventEmitter
