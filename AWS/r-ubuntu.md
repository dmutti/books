# Knitr @ Ubuntu

## R Core and RStudio

* Run on terminal

```bash
sudo apt-get update
sudo apt-get upgrade
sudo nano /etc/apt/sources.list
```

* Add to the end of the file `deb http://cran.rstudio.com/bin/linux/ubuntu trusty/`
* Run on terminal

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 51716619E084DAB9
sudo apt-get update
sudo apt-get install r-base-core
sudo apt-get install gdebi-core
wget https://download1.rstudio.org/rstudio-0.99.902-amd64.deb
sudo gdebi rstudio-0.99.902-amd64.deb
```

## R Packages

* Start R on terminal

```bash
sudo R
```

* Install packages

```r
install.packages(c('knitr','markdown'))
```

* Run on terminal

```bash
Rscript -e "library(knitr); library(markdown); knit('file.Rmd'); markdownToHTML('file.md', 'gnip-saopaulo-bb.html');"
```

## Bonus wkhtmltopdf

* On terminal
```bash
sudo add-apt-repository ppa:ecometrica/servers
sudo apt-get update
sudo apt-get install wkhtmltopdf
sudo shutdown -r now
sudo cp /usr/bin/wkhtmltopdf /usr/local/bin
sudo chmod a+x /usr/local/bin/wkhtmltopdf
sudo apt-get install xvfb
sudo nano /usr/local/bin/wkhtmltopdf.sh
```

* Add to the end of the file `xvfb-run -a -s "-screen 0 1024x768x16" wkhtmltopdf "$@"`
 
* On terminal
```bash
sudo chmod a+x /usr/local/bin/wkhtmltopdf.sh
```
