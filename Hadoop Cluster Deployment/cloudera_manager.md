# Com Proxy

## Baixar o Cloudera Manager
* wget -e use_proxy=yes -e http_proxy=a1-integproxy-s-pla1.host.intranet:3128 http://archive.cloudera.com/cm5/installer/latest/cloudera-manager-installer.bin

## Configurar o yum
* nano /etc/yum.conf
* adicionar
  * proxy=http://a1-integproxy-s-pla1.host.intranet:3128

# Sem Proxy

## Repo
* wget --no-parent --recursive --domains archive.cloudera.com http://archive.cloudera.com/cm5/redhat/6/x86_64/cm/5/
* wget http://archive.cloudera.com/cm5/redhat/6/x86_64/cm/cloudera-manager.repo
* wget http://archive.cloudera.com/cm5/redhat/6/x86_64/cm/RPM-GPG-KEY-cloudera

-----------

* wget --no-parent --recursive --domains archive.cloudera.com http://archive.cloudera.com/cdh5/redhat/6/x86_64/cdh/5/
* wget http://archive.cloudera.com/cdh5/redhat/6/x86_64/cdh/cloudera-cdh5.repo
* wget http://archive.cloudera.com/cdh5/redhat/6/x86_64/cdh/RPM-GPG-KEY-cloudera

-----------

* http://archive.cloudera.com/redhat/cdh/RPM-GPG-KEY-cloudera

-----------

* Modificar os arquivos .repo
  * cloudera-cdh5.repo
  * cloudera-manager.repo
  * gpgcheck = 0
* Modificar o /etc/yum.conf
  * gpgcheck=0

------------

* copiar os arquivos cloudera-cdh5.repo e cloudera-manager.repo para /etc/yum.repos.d

## Parcels
* wget http://archive-primary.cloudera.com/cdh5/parcels/latest/CDH-5.0.2-1.cdh5.0.2.p0.13-el6.parcel
* wget http://archive-primary.cloudera.com/impala/parcels/latest/IMPALA-1.3.1-1.impala1.3.1.p0.1172-el6.parcel
* wget http://archive-primary.cloudera.com/search/parcels/latest/SOLR-1.3.0-1.cdh4.5.0.p0.9-el6.parcel

## Estrutura de Diretórios

### /export/repo/cdh5/parcels/latest
```
CDH-5.0.2-1.cdh5.0.2.p0.13-el6.parcel
CDH-5.0.2-1.cdh5.0.2.p0.13-el6.parcel.sha
IMPALA-1.3.1-1.impala1.3.1.p0.1172-el6.parcel
IMPALA-1.3.1-1.impala1.3.1.p0.1172-el6.parcel.sha
manifest.json
SOLR-1.3.0-1.cdh4.5.0.p0.9-el6.parcel
SOLR-1.3.0-1.cdh4.5.0.p0.9-el6.parcel.sha
```

* Para gerar o arquivo .sha
  * Junto com o arquivo parcel, existe um arquivo manifest.json
  * No arquivo, para cada versão existe uma linha de hash; ex: `"hash": "4ed1e7aebc67f442c7a25cd56c50523ff90ffd1a"`
  * Copiar o valor do hash com aspas e executar `echo "${hashDoArquivo}" > nomeDoArquivo.parcel.sha`


### /export/repo/cdh5/redhat/6/x86_64/cdh
```
cloudera-cdh5.repo
RPM-GPG-KEY-cloudera
```

### /export/cdh5/redhat/6/x86_64/cdh/5/repodata
```
filelists.xml.gz
filelists.xml.gz.asc
other.xml.gz
other.xml.gz.asc
primary.xml.gz
primary.xml.gz.asc
repomd.xml
repomd.xml.asc
```

### Diretório /export/repo/cdh5/redhat/6/x86_64/cdh/5/RPMS/noarch
```
avro-doc-1.7.5+cdh5.0.2+20-1.cdh5.0.2.p0.23.el6.noarch.rpm
avro-libs-1.7.5+cdh5.0.2+20-1.cdh5.0.2.p0.23.el6.noarch.rpm
avro-tools-1.7.5+cdh5.0.2+20-1.cdh5.0.2.p0.23.el6.noarch.rpm
bigtop-tomcat-0.7.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.noarch.rpm
bigtop-utils-0.7.0+cdh5.0.2+0-1.cdh5.0.2.p0.23.el6.noarch.rpm
crunch-0.9.0+cdh5.0.2+25-1.cdh5.0.2.p0.14.el6.noarch.rpm
crunch-doc-0.9.0+cdh5.0.2+25-1.cdh5.0.2.p0.14.el6.noarch.rpm
flume-ng-1.4.0+cdh5.0.2+115-1.cdh5.0.2.p0.14.el6.noarch.rpm
flume-ng-agent-1.4.0+cdh5.0.2+115-1.cdh5.0.2.p0.14.el6.noarch.rpm
flume-ng-doc-1.4.0+cdh5.0.2+115-1.cdh5.0.2.p0.14.el6.noarch.rpm
hbase-solr-1.3+cdh5.0.2+42-1.cdh5.0.2.p0.14.el6.noarch.rpm
hbase-solr-doc-1.3+cdh5.0.2+42-1.cdh5.0.2.p0.14.el6.noarch.rpm
hbase-solr-indexer-1.3+cdh5.0.2+42-1.cdh5.0.2.p0.14.el6.noarch.rpm
hive-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-hbase-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-hcatalog-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-hcatalog-server-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-jdbc-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-metastore-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-server-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-server2-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-webhcat-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
hive-webhcat-server-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.el6.noarch.rpm
kite-0.10.0+cdh5.0.2+86-1.cdh5.0.2.p0.15.el6.noarch.rpm
llama-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.noarch.rpm
llama-doc-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.noarch.rpm
llama-master-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.noarch.rpm
mahout-0.8+cdh5.0.2+31-1.cdh5.0.2.p0.14.el6.noarch.rpm
mahout-doc-0.8+cdh5.0.2+31-1.cdh5.0.2.p0.14.el6.noarch.rpm
oozie-4.0.0+cdh5.0.2+180-1.cdh5.0.2.p0.14.el6.noarch.rpm
oozie-client-4.0.0+cdh5.0.2+180-1.cdh5.0.2.p0.14.el6.noarch.rpm
parquet-1.2.5+cdh5.0.2+95-1.cdh5.0.2.p0.19.el6.noarch.rpm
parquet-format-1.0.0+cdh5.0.2+7-1.cdh5.0.2.p0.30.el6.noarch.rpm
pig-0.12.0+cdh5.0.2+34-1.cdh5.0.2.p0.15.el6.noarch.rpm
pig-udf-datafu-1.1.0+cdh5.0.2+18-1.cdh5.0.2.p0.21.el6.noarch.rpm
search-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.14.el6.noarch.rpm
sentry-1.2.0+cdh5.0.2+75-1.cdh5.0.2.p0.14.el6.noarch.rpm
solr-4.4.0+cdh5.0.2+190-1.cdh5.0.2.p0.14.el6.noarch.rpm
solr-doc-4.4.0+cdh5.0.2+190-1.cdh5.0.2.p0.14.el6.noarch.rpm
solr-mapreduce-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.14.el6.noarch.rpm
solr-server-4.4.0+cdh5.0.2+190-1.cdh5.0.2.p0.14.el6.noarch.rpm
spark-core-0.9.0+cdh5.0.2+36-1.cdh5.0.2.p0.15.el6.noarch.rpm
spark-master-0.9.0+cdh5.0.2+36-1.cdh5.0.2.p0.15.el6.noarch.rpm
spark-python-0.9.0+cdh5.0.2+36-1.cdh5.0.2.p0.15.el6.noarch.rpm
spark-worker-0.9.0+cdh5.0.2+36-1.cdh5.0.2.p0.15.el6.noarch.rpm
sqoop-1.4.4+cdh5.0.2+48-1.cdh5.0.2.p0.15.el6.noarch.rpm
sqoop2-1.99.3+cdh5.0.2+30-1.cdh5.0.2.p0.14.el6.noarch.rpm
sqoop2-client-1.99.3+cdh5.0.2+30-1.cdh5.0.2.p0.14.el6.noarch.rpm
sqoop2-server-1.99.3+cdh5.0.2+30-1.cdh5.0.2.p0.14.el6.noarch.rpm
sqoop-metastore-1.4.4+cdh5.0.2+48-1.cdh5.0.2.p0.15.el6.noarch.rpm
whirr-0.9.0+cdh5.0.2+11-1.cdh5.0.2.p0.14.el6.noarch.rpm
```

### /export/repo/cdh5/redhat/6/x86_64/cdh/5/RPMS/x86_64
```
bigtop-jsvc-0.6.0+cdh5.0.2+432-1.cdh5.0.2.p0.18.el6.x86_64.rpm
bigtop-jsvc-debuginfo-0.6.0+cdh5.0.2+432-1.cdh5.0.2.p0.18.el6.x86_64.rpm
hadoop-0.20-conf-pseudo-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-0.20-mapreduce-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-0.20-mapreduce-jobtracker-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-0.20-mapreduce-jobtrackerha-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-0.20-mapreduce-tasktracker-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-0.20-mapreduce-zkfc-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-client-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-conf-pseudo-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-debuginfo-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-doc-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-datanode-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-fuse-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-journalnode-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-namenode-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-nfs3-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-secondarynamenode-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-hdfs-zkfc-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-httpfs-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-libhdfs-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-libhdfs-devel-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-mapreduce-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-mapreduce-historyserver-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-yarn-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-yarn-nodemanager-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-yarn-proxyserver-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hadoop-yarn-resourcemanager-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.el6.x86_64.rpm
hbase-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hbase-doc-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hbase-master-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hbase-regionserver-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hbase-rest-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hbase-thrift-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.el6.x86_64.rpm
hue-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-beeswax-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-common-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-doc-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-hbase-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-impala-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-pig-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-plugins-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-rdbms-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-search-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-server-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-spark-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-sqoop-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
hue-zookeeper-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.el6.x86_64.rpm
impala-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-catalog-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-debuginfo-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-server-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-shell-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-state-store-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
impala-udf-devel-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.el6.x86_64.rpm
zookeeper-3.4.5+cdh5.0.2+33-1.cdh5.0.2.p0.31.el6.x86_64.rpm
zookeeper-debuginfo-3.4.5+cdh5.0.2+33-1.cdh5.0.2.p0.31.el6.x86_64.rpm
zookeeper-native-3.4.5+cdh5.0.2+33-1.cdh5.0.2.p0.31.el6.x86_64.rpm
zookeeper-server-3.4.5+cdh5.0.2+33-1.cdh5.0.2.p0.31.el6.x86_64.rpm
```

### /export/repo/cdh5/redhat/6/x86_64/cdh/5/SRPMS
```
avro-libs-1.7.5+cdh5.0.2+20-1.cdh5.0.2.p0.23.src.rpm
bigtop-jsvc-0.6.0+cdh5.0.2+432-1.cdh5.0.2.p0.18.src.rpm
bigtop-tomcat-0.7.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.src.rpm
bigtop-utils-0.7.0+cdh5.0.2+0-1.cdh5.0.2.p0.23.src.rpm
crunch-0.9.0+cdh5.0.2+25-1.cdh5.0.2.p0.14.src.rpm
flume-ng-1.4.0+cdh5.0.2+115-1.cdh5.0.2.p0.14.src.rpm
hadoop-2.3.0+cdh5.0.2+579-1.cdh5.0.2.p0.25.src.rpm
hbase-0.96.1.1+cdh5.0.2+74-1.cdh5.0.2.p0.21.src.rpm
hbase-solr-1.3+cdh5.0.2+42-1.cdh5.0.2.p0.14.src.rpm
hive-0.12.0+cdh5.0.2+319-1.cdh5.0.2.p0.16.src.rpm
hue-3.5.0+cdh5.0.2+373-1.cdh5.0.2.p0.14.src.rpm
impala-1.3.1+cdh5.0.2+0-1.cdh5.0.2.p0.18.src.rpm
kite-0.10.0+cdh5.0.2+86-1.cdh5.0.2.p0.15.src.rpm
llama-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.18.src.rpm
mahout-0.8+cdh5.0.2+31-1.cdh5.0.2.p0.14.src.rpm
oozie-4.0.0+cdh5.0.2+180-1.cdh5.0.2.p0.14.src.rpm
parquet-1.2.5+cdh5.0.2+95-1.cdh5.0.2.p0.19.src.rpm
parquet-format-1.0.0+cdh5.0.2+7-1.cdh5.0.2.p0.30.src.rpm
pig-0.12.0+cdh5.0.2+34-1.cdh5.0.2.p0.15.src.rpm
pig-udf-datafu-1.1.0+cdh5.0.2+18-1.cdh5.0.2.p0.21.src.rpm
search-1.0.0+cdh5.0.2+0-1.cdh5.0.2.p0.14.src.rpm
sentry-1.2.0+cdh5.0.2+75-1.cdh5.0.2.p0.14.src.rpm
solr-4.4.0+cdh5.0.2+190-1.cdh5.0.2.p0.14.src.rpm
spark-core-0.9.0+cdh5.0.2+36-1.cdh5.0.2.p0.15.src.rpm
sqoop-1.4.4+cdh5.0.2+48-1.cdh5.0.2.p0.15.src.rpm
sqoop2-1.99.3+cdh5.0.2+30-1.cdh5.0.2.p0.14.src.rpm
whirr-0.9.0+cdh5.0.2+11-1.cdh5.0.2.p0.14.src.rpm
zookeeper-3.4.5+cdh5.0.2+33-1.cdh5.0.2.p0.31.src.rpm
```

### /export/repo/cm5/redhat/6/x86_64/cm
```
cloudera-manager.repo
RPM-GPG-KEY-cloudera
```

* Criar um link simbólico
  * ln -sf /export/repo/cm5/redhat/6/x86_64/cm/5 /export/repo/cm5/redhat/6/x86_64/cm/5.0.2

### /export/repo/cm5/redhat/6/x86_64/cm/5/repodata
```
filelists.xml.gz
filelists.xml.gz.asc
other.xml.gz
other.xml.gz.asc
primary.xml.gz
primary.xml.gz.asc
repomd.xml
repomd.xml.asc
```

### /export/repo/cm5/redhat/6/x86_64/cm/5/RPMS/x86_64
```
cloudera-manager-agent-5.0.2-1.cm502.p0.297.el6.x86_64.rpm
cloudera-manager-daemons-5.0.2-1.cm502.p0.297.el6.x86_64.rpm
cloudera-manager-server-5.0.2-1.cm502.p0.297.el6.x86_64.rpm
cloudera-manager-server-db-2-5.0.2-1.cm502.p0.297.el6.x86_64.rpm
enterprise-debuginfo-5.0.2-1.cm502.p0.297.el6.x86_64.rpm
jdk-6u31-linux-amd64.rpm
oracle-j2sdk1.7-1.7.0+update45-1.x86_64.rpm
```

### /export/repo/redhat/cdh
```
RPM-GPG-KEY-cloudera
```

## Apache

* /etc/hosts
  * IP_DA_MAQUINA archive.cloudera.com


* /opt/httpd24/conf/vhosts.conf

```
Directory />
  Options Indexes FollowSymLinks
  AllowOverride All
</Directory>

Include /opt/httpd24/conf/vhosts.d/*.conf
```

* /opt/httpd24/conf/vhosts.d/archive.cloudera.conf

```
<VirtualHost *:80>
  ServerName archive.cloudera.com
  DocumentRoot /export/repo/
  IndexOptions FancyIndexing
</VirtualHost>
```

* Para validar tudo até aqui
  * `yum search hadoop`

# Log da Instalação
* tail -f /var/log/cloudera-manager-installer/*

# Log do Servidor
* tail -f /var/log/cloudera-scm-server/*

# Configuração do Cluster
* login admin/admin
* selecionar cloudera express
* inserir a lista de hosts do cluster, separados por ,
* Passo 1
  * Usar parcels
  * CDH-5.0.2-1.cdh5.0.2.p0.13
  * Nenhum
  * Nenhum
  * Nenhum
  * Cloudera Manager Agent - Versão correspondente a este Cloudera Manager Server
* Passo 2
  * Desmarcar Install Java Unlimited Strength Encryption Policy Files
* Passo 3
  * root
  * Todos os hosts aceitam a mesma senha
  * senha
  * senha
  * 22
  * 10
* Passo 4
...

# Quando a instalação der problema

* mover o diretório /opt/cloudera para o /export
* criar um link simbólico
* ln -sf /export/cloudera /opt/cloudera

# Pós Instalação
* Arrumei o /etc/hosts
* vm.swappiness
  * echo 0 > /proc/sys/vm/swappiness
  * nano /etc/sysctl.conf
  * vm.swappiness = 0
* Transparent Huge Pages
  * nano /etc/rc.local
  * echo never > /sys/kernel/mm/redhat_transparent_hugepage/defrag
* Desabilitar dfs.permissions
  * http://blog.timmattison.com/archives/2011/12/26/how-to-disable-hdfs-permissions-for-hadoop-development/
