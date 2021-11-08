---
title: HTTP发展史
date: 2021-11-08
sidebar: 'auto'
tags:
- HTTP
categories:
- 计算机网络
isShowComments: true
---



<img src="https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081734252.webp" alt="图片描述" style="zoom:150%;" />

## 1. HTTP0.9

### 1.1 提出

​		HTTP0.9 , 于1991年提出，主要用于学术交流，主要用于在网络之间传输体积很小的HTML文件。

### 1.2 请求流程

![http/0.9请求流程](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e305dd85a7c849~tplv-t2oaga2asx-watermark.awebp)

1.   首先客户端根据IP地址、端口和服务器建立TCP连接，而建立连接的过程就是TCP协议三次握手的过程。
2.   建立好连接后，客户端会发送一个GET请求行的信息， 如`GET /index.html` 用来获取index.html
3.   服务器接受请求信息后，读取对应的HTML文件，并将连接以ASCII字符流返回给客户端
4.   HTML文档传输完成后，断开连接

### 1.3 特点

-   **只有一个请求行，没有HTTP请求头和请求体**
-   **服务器也没有返回头信息**
-   **返回的内容是以ASCII字符流来传输的**（因为都是HTML格式文件，且ASCII编码范围为0 ~127,  一个字符即可表示，用ASCII来传输节省空间）

### 1.4 传输层协议

​		TCP

## 2. HTTP1.0

### 2.1 改进HTTP0.9

​		为 了满足传输多种类型文件的需求， HTTP/1.0引入了请求头和响应头，它们都是以Key-Value形式保存的，在HTTP发送请求时，会带上请求头信息，服务器返回数据时，会先返回响应头信息。

![http/1.0请求流程](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111082239155.webp)

### 2.2 特点

-   为了支持多种类型文件，浏览器需要知道返回的数据类型
-   为了减轻传输性能，支持压缩后传输
-   为了提供国际化的支持，浏览器需要指明需要的语言版本
-   为了准确读取文件，浏览器需要知道文件的编码类型
-   为了告诉浏览器服务器最终处理该请求的情况，引入状态码
-   为了减轻服务器的压力，提供Cache机制，用来缓存已经下载过的数据
-   为了方便服务器统计客户端的基本信息，在请求头中加入用户代理User Agent字段

### 2.3 请求体/响应体

**请求头**：

```js
accept: text/html // 期待服务器返回html类型的文件
accept-encoding: gzip, deflate, br // 期待服务器可以采用gzip、deflate、br其中一种压缩方式
accept-Charset: ISO-8859-1,utf-8 // 期待返回的文件编码是 ISO-8859-1或utf-8
accept-language: zh-CN,zh // 期望⻚面的优先语言是中文
```

**响应头**：

```js
content-encoding: br // 表示服务器采用了br的压缩方式
content-type: text/html; charset=UTF-8 // 服务器返回的是html文件，并且该文件的编码类型是UTF-8
```

### 2.4 传输层协议

​		TCP

### 2.5 瓶颈

-   每一次进行HTTP通信，都需要建立TCP链接、传输HTTP数据和断开TCP连接三个阶段，会增加大量无畏的开销
-   只有前面请求的返回之后才能进行下一次请求，如果某个请求没有及时返回，会引起`对头阻塞`
-   每个域名绑定一个唯一的IP地址，因此一个服务器只能支持一个域名
-   需要在响应头中设置完整的数据大小（`Content-Length`），浏览器根据设置的数据大小来接受数据，这种方式对于接受动态生成的内容无能为力
-   存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续存

## 3 HTTP1.1

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081800794.webp)

### 3.1 改进HTTP1.0



### 3.2 传输层协议



### 3.3 瓶颈



## HTTP2.0

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081800828.webp)

HTTP2.0的前身是HTTP1.0和HTTP1.1。虽然之前仅仅只有两个版本，但这两个版本所包含的协议规范之庞大，足以让任何一个有经验的工程师为之头疼。网络协议新版本并不会马上取代旧版本。实际上，1.0和1.1在之后很长的一段时间内一直并存，这是由于[网络基础设施](https://baike.baidu.com/item/网络基础设施/5183560)更新缓慢所决定的

## HTTP3.0

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081801681.webp)

## 





## 参考

1.   [HTTP发展史（HTTP1.1，HTTPS，SPDY，HTTP2.0，QUIC，HTTP3.0）](https://juejin.cn/post/6844903988953874445#heading-0)
2.   [六张图从HTTP/0.9进化到HTTP3.0](https://juejin.cn/post/6856036933723521032)
3.   [百度百科](https://baike.baidu.com/item/HTTP/243074?fr=aladdin#2)

