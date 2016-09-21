# Ambari Install

## Getting Ready to Install

* Source: http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/ch_Getting_Ready.html

### Set Up Password-less SSH

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/set_up_password-less_ssh.html

```bash
# @Ambari Server host
ssh-keygen
cat ~/.ssh/id_rsa.pub

# @Other hosts
echo ${id_rsa.pub} >> authorized_keys
```

### Enable NTP on the Cluster and on the Browser Host

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/enable_ntp_on_the_cluster_and_on_the_browser_host.html

```bash
sudo chkconfig --list ntpd
sudo chkconfig ntpd on
sudo service ntpd start
```

### Disable iptables

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/configuring_iptables.html

```bash
sudo chkconfig iptables off
sudo /etc/init.d/iptables stop
sudo chkconfig ip6tables off
sudo /etc/init.d/ip6tables stop
```

### Disable SELinux and PackageKit and check the umask Value

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/disable_selinux_and_packagekit_and_check_the_umask_value.html

```bash
sudo su
echo umask 0022 >> /etc/profile
```

## Installing Ambari

### Download the Ambari Repository

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/download_the_ambari_repo.html

```bash
sudo wget -nv http://public-repo-1.hortonworks.com/ambari/centos6/2.x/updates/2.4.0.1/ambari.repo -O /etc/yum.repos.d/ambari.repo
sudo yum repolist
sudo yum install ambari-server
```

### Setting up Ambari to use an Internet Proxy Server

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-reference/content/ch_setting_up_an_internet_proxy_server_for_ambari.html

```bash
sudo ambari-server stop
sudo vi /var/lib/ambari-server/ambari-env.sh
# -Dhttp.proxyHost=<yourProxyHost> -Dhttp.proxyPort=<yourProxyPort>
```


### Set Up the Ambari Server

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/set_up_the_ambari_server.html

```bash
sudo ambari-server setup
# Customize user account for ambari-server daemon [y/n] (n)? y
# Enter user account for ambari-server daemon (root): ec2-user
# Enter choice (1): 1
# Do you accept the Oracle Binary Code License Agreement [y/n] (y)? y
# Enter advanced database configuration [y/n] (n)? n
```

### Start the Ambari Server

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/start_the_ambari_server.html

```bash
sudo ambari-server start
sudo ambari-server status

# Check DB Errors
tail -f /var/log/ambari-server/ambari-server-check-database.log

# Ignore DB Errors
sudo ambari-server start --skip-database-check
```

## Installing, Configuring, and Deploying a HDP Cluster

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/ch_Deploy_and_Configure_a_HDP_Cluster.html

### Log In to Apache Ambari

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/log_in_to_apache_ambari.html
* Open http://\<your.ambari.server\>:8080
    * admin/admin

### Launching the Ambari Install Wizard

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/launching_the_ambari_install_wizard.html
* From the Ambari Welcome page, choose Launch Install Wizard.

### Name Your Cluster

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/name_your_cluster.html
* In Name your cluster, type a name for the cluster you want to create. Use no white spaces or special characters in the name.
* Choose Next.

### Select Version

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/select_version.html
* The UI displays repository Base URLs based on Operating System Family (OS Family). Be sure to set the correct OS Family based on the Operating System you are running. The following table maps the OS Family to the Operating Systems.
* Choose Next.

### Install Options

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/install_options.html
* Use the Target Hosts text box to enter your list of host names, one per line. You can use ranges inside brackets to indicate larger sets of hosts. For example, for host01.domain through host10.domain use host[01-10].domain
* If you want to let Ambari automatically install the Ambari Agent on all your hosts using SSH, select Provide your SSH Private Key and either use the Choose File button in the Host Registration Information section to find the private key file that matches the public key you installed earlier on all your hosts or cut and paste the key into the text box manually.
* Fill in the user name for the SSH key you have selected. If you do not want to use root, you must provide the user name for an account that can execute sudo without entering a password. If SSH on the hosts in your environment is configured for a port other than 22, you can change that as well.
* Choose Register and Confirm to continue

```bash
# @Ambari Server
cat ~/.ssh/id_rsa
```

### Confirm Hosts

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/confirm_hosts.html
* Choose Next

### Choose Services

* http://docs.hortonworks.com/HDPDocuments/Ambari-2.4.0.1/bk_ambari-installation/content/choose_services.html
* Ambari does not install Hue, or HDP Search (Solr)
    * http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/bk_command-line-installation/content/installing_hue.html
    * http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/bk_security/content/installing_ranger_using_ambari.html
    * http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.5.0/bk_solr-search-installation/content/index.html
* * Choose Next

### Troubleshooting

* https://docs.hortonworks.com/HDPDocuments/Ambari-2.2.2.0/bk_ambari_reference_guide/content/ch_amb_ref_using_non_default_databases.html