```r
library(dplyr)
```

The main idea behind grouping data is that you want to break up your dataset into groups of rows based on the values of one or more variables. The `group_by()` function is responsible for doing this.

Group cran by the package variable and store the result in a new variable called by_package: `by_package <- group_by(cran, package)`

```r
> by_package
Source: local data frame [225,468 x 11]
Groups: package

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

At the top of the output above, you'll see 'Groups: package', which tells us that this tbl has been grouped by the package variable. Everything else looks the same, but now any operation we apply to the grouped data will take place on a per package basis.

Recall that when we applied `mean(size)` to the original tbl_df via `summarize()`, it returned a single number -- the mean of all values in the size column. We may care about what that number is, but wouldn't it be so much more interesting to look at the mean download size for each unique package? That's exactly what you'll get if you use `summarize()` to apply `mean(size)` to the grouped data in by_package.

```r
> summarize(by_package, mean(size))
Source: local data frame [6,023 x 2]

       package mean(size)
1           A3   62194.96
2  ABCExtremes   22904.33
3     ABCoptim   17807.25
4        ABCp2   30473.33
5       ACCLMA   33375.53
6          ACD   99055.29
7         ACNE   96099.75
8        ACTCD  134746.27
9    ADGofTest   12262.91
10        ADM3 1077203.47
..         ...        ...
```

Instead of returning a single value, `summarize()` now returns the mean size for EACH package in our dataset.

```r
# Compute four values, in the following order, from
# the grouped data:
#
# 1. count = n()
# 2. unique = n_distinct(ip_id)
# 3. countries = n_distinct(country)
# 4. avg_bytes = mean(size)
#
# A few thing to be careful of:
#
# 1. Separate arguments by commas
# 2. Make sure you have a closing parenthesis
# 3. Check your spelling!
# 4. Store the result in pack_sum (for 'package summary')
#
# You should also take a look at ?n and ?n_distinct, so
# that you really understand what is going on.

pack_sum <- summarize(by_package,
  count = n(),
  unique = n_distinct(ip_id),
  countries = n_distinct(country),
  avg_bytes = mean(size))

> pack_sum
Source: local data frame [6,023 x 5]

       package count unique countries  avg_bytes
1           A3    25     24        10   62194.96
2  ABCExtremes    18     17         9   22904.33
3     ABCoptim    16     15         9   17807.25
4        ABCp2    18     17        10   30473.33
5       ACCLMA    15     14         9   33375.53
6          ACD    17     16        10   99055.29
7         ACNE    16     15        10   96099.75
8        ACTCD    15     14         9  134746.27
9    ADGofTest    47     44        20   12262.91
10        ADM3    17     16        10 1077203.47
  ..         ...   ...    ...       ...        ...
```

The 'count' column, created with `n()`, contains the total number of rows (i.e. downloads) for each package. The 'unique' column, created with `n_distinct(ip_id)`, gives the total number of unique downloads for each package, as measured by the number of distinct ip_id's. The 'countries' column, created with `n_distinct(country)`, provides the number of countries in which each package was downloaded. And finally, the 'avg_bytes' column, created with `mean(size)`, contains the mean download size (in bytes) for each package.

Naturally, we'd like to know which packages were most popular on the day these data were collected (July 8, 2014). Let's start by isolating the top 1% of packages, based on the total number of downloads as measured by the 'count' column.

We need to know the value of 'count' that splits the data into the top 1% and bottom 99% of packages based on total downloads. In statistics, this is called the 0.99, or 99%, sample quantile. Use `quantile(pack_sum$count, probs = 0.99)` to determine this number.

Use `filter()` to select all rows from pack_sum for which 'count' is strictly greater (>) than 679. Store the result in a new variable called top_counts: `top_counts <- filter(pack_sum, count > 679)`

`arrange() `the rows of top_counts based on the 'count' column. We want the packages with the highest number of downloads at the top, which means we want 'count' to be in descending order: `arrange(top_counts, desc(count))`

Perhaps we're more interested in the number of *unique* downloads on this particular day. In other words, if a package is downloaded ten times in one day from the same computer, we may wish to count that as only one download. That's what the 'unique' column will tell us. Like we did with 'count', let's find the 0.99, or 99%, quantile for the 'unique' variable with `quantile(pack_sum$unique, probs = 0.99)`.

Apply `filter()` to pack_sum to select all rows corresponding to values of 'unique' that are strictly greater than 465. Assign the result to a variable called top_unique: `top_unique <- filter(pack_sum, unique > 465)`


Our final metric of popularity is the number of distinct countries from which each package was downloaded. We'll approach this one a little differently to introduce you to a method called 'chaining' (or 'piping').

Chaining allows you to string together multiple function calls in a way that is compact and readable, while still accomplishing the desired result.

```r
# Don't change any of the code below. Just type submit()
# when you think you understand it.

# We've already done this part, but we're repeating it
# here for clarity.

by_package <- group_by(cran, package)
pack_sum <- summarize(by_package,
  count = n(),
  unique = n_distinct(ip_id),
  countries = n_distinct(country),
  avg_bytes = mean(size))

  # Here's the new bit, but using the same approach we've
  # been using this whole time.

  top_countries <- filter(pack_sum, countries > 60)
  result1 <- arrange(top_countries, desc(countries), avg_bytes)

  # Print the results to the console.
  print(result1)
```

It's worth noting that we sorted primarily by country, but used avg_bytes (in ascending order) as a tie breaker. This means that if two packages were downloaded from the same number of countries, the package with a smaller average download size received a higher ranking.

We'd like to accomplish the same result as the last script, but avoid saving our intermediate results. This requires embedding function calls within one another.

```r
# Don't change any of the code below. Just type submit()
# when you think you understand it. If you find it
# confusing, you're absolutely right!

result2 <-
arrange(
  filter(
    summarize(
      group_by(cran,
        package
        ),
        count = n(),
        unique = n_distinct(ip_id),
        countries = n_distinct(country),
        avg_bytes = mean(size)
        ),
        countries > 60
        ),
        desc(countries),
        avg_bytes
        )

        print(result2)
```

That's exactly what we've done in this script. The result is equivalent, but the code is much less readable and some of the arguments are far away from the function to which they belong.

```r
# Read the code below, but don't change anything. As
# you read it, you can pronounce the %>% operator as
# the word 'then'.
#
# Type submit() when you think you understand
# everything here.

result3 <-
cran %>%
group_by(package) %>%
summarize(count = n(),
unique = n_distinct(ip_id),
countries = n_distinct(country),
avg_bytes = mean(size)
) %>%
filter(countries > 60) %>%
arrange(desc(countries), avg_bytes)

# Print result to console
print(result3)
```

In this script, we've used a special chaining operator, `%>%`, which is part of the dplyr package. You can pull up the related documentation with ?chain. The benefit of `%>%` is that it allows us to chain the function calls in a linear fashion. The code to the right of `%>%` operates on the result from the code to the left of `%>%`.

```r
# select() the following columns from cran. Keep in mind
# that when you're using the chaining operator, you don't
# need to specify the name of the data tbl in your call to
# select().
#
# 1. ip_id
# 2. country
# 3. package
# 4. size
#
# The call to print() at the end of the chain is optional,
# but necessary if you want your results printed to the
# console. Note that since there are no additional arguments
# to print(), you can leave off the parentheses after
# the function name. This is a convenient feature of the %>%
# operator.

cran %>%
select(ip_id, country, package, size) %>%
print
```

```
# Use mutate() to add a column called size_mb that contains
# the size of each download in megabytes (i.e. size / 2^20).
#
# If you want your results printed to the console, add
# print to the end of your chain.

cran %>%
select(ip_id, country, package, size) %>%
mutate(size_mb = size / 2^20) %>%
print
```

```r
# Use filter() to select all rows for which size_mb is
# less than or equal to (<=) 0.5.
#
# If you want your results printed to the console, add
# print to the end of your chain.

cran %>%
select(ip_id, country, package, size) %>%
mutate(size_mb = size / 2^20) %>%
filter(size_mb <= .5) %>%
print
```

```r
# arrange() the result by size_mb, in descending order.
#
# If you want your results printed to the console, add
# print to the end of your chain.

cran %>%
select(ip_id, country, package, size) %>%
mutate(size_mb = size / 2^20) %>%
filter(size_mb <= 0.5) %>%
arrange(desc(size_mb)) %>%
print
```
