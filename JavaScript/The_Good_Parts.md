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
