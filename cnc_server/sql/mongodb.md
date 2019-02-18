1. 加库
vim /etc/yum.repos.d/mongodb-org-3.6.repo

[mongodb-org-3.6]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.6/x86_64/
gpgcheck=0
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc

2. yum update 

3. yum -y install mongodb-org

4. vim /etc/mongod.conf

5. 
systemctl start mongod.service
systemctl stop mongod.service
systemctl status mongod.service
systemctl restart mongod.service



6. 开机启动
systemctl enable mongod.service


7. 主从配置
mkdir /mongodb/master

mkdir /mongodb/log

master:
vi /mongodb/mongodb.conf
dbpath=/mongodb/data
logpath=/mongodb/logs/log.log
master=true
fork=true
port=27017
oplogSize=2048

/usr/bin/mongod --config /mongodb/mongodb.conf
/usr/bin/mongod --config /home/dms/mongo/mongodb.conf

/usr/bin/mongod --shutdown --dbpath  /mongodb/data/

/usr/bin/mongod --shutdown --dbpath  /mongodb/data/
/usr/bin/mongod --shutdown --dbpath  /home/dms/mongo/data/

slave:
dbpath=/mongodb/data
logpath=/mongodb/logs/logs.log
slave=true
source=10.131.212.68:27017
fork=true
port=27017
autoresync=true


/usr/bin/mongod --config /home/dms/mongo/mongodb.conf



rs.status()
rs.initiate()

rs.add("10.131.212.67:27017")

systemctl stop firewalld
systemctl disable firewalld



rs.printReplicationInfo()
rs.conf();

从节点(默认从节点不能访问)：
rs.slaveOk()

mongo --host 10.131.212.67



yum search mongodb

yum remove mongodb-org-tools.x86_64 mongodb-org-shell.x86_64 mongodb-org-server.x86_64 mongodb-org-mongos.x86_64 mongodb-org.x86_64
yum clean all 
