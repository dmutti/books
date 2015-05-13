# Objects

* The simple types of JavaScript are numbers, strings, booleans ( true and false ), null, and undefined
* All other values are objects
* Numbers, strings, and booleans are object-like in that they have methods, but they are immutable
* Objects in JavaScript are mutable keyed collections
* In JavaScript, arrays are objects, functions are objects, regular expressions are objects, and, of course, objects are objects.

## Object Literals

* An object literal is a pair of curly braces surrounding zero or more name/value pairs.
* A property's name can be any string, including the empty string.
* Quotes around a property's name in an object literal are optional if the name would be a legal JavaScript name and not a reserved word
    * required around "first-name"
    * optional around first_name
* A property's value can be obtained from any expression, including another object literal.

```js
var empty_object = { };

var stooge = {
    "first-name": "Jerome",
    "last-name": "Howard"
};

var flight = {
    airline: "Oceanic",
    number: 815,
    departure: {
        IATA: "SYD",
        time: "2004-09-22 14:55",
        city: "Sydney"
    },
    arrival: {
        IATA: "LAX",
        time: "2004-09-23 10:42",
        city: "Los Angeles"
    }
};
```

## Retrieval

* Values can be retrieved from an object by wrapping a string expression in a `[ ]` suffix
* If the string expression is a constant, and if it is a legal JavaScript name and not a reserved word, then the `.` notation can be used instead
    * The `.` notation is preferred because it is more compact and it reads better
* The `undefined` value is produced if an attempt is made to retrieve a nonexistent member

```js
stooge["first-name"]
flight.departure.IATA
```

* The `||` operator can be used to fill in default values

```js
var middle = stooge["middle-name"] || "(none)";
var status = flight.status || "unknown";
```

* Attempting to retrieve values from `undefined` will throw a `TypeError` exception. This can be guarded against with the `&&` operator

```js
flight.equipment // undefined
flight.equipment.model // throw "TypeError"
flight.equipment && flight.equipment.model // undefined
```

## Update

* A value in an object can be updated by assignment. If the property name already exists in the object, the property value is replaced
* If the object does not already have that property name, the object is augmented

## Reference

* **Objects are passed around by reference. They are never copied**

## Prototype

* Every object is linked to a prototype object from which it can inherit properties
    * All objects created from object literals are linked to `Object.prototype`, an object that comes standard with JavaScript
* When you make a new object, you can select the object that should be its prototype.
* The `create` method creates a new object that uses an old object as its prototype

```js
if (typeof Object.create !== 'function') {
    Object.create = function(o) {
        var F = function() { };
        F.prototype = o;
        return new F();
    };
}
var another_stooge = Object.create(stooge);
```

* The prototype link has no effect on updating. When we make changes to an object, the object's prototype is not touched
* The prototype link is used only in retrieval. If we try to retrieve a property value from an object, and if the object lacks the property name, then JavaScript attempts to retrieve the property value from the prototype object. And if that object is lacking the property, then it goes to its prototype, and so on until the process finally bottoms out with Object.prototype . If the desired property exists nowhere in the prototype chain, then the result is the `undefined` value
    * This is called delegation
* The prototype relationship is a dynamic relationship. If we add a new property to a prototype, that property will immediately be visible in all of the objects that are based on that prototype

## Reflection

* The `typeof` operator can be very helpful in determining the type of a property
* Some care must be taken because any property on the prototype chain can produce a value
    *  when you are reflecting, you are interested in data, and so you should be aware that some values could be functions.

```js
typeof flight.toString // 'function'
typeof flight.constructor // 'function'
```

* The other approach is to use the `hasOwnProperty` method, which returns true if the object has a particular property
    * The `hasOwnProperty` method does not look at the prototype chain

```js
flight.hasOwnProperty('number') // true
flight.hasOwnProperty('constructor') // false
```

## Enumeration

* The `for in` statement can loop over all of the property names in an object
* The enumeration will include all of the properties -- including functions and prototype properties that you might not be interested in
    *  The most common filters are the `hasOwnProperty` method and using `typeof` to exclude functions

```js
var name;
for (name in another_stooge) {
    if (typeof another_stooge[name] !== 'function') {
        document.writeln(name + ': ' + another_stooge[name]);
    }
}
```

* There is no guarantee on the order of the names
* If you want to assure that the properties appear in a particular order, it is best to avoid the for in statement entirely and instead make an array containing the names of the properties in the correct order

```js
var i;
var properties = [
    'first-name',
    'middle-name',
    'last-name',
    'profession'
];
for (i = 0; i < properties.length; i += 1) {
    document.writeln(properties[i] + ': ' + another_stooge[properties[i]]);
}
```

## Delete

* The `delete` operator can be used to remove a property from an object
    * It will remove a property from the object if it has one
    * It will not touch any of the objects in the prototype linkage

```js
delete another_stooge.nickname;
```

## Global Abatement

* JavaScript makes it easy to define global variables that can hold all of the assets of your application
* One way to minimize the use of global variables is to create a single global variable for your application
    * That variable then becomes the container for your application

```js
var MYAPP = {};

MYAPP.stooge = {
    firstName : "Joe",
    lastName: "Howard"
};

MYAPP.flight = {
    //...
};
```

# Functions

* Functions in JavaScript are objects
    * Objects are collections of name/value pairs having a hidden link to a prototype object
    * Objects produced from object literals are linked to `Object.prototype`
* Function objects are linked to `Function.prototype` (which is itself linked to `Object.prototype`)
    * Every function is also created with two additional hidden properties
        * the function's context
        * the code that implements the function's behavior.
* Every function object is also created with a `prototype` property
    * Its value is an object with a constructor property whose value is the function
    * This is distinct from the hidden link to `Function.prototype`

## Function Literal

* Function objects are created with function literals
* The function object created by a function literal contains a link to that outer context
    * This is called closure
    * This is the source of enormous expressive power

```js
var add = function(a,b) {
    return a + b;
};
```

## Invocation

* Invoking a function suspends the execution of the current function, passing control and parameters to the new function
* In addition to the declared parameters, every function receives two additional parameters
    * `this` -  determined by the invocation pattern (method invocation pattern, the function invocation pattern, the constructor invocation pattern, and the apply invocation pattern)
    * `arguments`
* There is no runtime error when the number of arguments and the number of parameters do not match
    * If there are too many argument values, the extra argument values will be ignored
    * If there are too few argument values, the undefined value will be substituted for the missing values
* There is no type checking on the argument values
    * any type of value can be passed to any parameter.

### The Method Invocation Pattern

* When a function is stored as a property of an object, we call it a method.
* When a method is invoked, `this` is bound to that object
* If an invocation expression contains a refinement (that is, a `.` dot expression or `[subscript]` expression), it is invoked as a method
* A method can use `this` to access the object so that it can retrieve values from the object or modify the object
* **The binding of `this` to the object happens at invocation time**
    * This very late binding makes functions that use `this` highly reusable
* Methods that get their object context from this are called public methods

```js
var myObject = {
    value: 0,
    increment: function(inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
};

myObject.increment();
console.log(myObject.value); //1

myObject.increment(2);
console.log(myObject.value); //3
```

### The Function Invocation Pattern

* When a function is not the property of an object, then it is invoked as a function
* When a function is invoked with this pattern, `this` is bound to the global object

```js
var sum = add(3, 4);    // sum is 7
```

* This was a mistake in the design of the language
    * Had the language been designed correctly, when the inner function is invoked, `this` would still be bound to the `this` variable of the outer function
    * A consequence of this error is that a method cannot employ an inner function to help it do its work because the inner function does not share the method’s access to the object as its `this` is bound to the wrong value
    * workaround: define a variable and assigns it the value of `this`. then the inner function will have access to `this` through that variable. By convention, the name of that variable is `that`

```js
var myObject = {
    value: 0,
    increment: function(inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    },
    add: function(first, second) {
        return first + second;
    }
};

myObject.double = function() {
    var that = this; //workaround

    var helper = function() {
        that.value += that.add(that.value, that.value);
    };
    helper();
};

myObject.increment();
myObject.increment(2);
myObject.double();
console.log(myObject.value);
```

### The Constructor Invocation Pattern

* JavaScript is a prototypal inheritance language. **Objects can inherit properties directly from other objects. The language is class-free.**
* If a function is invoked with the `new` prefix, then a new object will be created with a hidden link to the value of the function’s `prototype` member, and this will be bound to that new object
* Functions that are intended to be used with the new prefix are called constructors
    * By convention, they are kept in variables with a capitalized name. If a constructor is called without the new prefix, very bad things can happen without a compile-time or runtime warning, so the capitalization convention is really important.
* **Use of this style of constructor functions is not recommended.**

```js
var Quo = function (string) {
    this.status = string;
};

Quo.prototype.get_status = function () {
    return this.status;
};

var myQuo = new Quo("confused");
console.log(myQuo.get_status()); //confused
```

### The Apply Invocation Pattern

* The `apply` method lets us construct an array of arguments to use to invoke a function
    * It also lets us choose the value of `this`
* The apply method takes two parameters
    * The first is the value that should be bound to `this`
    * The second is an array of parameters

```js
var add = function(a, b) {
    return a + b;
};

var array = [3, 4];
var sum = add.apply(null, array);
console.log(sum);

//----------------------------------

var statusObject = {
    status: 'A-OK'
};

var Quo = function (string) {
    this.status = string;
};

Quo.prototype.get_status = function () {
    return this.status;
};

var status = Quo.prototype.get_status.apply(statusObject);
console.log(status);//A-OK
```

## Arguments

* the `arguments` array gives the function access to all of the arguments that were supplied with the invocation, including excess arguments that were not assigned to parameters
* Because of a design error, arguments is not really an array
    * It is an array-like object
    * `arguments` has a length property, but it lacks all of the array methods

```js
var sum = function() {
    var sum = 0;
    for (i in arguments) {
        sum += arguments[i];
    }
    return sum;
}

console.log(sum(1,2,3));
```

## Functions

* A function always returns a value. If the return value is not specified, then `undefined` is returned
* If the function was invoked with the `new` prefix and the return value is not an object, then `this` (the new object) is returned instead.

## Exceptions

* The `throw` statement interrupts execution of the function
    * It should be given an exception object containing a `name` property that identifies the type of the exception, and a descriptive `message` property
    * You can also add other properties.
* A `try` statement has a single `catch` block that will catch all exceptions. If your handling depends on the type of the exception, then the exception handler will have to inspect the name to determine the type of the exception.


```js
var add = function(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw {
            name: 'TypeError',
            message: 'add needs numbers'
        };
    }
    return a + b;
};

var try_it = function() {
    try {
        add("seven");
    } catch (e) {
        console.log(e.name + ': ' + e.message);
    }
}

try_it();
```

## Augmenting Types

* adding a method to `Object.prototype` makes that method available to all objects. This also works for functions, arrays, strings, numbers, regular expressions, and booleans.
* by augmenting `Function.prototype`, we can make a method available to all functions
* By augmenting `Function.prototype` with a `method` method, we no longer have to type
the name of the prototype property.
* all values are immediately endowed with the new methods, even values that were created before the methods were created

```js
Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
    return this;
};

Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

console.log((-10/3).integer()); //-3

String.method('trim', function () {
    return this.replace(/^\s+|\s+$/g, '');
});

console.log('"' + " neat ".trim() + '"'); //"neat"
```

* add a method only if the method is known to be missing

```js
Function.prototype.method = function(name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
};
```

* the `for in` statement interacts badly with prototypes. We can mitigate that with
    * `hasOwnProperty` method to screen out inherited properties
    * and we can look for specific types


## Recursion

```js
var hanoi = function(disc, src, aux, dst) {
    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);
        console.log('Move disc ' + disc + ' from ' + src + ' to ' + dst);
        hanoi(disc - 1, aux, src, dst);
    }
};
hanoi(3, 'Src', 'Aux', 'Dst');
```

## Scope

* JavaScript does not have block scope even though its block syntax suggests that it does.
* JavaScript does have function scope. Parameters and variables defined in a function are not visible outside of the function, and variables defined anywhere within a function is visible everywhere within the function
* In many modern languages, it is recommended that variables be declared as late as possible, at the first point of use. That turns out to be bad advice for JavaScript because it lacks block scope.
    * **it is best to declare all of the variables used in a function at the top of the function body**

## Closure

* `myObject` had a value and an increment method. Suppose we wanted to protect the value from unauthorized changes.
* Instead of initializing `myObject` with an object literal, we will initialize myObject by calling a function that returns an object literal
    * That function defines a `value` variable
    * That variable is always available to the `increment` and `getValue` methods, but the function’s scope keeps it hidden from the rest of the program
* We are not assigning a function to `myObject`. We are assigning the result of invoking that function
    * Notice the `()` on the last line
    * The function returns an object containing two methods, and those methods continue to enjoy the privilege of access to the value variable

```js

var myObject = function() {
    var value = 0;
    return {
        increment: function(inc) {
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function() {
            return value;
        }
    };
}();

myObject.increment();
myObject.increment(2);
console.log(myObject.getValue()); //3
```

* Doing the same thing with `Quo`
    * This quo function is designed to be used without the `new` prefix, so the name is not capitalized.

```js
var quo = function (status) {
    return {
        get_status: function() {
            return status;
        }
    };
};

var myQuo = quo("amazed");
console.log(myQuo.get_status()); //amazed
```

## Module

* We can use functions and closure to make modules. A module is a function or object that presents an interface but that hides its state and implementation.
* By using functions to produce modules, we can almost completely eliminate our use of global variables
* The general pattern of a module is a function that defines private variables and functions; creates privileged functions which, through closure, will have access to the private variables and functions; and that returns the privileged functions or stores them in an accessible place

### Example 1

```js
String.method('deentityify', function() {
    var entity = {
        quot: '"',
        lt: '<',
        gt: '>'
    };

    return function() {
        return this.replace(/&([^&;]+);/g,
            function(a,b) {
                var r = entity[b];
                return typeof r === 'string' ? r : a;
            }
        );
    };
}());

console.log('&lt;&quot;&gt;'.deentityify());
```

* Notice the last line. We immediately invoke the function we just made with the `( )` operator. That invocation creates and returns the function that becomes the `deentityify` method.
* The module pattern takes advantage of function scope and closure to create relation- ships that are binding and private. In this example, only the `deentityify` method has access to the entity data structure.

### Example 2

* The methods do not make use of this or that. As a result, there is no way to compromise the seqer
* It isn’t possible to get or change the `prefix` or `seq` except as permitted by the methods
* The seqer object is mutable, so the methods could be replaced, but that still does not give access to its secrets
* If we passed `seqer.gensym` to a third party’s function, that function would be able to generate unique strings, but would be unable to change the `prefix` or `seq`

```js
var serial_maker = function() {
    var prefix = '';
    var seq = 0;
    return {
        set_prefix: function(p) {
            prefix = String(p);
        },
        set_seq: function(s) {
            seq = s;
        },
        gensym: function() {
            var result = prefix + seq;
            seq += 1;
            return result;
        }
    };
};
var seqer = serial_maker();
seqer.set_prefix('Q');
seqer.set_seq(1000);
console.log(seqer.gensym());
```

## Cascade

* Some methods do not have a return value
    * For example, it is typical for methods that set or change the state of an object to return nothing
* If we have those methods return `this` instead of `undefined`, we can enable cascades

```js
getElement('myBoxDiv').
    move(350, 150).
    width(100).
    height(100).
    color('red').
    border('10px outset').
    padding('4px').
    appendText("Please stand by");
```

## Curry

* Functions are values, and we can manipulate function values in interesting ways
* `Currying` allows us to produce a new function by combining a function and an argument
* The `curry` method works by creating a closure that holds that original function and the arguments to curry
    * It returns a function that, when invoked, returns the result of calling that original function, passing it all of the arguments from the invocation of curry and the current invocation
    * It uses the Array `concat` method to concatenate the two arrays of arguments together

```js
Function.method('curry', function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;
    return function () {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

var add = function(a, b) {
    return a + b;
};

var add1 = add.curry(1);
console.log(add1(6)); //7
```

## Memoization

* Functions can use objects to remember the results of previous operations, making it possible to avoid unnecessary work
    * This optimization is called *memoization*

```js
var fibonacci_recursive = function(n) {
    return n < 2 ? n : fibonacci_recursive(n-1) + fibonacci_recursive(n-2);
};

var fibonacci_memoized = function() {
    var memo = [0, 1];
    var fib = function(n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = fib(n-1) + fib(n-2);
            memo[n] = result;
        }
        return result;
    };
    return fib;
}();
```

# Inheritance

* **JavaScript, being a loosely typed language, never casts. The lineage of an object is irrelevant. What matters about an object is what it can do, not what it is descended from.**
* JavaScript is a prototypal language, which means that objects inherit directly from other objects.

## Pseudoclassical

* Instead of having objects inherit directly from other objects, an unnecessary level of indirection is inserted such that objects are produced by constructor functions.
* When a function object is created, the Function constructor that produces the function object runs some code like this:

```js
this.prototype = { constructor: this };
```

* The new function object is given a `prototype` property whose value is an object containing a constructor property whose value is the new function object.
    * The `prototype` object is the place where inherited traits are to be deposited
    * Every function gets a `prototype` object because the language does not provide a way of deter- mining which functions are intended to be used as constructors.
* When a function is invoked with the constructor invocation pattern using the `new` prefix, this modifies the way in which the function is executed.
    * there is a serious hazard with the use of constructor functions. If you forget to include the `new` prefix when calling a constructor function, then `this` will not be bound to a new object
    * `this` will be bound to the global object, so instead of augmenting your new object, you will be clobbering global variables
    * To mitigate this problem, there is a convention that all constructor functions are named with an initial capital, and that nothing else is spelled with an initial capital.
    * A much better alternative is to not use `new` at all.
* Much of the complexity of class hierarchies is motivated by the constraints of static type checking. JavaScript is completely free of those constraints
    * In classical languages, class inheritance is the only form of code reuse. JavaScript has more and better options.

## Object Specifiers

* It sometimes happens that a constructor is given a very large number of parameters. This can be troublesome because it can be very difficult to remember the order of the arguments
* In such cases, it can be much friendlier if we write the constructor to accept a single object specifier instead. That object contains the specification of the object to be constructed

* instead of

```js
var myObject = maker(f, l, m, c, s);
```

* we can write

```js
var myObject = maker({
    first: f,
    last: l,
    state: s,
    city: c
});
```

* The arguments can now be listed in any order, arguments can be left out if the con- structor is smart about defaults, and the code is much easier to read

## Prototypal
