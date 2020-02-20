---
title: wireshark 的使用 
tags: tool
date: 2017-03-03
keywords:  wireshark,fiddler,抓包
---
### wireshark 抓包

1. window 下需要配置环境变量 `SSLKEYLOGFILE` ，路径就是 log 文件所在的目录，
2. 在`wireshark edit->preference->protocol->ssl`, 选择文件所在路径
3. 把wireshark，浏览器关掉，使用命令行启动浏览器，以便于chrome或者firefox浏览器读取到上面环境变量

<!--more-->

4. 为了读取关键包，设置一下捕获规则， `tcp port 443`,打开一个使用了`http2`的网站，如（taobao.com）,接着设置过滤规则 http2，打开16进制面板上tab,切换解密，然后切换到解压缩，就可以看到http2 header部分数据
5. 详细内容参照[Decrypting TLS](https://jimshaver.net/2015/02/11/decrypting-tls-browser-traffic-with-wireshark-the-easy-way/),[使用 Wireshark 调试 HTTP/2 流量](https://imququ.com/post/http2-traffic-in-wireshark.html)
6. 实际上是不能解密数据部分的，第一个链接老外说可以，实际操作是不可行的，日志文件只是记录了随机数，又不知道最后的加密秘钥，为什么http2 的头部可以被解密，这是一个疑问的地方、
7. 容易踩坑的地方，windows 用户按照这样的配置以后，什么环境变量都对的话，而且使用命令行启动浏览器，注意是火狐浏览器和谷歌浏览器，假如能在日志文件看到数据，接下来你需要在`wireshark`下面找到解密面板，这是最坑的，我是找了好久，想哭。
