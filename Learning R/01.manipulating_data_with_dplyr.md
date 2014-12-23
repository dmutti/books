As you may know, "CRAN is a network of ftp and web servers around the world that store identical, up-to-date, versions of code and documentation for R (http://cran.rstudio.com/). RStudio maintains one of these so-called 'CRAN mirrors' and they generously make their download logs publicly available http://cran-logs.rstudio.com/). We'll be working with the log from July 8, 2014, which contains information on roughly 225,000 package downloads.

```r
mydf <- read.csv("2014-07-08.csv", stringsAsFactors = FALSE)
```

The first step of working with data in dplyr is to load the data into what the package authors call a 'data frame tbl' or 'tbl_df'

```r
cran <- tbl_df(mydf)
```

```r
Source: local data frame [225,468 x 11]

    X       date     time    size r_version r_arch      r_os      package version country ip_id
1   1 2014-07-08 00:54:41   80589     3.1.0 x86_64   mingw32    htmltools   0.2.4      US     1
2   2 2014-07-08 00:59:53  321767     3.1.0 x86_64   mingw32      tseries 0.10-32      US     2
3   3 2014-07-08 00:47:13  748063     3.1.0 x86_64 linux-gnu        party  1.0-15      US     3
4   4 2014-07-08 00:48:05  606104     3.1.0 x86_64 linux-gnu        Hmisc  3.14-4      US     3
5   5 2014-07-08 00:46:50   79825     3.0.2 x86_64 linux-gnu       digest   0.6.4      CA     4
6   6 2014-07-08 00:48:04   77681     3.1.0 x86_64 linux-gnu randomForest   4.6-7      US     3
7   7 2014-07-08 00:48:35  393754     3.1.0 x86_64 linux-gnu         plyr   1.8.1      US     3
8   8 2014-07-08 00:47:30   28216     3.0.2 x86_64 linux-gnu      whisker   0.3-2      US     5
9   9 2014-07-08 00:54:58    5928        NA     NA        NA         Rcpp  0.10.4      CN     6
10 10 2014-07-08 00:15:35 2206029     3.0.2 x86_64 linux-gnu     hflights     0.1      US     7
.. ..        ...      ...     ...       ...    ...       ...          ...     ...     ...   ...

```

dplyr supplies five 'verbs' that cover all fundamental data manipulation tasks: `select()`, `filter()`, arrange(), mutate(), and summarize().


Use `select(cran, ip_id, package, country)` to select only the ip_id, package, and country variables from the cran dataset.

Use `select(cran, r_arch:country)` to select all columns starting from r_arch and ending with country.

We can also select the same columns in reverse order using `select(cran, country:r_arch)`

Instead of specifying the columns we want to keep, we can also specify the columns we want to throw away. To see how this works, do `select(cran, -time)` to omit the time column. The negative sign in front of time tells `select()` that we DON'T want the time column. Let's combine strategies to omit all columns from X through size (X:size): `select(cran, -(X:size))`

Now that you know how to select a subset of columns using `select()`, a natural next question is "How do I select a subset of rows?" That's where the `filter()` function comes in.

Use `filter(cran, package == "swirl")` to select all rows for which the package variable is equal to "swirl".

You can specify as many conditions as you want, separated by commas. For example `filter(cran, r_version == "3.1.1", country == "US")` will return all rows of cran corresponding to downloads from users in the US running R version 3.1.1. The conditions passed to `filter()` can make use of any of the standard comparison operators.

We can also request rows for which EITHER one condition OR another condition are TRUE. For example, `filter(cran, country == "US" | country == "IN")` will gives us all rows for which the country variable equals either "US" or "IN".

Use `filter()` to return all rows of cran for which r_version is NOT NA: `filter(cran, !is.na(r_version))`


Inherent in `select()` was also the ability to arrange our selected columns in any order we please. Sometimes we want to order the rows of a dataset according to the values of a particular variable. This is the job of `arrange()`.

To see how `arrange()` works, let's first take a subset of cran. `select()` all columns from size through ip_id and store the result in cran2: `cran2 <- select(cran, size:ip_id)` Now, to order the ROWS of cran2 so that ip_id is in ascending order (from small to large), type `arrange(cran2, ip_id)`. To do the same, but in descending order, change the second argument to `desc(ip_id)`.


We can also arrange the data according to the values of multiple variables. For example, `arrange(cran2, package, ip_id)` will first arrange by package names (ascending alphabetically), then by ip_id. This means that if there are multiple rows with the same value for package, they will be sorted by ip_id (ascending numerically).

Arrange cran2 by the following three variables, in this order: country (ascending), r_version (descending), and ip_id (ascending): `arrange(cran2, country, desc(r_version), ip_id)`


Use `select()` to grab 3 columns -- ip_id, package, and size (in that order) -- and store the result in a new variable called cran3: `cran3 <- select(cran, ip_id, package, size)`

It's common to create a new variable based on the value of one or more variables already in a dataset. The `mutate()` function does exactly this.

We want to add a column called size_mb that contains the download size in megabytes. Here's the code to do it: `mutate(cran3, size_mb = size / 2^20)`


One very nice feature of `mutate()` is that you can use the value computed for your second column (size_mb) to create a third column, all in the same line of code: `mutate(cran3, size_mb = size / 2^20, size_gb = size_mb / 2^10)`

The last of the five core dplyr verbs, `summarize()`, collapses the dataset to a single row. Let's say we're interested in knowing the average download size. `summarize(cran, avg_bytes = mean(size))` will yield the mean value of the size variable. Here we've chosen to label the result 'avg_bytes', but we could have named it anything.

`summarize()` is most useful when working with data that has been grouped by the values of a particular variable.
