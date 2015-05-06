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
