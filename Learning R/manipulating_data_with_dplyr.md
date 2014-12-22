As you may know, "CRAN is a network of ftp and web servers around the world that store identical, up-to-date, versions of code and documentation for R (http://cran.rstudio.com/). RStudio maintains one of these so-called 'CRAN mirrors' and they generously make their download logs publicly available http://cran-logs.rstudio.com/). We'll be working with the log from July 8, 2014, which contains information on roughly 225,000 package downloads.

```r
mydf <- read.csv("2014-07-08.csv", stringsAsFactors = FALSE)
```

The first step of working with data in dplyr is to load the data into what the package authors call a 'data frame tbl' or 'tbl_df'

```r
cran <- tbl_df(mydf)
```

```r
> cran
Source: local data frame [225,468 x 11]

X       date     time    size r_version r_arch      r_os      package version country
1   1 2014-07-08 00:54:41   80589     3.1.0 x86_64   mingw32    htmltools   0.2.4      US
2   2 2014-07-08 00:59:53  321767     3.1.0 x86_64   mingw32      tseries 0.10-32      US
3   3 2014-07-08 00:47:13  748063     3.1.0 x86_64 linux-gnu        party  1.0-15      US
4   4 2014-07-08 00:48:05  606104     3.1.0 x86_64 linux-gnu        Hmisc  3.14-4      US
5   5 2014-07-08 00:46:50   79825     3.0.2 x86_64 linux-gnu       digest   0.6.4      CA
6   6 2014-07-08 00:48:04   77681     3.1.0 x86_64 linux-gnu randomForest   4.6-7      US
7   7 2014-07-08 00:48:35  393754     3.1.0 x86_64 linux-gnu         plyr   1.8.1      US
8   8 2014-07-08 00:47:30   28216     3.0.2 x86_64 linux-gnu      whisker   0.3-2      US
9   9 2014-07-08 00:54:58    5928        NA     NA        NA         Rcpp  0.10.4      CN
10 10 2014-07-08 00:15:35 2206029     3.0.2 x86_64 linux-gnu     hflights     0.1      US
.. ..        ...      ...     ...       ...    ...       ...          ...     ...     ...
Variables not shown: ip_id (int)
```
