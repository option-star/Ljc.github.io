---
title: 计网01 WebSocket
date: 2021-03-21
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



## 1. 什么是WebSocket？

**webSocket**： 一种浏览器与服务器进行双全工通讯的网络技术，属于应用层协议。



## 2. 优点

1. 支持双向通信，实时性更强
2. 更好的二进制支持
3. 较少的控制开销。连接建立后，ws客户端、服务端进行数据交互时，协议控制的数据包头部较小。而HTTP协议每次通信都需要携带完整的头部。
4. 支持扩展。



## 3. 如何建立连接

![image-20220409212138195](https://cdn.jsdelivr.net/gh/option-star/imgs/202204092121400.png)

### 1）客户端：申请协议升级

首先，客户端发起协议升级的请求，采用的是标准的HTTP报文格式，且只支持GET方法

> 请求报文

```http
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
```

- `Upgrade: websocket`： 表示要升级到webSocket协议
- `Sec-WebSocket-Version: 13`: 表示webSocket的版本。如果服务端不支持该版本，需要返回一个`Sec-WebSocket-Version`header，里面包含服务端支持的版本号
- `Sec-WebSocket-key`: 提供基本的防护，比如恶意连接，无意连接。
- `Connection: Upgrade`: 表示升级协议。



### 2）服务端：响应协议升级

服务端响应请求，状态码为101表示协议切换。

```http
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

其中：`Sec-WebSocket-Accept`根据客户端请求首部的`Sec-WebSocket-Key`计算出来的。

计算公式为：

- 将`Sec-WebSocket-Key`跟`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`拼接。
- 通过**SHA1**计算出摘要，并转成base64字符串



## 4. 数据帧格式

WebSocket客户端、服务端通信的最小单位是帧（frame），由1个或多个帧组成一条完整的消息（message）。

1. 发送端：将消息切割成多个帧，并发送给服务端；
2. 接收端：接收消息帧，并将关联的帧重新组装成完整的消息；





## 参考

1. [WebSocket 数据帧](https://blog.csdn.net/p312011150/article/details/79758068)
