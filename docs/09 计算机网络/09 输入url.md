---
title: 计网09 输入url
date: 2021-12-15
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



![简单的网络模型](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031607656.jpeg)



## 1. 用户输入

当用户在地址栏中输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容，还是请求的URL。

- 如果是**搜索内容**，地址栏会使用浏览器默认的搜索引擎，来合成新的带搜索关键字的URL。
- 如果是**URL**， 会判断输入内容是否如何URL规则，如果不符合地址栏会根据规则，合成完整的URL。



## 2. 本地缓存

​	取得完整的URL后, 浏览器进程会通过进程间的通信（IPC）把URL发送至网络进程。

​	网络进程会查找本地缓存是否缓存了该资源。如果有缓存资源直接返回资源给浏览器进程；如果缓存中没有查找到资源，那么进入网络请求流程。



## 3. 解析URL

​	网络进程对 `URL` 进行解析，解析之后，浏览器确定了Web服务器和文件名，然后通过这些信息来生成HTTP请求信息。

> HTTP请求消息

![HTTP 的消息格式](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031610220.jpeg)



## 2. 真实地址查询–DNS

​	发送信息之前，会先去那**查询服务器域名对应的 IP 地址**，因为委托操作系统发送消息时，必须提供通信对象的 IP 地址。

​	所以，有一种服务器就专门保存了 `Web` 服务器域名与 `IP` 的对应关系，它就是 `DNS` 服务器。

![域名解析的工作流程](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031613452.jpeg)

## 3. 协议栈

通过 DNS 获取到 IP 后，就可以把 HTTP 的传输工作交给操作系统中的**协议栈**。应用程序（浏览器）通过调用 Socket 库，来委托协议栈工作。



![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031613468.jpeg)



## 4. TCP三次握手

​	在 HTTP 传输数据之前，首先需要 TCP 建立连接，TCP 连接的建立，通常称为**三次握手**。在双方建立了连接后，TCP 报文中的数据部分就是存放 HTTP 头部 + 数据，组装好 TCP 报文之后，就需交给下面的网络层处理。

> 网络包报文

![TCP 层报文](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031617601.jpeg)

## 5. 远程定位 IP

TCP 模块在执行连接、收发、断开等各阶段操作时，都需要委托 IP 模块将数据封装成**网络包**发送给通信对象。

![IP 层报文](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031618045.jpeg)



## 6. 两点传输 - MAC

![MAC 层报文](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031619687.jpeg)



## 7. 出口——网卡

网络包只是存放在内存中的一串二进制数字信息，没有办法直接发送给对方。因此，我们需要将**数字信息转换为电信号**，才能在网线上传输，也就是说，这才是真正的数据发送过程。



![数据包](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204031620004.png)



## 8. 送别者 —— 交换机





## 9. 出境大门 —— 路由器



## 10. 服务器



## 11. TCP四次挥手



## 12. 浏览器渲染







