# Node.js Design Fundamentals

* Some principles and design patterns literally define the Node.js platform and its
ecosystem
    * the most peculiar ones are probably its asynchronous nature and its programming style that makes heavy use of callbacks
* However, there are other fundamental components that characterize the platform;
    * for example, its module system, which allows multiple versions of the same dependency to coexist in an application
    * and the observer pattern, implemented by the `EventEmitter` class, which perfectly complements callbacks when dealing with asynchronous code.

## The Node.js philosophy

### Small core

* The Node.js core itself has its foundations built on a few principles
* one of these is, having the smallest set of functionality, leaving the rest to the so-called **userland (or userspace)**
    * the ecosystem of modules living outside the core

### Small modules

* Node.js uses the concept of module as a fundamental mean to structure the code of a program. It is the brick for creating applications and reusable libraries called packages
* In Node.js, one of the most evangelized principles is to design small modules, not only in terms of code size, but most importantly in terms of scope.
* This principle has its roots in the Unix philosophy, particularly in two of its precepts, which are as follows:
    * "Small is beautiful."
    * "Make each program do one thing well."
* Node.js helps solving the dependency hell problem by making sure that each installed package will have its own separate set of dependencies
    * thus enabling a program to depend on a lot of packages without incurring in conflicts

### Small surface area

* Node.js modules usually also have the characteristic of exposing only a minimal set of functionality
* The main advantage here is an increased usability of the API, which means that the API becomes clearer to use and is less exposed to erroneous usage.
* a very common pattern for defining modules is to expose only one piece of functionality, such as a function or a constructor, while letting more advanced aspects or secondary features become properties of the exported function or constructor
* **modules are created to be used rather than extended**

### Simplicity and pragmatism

* Designing a simple, as opposed to a perfect, feature-full software, is a good practice for several reasons
    * it takes less effort to implement
    * allows faster shipping with less resources
    * is easier to adapt
    * is easier to maintain and understand

## The reactor pattern

* the heart of the Node.js asynchronous nature

### I/O is slow

* I/O is usually not expensive in terms of CPU, but it adds a delay between the moment the request is sent and the moment the operation completes

### Blocking I/O

* In traditional blocking I/O programming, the function call corresponding to an I/O request will block the execution of the thread until the operation completes.
* a web server that is implemented using blocking I/O will not be able to handle multiple connections in the same thread
    * each I/O operation on a socket will block the processing of any other connection
* For this reason, the traditional approach to handle concurrency in web servers is to kick off a thread or a process (or to reuse one taken from a pool) for each concurrent connection that needs to be handled
* Unfortunately, a thread is not cheap in terms of system resources, it consumes memory and causes context switches
    * so having a long running thread for each connection and not using it for most of the time, is not the best compromise in terms of efficiency.

### Non-blocking I/O

* In this operating mode, the system call **always returns immediately without waiting for the data to be read or written**
    * If no results are available at the moment of the call, the function will simply return a predefined constant, indicating that there is no data available to return at that moment.
* The most basic pattern for accessing this kind of non-blocking I/O is to actively poll the resource within a loop until some actual data is returned; this is called **busy-waiting**
    * the loop will consume precious CPU only for iterating over resources that are unavailable most of the time
    * Polling algorithms usually result in a huge amount of wasted CPU time

### Event demultiplexing

* modern operating systems provide a native mechanism to handle concurrent, non-blocking resources in an efficient way
* this mechanism is called **synchronous event demultiplexer** or **event notification interface**
    * This component collects and queues I/O events that come from a set of watched resources, and block until new events are available to process

```js
//### PSEUDOCODE
socketA, pipeB;
watchedList.add(socketA, FOR_READ); //[1]
watchedList.add(pipeB, FOR_READ);
while (events = demultiplexer.watch(watchedList)) { //[2]
    //event loop
    foreach (event in events) { //[3]
       //This read will never block and will always return data
       data = event.resource.read();
       if (data === RESOURCE_CLOSED) {
           //the resource was closed, remove it from the watched list
           demultiplexer.unwatch(event.resource);
       } else {
           //some actual data was received, process it
           consumeData(data);
       }
   }
}
```

1. The resources are added to a data structure, associating each one of them with a specific operation, in our example a read.
2. The event notifier is set up with the group of resources to be watched. This call is synchronous and blocks until any of the watched resources is ready for a read. When this occurs, the event demultiplexer returns from the call and a new set of events is available to be processed.
3. Each event returned by the event demultiplexer is processed. At this point, the resource associated with each event is guaranteed to be ready to read and to not block during the operation. When all the events are processed, the flow will block again on the event demultiplexer until new events are again available to be processed. This is called the **event loop**.

![Node.js Event Demultiplexing](Design_Patterns_fig_1.png "Node.js Event Demultiplexing")

* with this pattern, we can now handle several I/O operations inside a single thread, without using a busy-waiting technique
* the previous image helps us understand how concurrency works in a single-threaded application using a synchronous event demultiplexer and non-blocking I/O
    * The tasks are spread over time, instead of being spread across multiple threads. This has the clear advantage of minimizing the total idle time of the thread
    * To have only a single thread has a beneficial impact on the way programmers approach concurrency in general. The absence of in-process race conditions and multiple threads to synchronize allows us to use much simpler concurrency strategies.


### The reactor pattern

* The reactor pattern is a specialization of the event demultiplexing algorithm
* The main idea behind it is to have a handler (which in Node.js is represented by a `callback` function) associated with each I/O operation, which will be invoked as soon as an event is produced and processed by the event loop
* **Pattern (reactor): handles I/O by blocking until new events are available from a set of observed resources, and then reacting by dispatching each event to an associated handler.**

![Node.js Reactor Pattern](Design_Patterns_fig_2.png "Node.js Reactor Pattern")

1. The application generates a new I/O operation by submitting a request to the Event Demultiplexer. The application also specifies a handler, which will be invoked when the operation completes. Submitting a new request to the Event Demultiplexer is a non-blocking call and it immediately returns the control back to the application.
2. When a set of I/O operations completes, the Event Demultiplexer pushes the new events into the **Event Queue**
3. At this point, the Event Loop iterates over the items of the Event Queue
4. For each event, the associated handler is invoked
5. The handler, which is part of the application code, will give back the control to the Event Loop when its execution completes (**5a**). However, new asynchronous operations might be requested during the execution of the handler (**5b**), causing new operations to be inserted in the Event Demultiplexer (**1**), before the control is given back to the Event Loop.
6. **When all the items in the Event Queue are processed, the loop will block again on the Event Demultiplexer which will then trigger another cycle**

### The non-blocking I/O engine of Node.js – libuv

* Node.js core team created a C library called [libuv](http://nikhilm.github.io/uvbook/), with the objective to make Node.js compatible with all the major platforms and normalize the non-blocking behavior of the different types of resource
    * libuv today represents the low-level I/O engine of Node.js

## The callback pattern

* Callbacks are functions that are invoked to propagate the result of an operation
and this is exactly what we need when dealing with asynchronous operations.
    * They practically replace the use of the return instruction that, as we know, always executes synchronously
* [closures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Closures) are an ideal construct for implementing callbacks
    * With closures, we can in fact reference the environment in which a function was created
    * we can always maintain the context in which the asynchronous operation was requested, no matter when or where its callback is invoked.

### The continuation-passing style

* In JavaScript, a callback is a function that is passed as an argument to another
function and is invoked with the result when the operation completes.
    * called **continuation-passing style**
    * it simply indicates that a result is propagated by passing it to another function (the callback), instead of directly returning it to the caller.

#### Synchronous continuation-passing style

* the result is passed back to the caller using the `return` instruction; this is also called **direct style**

```js
function add(a, b) {
    return a + b;
}
```

* The equivalent continuation-passing style of the preceding function would be as follows
* The `add()` function is a synchronous **CPS** function, which means that it will return a value only when the callback completes its execution.

```js
function add(a, b, callback) {
    callback(a + b);
}
console.log('before');
add(1, 2, function(result) {
    console.log('Result: ' + result);
});
console.log('after');
```

#### Asynchronous continuation-passing style

```js
function addAsync(a, b, callback) {
    setTimeout(function() {
        callback(a + b);
    }, 100);
}
console.log('before');
addAsync(1, 2, function(result) {
    console.log('Result: ' + result);
});
console.log('after');
```

* we use `setTimeout()` to simulate an asynchronous invocation of the callback.
* Since `setTimeout()` triggers an asynchronous operation, it will not wait anymore for the callback to be executed, but instead, it returns immediately giving the control back to addAsync(), and then back to its caller
    * This property allows the stack to unwind, and the control to be given back to the event loop as soon as an asynchronous request is sent, thus allowing a new event from the queue to be processed.
* When the asynchronous operation completes, the execution is then resumed starting from the callback provided to the asynchronous function that caused the unwinding
* thanks to closures it is trivial to maintain the context of the caller of the asynchronous function, even if the callback is invoked at a different point in time and from a different location.

#### Non continuation-passing style callbacks

* There are several circumstances in which the presence of a callback argument might make you think that a function is asynchronous or is using a continuation-passing style; that's not always true

```js
var result = [1, 5, 7].map(function(element) {
    return element – 1;
});
```

### Synchronous or asynchronous?

#### An unpredictable function

* One of the most dangerous situations is to have an API that behaves synchronously under certain conditions and asynchronously under others
* The following function is dangerous because
    * it behaves asynchronously until the cache is not set -- which is until the `fs.readFile()` function returns its results
    * but it will also be synchronous for all the subsequent requests for a file already in the cache -- triggering an immediate invocation of the callback.

```js
var fs = require('fs');
var cache = {};

function inconsistentRead(filename, callback) {
    if(cache[filename]) {
        //invoked synchronously
        callback(cache[filename]);
    ￼} else {
        //asynchronous function
        fs.readFile(filename, 'utf8', function(err, data) {
            cache[filename] = data;
            callback(data);
        });
    }
}
```

#### Using synchronous APIs

* **it is imperative for an API to clearly define its nature, either synchronous or asynchronous.**
* **it is always a good practice to implement a synchronous API using a direct style; this will eliminate any confusion around its nature and will also be more efficient from a performance perspective.**

* using a synchronous API instead of an asynchronous one has some caveats
    * A synchronous API might not be always available for the needed functionality
    * A synchronous API will block the event loop and put the concurrent requests on hold. It practically breaks the Node.js concurrency, slowing down the whole application.

#### Deferred execution

* Another alternative for fixing our `inconsistentRead()` function is to make it purely asynchronous.
* **The trick here is to schedule the synchronous callback invocation
to be executed "in the future" instead of being run immediately in the same event loop cycle.**
    * this is possible using `process.nextTick()`, which defers the execution of a function until the next pass of the event loop
* `process.nextTick()` functioning is very simple
    * it takes a callback as an argument and pushes it on the top of the event queue, in front of any pending I/O event, and returns immediately
    * The callback will then be invoked as soon as the event loop runs again

```js
var fs = require('fs');
var cache = {};
function consistentReadAsync(filename, callback) {
    if(cache[filename]) {
        process.nextTick(function() {
            callback(cache[filename]);
        });
    } else {
        //asynchronous function
        fs.readFile(filename, 'utf8', function(err, data) {
            cache[filename] = data;
            callback(data);
        });
    }
}
```

* Another API for deferring the execution of code is `setImmediate()`
    * despite the name—might actually be slower than `process.nextTick()`
* Callbacks deferred with `process.nextTick()` run before any other I/O event is fired
    * with `setImmediate()`, the execution is queued behind any I/O event that is already in the queue
* Since `process.nextTick()` runs before any already scheduled I/O, **it might cause I/O starvation under certain circumstances** (for example: a recursive invocation)
    * **this can never happen with setImmediate()**

### Node.js callback conventions

* These conventions apply to the Node.js core API but they are also followed virtually by every userland module and application.

#### Callbacks come last

* if a function accepts in input a callback, this has to be passed as the last argument
* The motivation for this convention is that the function call is more readable in case the callback is defined in place

```js
fs.readFile(filename, [options], callback)
```

#### Error comes first

* any error produced by a CPS function is always passed as the first argument of the callback
* and any actual result is passed starting from the second argument
* If the operation succeeds without errors, the first argument will be `null` or `undefined`
* It is a good practice to always check for the presence of an error
* Another important convention to take into account is that the error must always be of type `Error`
    * simple strings or numbers should never be passed as error objects

```js
fs.readFile('foo.txt', 'utf8', function(err, data) {
    if(err)
        handleError(err);
    else
        processData(data);
});
```

#### Propagating errors

* Propagating errors in synchronous, direct style functions is done with the well-known `throw` command, which causes the error to jump up in the call stack until it's caught.
* In asynchronous CPS, proper error propagation is done by simply passing the `error` to the next callback in the CPS chain

```js
var fs = require('fs');
function readJSON(filename, callback) {
    fs.readFile(filename, 'utf8', function(err, data) {
        var parsed;
        if(err)
            //propagate the error and exit the current function
            return callback(err);
        try {
            //parse the file contents
            parsed = JSON.parse(data);
        } catch(err) {
            //catch parsing errors
            return callback(err);
        }
        //no errors, propagate just the data
        callback(null, parsed);
    });
};
```

#### Uncaught exceptions

* in order to avoid any exception to be thrown into the `fs.readFile()` callback, we put a try-catch block around `JSON.parse()`
* Throwing an exception inside an asynchronous callback will cause the exception to jump up to the event loop and never be propagated to the next callback
* **this is an unrecoverable state and the application will simply shut down printing the error to the `stderr` interface**

[01_node.js_design_fundamentals/06_callbacks_uncaught_exceptions/uncaught.js](design_patterns_code/01_node.js_design_fundamentals/06_callbacks_uncaught_exceptions/uncaught.js)

* wrapping the invocation of `readJSONThrows()` with a try-catch block will not work
    * because the stack in which the block operates is different from the one in which our callback is invoked

[01_node.js_design_fundamentals/06_callbacks_uncaught_exceptions/uncaughtIntercept.js](design_patterns_code/01_node.js_design_fundamentals/06_callbacks_uncaught_exceptions/uncaughtIntercept.js)

* The preceding catch statement will never receive the JSON parsing exception
    * it will travel back to the stack in which the exception was thrown
    * the stack ends up in the event loop and not with the function that triggers the asynchronous operation
* we still have a last chance to perform some cleanup or logging before the application terminates  
    * Node.js emits a special event called `uncaughtException` just before exiting the process

* **an uncaught exception leaves the application in a state that is not guaranteed to be consistent**
    * there might still have incomplete I/O requests running, or closures might have become inconsistent
* in production, always exit anyway from the application after an uncaught exception is received

## The module system and its patterns

* Modules are the main mechanism to enforce **information hiding** by keeping private all the functions and variables that are not explicitly marked to be **exported**

### The revealing module pattern

* One of the major problems with JavaScript is the absence of namespacing
    * Programs run in the global scope polluting it with data that comes from both internal application code and dependencies
* A popular technique to solve this problem is called revealing module pattern and it looks like the following

```js
var module = (function() {
    var privateFoo = function() { ... };
    var privateVar = [ ];

    var export = {
        publicFoo = function() { ... },
        publicVar = function() { ... }
    }
    return export;
}) ();
```

* **This pattern leverages a self-invoking function to create a private scope, exporting only the parts that are meant to be public**
* the `module` variable contains only the exported API, while the rest of the module content is practically inaccessible from outside

### Node.js modules explained

* To describe how it works, we can make an analogy with the revealing module pattern, where each module runs in a private scope, so that every variable that is defined locally does not pollute the global namespace

#### A homemade module loader

* Let's start by creating a function that loads the content of a module, wraps it into a private scope, and evaluates it

[01_node.js_design_fundamentals/07_homemade_module_loader/loader.js](design_patterns_code/01_node.js_design_fundamentals/07_homemade_module_loader/loader.js)

* Features such as `eval()` or the functions of the [vm module](http://nodejs.org/ api/vm.html) can be easily used in the wrong way or with the wrong input, thus opening a system to code injection attacks. They should always be used with extreme care or avoided altogether.
* The loader module does the following:
    * [1] resolve the full path of the module and assigns it to `id`. This task is delegated to `require.resolve()`, which implements a specific resolving algorithm
    * [2] If the module was already loaded in the past, it should be available in the cache.
    * [3] If the module was not yet loaded we create a `module` object that contains an exports property initialized with an empty object literal
    * [4] The module object is cached
    * [5] The module source code is read from its file and the code is evaluated. The module exports its public API by manipulating or replacing the `module.exports` object
    * [6] the content of `module.exports`, which represents the public API of the module, is returned to the caller

#### Defining a module

```js
var dependency = require('./anotherModule');

function log() {
    console.log('Well done ' + dependency.username);
}

module.exports.run = function() {
    log();
};
```

* everything inside a module is private unless it's assigned to the `module.exports` variable
* The contents of this variable are then cached and returned when the module is loaded using `require()`

#### Defining globals

* Even if all the variables and functions that are declared in a module are defined in its local scope, it is still possible to define a global variable
* the module system exposes a special variable called `global`
    * Everything that is assigned to this variable will end up automatically in the global scope

#### module.exports vs exports

* The variable exports is just a reference to the initial value of `module.exports`
    * such a value is essentially a simple object literal created before the module is loaded.
* If we want to export something other than an object literal, as for example a function, an instance, or even a string, we have to reassign `module.exports` as follows:

```js
module.exports = function() {
    console.log('Hello');
}
```

#### require is synchronous

* `require` function is synchronous
    * it returns the module contents using a simple direct style, and no callback is required.
* **any assignment to module.export must be synchronous as well**
* This property has important repercussions in the way we define modules, as it limits us to mostly using synchronous code during the definition of a module.

#### The resolving algorithm

* Node.js solves this problem [*dependency hell*] elegantly by loading a different version of a module depending on where the module is loaded from.
* The resolving algorithm can be divided into the following three major branches:
    * **File modules** - If `moduleName` starts with "/" it's considered already an absolute path to the module and it's returned as it is. If it starts with "./", then `moduleName` is considered a relative path, which is calculated starting from the requiring module
    * **Core modules** - If `moduleName` is not prefixed with "/" or "./", the algorithm will first try to search within the core Node.js modules
    * **Package modules** - If no core module is found matching `moduleName`, then the search continues by looking for a matching module into the first `node_modules` directory that is found navigating up in the directory structure starting from the requiring module. The algorithm continues to search for a match by looking into the next `node_modules` directory up in the directory tree, until it reaches the root of the filesystem.

#### The module cache

* Each module is loaded and evaluated only the first time it is required, since any subsequent call of `require()` will simply return the cached version.
* Caching is crucial for performances, but it also has some important functional implications:
    * **It makes it possible to have cycles within module dependencies**
    * It guarantees, to some extent, that always the same instance is returned when requiring the same module from within a given package

### Module definition patterns

* The module system, besides being a mechanism for loading dependencies, is also a tool for defining APIs.

#### Named exports

* The most basic method for exposing a public API is using **named exports**
* It consists in assigning all the values we want to make public to properties of the object referenced by `exports` (or `module.exports`)
    * the resulting exported object becomes a container or namespace for a set of related functionality

```js
//file logger.js
exports.info = function(message) {
    console.log('info: ' + message);
};

//file main.js
var logger = require('./logger');
logger.info('This is an informational message');
```

#### Exporting a function

* It consists in reassigning the whole `module.exports` variable to a function
* Its main strength it's the fact that it exposes only a single functionality, which provides a clear entry point for the module, and makes it simple to understand and use
* it also honors the principle of small surface area very well
* A possible extension of this pattern is using the exported function as namespace for other public APIs

```js
//file logger.js
module.exports = function(message) { //standard
    console.log('info: ' + message);
};

module.exports.verbose = function(message) { //extension
    console.log('verbose: ' + message);
};

//file main.js
var logger = require('./logger');
logger('This is an informational message'); //standard
logger.verbose('This is a verbose message'); //extension
```

#### Exporting a constructor

* It is a specialization of a module that exports a function
* we allow the user to create new instances using the constructor
    * we also give them the ability to extend its prototype and forge new classes

```js
//file logger.js
function Logger(name) {
    this.name = name;
};

Logger.prototype.log = function(message) {
    console.log('[' + this.name + '] ' + message);
};

Logger.prototype.info = function(message) {
    this.log('info: ' + message);
};

Logger.prototype.verbose = function(message) {
    this.log('verbose: ' + message);
};
module.exports = Logger;

//file main.js
var Logger = require('./logger');
var dbLogger = new Logger('DB');

dbLogger.info('This is an informational message');
var accessLogger = new Logger('ACCESS');
accessLogger.verbose('This is a verbose message');
```

* A variation of this pattern consists in applying a `guard` against invocations that don't use the new instruction. This little trick allows us to use our module as a factory.
* we check whether `this` exists and is an instance of `Logger`
    * If any of these conditions is false, it means that the `Logger()` function was invoked without using `new`
    * we proceed with creating the new instance properly and returning it to the caller

```js
function Logger(name) {
    if(!(this instanceof Logger)) {
        return new Logger(name);
    }
    this.name = name;
};

//file main.js
var Logger = require('./logger');
var dbLogger = Logger('DB');
accessLogger.verbose('This is a verbose message');
```

#### Exporting an instance

* We can leverage the caching mechanism of `require()` to easily define stateful instances
    * objects with a state created from a constructor or a factory, which can be shared across different modules
* This pattern is very much like creating a **Singleton**, however, it does not guarantee the uniqueness of the instance across the entire application
    * a module might be installed multiple times inside the dependency tree of an application
    * This results with multiple instances of the same logical module, all running in the context of the same Node.js application.
* Because the module is cached, every module that requires the `logger` module will actually always retrieve the same instance of the object, thus sharing its state.


```js
//file logger.js
function Logger(name) {
    this.count = 0;
    this.name = name;
};

Logger.prototype.log = function(message) {
    this.count++;
    console.log('[' + this.name + '](' + this.count + ') ' + message);
};

module.exports = new Logger('DEFAULT'); //standard
module.exports.Logger = Logger; //extension

//file main.js
var logger = require('./logger'); //standard
logger.log('This is an informational message');


var logger2 = new logger.Logger('CUSTOM'); //extension
logger2.log('This is an informational message');
```

#### Modifying other modules or the global scope

* A module can even export nothing
    * or can modify the global scope and any object in it, including other modules in the cache
* this pattern can be useful and safe under some circumstances (for example, for testing)
* **monkey patching**
    * the practice of modifying the existing objects at runtime to change or extend their behavior or to apply temporary fixes
* `patcher` must be required before using the `logger` module for the first time in order to allow the patch to be applied

```js
//file patcher.js
// ./logger is another module
require('./logger').customMessage = function() {
    console.log('This is a new functionality');
};

//file main.js
require('./patcher');
var logger = require('./logger');
logger.customMessage();
```

## The observer pattern

* Pattern (observer): defines an object (called subject), which can notify a set of observers (or listeners), when a change in its state happens.

### The EventEmitter

* The observer pattern is already built into the core and is available through the `EventEmitter` class
* The `EventEmitter` is a prototype, and it is exported from the `events` core module
* **Inside the listener, `this` refers to the instance of the `EventEmitter` that produces the event**

```js
var EventEmitter = require('events').EventEmitter;
var eeInstance = new EventEmitter();
```

* The essential methods of the `EventEmitter` are
    * `on(event, listener)`: This method allows you to register a new listener (a function) for the given event type (a string)
    * `once(event, listener)`: This method registers a new listener, which is then removed after the event is emitted for the first time
    * `emit(event, [arg1], [...])`: This method produces a new event and provides additional arguments to be passed to the listeners
    * `removeListener(event, listener)`: This method removes a listener for the specified event type
* big difference between a listener and a traditional Node.js callback
    * the first argument is not an error, but it can be any data passed to `emit()` at the moment of its invocation

### Create and use an EventEmitter
