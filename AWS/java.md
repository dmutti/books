# Java

* sudo yum remove -y java-1.7.0-openjdk
* http://blog.kdecherf.com/2012/04/12/oracle-i-download-your-jdk-by-eating-magic-cookies/
    * wget --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie;" http://download.oracle.com/otn-pub/java/jdk/7u67-b01/jdk-7u67-linux-x64.rpm
    * sudo rpm -i jdk-7u67-linux-x64.rpm
* mvn -Dmaven.test.skip=true package
* sudo nohup java -jar target/reconf-server-1.0.0-SNAPSHOT.jar &
