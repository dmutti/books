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
