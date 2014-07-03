# Baixar o Cloudera Manager
* wget -e use_proxy=yes -e http_proxy=a1-integproxy-s-pla1.host.intranet:3128 http://archive.cloudera.com/cm5/installer/latest/cloudera-manager-installer.bin

# Configurar o yum
* nano /etc/yum.conf
* adicionar
  * proxy=http://a1-integproxy-s-pla1.host.intranet:3128

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

# Pós Instalação
* Arrumei o /etc/hosts
* vm.swappiness
  * echo 0 > /proc/sys/vm/swappiness
  * nano /etc/sysctl.conf
  * vm.swappiness = 0
* Transparent Huge Pages
  * nano /etc/rc.local
  * echo never > /sys/kernel/mm/redhat_transparent_hugepage/defrag
