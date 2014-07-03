* Fonte
	* https://martin.atlassian.net/wiki/display/lestermartin/Build+a+Virtualized+5-Node+Hadoop+2.0+Cluster#BuildaVirtualized5-NodeHadoop2.0Cluster-RemainingNodes
* VM
	* 768 MB
	* sem audio
	* rede nat (1) / host only (2)
	* sem usb
* instalação mínima
	* dar o nome da máquina
	* ao configurar a rede, marca as duas (eth0 e eth1) pra iniciar automaticamente
* yum install nano
* nano /etc/rc.d/rc.local
	* setterm -blank 0
* nano /etc/ssh/ssh_config
	* StrictHostKeyChecking no
* disable SElinux
	* nano /etc/selinux/config
	* SELINUX=disabled
* nano /etc/sysconfig/network-scripts/ifcfg-eth1
	* Mudar
		* ONBOOT=yes
		* NM_CONTROLLED=no
		* BOOTPROTO=none
    * Remover
    	* UUID
    	* HWADDR
    * Acrescentar
    	* IPADDR=192.168.56.XX (ip arbitrário para a máquina)
    	* NETMASK=255.255.255.0
* nano /etc/sysconfig/network-scripts/ifcfg-eth0
	* Remover
		* UUID
* rm -f /etc/udev/rules.d/70-persistent-net.rules
* shutdown -r now
* yum install -y openssh-clients
* testar ssh localhost
* chkconfig iptables off
* chkconfig ip6tables off
* yum install -y ntp
* chkconfig ntpd on
* shutdown -r now
* nano /etc/hosts
	* 192.168.56.41 a1-jak1.pateta
	* 192.168.56.42 a1-jak2.pateta
	* 192.168.56.43 a1-jak3.pateta
	* 192.168.56.51 a1-daxter1.pateta
* hostname a1-jak1.pateta
* hostname -f
	* conferir que o nome configurado anteriormente aparece aqui
* rm -f /etc/udev/rules.d/70-persistent-net.rules
* shutdown -r now
* yum install -y wget
* cd /etc/yum.repos.d
	* wget http://archive.cloudera.com/cdh5/redhat/6/x86_64/cdh/cloudera-cdh5.repo
* Java
	* bash +x jdk-6u45-linux-x64.bin
	* mkdir -p /usr/java
	* mv jdk1.6.0_45/ /usr/java/
	* cd /usr/java
	* ln -sf jdk1.6.0_45/ latest
* .bashrc

```
alias rm='rm -f'
alias cp='cp -i'
alias mv='mv -i'
alias ls='ls -la'
alias ll='ls -la --color'

if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

export PATH=/usr/java/latest/bin:$PATH
export JAVA_HOME=/usr/java/latest
```
