---
title: HTTPS
date: 2021-11-08
sidebar: 'auto'
tags:
- HTTPS
- 计算机网络
categories:
- 计算机网络
isShowComments: true
---





## 为什么需要HTTPS

::: tip

HTTP存在的问题

:::

### 1. 通信使用明文可能被窃听

### 2. 不验证通信方身份就可能遭遇伪装

### 3. 无法证明报文的完整性，可能已遭篡改



## 什么是HTTPS

![https](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081457057.jpeg)

HTTPS并不是一种新协议，只是HTTP通信接口部分使用SSL(`Secure Socket Layer`)或者TLS（`Transport LayerSecurity`）协议替代。

通常, HTTP直接和TCP通信。当使用SSL时，则HTTP先和SSL通信，再由SSL和TCP通信。简而言之，HTTPS就是身披SSL协议外壳的HTTP。

使用SSL后 ,HTTP就拥有了HTTPS的加密、证书和完整性保护这些功能。

SSL是独立于HTTP的协议，所以在应用层的SMTP和Telnet等协议均可配合SSL协议使用

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081512824.webp)

## HTTPS做了什么

- `加密(Encryption)`， 通过对数据加密，防止数据被监听
- `数据一致性(Data integrity)`，确保数据在传输过程中不会被修改。
- `身份认证(Authentication)`，指确认对方的真实身份，防止中间人攻击并建立用户信任。

## SSL/TLS



## HTTPS的通信步骤

::: tip

有必要了解一下的故事：[用信鸽来解释 HTTPS](https://mp.weixin.qq.com/s?__biz=MzI4Njc5NjM1NQ==&mid=2247485207&idx=1&sn=64827cd627ad08798d21076cef1b7cfa&chksm=ebd6383bdca1b12de54dc4e157543b2ff63fc8c876a73f830d3855760b90ae109b239ade633f&mpshare=1&scene=24&srcid=0416kj0u5u9OKS1MIT61ETQM#rd)

:::

![HTTPS加解密流程](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081526798.webp)



![过程](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111081503309.jpeg)

详细版：

1.  客户端通过发送Client Hello报文开始SSL通信。报文中包含客户端支持的SSL的指定版本、加密组件（Cipher Suite）列表（所使用的加密算法及密钥长度等）。
2.  服务器可进行SSL通信时，会以Server Hello报文作为应答。和客户端一样，在报文中包含SSL版本以及加密组件。服务器的加密组件内容是从接收到的客户端加密组件内筛选出来的。
3. 之后服务器发送Certificate报文。报文中包含公开密钥的证书（用于非对称加密）。
4.  最后服务器发送Server Hello Done报文通知客户端，最初阶段的SSL握手协商部分结束。
5. SSL第一次握手结束之后，客户端以Client KeyExchange报文作为回应。报文中包含通信加密中使用的一种被称为Pre-master secret的随机密码串（用于对称加密）。该报文已用步骤3中的公开密钥进行加密。
6.  接着客户端继续发送Change Cipher Spec报文。该报文会提示服务器，在此报文之后的通信会采用Pre-master secret密钥加密。
7. 客户端发送Finished报文。该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判定标准。
8. 服务器同样发送Change Cipher Spec报文。
9.  服务器同样发送Finished报文。
10.  服务器和客户端的Finished报文交换完毕之后，SSL连接就算建立完成。当然，通信会受到SSL的保护。从此处开始进行应用层协议的通信，即发送HTTP请求。
11.  应用层协议通信，即发送HTTP响应
12. 最后由客户端断开连接。断开连接时，发送close_notify报文。上图做了一些省略，这步之后再发送TCP FIN报文来关闭与TCP的通信。



## 参考

1. [图解HTTP](https://weread.qq.com/web/reader/3da32b505dd9f43da9a1acakd8232f00235d82c8d161fb2)
2. [看完这篇 HTTPS，和面试官扯皮就没问题了](https://juejin.cn/post/6844904089495535624)
3. [《大前端进阶 安全》系列 HTTPS详解（通俗易懂）](https://juejin.cn/post/6844904127420432391)
4. [分分钟让你理解HTTPS](https://juejin.cn/post/6844903599303032845)

