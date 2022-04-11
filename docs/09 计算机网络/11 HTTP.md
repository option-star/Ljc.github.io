---
title: 计网11 HTTP
date: 2022-03-31
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



## 1. HTTP头部字段有哪些？

> 通用头

| 协议头            | **说明**                                                     | **举例**                                                     |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Cache-Control     | 用来指定当前的请求/回复中是否使用缓存机制                    | Cache-Control: no-store                                      |
| **Connection**    | TCP持久连接                                                  | Connection: keep-alive (Upgrade)                             |
| Date              | 报文创建时间                                                 | Date: Dec, 26 Dec 2015 17: 30: 00 GMT                        |
| Trailer           | 会实现说明在报文主体后记录哪些首部字段，该首部字段可以使用在 HTTP/1.1 版本分块传输编码时 | Trailer: Expiress                                            |
| Transfer-Encoding | 用来改变报文格式                                             | Transfer-Encoding: chunked                                   |
| Via               | 一个一般性的警告，表示在实体内容中可能存在错误               | Warning: 199 Miscellaneous warning                           |
| Upgrade           | 告诉服务器，这个请求是由哪些代理发出的                       | Via: 1.0 fred, 1.1 [itbilu.com.com](http://itbilu.com.com/) (Apache/1.1) |
| Warning           | 一个一般性的警告，表示在实体内容中可能存在错误               | Warning: 199 Miscellaneous warning                           |



> 请求头

| 协议头          | 说明                                                         | 举例                                               |
| --------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Accept          | 声明自己可接收格式                                           | Accept: text/plain                                 |
| Accept-Charset  | 浏览器申明可接受的字符集                                     | Accept-Charset: utf-8                              |
| Accept-Encoding | 声明自己接收哪些压缩方法                                     | Accept-Encoding: gzip, deflate                     |
| Accept-Language | 浏览器可接受的响应内容语言列表                               | Accept-Language: en-US                             |
| Authorization   | 用于表示 HTTP 协议中需要认证资源的认证信息                   | Authorization: Basic OSdjJGRpbjpvcGVul ANIc2SdDE== |
| Expect          | 表示客户端要求服务器做出特定的行为                           | Expect: 100-continue                               |
| From            | 发起此请求的用户的邮件地址                                   | From: [user@itbilu.com](mailto:user@itbilu.com)    |
| **Host**        | 表示服务器的域名以及服务器所监听的端口号                     | Host: [www.itbilu.com:80](http://www.itbilu.com/)  |
| If-XXX          | 条件请求                                                     | If-Modified-Since: Dec, 26 Dec 2015 17:30:00 GMT   |
| Max-Forwards    | 限制该消息可被代理及网关转发的次数                           | Max-Forwards: 10                                   |
| Range           | 表示请求某个实体的一部分，字节偏移以 0 开始                  | Range: bytes=500-999                               |
| Referer         | 表示浏览器所访问的前一个页面，可以认为是之前访问页面的链接将浏览器带到了当前页面 | Referer: http://itbilu.com/nodejs                  |
| User-Agent      | 浏览器的身份标识字符串                                       | User-Agent: Mozilla/……                             |
|                 |                                                              |                                                    |

> 响应头

| 协议头           | 说明                             | 举例                                            |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| Accept-Ranges    | 字段的值表示可用于定义范围的单位 | Accept-Ranges: byte                             |
| Age              | 创建响应的时间                   | Age：5744337                                    |
| ETag             | 唯一标识分配的资源               | Etag：W/"585cd998-7c0f"                         |
| Location         | 表示重定向后的 URL               | Location: http://www.zcmhi.com/archives/94.html |
| Retry-After      | 告知客户端多久后再发送请求       | Retry-After: 120                                |
| Server           | 告知客户端服务器信息             | Server: Apache/1.3.27 (Unix) (Red-Hat/Linux)    |
| Vary             | 缓存控制                         | Vary: Origin                                    |
| Content-Length   | 服务器响应的数据长度             | Content-Length:1000                             |
| Content-Type     | 服务器响应的数据格式             | `Content-Type:text/html;charset=utf-8`          |
| Content-Encoding | 服务器返回的数据的压缩格式       | `Content-Encoding: gzip`                        |



## 2. GET与POST有什么区别？



## 3. GET与POST都是安全和幂等的吗？

- **安全**： 指请求方法不会破坏服务器上的资源。
- **幂等**：多次执行相同的操作，结果都是相同的。

> GET (RFC规范)

​	GET方法就是**安全幂等的**，因为只读操作，无论操作多少次，服务器上的数据都是**安全的**，且每次结果都相同。

> POST（RFC规范）

​	POST方法因为是新增或提交数据的操作，会修改服务器上的资源，所以是**不安全的**，且多次提交数据就会创建多个资源，所以不是**幂等的**。

> 如果不按照RFC定义的规范来实现GET和POST方法

- 可以用GET方法实现新增或删除数据的请求，这样实现的GET方法自然不是安全和幂等的。
- 可以用POST方法实现查询数据的请求，这样的POST方法自然就是安全和幂等的。



## 4. GET请求可以带body吗？

​	可以，RFC规范并没有规定GET请求不能带body。

​	理论上，任何请求都可以带body的，只是因为RFC规范定义的GET请求是获取资源，所以根据这个语义不许需要用到body。
