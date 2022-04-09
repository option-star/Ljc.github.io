---
title: 计网10 RSA握手
date: 2022-04-09
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



## RSA -+握手

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325954.png)

### 1. 第一次握手

​	客户端首先会发一个「**Client Hello**」消息，消息里面有客户端使用的 TLS 版本号、支持的密码套件列表，以及生成的**随机数（\*Client Random\*）**，这个随机数会被服务端保留，它是生成对称加密密钥的材料之一。

> Client Hello

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325971.png)



### 2. 第二次握手

1. 当服务端收到客户端的「Client Hello」消息后，会确认 TLS 版本号是否支持，和从密码套件列表中选择一个密码套件，以及生成**随机数（\*Server Random\*）**。
2. 接着，返回「**Server Hello**」消息，消息里面有服务器确认的 TLS 版本号，也给出了随机数（Server Random），然后从客户端的密码套件列表选择了一个合适的密码套件。

> Server Hello

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325776.png)

3. 然后，服务端为了证明自己的身份，会发送「**Server Certificate**」给客户端，这个消息里含有数字证书。

> Server Certificate

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325709.png)

4. 随后，服务端发了「**Server Hello Done**」消息，目的是告诉客户端，我已经把该给你的东西都给你了，本次打招呼完毕。

> Server Hello Done

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325730.png)



### 3. 第三次握手

1. 客户端验证证书
2. 客户端就会生成一个新的**随机数 (\*pre-master\*)**，用服务器的 RSA 公钥加密该随机数，通过「**Change Cipher Key Exchange**」消息传给服务端。

> **Change Cipher Key Exchange**

![图片](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171329451.png)

3. 生成完会话密钥后，然后客户端发一个「**Change Cipher Spec**」，告诉服务端开始使用加密方式发送消息。

> Change Cipher Spec

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325224.png)

4. 然后，客户端再发一个「**Encrypted Handshake Message（Finishd）**」消息，把之前所有发送的数据做个摘要，再用会话密钥（master secret）加密一下，让服务器做个验证，验证加密通信是否可用和之前握手信息是否有被中途篡改过。

> Encrypted Handshake Message（Finishd）

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325590.png)







### 4. 第四次握手

​	服务器也是同样的操作，发「**Change Cipher Spec**」和「**Encrypted Handshake Message**」消息，如果双方都验证加密和解密没问题，那么握手正式完成。

​	最后，就用「会话密钥」加解密 HTTP 请求和响应了。

### 5. RSA算法的缺陷

​	**使用 RSA 密钥协商算法的最大问题是不支持前向保密**。因为客户端传递随机数（用于生成对称加密密钥的条件之一）给服务端时使用的是公钥加密的，服务端收到到后，会用私钥解密得到随机数。所以一旦服务端的私钥泄漏了，过去被第三方截获的所有 TLS 通讯密文都会被破解。

​	为了解决这一问题，于是就有了 DH 密钥协商算法，这里简单介绍它的工作流程。

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325143.png)

客户端和服务端各自会生成随机数，并以此作为私钥，然后根据公开的 DH 计算公示算出各自的公钥，通过 TLS 握手双方交换各自的公钥，这样双方都有自己的私钥和对方的公钥，然后双方根据各自持有的材料算出一个随机数，这个随机数的值双方都是一样的，这就可以作为后续对称加密时使用的密钥。

DH 密钥交换过程中，**即使第三方截获了 TLS 握手阶段传递的公钥，在不知道的私钥的情况下，也是无法计算出密钥的，而且每一次对称加密密钥都是实时生成的，实现前向保密**。

但因为 DH 算法的计算效率问题，后面出现了 ECDHE 密钥协商算法，我们现在大多数网站使用的正是 ECDHE 密钥协商算法。
