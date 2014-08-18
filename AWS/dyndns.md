# DynDNS client

* http://blog.optimalbi.com/2014/04/08/amazon-dynamic-ip-addresses/
* wget http://sourceforge.net/projects/ddclient/files/latest/download -O/tmp/ddclient-3.8.2.tar.bz2
* sudo su
    * tar xvjf /tmp/ddclient-3.8.2.tar.bz2
    * cp /tmp/ddclient /usr/sbin/ddclient
    * mkdir /etc/ddclient/
    * cp /tmp/ddclient-3.8.2/sample-etc_ddclient.conf /etc/ddclient/ddclient.conf
* ddclient.conf

```properties
syslog=yes
daemon=600
cache=/tmp/ddclient.cache
pid=/var/run/ddclient.pid
use=web, web=checkip.dyndns.com/, web-skip='IP Address'
login=LOGIN_NOT_EMAIL
password=PASSWORD
protocol=dyndns2
server=members.dyndns.org
wildcard=YES
yaddayaddayadda.dyndns.org
```

* You can then test the connection using
    * sudo ddclient -daemon=0 -debug -verbose -noquiet
*  To have the ddclient run at start up run the following commands
    * sudo cp /tmp/ddclient-3.8.2/sample-etc_rc.d_init.d_ddclient.redhat /etc/ddclient/ddclient_control
* Edit the file /etc/rc.local and add the following line at the end of the file
    * /etc/ddclient/ddclient_control start
