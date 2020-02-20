---
title: http2 性能研究
tags: http2
date: 2017-03-07
keywords:  http2,wireshark
---
### http2与http 1.x系列对比

#### 网络五层协议+TLS

>简单介绍一下网络的内容


| 工作层|作用   |  详情|
|:----:|:------:|:------:|
|`物理层`|端对端的物理链路|电脑的网线接口| 
|数据链路层(MAC层)|负责帧的封装,透明传输，差错检测|PPP协议帧的格式，首部四个字段，尾部四个字段，中间是IP数据报，一般不超过1500字节,尾部校验和同步码，如果是mac帧，这里mac帧会有源mac地址，目的mac地址|
|`网络层(IP层)`|向上提供灵活的、无连接、尽最大努力交付数据包服务|与IP协议配套使用的还有ARP，ICMP，IGMP，IP数据包格式，固定20字节首部，主要有版本(ipv4,ipv6),片偏移，首部校验和，原ip地址，目的ip地址，可选字段，还有数据部分|
|`传输层`|运输层为应用进程之间端对端的逻辑通信|主要有面向连接的TCP和无连接的UDP，UDP首部，源端口，目的端口，数据报长度，首部和数据部分一起校验，加上伪首部，TCP首部最小长度20字节|
|`TLS层`|解决网络数据安全问题|https 的数据都是密文传输，保证不被篡改 [SSL](http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)|
|`应用层`|通过位于不同主机的多个应用进程之间的通信协议和协同工作来完成的|...|

<!--more-->

#### http 1.x

>说到`http`(超文本传输协议)，想到`B/S`架构，想到每一次我们从输入网址，敲击回车键，后面的一系列事件，首先是DNS解析，一般本地会有你经常访问的 DNS解析，假如没有，就会去本地DNS服务器查询，`DNS`一般是使用UDP协议，获得`IP`地址之后，接着就是`TCP`三次握手建立连接，然后就是`SSL`的握手协议，`Client Hello-->Server Hello 、server certificate、server key exchange ---->server hello done ---> application data`,然后两个端之间建立了连接，进行数据的传递。
**包在端到端的传递**
以访问`taobao.com`为例，由于IP不在`192.168.1.X`这个网段，ARP协议不起作用，直接将包发送给我们路由器，也就是默认网关，通过路由，中间还有好多协议，到达`taobao.com`的`Tengine`负载均衡服务器，然后到达某一个服务器的`443`端口，这里就是端到端，我们电脑上运行的`chrome一个tab` 对应一个进程，到某一台服务器上运行服务器的443端口的那个进程


完成上面那些之后，我们看到淘宝的首页展示在我们面前，我们要请求`CSS，HTML，js,picture`这些静态资源，而这些静态资源可能是从阿里云CDN获取的，可能又要建立上面的连接，发送`GET`请求，重复上面的步骤。

##### http1.x 请求头

```
<request line>  //请求行 回车符 换行符  \r\n
<headers>       //请求头 回车符 换行符  \r\n
<blank line>    //空行   回车符 换行符  \r\n
[<request-body>] //请求体，只有post有,get请求自带拼接参数

//get请求
GET http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=413631      
Accept:*/*
Accept-Encoding:gzip, deflate, sdch
Accept-Language:zh-CN,zh;q=0.8
Connection:keep-alive
Cookie:BAIDUID=C3C3DF1F2FCBAAC76D586A089D352B20:FG=1; BIDUPSID=C3C3DF1F2FCBAAC76D586A089D352B20; PSTM=1487486381; cflag=15%3A3
Host:bdimg.share.baidu.com
Referer:http://blog.csdn.net/zqjflash/article/details/50179235
User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36

// post请求
POST /;jsessionid=0488BE7BC900465C2DC4BB8AB24590F7.tomcat1 HTTP/1.1
Host: passport.csdn.net
Connection: keep-alive
Content-Length: 114
Cache-Control: max-age=0
Origin: https://passport.csdn.net
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Referer: https://passport.csdn.net/
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: uuid_tt_dd=4631346229468547818_20170222; UN=qq_27190173; UE=""; BT=1487775919653; Hm_lvt_6bcd52f51e9b3dce32bec4a3997715ac=1488868447,1488871119,1488934143,1489065486; Hm_lpvt_6bcd52f51e9b3dce32bec4a3997715ac=1489070690; JSESSIONID=0488BE7BC900465C2DC4BB8AB24590F7.tomcat1; LSSC=LSSC-103313-gsFvBex9lecaSC6m9Bwyn5tu5PxDgY-passport.csdn.net; _ga=GA1.2.861628891.1488380192; _gat=1; dc_tos=omjyg8; dc_session_id=1489070692647

(----此处空一行---就是空行-)
数据部分
username=12677641193&password=1212121212&lt=LT-85675-U1reLQcXULotRI4ZZYAJe6UqmNOkIz&execution=e1s1&_eventId=submit
```

##### http1.x 响应头

```
HTTP/1.1 200 OK
Server: openresty
Date: Thu, 09 Mar 2017 14:48:23 GMT
Content-Type: text/html;charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive
Keep-Alive: timeout=20
Pragma: no-cache
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Cache-Control: no-cache
Cache-Control: no-store
Content-Encoding: gzip
Vary: Accept-Encoding
```

##### http1.X 存在的问题

1. http1.0 每次只能发一个http请求，http1.1 使用`request pipelining`(请求流水线)(默认是关闭的，可以同时向服务器发多个请求【这里多个请求，不同的浏览器有不同的支持】，但是响应必须按顺序到达，比较鸡肋，详情看这里，[`并发请求数`](https://www.zhihu.com/question/20474326))，比 http1.0 效率更好，但是依然存在`head-of-line blocking`(队头阻塞)，即在一个TCP连接上，由于TCP层数据包需要按顺序到达，假如http的包在传输过程中丢失的话，超时重传给服务器，等到数据包按顺序到达以后，才会给客户端发送数据，超时重传那一段在客户端看起来就是被阻塞了。
2. http1.x 每次的头部好多数据是冗余的，消耗了带宽，每次都重复传这些头部数据。
3. http1.1 相对于 http1.0 好的地方在于默认开启持久化连接，`Connection： keep-alive`,这样在一个TCP连接上，可以发多个http请求.


#### http2.0
##### http2.0 请求头

```
:authority:imququ.com
:method:GET
:path:/beacon.html?dt=%E4%BD%BF%E7%94%A8%20Wireshark%20%E8%B0%83%E8%AF%95%20HTTP%2F2%20%E6%B5%81%E9%87%8F%20%7C%20JerryQu%20%E7%9A%84%E5%B0%8F%E7%AB%99&dr=&ul=zh-CN&sd=24-bit&sr=1366x768&_=1489071389465
:scheme:https
accept:image/webp,image/*,*/*;q=0.8
accept-encoding:gzip, deflate, sdch, br
accept-language:zh-CN,zh;q=0.8
cache-control:no-cache
cookie:u=ee40d34c-d87a-40ce-a3bd-c4ea3e05b72d; v=44
pragma:no-cache
referer:https://imququ.com/post/http2-traffic-in-wireshark.html
user-agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36
```

##### http2.0 响应头

```
cache-control:no-cache
date:Thu, 09 Mar 2017 14:56:29 GMT
public-key-pins:pin-sha256="YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg="; pin-sha256="aef6IF2UF6jNEwA2pNmP7kpgT6NFSdt7Tqf5HzaIGWI="; max-age=2592000; includeSubDomains
referrer-policy:origin-when-cross-origin
server:nginx
status:204
strict-transport-security:max-age=31536000; includeSubDomains; preload
x-content-type-options:nosniff
x-frame-options:deny
x-via:Aliyun.QingDao
x-xss-protection:1; mode=block
```

##### http2.0 应该满足条件

>`HTTP/2.0` 通过支持首部字段压缩和在同一连接上发送多个并发消息，让应用更有效地利用网络资源，减少感知的延迟时间。而且，它还支持服务器到客户端的主动推送机制。

- 相对于使用TCP 的HTTP 1.1 用户在大多数情况下的感知延迟要有实质上、可度量的改进；
- 解决 HTTP 中的“队首阻塞”问题；
- 并行操作无需与服务器建立多个连接，从而改进 TCP 的利用率，特别是拥塞控制方面；
- 保持 HTTP 1.1 的语义，利用现有文档，包括（但不限于）HTTP 方法、状态码、URI，以及首部字段；
- 明确规定 HTTP 2.0 如何与 HTTP 1.x 互操作，特别是在中间介质上；
- 明确指出所有新的可扩展机制以及适当的扩展策略。

##### http2.0二进制分帧机制

>`HTTP2.0` 将所有传输的信息分割为更小的消息和帧，并对它们采用二进制格式的编码，`HTTP 2.0` 的二进制分帧机制解决了`HTTP 1.x` 中存在的队首阻塞问题，也消除了并行处理和发送请求及响应时对多个连接的依赖。

###### 流、消息和帧

- 流：流是连接中的一个虚拟信道，可以承载双向的消息；每个流都有一个唯一的整数标识符（1、2…N）；
- 消息：是指逻辑上的 HTTP 消息，比如请求、响应等，由一或多个帧组成。
- 帧：HTTP 2.0 通信的最小单位，每个帧包含帧首部，至少也会标识出当前帧所属的流，承载着特定类型的数据，如 HTTP 首部、负荷，等等

>建立HTTP2.0连接后，客户端与服务器会通过交换帧来通信，帧是基于这个新协议通信的最小单位。所有帧都**`共享一个8字节的首部`**，其中包含帧的长度、类型、标志，还有一个保留位和一个31位的流标识符。如下图所示

|Bit | 0-7 | 8-15 |16-23|23-31|
|:--:|:--:|:--:|:----:|:----:|
|0|长度（0-15）|-|类型|标志|
|32|R（1bit）|-|-|流标识符（1-31）|
|64|R（1bit）|-|-|优先值（1-31）
|...|首部块|-|-|-|-|

```
发起新流

    - 在发送应用数据之前，必须创建一个新流并随之发送相应的元数据，比如流优先级、HTTP 首部等；
    - 客户端通过发送HEADERS帧来发起新流；
    服务器通过发送 PUSH_PROMISE 帧来发起推送流。

发送应用数据
    - 创建新流并发送HTTP 首部之后，接下来就是利用DATA 帧。应用数据可以分为多个DATA 帧，最后一帧要翻转帧首部的END_STREAM 字段
    - HTTP 2.0 标准要求DATA 帧不能超过2的14次方-1（16383）字节。长度超过这个阀值的数据，就得分帧发送。
```

![数据流](http://omla9ld8j.bkt.clouddn.com/2017-03-10_171740.png)

###### 多向请求与响应

- `HTTP 2.0` 中新的二进制分帧层突破了这些限制，实现了多向请求和响应：客户端和服务器可以把`HTTP` 消息分解为互不依赖的帧，然后乱序发送，最后再在另一端把它们重新组合起来
- 把HTTP 消息分解为独立的帧，交错发送，然后在另一端重新组装是`HTTP 2.0` 最重要的一项增强。这个机制会在整个`Web`技术栈中引发一系列连锁反应，从而带来巨大的性能提升。
- chrome 浏览器，可以开启6个并发![并发数](http://omla9ld8j.bkt.clouddn.com/2017-03-10_153645.png)
 
###### 请求优先级

- 把HTTP 消息分解为很多独立的帧之后，就可以通过优化这些帧的交错和传输顺序，每个流都可以带有一个31 比特的优先值：0 表示最高优先级；2的31次方-1 表示最低优先级。
- 服务器可以根据流的优先级，控制资源分配（CPU、内存、带宽），而在响应数据准备好之后，优先将最高优先级的帧发送给客户端。
- `HTTP 2.0` 一举解决了所有这些低效的问题：浏览器可以在发现资源时立即分派请求，指定每个流的优先级，让服务器决定最优的响应次序。这样请求就不必排队了，既节省了时间，也最大限度地利用了每个连接。

###### 单条TCP持久连接

- HTTP 2.0 连接都是持久化的，而且客户端与服务器之间也只需要一个连接即可。 

###### 流量控制

- 流量控制基于每一跳进行，而非端到端的控制；
- 流量控制基于窗口更新帧进行，即接收方广播自己准备接收某个数据流的多少字节，以及对整个连接要接收多少字节；
- 流量控制窗口大小通过 WINDOW_UPDATE 帧更新，这个字段指定了流 ID 和窗口大小递增值；
- 流量控制有方向性，即接收方可能根据自己的情况为每个流乃至整个连接设置任意窗口大小；
- 流量控制可以由接收方禁用，包括针对个别的流和针对整个连接。

##### 服务器推送

- `HTTP 2.0` 新增的一个强大的新功能，就是服务器可以对一个客户端请求发送多个响应。服务器向客户端推送资源无需客户端明确地请求。
- `HTTP 2.0` 连接后，客户端与服务器交换`SETTINGS` 帧，借此可以限定双向并发的流的最大数量。因此，客户端可以限定推送流的数量，或者通过把这个值设置为0 而完全禁用服务器推送。
- 所有推送的资源都遵守同源策略。换句话说，服务器不能随便将第三方资源推送给客户端，而必须是经过双方确认才行。
- `PUSH_PROMISE`：所有服务器推送流都由PUSH_PROMISE 发端，服务器向客户端发出的有意推送所述资源的信号。客户端接收到PUSH_PROMISE 帧之后，可以视自身需求选择拒绝这个流

##### 首部压缩

- `http2.0`会压缩首部元数据：在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键值对，对于相同的数据，不再通过每次请求和响应发送；“首部表”在http2.0的连接存续期内始终存在，由客户端和服务器共同渐进地更新；每个新的首部键值对要么追加到当前表的末尾，要么替换表中之前的值。
#### 扩展`SPDY 协议`

#### HTTP2.0升级与发现

- 通过TLS和ALPN发起新的HTTPS连接；
![ALPN-Clent Hello](http://omla9ld8j.bkt.clouddn.com/2017-03-10_153907.png)
![ALPN-Server Hello](http://omla9ld8j.bkt.clouddn.com/2017-03-10_160114.png)
- 根据之前的信息发起新的HTTP连接；
- 没有之前的信息而发起新的HTTP连接。
- 通过常规非加密信道建立HTTP2.0连接需要多做一点工作。因为HTTP1.0和HTTP2.0都使用同一个端口（80），有没有服务器是否支持HTTP2.0的其他任何信息，此时客户端只能使用HTTP Upgrade机制通过协调确定适当的协议：

    ```这基本不常见，因为目前大部分支持http2的都是https
    Upgrade: HTTP/2.0 
    HTTP2-Settings: (SETTINGS payload) 
    HTTP/1.1 200 OK 
    HTTP/1.1 101 Switching Protocols 

    发起带有HTTP 2.0 Upgrade 首部的HTTP 1.1 请求
    HTTP/2.0 SETTINGS 净荷的Base64 URL 编码
    服务器拒绝升级，通过HTTP 1.1 返回响应
    服务器接受HTTP 2.0 升级，切换到新分帧
    ```

#### http2性能评估

