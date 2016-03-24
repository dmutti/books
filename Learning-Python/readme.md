[TOC]

# Fixing the Tcl/Tk IDLE Warning

```bash
# WARNING: The version of Tcl/Tk (8.5.9) in use may be unstable.
brew remove python3
brew install homebrew/dupes/tcl-tk
brew install python3 --with-tcl-tk
brew linkapps python3
```

# How Python Runs Programs

* If the Python process has write access on your machine, it will store the byte code of your programs in files that end with a .pyc extension (".pyc" means compiled ".py" source). Prior to Python 3.2, you will see these files show up on your computer after you've run a few programs alongside the corresponding source code files -- that is, in the same directories.
    * In 3.2 and later, Python instead saves its .pyc byte code files in a subdirectory named `__pycache__` located in the directory where your source files reside, and in files whose names identify the Python version that created them (e.g., script.cpython-33.pyc)
    * Both source code changes and differing Python version numbers will trigger a new byte code file. If Python cannot write the byte code files to your machine, your program still works -- the byte code is generated in memory and simply discarded on program exit.
* There is really no distinction between the development and execution environments. The systems that compile and execute your source code are really one and the same. In Python, the compiler is always present at runtime and is part of the system that runs programs.
*  Frozen binaries bundle together the byte code of your program files, along with the PVM (interpreter) and any Python support files your program needs, into a single package.

# How You Run Programs

* the interactive interpreter automatically prints the results of expressions
* don't start with a space or tab at the interactive prompt unless it's nested code.
* At the interactive prompt, inserting a blank line (by hitting the Enter key at the start of a line) is necessary to tell interactive Python that you're done typing the multiline statement. That is, you must press Enter twice to make a compound statement run

```python
# a first python script
import sys
print(sys.platform)
print(2 ** 100)
x = 'Spam!'
print(x * 8)
```

* importers gain access to all the names assigned at the top level of a module's file. These names are usually assigned to tools exported by the module -- functions, classes, variables, and so on -- that are intended to be used in other files and other programs
    * Externally, a module file's names can be fetched with two Python statements, `import` and `from`, as well as the `reload` call.
    * **reloads aren't transitive** -- reloading a module reloads that module only, not any modules it may import
* `from` copies a module's attributes, such that they become simple variables in the recipient -- you can simply refer to the imported string this time as `title` (a variable) instead of `myfile.title` (an attribute reference)

```python
# myfile.py
title = "The Meaning of Life"
###############

# %python
import myfile
print(myfile.title)

# %python
from myfile import title
print(title)
```

* `dir` function starts to come in handy -- you can use it to fetch a list of all the names available inside a module
    * `dir(script1)`
    * it returns all the attributes inside that module
* modules are the largest program structure in Python programs
* each module file is a package of variables -- a namespace.

> **import versus from**: the `from` statement in a sense defeats the namespace partitioning purpose of modules. **it copies variables from one file to another, causing same-named variables in the importing file to be overwritten -- and won't warn you if it does.**

*  the `exec(open('module.py').read())` built-in function call is another way to launch files from the interactive prompt without having to import and later reload
    * Each such `exec` runs the current version of the code read from a file, without requiring later reloads
    * like the `from` statement, it has the potential to silently overwrite variables you may currently be using
* Usage Notes: IDLE
    * Run scripts by selecting "Run -> Run Module" in text edit windows, not by interactive imports and reloads.
    * tkinter GUI and threaded programs may not work well with IDLE

## Debugging Python Code

* Use the pdb command-line debugger
    * Python comes with a source code debugger named **pdb**, available as a module in Python's standard library
    * You can launch pdb interactively by importing it, or as a top-level script
    * pdb also includes a postmortem function (`pdb.pm()`) that you can run after an exception occurs, to get information from the time of the error
* Use Python's `-i` command-line argument
    *  If you run your script from a command line and pass a `-i` argument between python and the name of your script(e.g. `python -i m.py`), Python will enter into its interactive interpreter mode when your script exits, whether it ends successfully or runs into an error
    *  At this point, you can print the final values of variables to get more details about what happened in your code because they are in the top-level namespace.

# Introducing Python Object Types

* **everything is an object in a Python script**

| Object type | Example literals / Creation |
| ----------- | --------------------------- |
| Numbers | 1234, 3.1415, 3+4j, 0b111, Decimal(), Fraction() |
| Strings | 'spam', "Bob's", b'a\x01c', u'sp\xc4m' |
| Lists | [1, [2, 'three'], 4.5],list(range(10)) |
| Dictionaries | {'food': 'spam', 'taste': 'yum'}, dict(hours=10) |
| Tuples | (1, 'spam', 4, 'U'),tuple('spam'),namedtuple | 
| Files | open('eggs.txt'),open(r'C:\ham.bin', 'wb') |
| Sets | set('abc'),{'a', 'b', 'c'} |
| Other core types | Booleans, types, None |
| Program unit types | Functions, modules, classes |
| Implementation-related types | Compiled code, stack tracebacks |

* Python is **dynamically typed**, a model that keeps track of types for you automatically instead of requiring declaration code, but it is also **strongly typed**, a constraint that means you can perform on an object only operations that are valid for its type
* Python variables never need to be declared ahead of time
    * A variable is created when you assign it a value, may be assigned any type of object, and is replaced with its value when it shows up in an expression.
* In Python, we can also index backward, from the end -- positive indexes count from the left, and negative indexes count back from the right

```python
s = 'Spam'
s[-1] # 'm'
s[-2] # 'a'
s[1:3] # slicing -> 'pa'
s[1:] # Everything past the first (1:len(S)) -> 'pam'
s[0:3] # Everything but the last -> 'Spa'
s[:3] # Same as S[0:3] -> 'Spa'
s[:-1] # Everything but the last again, but simpler (0:-1) -> 'Spa'
s[:] # # All of S as a top-level copy (0:len(S)) -> 'Spam' 
```
* Strictly speaking, you can change text-based data in place if you either expand it into a list of individual characters and join it back together with nothing between, or use the newer `bytearray` type

```python
s = 'shrubbery'
l = list(s)
l[1] = 'c'
''.join(l) # Join with empty delimiter
```

* Strings also support an advanced substitution operation known as formatting, available as both an expression (the original) and a string method call

```python
'%s, eggs, and %s' % ('spam', 'SPAM!') # 'spam, eggs, and SPAM!'
'{0}, eggs, and {1}'.format('spam', 'SPAM!') # 'spam, eggs, and SPAM!'
'{}, eggs, and {}'.format('spam', 'SPAM!') # 'spam, eggs, and SPAM!'
```

* you can always call the built-in `dir` function. This function
    * lists variables assigned in the caller's scope when called with no argument
    * returns a list of all the attributes available for any object passed to it
    * In general, leading and trailing double underscores is the naming pattern Python uses for implementation details
    * The names without the underscores in this list are the callable methods on string objects.
* **none of the string object's own methods support pattern-based text processing**
* The `dir` function simply gives the methods' names. To ask what they do, you can pass them to the `help` function
    * `help(S.replace)`
* Both `dir` and `help` also accept as arguments either a real object or the name of a data type
* Python allows strings to be enclosed in single or double quote characters -- they mean the same thing but allow the other type of quote to be embedded with an escape (most programmers prefer single quotes)
    * It also allows multiline string literals enclosed in triple quotes (single or double) -- when this form is used, all the lines are concatenated together, and end-of-line characters are added where line breaks appear.
* Python also supports a raw string literal that turns off the backslash escape mechanism.
    * Such literals start with the letter `r` and are useful for strings like directory paths on Windows
    * `print(r'c:\n')`
* Python's strings also come with full Unicode support required for processing text in internationalized character sets.
    * the normal str string handles Unicode text (including ASCII, which is just a simple kind of Unicode);
    * a distinct bytes string type represents raw byte values (including media and encoded text);

```python
'sp\xc4m' # 'spÄm'
b'a\x01c' # b'a\x01c'
'a\x01c' # 'a\x01c'
```

* to do pattern matching in Python, we import a module called `re`

```python
import re
match = re.match('Hello[ \t]*(.*)world', 'Hello Python world')
match.group(1) # 'Python '
```

* Because they are sequences, lists support all the sequence operations we discussed for strings; the only difference is that the results are usually lists instead of strings.
    * **lists have no fixed type constraint and no fixed size**
    * we can index, slice, and so on, just as for strings
* Because lists are mutable, most list methods also change the list object in place, instead of creating a new one
* One nice feature of Python's core data types is that they support arbitrary nesting
    * we can nest them in any combination, and as deeply as we like.
    * we can have a list that contains a dictionary, which contains another list, and so on

## Comprehensions

```python
M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print([row[2] for row in M])
[row[1] for row in M if row[1] % 2 == 0] # Filter out odd items
[M[i][i] for i in [0, 1, 2]] # Collect a diagonal from matrix

[[x**2, x**3] for x in range(4)] # [[0, 0], [1, 1], [4, 8], [9, 27]]

import string
print([x for x in string.ascii_letters])
```

* Python includes a more advanced operation known as a list comprehension expression, which turns out to be a powerful way to process structures like a matrix
* It's easy to grab rows by simple indexing because the matrix is stored by rows, but it's almost as easy to get a column with a list comprehension
* List comprehensions derive from set notation; they are a way to build a new list by running an expression on each item in a sequence, one at a time, from left to right
* **List comprehensions make new lists of results, but they can be used to iterate over any iterable object**
* enclosing a comprehension in parentheses can also be used to create generators that produce results on demand

## Dictionaries

```python
D = {'food': 'Spam', 'quantity': 4, 'color': 'pink'}

D = {}
D['name'] = 'Bob'
D['job'] = 'dev'
D['age'] = 40

bob1 = dict(name='Bob', job='dev', age=40)
bob2 = dict(zip(['name', 'job', 'age'], ['Bob', 'dev', 40]))

######### Contains
bob1.__contains__('x') # false
'x' in bob1 # false
value = D.get('x', 0) # 0
value = D['x'] if 'x' in D else 0 # 0 

######### Sorted keys list
for key in sorted(D):
    print(key, '=>', D[key])
```

* When written as literals, dictionaries are coded in curly braces and consist of a series of “key: value” pairs
* **The exact order of dictionary keys may vary per Python**

## Iteration and Optimization

* The generator comprehension expression we saw earlier is such an `iterable`
    * its values aren't stored in memory all at once, but are produced as requested, usually by iteration tools
* Python `file` objects similarly iterate line by line when used by an iteration tool: file content isn't in a list, it's fetched on demand
* The list comprehension and related functional programming tools like `map` and `filter`, will often run faster than a for loop today on some types of code (perhaps even twice as fast)

## Tuples

```python
T = (1,2,3,4)

T.index(4) # 3
T.count(2) # 1

T[0] = 2 # ERROR
(2) + T[1:] # ERROR
(2,) + T[1:] # (2, 2, 3, 4)

T = ('spam', [3,4], 3.0)
```

* tuples are sequences, like lists, but they are immutable, like strings
* Functionally, they're used to represent fixed collections of items
* Syntactically, they are normally coded in parentheses instead of square brackets,
* tuples support mixed types and nesting, but they don't grow and shrink because they are immutable

## Files

```python
f = open('/Users/danilomutti/tmp/data.txt', 'w')
f.write('Hello\n')
f.write('world\n') # Return number of items written
f.close()

for line in open('/Users/danilomutti/tmp/data.txt'): print(line)

##### Encoding
S = 'sp\xc4m'
file = open('/Users/danilomutti/tmp/unidata.txt', 'w', encoding='utf-8') # Write/encode UTF-8 text
file.write(S)
file.close()

text = open('/Users/danilomutti/tmp/unidata.txt', encoding='utf-8').read()
raw = open('/Users/danilomutti/tmp/unidata.txt', 'rb').read()
text.encode('utf-8') # b'sp\xc3\x84m'
raw.decode('utf-8') # 'spÄm'

import codecs
raw = codecs.open('unidata.txt', encoding='utf8').read()
raw.encode('latin1').decode('utf-8')
```

* to create a file object, you call the built-in open function, passing in an external filename and an optional processing mode as strings.
* To read back what you just wrote, reopen the file in 'r' processing mode, for reading text input
    * this is the default if you omit the mode in the call
* A file's contents are always a string in your script, regardless of the type of data the file contains
* `text` files represent content as normal `str` strings and perform Unicode encoding and decoding automatically when writing and reading data
* `binary` files represent content as a special `bytes` string and allow you to access file content unaltered
* For more advanced tasks, though, Python comes with additional file-like tools: pipes, FIFOs, sockets, keyed-access files, persistent object shelves, descriptor-based files, relational and object-oriented database interfaces, and more

## Sets

```python
X = set('spam')
Y = {'h', 'a', 'm'}

X,Y # A tuple of two sets without parentheses ({'a', 'm', 'p', 's'}, {'a', 'h', 'm'})
X & Y # Intersection - {'a', 'm'}
X | Y # Union - {'a', 'h', 'm', 'p', 's'}
X - Y # Difference - {'p', 's'}
X > Y # Superset - False

'p' in set('spam'), 'p' in 'spam', 'ham' in ['eggs', 'spam', 'ham'] # (True, True, True)
```

* Sets are unordered collections of unique and immutable objects
* You create sets by calling the built-in `set` function or using new set literals and expressions
* they also support the usual mathematical set operations

## Numeric Types

```python
import decimal
d = decimal.Decimal('3.141') #BigDecimal-like
decimal.getcontext().prec = 2
decimal.Decimal('1.00') / decimal.Decimal('3.00') # Decimal('0.33')

from fractions import Fraction
f = Fraction(2, 3)
f + Fraction(1, 2) # Fraction(7, 6)
```

* `decimal numbers`, which are fixed-precision floating-point numbers
* `fraction numbers`, which are rational numbers with both a numerator and a denominator
* Both can be used to work around the limitations and inherent inaccuracies of floating-point math

## None

```python
X = None
L = [None] * 100
```

* a special placeholder object commonly used to initialize names and objects

## How to Break Your Code's Flexibility

```python
if type(L) == type([]):
    print('yes')

if type(L) == list:
    print('yes')

if isinstance(L, list):
    print('yes')
```

* **type testing is almost always the wrong thing to do in a Python program**
* By checking for specific types in your code, you effectively break its flexibility -- you limit it to working on just one type
    * Without such tests, your code may be able to work on a whole range of types.
* we care what an object does, not what it is
    * Not caring about specific types means that code is automatically applicable to many of them
    * any object with a compatible interface will work, regardless of its specific type

# Numeric Types

* Python's numeric toolbox includes:
    * Integer and floating-point objects -- `1.23, 1., 3.14e-10, 4E210, 4.0e+210`
    * Complex number objects -- `3+4j, 3.0+4.0j, 3J`
    * Decimal: fixed-precision objects -- `Decimal('1.0')`
    * Fraction: rational number objects -- `Fraction(1, 3)`
    * Sets: collections with numeric operations
    * Booleans: true and false
    * Built-in functions and modules: round, math, random, etc.
    * Expressions;unlimitedintegerprecision;bitwiseoperations;hex,octal,andbinary formats
    * Third-party extensions: vectors, libraries, visualization, plotting, etc.

* If you write a number with a decimal point or exponent, Python makes it a floating-point object and uses floating-point (not integer) math when the object is used in an expression
    * Floating-point numbers are implemented as C "doubles"
* In Python 3.X, the normal and long integer types have been merged -- there is only `integer`, which automatically supports unlimited precision
* Hexadecimals start with a leading `0x` [zerox] or `0X` [zeroX], followed by a string of hexadecimal digits (0-9 and A-F)
* Octal literals start with a leading `0o` [zeroo] or `0O` [zeroO], followed by a string of digits (0-7)
* Binary literals begin with a leading `0b` [zerob] or `0B` [zeroB], followed by binary digits (0-1)
* `hex(I)`, `oct(I)`, and `bin(I)` convert an integer to its representation string in these three bases
    * `int(str, base)` converts a runtime string to an integer per a given base
* complex literals are written as `real_part + imaginary_part`, where the **imaginary_part** is terminated with a `j` or `J`
    * **real_part** is optional, so the **imaginary_part** may appear on its own
    * complex numbers may also be created with the `complex(real, imag)`

## Built-in Numeric Tools

* Expression operators: `+, -, *, /, >>, **, &, ...`
* Built-in mathematical functions: `pow, abs, round, int, hex, bin, ...`
* Utility modules: `random, math, ...`
* **expression** is a combination of numbers (or other objects) and operators that computes a value when executed by Python
* Comparison operators may be chained: `X < Y < Z` produces the same result as `X < Y and Y < Z`.

| Operator | Description |
|----------|-------------|
| x if y else z | ternary operator |
| x or y | logical OR |
| x and y | logical AND |
| not x | logical negation |
| x in y, x not in y | Membership (iterables, sets) |
| x is y, x is not y | Object identity tests |
| x < y, x <= y, x > y, x >= y | Magnitude comparison, set subset and superset |
| x == y,x != y | Value equality operators |
| x \| y | Bitwise OR, set union |
| x ^ y | Bitwise XOR, set symmetric difference |
| x \& y | Bitwise AND, set intersection |
| x + y | |
| x – y | |
| x * y | |
| x % y | |
| x / y, x // y | Division: true and floor |
| −x, +x | |
| ~x | Bitwise NOT (inversion) |
| x ** y | Power (exponentiation) |
| x[i] | |
| x[i:j:k] | Slicing |
| x(...) | Call (function, method, class, other callable) |
| x.attr | |
| (...) | Tuple, expression, generator expression |
| [...] | List, list comprehension |
| {...} | Dictionary, set, set and dictionary comprehensions | 

```python
a = 3
b = 4
a + 1, a - 1 # tuple (4,2)
2 + 4.0, 2.0 ** b # tuple (6.0, 16.0)
```

* str and repr Display Formats
    * `repr` (and the default interactive echo) produces results that look as though they were code
    * `str` (and the print operation) converts to a typically more user-friendly format if available
    * Some objects have both--a str for general use, and a repr with extra details

* Python also allows us to **chain** multiple comparisons together to perform range tests.
    * The expression (`A < B < C`) tests whether B is between A and C
    * it is equivalent to the Boolean test (`A < B and B < C`) but is easier on the eyes (and the keyboard)

## Division: Classic, Floor, and True

* `X / Y` -- true division, always keeping remainders in floating-point results, regardless of types
* `X // Y` -- floor division, always truncates fractional remainders down to their floor, regardless of types. It returns an integer for integer operands or a float if any operand is a float.

```python
5 // 2, 5 // −2 # (2, −3) # Truncates to floor: rounds to first lower integer # 2.5 becomes 2, -2.5 becomes -3
```

## Other Built-in Numeric Tools

```python
import math

math.pi, math.e # (3.141592653589793, 2.718281828459045)
math.sin(2 * math.pi / 180)
math.sqrt(144), math.sqrt(2)

pow(2, 4), 2 ** 4, 2.0 ** 4.0 # (16, 16, 16.0)
abs(-42.0), sum((1, 2, 3, 4)), sum([1, 2, 3, 4]) # (42.0, 10, 10)
min(3, 1, 2, 4), max(3, 1, 2, 4) # (1, 4)
int(2.567), int(-2.567) # (2, -2)
round(2.567), round(2.467), round(2.567, 2) # (3, 2, 2.57)
```

## Decimal Type

* decimals are fixed-precision floating-point values
* the decimal type is well suited to representing fixed-precision quantities like sums of money and can help you achieve better numeric accuracy
* When decimals of different precision are mixed in expressions, Python converts up to the largest number of decimal digits automatically
* The precision is applied globally for all decimals created in the calling thread

```python
from decimal import Decimal
Decimal('0.1') + Decimal('0.1') + Decimal('0.1') - Decimal('0.3') # Decimal('0.0')
Decimal(0.1) + Decimal(0.1) + Decimal(0.1) - Decimal(0.3)

import decimal
decimal.getcontext().prec = 4
```

* it’s also possible to reset precision temporarily by using the with context manager statement
* The precision is reset to its original value on statement exit

```python
import decimal
with decimal.localcontext() as ctx:
    ctx.prec = 2
    Decimal(0.1) + Decimal(0.1) + Decimal(0.1) - Decimal(0.3) # 1.1E-17
```

## Fraction Type

* It essentially keeps both a numerator and a denominator explicitly, so as to avoid some of the inaccuracies and limitations of floating-point math
* fractions have a `from_float` method, and float accepts a `Fraction` as an argument

```python
from fractions import Fraction
x = Fraction(1, 3)
y = Fraction(4, 6)
x + y # Fraction(1, 1)
x * y # Fraction(2, 9)
Fraction('.25') # Fraction(1, 4)
Fraction(2.5) # Fraction(5, 2)
```

### Type Mixing

* although you can convert from floating point to fraction, in some cases there is an unavoidable precision loss when you do so, because the number is inaccurate in its original floating-point form

* Fraction + int -> Fraction
* Fraction + float -> float
* Fraction + Fraction -> Fraction

## Sets

```python
set([1, 2, 3, 4]) # {1, 2, 3, 4}
{1, 2, 3, 4} # {1, 2, 3, 4}

set('spam') # {'s', 'a', 'p', 'm'}
S = {'s', 'p', 'a', 'm'} # {'s', 'a', 'p', 'm'}
S.add('alot') # {'s', 'a', 'p', 'alot', 'm'}

type({}) # dict
type(set())  # set
```

* an unordered collection of unique and immutable objects that supports operations corresponding to mathematical set theory
* `{}` is still a dictionary in all Pythons. Empty sets must be created with the `set` built-in, and print the same way
* **sets can only contain immutable (a.k.a. "hashable") object types**
    * lists and dictionaries cannot be embedded in sets, but tuples can if you need to store compound values
* Sets themselves are mutable too, and so cannot be nested in other sets directly
    * if you need to store a set inside another set, the `frozenset` built-in call works just like set but creates an immutable set that cannot change and thus can be embedded in other sets
* Set comprehensions run a loop and collect the result of an expression on each iteration; a loop variable gives access to the current iteration value for use in the collection expression. The result is a new set you create by running the code, with all the normal set behavior

```python
{x ** 2 for x in [1, 2, 3, 4]} # {16, 1, 4, 9}
```

## Booleans

* Python today has an explicit Boolean data type called `bool`, with the values True and False available as preassigned built-in names. 
    * Internally, the names True and False are instances of `bool`, which is in turn just a subclass (in the object-oriented sense) of the built-in integer type `int`.
    * True and False behave exactly like the integers 1 and 0, except that they have customized printing logic -- they print themselves as the words True and False, instead of the digits 1 and 0
    * `bool` accomplishes this by redefining `str` and `repr` string formats for its two objects

# The Dynamic Typing Interlude

* In Python, types are determined automatically at runtime, not in response to declarations in your code
    * This means that you never declare variables ahead of time
* A variable never has any type information or constraints associated with it. The notion of type lives with objects, not names.
    * Variables are generic in nature; they always simply refer to a particular object at a particular point in time.
* **variables are created when assigned, can reference any type of object, and must be assigned before they are referenced**
* Because variables have no type, we haven’t actually changed the type of the variable a; we’ve simply made the variable reference a different type of object
    * All we can ever say about a variable in Python is that it references a particular object at a particular point in time
* in Python, whenever a name is assigned to a new object, the space held by the prior object is reclaimed if it is not referenced by any other name or object

## Shared References

```python
a = 3
b = a
a = 'spam'
print(b) # 3
```

* there is no way to ever link a variable to another variable in Python. Rather, both variables point to the same object via their references.
* in Python variables are always pointers to objects, not labels of changeable memory areas: setting a variable to a new value does not alter the original object, but rather causes the variable to reference an entirely different object.
* The net effect is that assignment to a variable itself can impact only the single variable being assigned.

## Shared References and In-Place Changes

```python
L1 = [1,2,3]
L2 = L1
L1[0] = 6
L2 # [6,2,3]
```

* This behavior only occurs for mutable objects that support in-place changes, and is usually what you want, but you should be aware of how it works, so that it's expected.
* if you don't want such behavior, you can request that Python copy objects instead of making references.
    * using the built-in `list` function and the standard library `copy` module
    * the most common way is to slice from start to finish

```python
import copy
L1 = [1,2,3]
L2 = L1[:] # list(L1) or copy.copy(L1)
L1[0] = 6
L1 # [6,2,3]
L2 # [1,2,3]
```

## Shared References and Equality

```python
L = [1, 2, 3]
M = L
L == M # True -> same values
L is M # True -> same objects

###############
L = [1, 2, 3]
M = [1, 2, 3]
L == M # True -> same values
L is M # False -> different objects
```

* **the `==` operator, tests whether the two referenced objects have the same values**
* **the `is` operator, instead tests for object identity -- it returns `True` only if both names point to the exact same object**
* **small integers and strings are cached and reused, `is` tells us they reference the same single object**
* Because you cannot change immutable numbers or strings in place, it doesn't matter how many references there are to the same object -- every reference will always see the same, unchanging value

## Weak References

* a weak reference, implemented by the `weakref` standard library module, is a reference to an object that does not by itself prevent the referenced object from being garbage-collected
* If the last remaining references to an object are weak references, the object is reclaimed and the weak references to it are automatically deleted (or otherwise notified).
* Useful in dictionary-based caches of large objects

# String Fundamentals

* In Python 3.X there are three string types
    * `str` is used for Unicode text (including ASCII)
    * `bytes` is used for binary data (including encoded text)
    * `bytearray` is a mutable variant of bytes
* Files work in two modes
    * `text`, which represents content as `str` and implements Unicode encodings
    * `binary`, which deals in raw bytes and does no data translation
* Python has no distinct type for individual characters; you just use one-character strings

| Operation | Interpretation |
|-----------|----------------|
| S = '' | empty string |
| S = "spam's" | same as single |
| S = 's\np\ta\x00m' | Escape sequences |
| S = """...multiline...""" | Triple-quoted block strings |
| S = r'\temp\spam' | Raw strings (no escapes) |
| B = b'sp\xc4m' | Byte strings |
| U = u'sp\u00c4m' | Unicode strings |
| S1 + S2 | concatenate |
| S * 3 | repeat |
| S[i] | index |
| S[i:j] | slice |
| len(S) | length |
| "a %s parrot" % kind | String formatting expression |
| "a {0} parrot".format(kind) | String formatting method |
| S.find('pa') | search |
| S.rstrip() | remove whitespace |
| S.replace('pa', 'xx') | replacement |
| S.split(',') | split on delimiter |
| S.isdigit() | content test |
| S.lower() | case conversion |
| S.endswith('spam') | end test |
| 'spam'.join(strlist) | delimiter join |
| S.encode('latin-1') | Unicode encoding |
| B.decode('utf8') | Unicode decoding |
| for x in S: print(x) | iteration |
| 'spam' in S | membership |
| [c * 2 for c in S] | iteration |
| re.match('sp(.*)am', line) | Pattern matching: library `module`|

* single and double-quote characters are interchangeable
    * string literals can be written enclosed in either two single or two double quotes
    * The reason for supporting both is that it allows you to embed a quote character of the other variety inside a string without escaping it with a backslash
    * Standard: **'standard'**
* Python automatically concatenates adjacent string literals in any expression
    * Adding commas between these strings would result in a tuple, not a string
* **if Python does not recognize the character after a \ as being a valid escape code, it simply keeps the backslash in the resulting string**

```python
title = "Meaning " 'of' " Life"
title # 'Meaning of Life'

title = "Meaning ", 'of', " Life"
title # ('Meaning ', 'of', ' Life')
```

## Raw Strings Suppress Escapes

* `myfile = open('C:\new\text.dat', 'w')`
* the call tries to open a file named "C:(newline)ew(tab)ext.dat"
    * If the letter `r` (uppercase or lowercase) appears just before the opening quote of a string, it turns off the escape mechanism. The result is that Python retains your backslashes literally, exactly as you type them.
* `myfile = open(r'C:\new\text.dat', 'w')` or `myfile = open('C:\\new\\text.dat', 'w')`

## Triple Quotes Code Multiline Block Strings

* Python collects all the triple-quoted text into a single multiline string, with embedded newline characters (`\n`) at the places where your code has line breaks
* triple-quoted strings will retain all the enclosed text, including any to the right of your code that you might intend as comments
* put your comments above or below the quoted text
* triple-quoted strings are also sometimes used as a way to multiline comments

```python
X = 1
"""
import os
print(os.getcwd())
"""
Y = 2
```

## Indexing and Slicing

* `S[:]` fetches items at offsets 0 through the end--making a top-level copy of S
* Extended slicing `(S[i:j:k])` accepts a step (or stride) k, which defaults to +1
* `S[::-1]` collects items in the opposite order -- it reverses the sequence

## String Conversion Tools

* `"42" + 1`
* because `+` can mean both addition and concatenation, the choice of conversion would be ambiguous
* **In Python, magic is generally omitted if it will make your life more complex.**
* you need to employ conversion tools before you can treat a string like a number, or vice versa
    * `int("42"), str(42)`
* it is also possible to convert a single character to its underlying integer code (e.g., its ASCII byte value) by passing it to the built-in `ord` function
    * this returns the actual binary value used to represent the corresponding character in memory.
    * The `chr` function performs the inverse operation, taking an integer code and converting it to the corresponding character

```python
str(3.1415), float("1.5") # ('3.1415', 1.5)
text = "1.234E-10"
float(text) # 1.234e-10

ord('s') # 115
chr(115) # 's'
int('1101', 2) # 13 - Convert binary to integer: built-in
bin(13) # '0b1101' - Convert integer to binary: built-in
```

## String Methods

* The fact that concatenation operations and the `replace` method generate new string objects each time they are run is actually a potential downside of using them to change strings
* If you have to apply many changes to a very large string, you might be able to improve your script's performance by converting the string to an object that does support in-place changes
* joining substrings all at once might often run faster than concatenating them individually

```python
S = 'spammy'
L = list(S)
L[3] = 'x'
L[4] = 'x'
S = ''.join(L)


line = 'aaa bbb ccc'
cols = line.split() # default: whitespace
cols # ['aaa', 'bbb', 'ccc']
```

## String formatting type codes

| Code | Meaning |
|------|---------|
| s | String (or any object's str(X) string) |
| r | Same as s, but uses repr, not str |
| c | Character (int or str) |
| d | Decimal (base-10 integer) |
| i | Integer |
| u | Same as d (obsolete: no longer unsigned) |
| o | Octal integer (base 8) |
| x or X | Hex integer (base 16) |
| e or E | Floating point with exponent |
| f or F | Floating-point decimal |
| g or G | Floating-point (e or f) or (E or F) |
| % | Literal % (coded as %%) |

* The general structure of conversion targets looks like this: `%[(keyname)][flags][width][.precision]typecode`
    * Provide a key name for indexing the dictionary used on the right side of the expression
    * List flags that specify things like left justification (`−`), numeric sign (`+`), a blank before positive numbers and a `-` for negatives (a space), and zero fills (`0`)
    * Give a total minimum field width for the substituted text
    * Set the number of digits (precision) to display after a decimal point for floating-point numbers
    * Both the width and precision parts can also be coded as a `*` to specify that they should take their values from the next item in the input values on the expression's right side (useful when this isn't known until runtime).

## String formatting expressions

* `'...%s...' % (values)`
* the `%` [1] operator provides a compact way to code multiple string substitutions all at once, instead of building and concatenating parts individually
* On the left of the `%` operator, provide a format string containing one or more embedded conversion targets, each of which starts with a `%` (e.g., `%d`).
* On the right of the `%` operator, provide the object (or objects, embedded in a tuple) that you want Python to insert into the format string on the left in place of the conversion target (or targets).
* when you're inserting more than one value, you need to group the values in a tuple `(...)`

```python
'That is %d %s bird!' % (1, 'dead') # 'That is 1 dead bird!'
'%d %s %g you' % (1, 'spam', 4.0) # '1 spam 4 you'

'%f, %.2f, %.*f' % (1/3.0, 1/3.0, 4, 1/3.0) # '0.333333, 0.33, 0.3333'

x = 1.23456789
'%-6.2f | %05.2f | %+06.1f' % (x, x, x) # '1.23   | 01.23 | +001.2'
```

### Dictionary-Based Formatting Expressions

```python
'%(qty)d more %(food)s' % {'qty': 1, 'food': 'spam'} # '1 more spam'

food = 'spam'
qty = 10
vars()

'%(qty)d more %(food)s' % vars() # '10 more spam'
```


## String formatting method calls

* `'...{}...'.format(values)`
* there is no best-use recommendation between expressions and method calls today, and most programmers would be well served by a cursory understanding of both schemes
* The string object's `format` method uses the subject string as a template, and takes any number of arguments that represent values to be substituted according to the template.
* Within the subject string, curly braces designate substitution targets and arguments to be inserted either by position (`{1}`), or keyword (`{food}`), or relative position (`{}`)

```python
# 'spam, ham and eggs'
'{0}, {1} and {2}'.format('spam', 'ham', 'eggs')
'{motto}, {pork} and {food}'.format(motto='spam', pork='ham', food='eggs')
'{motto}, {0} and {food}'.format('ham', motto='spam', food='eggs')
'{}, {} and {}'.format('spam', 'ham', 'eggs')

somelist = list('SPAM')
'first={0[0]}, third={0[2]}'.format(somelist) # 'first=S, third=A'
```

## General Type Categories

* strings are immutable sequences: they cannot be changed in place (the immutable part), and they are positionally ordered collections that are accessed by offset (the sequence part)
* there are three major type (and operation) categories in Python that have this generic nature
    * **Numbers (integer, floating-point, decimal, fraction, others)** Support addition, multiplication, etc.
    * **Sequences (strings, lists, tuples)** Support indexing, slicing, concatenation, etc.
    * **Mappings (dictionaries)** Support indexing by key, etc.
* Mutable Types Can Be Changed in Place
    * **Immutables (numbers, strings, tuples, frozensets)** None of the object types in the immutable category support in-place changes, though we can always run expressions to make new objects and assign their results to variables as needed.
    * **Mutables (lists, dictionaries, sets, bytearray)** the mutable types can always be changed in place with operations that do not create new objects.

# Lists and Dictionaries

* Python lists are
    * Ordered collections of arbitrary objects
    * Accessed by offset
    * Variable-length, heterogeneous, and arbitrarily nestable
        * sequence operations such as concatenation and slicing return new lists
    * Arrays of object references

| Operation | Interpretation |
|-----------|----------------|
| L = [] | empty list |
| L = [123, 'abc', 1.23, {}] | |
| L = ['Bob', 40.0, ['dev', 'mgr']] | nested sublists |
| L = list('spam') | List of an iterable's items |
| L = list(range(-4, 4)) | list of successive integers |
| L[i] | index |
| L[i][j] | index of index |
| L[i:j] | slice |
| len(L) | length |
| L1 + L2 | concatenate |
| L * 3 | repeat |
| for x in L: print(x) | iteration |
| 3 in L | membership |
| L.append(4) | growing |
| L.extend([5,6,7]) | |
| L.insert(i, X) | |
| L.index(X) | searching |
| L.count(X) | |
| L.sort() | sorting |
| L.reverse() | reversing |
| L.copy() | copying |
| L.clear() | clearing |
| L.pop(i) | shrinking |
| L.remove(X) | |
| del L[i] | |
| del L[i:j] | |
| L[i:j] = [] | |
| L[i] = 3 | Index assignment |
| L[i:j] = [4,5,6] | slice assignment |
| L = [x**2 for x in range(5)] | List comprehensions |
| list(map(ord, 'spam')) | maps |

## Basic List Operations

* the `+` operator works the same for lists and strings
    * it expects the same sort of sequence on both sides -- otherwise, you get a type error when the code runs
    * you cannot concatenate a list and a string unless you first convert the list to a string (using tools such as `str` or `%` formatting) or convert the string to a list (the `list` built-in function does the trick)

## List Comprehensions

* list comprehensions are a way to build a new list by applying an expression to each item in any iterable
* the `map` built-in function does similar work, but applies a function to items in a sequence and collects all the results in a new list

```python
res = [c * 4 for c in 'SPAM'] # ['SSSS', 'PPPP', 'AAAA', 'MMMM']

res = []
for c in 'SPAM':
    res.append(c * 4)
res # ['SSSS', 'PPPP', 'AAAA', 'MMMM']

list(map(abs, [-1, -2, 0, 1, 2])) # [1, 2, 0, 1, 2]
```

## Indexing, Slicing, and Matrixes

* slicing a list always returns a new list
* When using a list, you can change its contents by assigning to either a particular item (offset) or an entire section (slice)
* Slice assignment is perhaps best thought of as a combination of two steps:
    * 1. Deletion. The slice you specify to the left of the = is deleted.
    * 2. Insertion. The new items contained in the iterable object to the right of the = are inserted into the list on the left, at the place where the old slice was deleted.
* `append` expects you to pass in a single object, not a list
    * `L.append(X)` changes L in place
    * `L+[X]` makes a new list
 
```python
L = ['spam', 'Spam', 'SPAM!']
L[1] = 'eggs'
L[0:2] = ['eat', 'more'] # # Replaces items 0,1

L = list(range(10)) # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
L[0:5] = [-1,-2,-3] # [-1, -2, -3, 5, 6, 7, 8, 9]

L = [1]
L[:0] = [2, 3, 4] # insert all at :0, [2, 3, 4, 1]
L[len(L):] = [5, 6, 7] # insert all at len(L), [2, 3, 4, 1, 5, 6, 7]
```

### Sorting lists

* `sort`, orders a list in place
* it uses Python standard comparison tests
* by default sorts in ascending order
* You can modify sort behavior by passing in keyword arguments
* magnitude comparison of mixed types raises an exception
    * `[1, 2, 'spam'].sort()` will raise an exception
* Python no longer supports passing in an arbitrary comparison function to sorts, to implement different orderings
    * The suggested workaround is to use the `key=func` keyword argument to code value transformations during the sort
* `append` and sort change the associated list object in place, but don't return the list as a result
* **`sorted` sorts any collection (not just lists) and returns a new list for the result (instead of in-place changes)**

```python
L = ['abc', 'ABD', 'aBe']
L.sort() # ['ABD', 'aBe', 'abc']

L = ['abc', 'ABD', 'aBe']
L.sort(key=str.lower) # ['abc', 'ABD', 'aBe']

L = ['abc', 'ABD', 'aBe']
L.sort(key=str.lower, reverse=True) # ['aBe', 'ABD', 'abc']

# built-in function
sorted(L, key=str.lower, reverse=True) # ['abc', 'ABD', 'aBe']

# creates a new list
L = ['abc', 'ABD', 'aBe']
sorted([x.lower() for x in L], reverse=True) # ['abe', 'abd', 'abc']

students = [ ('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10) ]
students.sort(key = lambda student : student[2], reverse=True)
# [('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]

students.sort(key = lambda student : student[0].lower())
# [('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

### Other common list methods

* `reverse` reverses the list in-place
* `extend` and `pop` methods insert multiple items at and delete an item from the end of the list, respectively
* the `reversed` built-in function works much like sorted and returns a new result object, but **it must be wrapped in a list call**
* `extend` adds many items, and `append` adds one
* the list `pop` method is often used in conjunction with append to implement a quick last-in-first-out (LIFO) stack structure. The end of the list serves as the top of the stack

```python
#**************************************

L = [1, 2]
L.extend([3, 4, 5]) # [1, 2, 3, 4, 5]

L = [1,2]
L.append([3, 4, 5]) # [1, 2, [3, 4, 5]]

L = [1, 2, 3, 4]
list(reversed(L)) # [1, 2, 3, 4]

L = []
L.insert(99, '99') # ['99']
L.insert(0, '100') # ['100', '99']
```

### Other common list operations
