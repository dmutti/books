# Introduction

### How to Get Help in R

```r
> ?mean #help("mean") opens the help page for the mean function
> ?"+" #help("+") opens the help page for addition
> ?"if" #help("if") opens the help page for if, used for branching code
> ??plotting #help.search("plotting") searches for topics containing words like "plotting"
> ??"regression model" #help.search("regression model") searches for topics containing phrases like this
```

* The `apropos` function finds variables (including functions) that match its input
    * you can also do fancier matching with apropos using regular expressions
    * `apropos("vector")`
* Most functions have examples that you can run to get a better idea of how they work
    * Use the `example` function to run these

```r
> example(plot)
> demo() #list all demonstrations
> demo(Japanese)
```

* R is modular and is split into packages, some of which contain vignettes
    * short documents on how to use the packages
    * You can browse all the vignettes on your machine using `browseVignettes()`
    * You can also access a specific vignette using the `vignette` function: `vignette("Sweave", package = "utils")`
* The help search operator `??` and `browseVignettes` will only find things in packages that you have installed on your machine
    * If you want to look in any package, you can use RSiteSearch, which runs a query at http://search.r-project.org
    * Multiword terms need to be wrapped in braces: `RSiteSearch("{Bayesian regression}")`

### Installing Extra Related Software

```r
> install.packages("installr") #download and install the package named installr
> library(installr) #load the installr package
> install.RStudio() #download and install the RStudio IDE
> install.Rtools() #Rtools is needed for building your own packages
> install.git() #git provides version control for your code
```

# A Scientific Calculator

### Mathematical Operations and Vectors

* The `+` operator performs addition
    * you can use it to add two vectors
* The colon operator `:` creates a sequence from one number to the next
* the `c` function concatenates values, in this case to create vectors
* Floating point division
    * `/`
    * 1:10 / 3
* Integer division
    * `%/%`
    * 1:10 %/% 3
* Remainder after division
    * `%%`
    * 1:10 %% 3
* To compare integer values for equality, use `==`
    * R also provides the function `all.equal` for checking equality of numbers
    * This provides a tolerance level (by default, about 1.5e-8), so that rounding errors less than the tolerance are ignored
    * all.equal(sqrt(2) ^ 2, 2) #TRUE
    * If the values to be compared are not the same, `all.equal` returns a report on the differences
    * If you require a TRUE or FALSE value, then you need to wrap the call to `all.equal` in a call to `isTRUE`
    * isTRUE(all.equal(sqrt(2) ^ 2, 3))

### Assigning Variables

* We can assign a (local) variable using either `<-` or `=`, though for historical reasons, `<-` is preferred
* Variable names can contain letters, numbers, dots, and underscores, but they can’t start with a number, or a dot followed by a number
* In some locales, non-ASCII letters are allowed, but for code portability it is better to stick to “a” to “z” (and “A” to “Z”).
* The help page `?make.names` gives precise details about what is and isn’t allowed.
* We can also do global assignment using `<<-`
* There is one more method of variable assignment, via the `assign` function
    * assign("my_local_variable", 9 ^ 3 + 10 ^ 3)
    * assign("my_global_variable", 1 ^ 3 + 12 ^ 3, globalenv())
    * the `assign` function doesn’t check its first argument to see if it is a valid variable name

* If you want to assign a value and print it all in one line, you have two possibilities
    * you can put multiple statements on one line by separating them with a semicolon, `;`
    * z <- rnorm(5); z
    * you can wrap the assignment in parentheses, `()`
    * (zz <- rlnorm(5))

### Special Numbers

* `Inf`, `-Inf`, `NaN`, and `NA`
* `is.finite(x)`, `is.infinite(x)`, `is.nan(x)`, `is.na(x)`

### Logical Vectors

* other useful functions for dealing with logical vectors are `any` and `all`, which return TRUE if the input vector contains at least one TRUE value or only TRUE values

```r
> none_true <- c(FALSE, FALSE, FALSE)
> some_true <- c(FALSE, TRUE, FALSE)
> all_true <- c(TRUE, TRUE, TRUE)

> any(none_true) # FALSE
> any(some_true) # TRUE
> any(all_true)  # TRUE
> all(none_true) # FALSE
> all(some_true) # FALSE
> all(all_true)  # TRUE
```

# Inspecting Variables and Your Workspace

## Classes

* ou can find out what the class of a variable is using `class(my_variable)`
* all variables also have an internal storage type (accessed via `typeof`), a mode (see `mode`), and a storage mode (`storage.mode`).
    * Types, modes, and storage modes mostly exist for legacy purposes
* R contains three different classes of numeric variable:  numeric for floating point values;  integer for integers; and  complex for complex numbers.

```r
> class(sqrt(1:10))
## [1] "numeric"

> class(3 + 1i)
## [1] "complex"

> class(1)
## [1] "numeric"

> class(1L)
## [1] "integer"
```

* In addition to the three numeric classes and the logical class that we’ve seen already, there are three more classes of vectors
    * `character` for storing text
    * `factor`s for storing categorical data. factors are integers with labels
    * and `raw` for storing binary data.
* Arrays contain multidimensional data, and matrices (via the  matrix class) are the special case of two-dimensional arrays.

### Factors

```r
> (gender <- factor(c("male", "female", "female", "male", "female")))
## [1] male female female male female
## Levels: female male

> levels(gender)
## [1] "female" "male"

> nlevels(gender)
## [1] 2
```

* The contents of the factor look much like their character equivalent -- you get readable labels for each value. Those labels are confined to specific values (in this case "female" and "male") known as the `levels` of the factor
* By default, factor levels are assigned alphabetically
* Underneath the hood, the factor values are stored as integers rather than characters. You can see this more clearly by calling `as.integer`

```r
> as.integer(gender)
## [1] 2 1 1 2 1
```

## Checking and Changing Classes
