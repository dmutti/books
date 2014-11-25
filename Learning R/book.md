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
    
