# Introduction

### How to Get Help in R

```r
?mean #help("mean") opens the help page for the mean function
?"+" #help("+") opens the help page for addition
?"if" #help("if") opens the help page for if, used for branching code
??plotting #help.search("plotting") searches for topics containing words like "plotting"
??"regression model" #help.search("regression model") searches for topics containing phrases like this
```

* The `apropos` function finds variables (including functions) that match its input
    * you can also do fancier matching with apropos using regular expressions
    * `apropos("vector")`
* Most functions have examples that you can run to get a better idea of how they work
    * Use the `example` function to run these

```r
example(plot)
demo() #list all demonstrations
demo(Japanese)
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
install.packages("installr") #download and install the package named installr
library(installr) #load the installr package
install.RStudio() #download and install the RStudio IDE
install.Rtools() #Rtools is needed for building your own packages
install.git() #git provides version control for your code
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
