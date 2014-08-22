# SSL

* do yum install mod24_ssl
* sudo mkdir -p /etc/ssl/localcerts
* sudo openssl req -new -x509 -days 10000 -nodes -out /etc/ssl/localcerts/apache.pem -keyout /etc/ssl/localcerts/apache.key

```
    Country Name (2 letter code) [XX]:BR
    State or Province Name (full name) []:SP
    Locality Name (eg, city) [Default City]:Sao Paulo
    Organization Name (eg, company) [Default Company Ltd]:ReConf Team
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:reconfserver.dyndns.org
    Email Address []:reconf.project@gmail.com
```

* sudo nano /etc/httpd/conf.d/reconfserver_ssl.conf

```
<VirtualHost *:443>
  ServerName  reconfserver.dyndns.org

  SSLEngine on
  SSLCertificateFile /etc/ssl/localcerts/apache.pem
  SSLCertificateKeyFile /etc/ssl/localcerts/apache.key

  RewriteEngine on

  RewriteCond     %{REQUEST_URI}  \.*$
  RewriteRule     ^/(.*)          http://localhost:8080/$1 [P,L]
  ProxyRequests           Off
  ProxyVia                Block
  ProxyPreserveHost	  On
  ProxyTimeout            10
</VirtualHost>
```
