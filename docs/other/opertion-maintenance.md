---
title: Linux 运维 
tags: 运维
date: 2016-03-09
keywords:  share,learning
---

### yum 源配置

```bash
cd /etc/yum.repos.d
cp rhel-source.repo  test.repo
vi test.repo
cd /media/RHEL_6.2\ i386\ Disc\ 1/(enabled=1)
yum clean all
yum makecache
```

<!--more-->

### 源代码编译安装

1. 解包
    . 习惯上将软件包释放到`/usr/src/目录`
    . 解包后的源代码文件位置：`/usr/src/软件名-版本号/`
    . 命令`tar xf httpd-2.2.17.tar.gz -C /usr/src`
2. 预配置
    · 使用源码目录中的 configure 脚本
    · 执行`./configure –help`可查看帮助
    · 典型的配置选项：
--prefix=软件安装目录
3. 编译
    · 执行 make 命令
    ·示例：`[root@www httpd-2.2.17]# make`
4. 安装
    ·执行`make install`命令
    ·示例`[root@www httpd-2.2.17]# make install`

### 管理 LVM 逻辑卷

```
1. Linux 中将硬盘等设备均表示为文件 (`/dev/sd[bcde][12345]`),所有硬件都是通过挂载实现。
2. 硬盘中的主分区数目只有 4 个，因此主分区和扩展分区的序号也就限制在 1~4。扩展分 区再分为逻辑分区，逻辑分区的序号始终从 5 开始。
3. 检测并确认新硬盘 `fdisk –l` 
Id：分区对应的系统 ID 号。
    83 表示 Linux 中的 EXT4 分区
    8e 表示 LVM 逻辑卷
    82 表 示 swap
    fd 表示 RAID 
4. 使用 fdisk 进行分区 `fdisk /dev/sdb` 、`partprobe`可以检测硬盘是否安装成功
5. 分区完之后需要对分区进行格式化 `mkfs -t ext4 /dev/sdb1`
6. `mount`  查看当前的挂载 `mount –a`  挂载`/etc/fstab` 中已记录的所有挂载（开机自动挂载需要将内容写在这个文件里）
7. `df -hT` 查看磁盘使用状况
8. `PV====》VG====》LV`
    . `[root@www ~]# pvcreate /dev/sd[bcde]1`
    . `[root@www ~]# vgcreate vg0 /dev/sd[bcde]1`
    . `[root@www ~]# lvcreate -L 20G -n lv0 vg0 ` 
    . 扩展逻辑卷 lvextend 命令 `lvextend –L +大小或直接写增加后的最终大小 /dev/卷组名/逻辑卷名`(记得先扩展vgextend ,不记得就查man 手册)
    调整（刷新）逻辑卷分区大小`resize2fs /dev/vg0/lv0 `
（这里需要对谁格式化？？？）
```

### 磁盘冗余阵列 磁盘恢复

1. 这里需要先对硬盘进行分区（三个主分区，其他为扩展分区）
2. `mdadm -Cv /dev/md5 -l5 -n3 -x1 /dev/sd[bcde]1`(RAID5 3个存储，一个校验)
3. `mkfs.ext4 /dev/md5`（格式化,之前不需要格式化）
3. `[root@www ~]# mkdir /xuexi [root@www ~]# mount /dev/md5 /xuexi/ `
4. 手动创建 RAID 配置文件 `/etc/mdadm.conf  [root@www ~]# mdadm -D -s > /etc/mdadm.conf` vi /etc/mdadm.conf 并在文件尾加 auto=yes 
5. 模拟/dev/sdb1 硬盘损坏，将其拔出后再插入 
`[root@www ~]# mdadm /dev/md5 -f /dev/sdb1 ` 
mdadm: set /dev/sdb1 faulty in /dev/md5 
`[root@www ~]# cat /proc/mdstat`
`[root@www ~]# mdadm /dev/md5 -r /dev/sdb1` 
mdadm: hot removed /dev/sdb1 from /dev/md5 
`[root@www ~]# mdadm /dev/md5 -a /dev/sdb1`
mdadm: added /dev/sdb1
[root@www ~]# cat /proc/mdstat
6. RAID 的拉伸
添加一块新硬盘`/dev/sdf`并创建sdf1分区 在添加到RAID5中作为热备盘
    `[root@www ~]# mdadm /dev/md5 -a /dev/sdf1` 
    mdadm: added /dev/sdf1
    `[root@www ~]# mdadm -G /dev/md5 -n 4` 
    `[root@www ~]# cat /proc/mdstat` 

### 关闭Linux防火墙

1. 重启后生效
    开启： `chkconfig iptables on` 
    关闭： `chkconfig iptables off` 
2. 即时生效，重启后失效 
    开启： `service iptables start` 
    关闭： `service iptables stop` 

### 关闭selinux

1. 永久关闭，重启后生效
    `vim /etc/sysconfig/selinux`
    把SELINUX=enforcing 改为 SELINUX=disabled
2. 临时关闭SELinux
    `setenforce 0`

### LAMP 架构搭建
Apache（httpd）+ Mysql + PHP

#### httpd.conf配置问题

```
1、解压 httpd 源码包，释放到/usr/src/目录下
2、[root@www httpd-2.2.17]# ./configure --prefix=/usr/local/httpd --enable-so   --enable-rewrite --enable-charset-lite --enable-cgi &&make && make install
3、优化执行路径
    通过源码包编译安装的 httpd 服务，程序路径并不在默认的搜索路径中，为了使该服务 在使用时更加方便，可以为相关程序添加符号链接（软链接）到/usr/local/bin 下
    [root@www ~]# ln -s /usr/local/httpd/bin/* /usr/local/bin/
4、添加 httpd 系统服务
    [root@www ~]# cp /usr/local/httpd/bin/apachectl /etc/init.d/httpd
    [root@www ~]# chmod +x /etc/init.d/httpd
    在**/etc/init.d/httpd**文件开头里面加上
    #chkconfig: 35 85 21 
    #description: Startup script for the Apache HTTP Server
    [root@www ~]# chkconfig --add httpd
    [root@www ~]# chkconfig --list httpd
5、配置并启用 httpd 服务 修改/usr/local/httpd/conf/httpd.conf 主配置文件

```

#### mysql配置问题

```
1. MySQL 5.5 需要 cmake 编译安装，所以先安装 cmake 包 
    [root@www ~]# tar xf cmake-2.8.6.tar.gz -C /usr/src/ 
    [root@www ~]# cd /usr/src/cmake-2.8.6/
    [root@www cmake-2.8.6]# ./configure && gmake && gmake install
2. 创建 MySQL 的用户和组
    [root@www ~]# groupadd mysql
    [root@www ~]# useradd -M -s /sbin/nologin -g mysql mysql
3. 编译安装
    [root@www ~]# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql
    -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci
    -DWITH_EXTRA_CHARSETS=all -DSYSCONFDIR=/etc && make && make install
4. 一些其他问题 如nginx 添加软连接或者环境变量
    ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx
```

#### php配置问题

```
1、准备工作（安装 yum install zlib-devel libxml2-devel）
2、安装扩展工具库（数据加密工具 libmcrypt、mhash、mcrypt）
    其中mcrypt 安装方式比较特别，解压之后，
    export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
    之后预编译安装 ./configure && make && make install

3、编译安装 PHP
    [root@www ~]# tar xf php-5.3.28.tar.gz -C /usr/src [root@www ~]# cd /usr/src/php-5.3.28/
    [root@www php-5.3.28]# ./configure --prefix=/usr/local/php5 --with-mcrypt
    --with-apxs2=/usr/local/httpd/bin/apxs --with-mysql=/usr/local/mysql
    --with-config-file-path=/usr/local/php5 --enable-mbstring && make && make install
4、建立主配置文件 php.ini，并进行调整
    [root@www php-5.3.28] # cp php.ini-development /usr/local/php5/php.ini
    修改 php.ini 文件将 226 行 OFF 改为 On 784行 字符集改为utf-8
5、添加 ZendGuardLoader 优化模块
    解压之后到达 php-5.3.x 目录
    将ZendGuardLoader.so 拷贝到 /usr/local/php5/lib/php/
    让后再php.ini末尾追加zend_extension=/usr/local/php5/lib/php/ZendGuardLoader.so
    zend.loader.enable=1
```
