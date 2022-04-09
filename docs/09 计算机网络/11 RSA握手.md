---
title: 计网10 RSA握手
date: 2022-04-09
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091522780.png)

## 1. RSA 握手过程

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325954.png)

### 1）第一次握手

​	客户端首先会发一个「**Client Hello**」消息：

- 客户端使用的 **TLS 版本号**
- 支持的**密码套件列表**
- 生成的**随机数（\*Client Random\*）**：这个随机数会被服务端保留，它是生成对称加密密钥的材料之一

> Client Hello

![图片](https://cdn.jsdelivr.net/gh/option-star/imgs/202204091325971.png)



### 2）第二次握手

1. 服务端返回「**Server Hello**」消息

   - 服务器确认的 **TLS 版本号**

   - **随机数**（Server Random）

   - 从客户端的密码套件列表选择了一个合适的**密码套件**。

2. 服务端会发送「**Server Certificate**」消息，这个消息里含有数字证书，目的是为了证明自己身份。

4. 服务端发了「**Server Hello Done**」消息：目的是告诉客户端，我已经把该给你的东西都给你了，本次打招呼完毕。



### 3）第三次握手

1. 客户端验证证书，从证书中获取RSA公钥。
2. 客户端就会生成一个新的**随机数 (\*pre-master\*)**，用服务器的 RSA 公钥加密该随机数，通过「**Change Cipher Key Exchange**」消息传给服务端。

3. 客户端发一个「**Change Cipher Spec**」，告诉服务端开始使用加密方式发送消息。

4. 客户端发一个「**Finished**」消息，把之前所有发送的数据做个摘要，再用会话密钥（master secret）加密一下，让服务器做个验证，验证加密通信是否可用和之前握手信息是否有被中途篡改过。



### 4）第四次握手

- 服务端同样发送「**Change Cipher Spec**」
- 服务端同样发送「**Finished**」
- 如果双方都验证加密和解密没问题，那么握手正式完成。最后，就用「会话密钥」加解密 HTTP 请求和响应了



## 2. RSA算法的缺陷

​	**不支持前向保密**。因为客户端传递随机数（用于生成对称加密密钥的条件之一）给服务端时使用的是公钥加密的，服务端收到到后，会用私钥解密得到随机数。所以一旦服务端的私钥泄漏了，过去被第三方截获的所有 TLS 通讯密文都会被破解。


