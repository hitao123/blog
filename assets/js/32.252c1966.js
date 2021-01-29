(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{507:function(t,e,a){"use strict";a.r(e);var n=a(12),s=Object(n.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h3",{attrs:{id:"yum-源配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#yum-源配置"}},[t._v("#")]),t._v(" yum 源配置")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" /etc/yum.repos.d\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("cp")]),t._v(" rhel-source.repo  test.repo\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("vi")]),t._v(" test.repo\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" /media/RHEL_6.2"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v(" i386"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v(" Disc"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("\\")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("/"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("enabled"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nyum clean all\nyum makecache\n")])])]),t._v(" "),a("h3",{attrs:{id:"源代码编译安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#源代码编译安装"}},[t._v("#")]),t._v(" 源代码编译安装")]),t._v(" "),a("ol",[a("li",[t._v("解包\n. 习惯上将软件包释放到"),a("code",[t._v("/usr/src/目录")]),t._v("\n. 解包后的源代码文件位置："),a("code",[t._v("/usr/src/软件名-版本号/")]),t._v("\n. 命令"),a("code",[t._v("tar xf httpd-2.2.17.tar.gz -C /usr/src")])]),t._v(" "),a("li",[t._v("预配置\n· 使用源码目录中的 configure 脚本\n· 执行"),a("code",[t._v("./configure –help")]),t._v("可查看帮助\n· 典型的配置选项：\n--prefix=软件安装目录")]),t._v(" "),a("li",[t._v("编译\n· 执行 make 命令\n·示例："),a("code",[t._v("[root@www httpd-2.2.17]# make")])]),t._v(" "),a("li",[t._v("安装\n·执行"),a("code",[t._v("make install")]),t._v("命令\n·示例"),a("code",[t._v("[root@www httpd-2.2.17]# make install")])])]),t._v(" "),a("h3",{attrs:{id:"管理-lvm-逻辑卷"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#管理-lvm-逻辑卷"}},[t._v("#")]),t._v(" 管理 LVM 逻辑卷")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("1. Linux 中将硬盘等设备均表示为文件 (`/dev/sd[bcde][12345]`),所有硬件都是通过挂载实现。\n2. 硬盘中的主分区数目只有 4 个，因此主分区和扩展分区的序号也就限制在 1~4。扩展分 区再分为逻辑分区，逻辑分区的序号始终从 5 开始。\n3. 检测并确认新硬盘 `fdisk –l` \nId：分区对应的系统 ID 号。\n    83 表示 Linux 中的 EXT4 分区\n    8e 表示 LVM 逻辑卷\n    82 表 示 swap\n    fd 表示 RAID \n4. 使用 fdisk 进行分区 `fdisk /dev/sdb` 、`partprobe`可以检测硬盘是否安装成功\n5. 分区完之后需要对分区进行格式化 `mkfs -t ext4 /dev/sdb1`\n6. `mount`  查看当前的挂载 `mount –a`  挂载`/etc/fstab` 中已记录的所有挂载（开机自动挂载需要将内容写在这个文件里）\n7. `df -hT` 查看磁盘使用状况\n8. `PV====》VG====》LV`\n    . `[root@www ~]# pvcreate /dev/sd[bcde]1`\n    . `[root@www ~]# vgcreate vg0 /dev/sd[bcde]1`\n    . `[root@www ~]# lvcreate -L 20G -n lv0 vg0 ` \n    . 扩展逻辑卷 lvextend 命令 `lvextend –L +大小或直接写增加后的最终大小 /dev/卷组名/逻辑卷名`(记得先扩展vgextend ,不记得就查man 手册)\n    调整（刷新）逻辑卷分区大小`resize2fs /dev/vg0/lv0 `\n（这里需要对谁格式化？？？）\n")])])]),a("h3",{attrs:{id:"磁盘冗余阵列-磁盘恢复"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#磁盘冗余阵列-磁盘恢复"}},[t._v("#")]),t._v(" 磁盘冗余阵列 磁盘恢复")]),t._v(" "),a("ol",[a("li",[t._v("这里需要先对硬盘进行分区（三个主分区，其他为扩展分区）")]),t._v(" "),a("li",[a("code",[t._v("mdadm -Cv /dev/md5 -l5 -n3 -x1 /dev/sd[bcde]1")]),t._v("(RAID5 3个存储，一个校验)")]),t._v(" "),a("li",[a("code",[t._v("mkfs.ext4 /dev/md5")]),t._v("（格式化,之前不需要格式化）")]),t._v(" "),a("li",[a("code",[t._v("[root@www ~]# mkdir /xuexi [root@www ~]# mount /dev/md5 /xuexi/")])]),t._v(" "),a("li",[t._v("手动创建 RAID 配置文件 "),a("code",[t._v("/etc/mdadm.conf [root@www ~]# mdadm -D -s > /etc/mdadm.conf")]),t._v(" vi /etc/mdadm.conf 并在文件尾加 auto=yes")]),t._v(" "),a("li",[t._v("模拟/dev/sdb1 硬盘损坏，将其拔出后再插入\n"),a("code",[t._v("[root@www ~]# mdadm /dev/md5 -f /dev/sdb1")]),t._v("\nmdadm: set /dev/sdb1 faulty in /dev/md5\n"),a("code",[t._v("[root@www ~]# cat /proc/mdstat")]),t._v(" "),a("code",[t._v("[root@www ~]# mdadm /dev/md5 -r /dev/sdb1")]),t._v("\nmdadm: hot removed /dev/sdb1 from /dev/md5\n"),a("code",[t._v("[root@www ~]# mdadm /dev/md5 -a /dev/sdb1")]),t._v("\nmdadm: added /dev/sdb1\n[root@www ~]# cat /proc/mdstat")]),t._v(" "),a("li",[t._v("RAID 的拉伸\n添加一块新硬盘"),a("code",[t._v("/dev/sdf")]),t._v("并创建sdf1分区 在添加到RAID5中作为热备盘\n"),a("code",[t._v("[root@www ~]# mdadm /dev/md5 -a /dev/sdf1")]),t._v("\nmdadm: added /dev/sdf1\n"),a("code",[t._v("[root@www ~]# mdadm -G /dev/md5 -n 4")]),t._v(" "),a("code",[t._v("[root@www ~]# cat /proc/mdstat")])])]),t._v(" "),a("h3",{attrs:{id:"关闭linux防火墙"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#关闭linux防火墙"}},[t._v("#")]),t._v(" 关闭Linux防火墙")]),t._v(" "),a("ol",[a("li",[t._v("重启后生效\n开启： "),a("code",[t._v("chkconfig iptables on")]),t._v("\n关闭： "),a("code",[t._v("chkconfig iptables off")])]),t._v(" "),a("li",[t._v("即时生效，重启后失效\n开启： "),a("code",[t._v("service iptables start")]),t._v("\n关闭： "),a("code",[t._v("service iptables stop")])])]),t._v(" "),a("h3",{attrs:{id:"关闭selinux"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#关闭selinux"}},[t._v("#")]),t._v(" 关闭selinux")]),t._v(" "),a("ol",[a("li",[t._v("永久关闭，重启后生效\n"),a("code",[t._v("vim /etc/sysconfig/selinux")]),t._v("\n把SELINUX=enforcing 改为 SELINUX=disabled")]),t._v(" "),a("li",[t._v("临时关闭SELinux\n"),a("code",[t._v("setenforce 0")])])]),t._v(" "),a("h3",{attrs:{id:"lamp-架构搭建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#lamp-架构搭建"}},[t._v("#")]),t._v(" LAMP 架构搭建")]),t._v(" "),a("p",[t._v("Apache（httpd）+ Mysql + PHP")]),t._v(" "),a("h4",{attrs:{id:"httpd-conf配置问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#httpd-conf配置问题"}},[t._v("#")]),t._v(" httpd.conf配置问题")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("1、解压 httpd 源码包，释放到/usr/src/目录下\n2、[root@www httpd-2.2.17]# ./configure --prefix=/usr/local/httpd --enable-so   --enable-rewrite --enable-charset-lite --enable-cgi &&make && make install\n3、优化执行路径\n    通过源码包编译安装的 httpd 服务，程序路径并不在默认的搜索路径中，为了使该服务 在使用时更加方便，可以为相关程序添加符号链接（软链接）到/usr/local/bin 下\n    [root@www ~]# ln -s /usr/local/httpd/bin/* /usr/local/bin/\n4、添加 httpd 系统服务\n    [root@www ~]# cp /usr/local/httpd/bin/apachectl /etc/init.d/httpd\n    [root@www ~]# chmod +x /etc/init.d/httpd\n    在**/etc/init.d/httpd**文件开头里面加上\n    #chkconfig: 35 85 21 \n    #description: Startup script for the Apache HTTP Server\n    [root@www ~]# chkconfig --add httpd\n    [root@www ~]# chkconfig --list httpd\n5、配置并启用 httpd 服务 修改/usr/local/httpd/conf/httpd.conf 主配置文件\n\n")])])]),a("h4",{attrs:{id:"mysql配置问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mysql配置问题"}},[t._v("#")]),t._v(" mysql配置问题")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("1. MySQL 5.5 需要 cmake 编译安装，所以先安装 cmake 包 \n    [root@www ~]# tar xf cmake-2.8.6.tar.gz -C /usr/src/ \n    [root@www ~]# cd /usr/src/cmake-2.8.6/\n    [root@www cmake-2.8.6]# ./configure && gmake && gmake install\n2. 创建 MySQL 的用户和组\n    [root@www ~]# groupadd mysql\n    [root@www ~]# useradd -M -s /sbin/nologin -g mysql mysql\n3. 编译安装\n    [root@www ~]# cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql\n    -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci\n    -DWITH_EXTRA_CHARSETS=all -DSYSCONFDIR=/etc && make && make install\n4. 一些其他问题 如nginx 添加软连接或者环境变量\n    ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/nginx\n")])])]),a("h4",{attrs:{id:"php配置问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#php配置问题"}},[t._v("#")]),t._v(" php配置问题")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("1、准备工作（安装 yum install zlib-devel libxml2-devel）\n2、安装扩展工具库（数据加密工具 libmcrypt、mhash、mcrypt）\n    其中mcrypt 安装方式比较特别，解压之后，\n    export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH\n    之后预编译安装 ./configure && make && make install\n\n3、编译安装 PHP\n    [root@www ~]# tar xf php-5.3.28.tar.gz -C /usr/src [root@www ~]# cd /usr/src/php-5.3.28/\n    [root@www php-5.3.28]# ./configure --prefix=/usr/local/php5 --with-mcrypt\n    --with-apxs2=/usr/local/httpd/bin/apxs --with-mysql=/usr/local/mysql\n    --with-config-file-path=/usr/local/php5 --enable-mbstring && make && make install\n4、建立主配置文件 php.ini，并进行调整\n    [root@www php-5.3.28] # cp php.ini-development /usr/local/php5/php.ini\n    修改 php.ini 文件将 226 行 OFF 改为 On 784行 字符集改为utf-8\n5、添加 ZendGuardLoader 优化模块\n    解压之后到达 php-5.3.x 目录\n    将ZendGuardLoader.so 拷贝到 /usr/local/php5/lib/php/\n    让后再php.ini末尾追加zend_extension=/usr/local/php5/lib/php/ZendGuardLoader.so\n    zend.loader.enable=1\n")])])])])}),[],!1,null,null,null);e.default=s.exports}}]);