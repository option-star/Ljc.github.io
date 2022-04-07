---
title: 计网07 HTTP状态码
date: 2022-03-31
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



![ 五大类 HTTP 状态码 ](https://cdn.jsdelivr.net/gh/option-star/imgs/202204070831334.png)

### 1xx 提示信息

:::tip

​	`1xx` 类状态码属于**提示信息**，是协议处理中的一种中间状态，实际用到的比较少。

:::

- `100 Continue`: 继续。客户端继续处理协议

- `101 Switching Protocol` ： 表示切换协议。服务端根据客户端的请求切换到更高级的协议。



### 2xx 成功

:::tip

​	`2xx` 类状态码表示服务器**成功**处理了客户端的请求，也是我们最愿意看到的状态。

:::

- ` 200 OK`: 表示一切正常。如果是非 `HEAD` 请求，服务器返回的响应头都会有 body 数据。
- `201 Created `: 请求已实现。并且有一个新的资源已经依据需求而建立
- `202 Accepted` ：请求已接受。已经接受请求，但还未处理完成
- `203 Non-Authoritative Information` : 非授权信息。请求成功。但返回的 meta 信息不在原始的服务器中，而是一个副本。
- `204 Not Content`: 无内容。响应头内没有body数据。
- `205 Reset Content`：重置内容。与 204 类似，不同点是返回此状态码的响应要求请求者重置文档视图
- `206 Partial Content`: 应用于HTTP分块下载或断电续存，表示响应返回的body数据并不是资源的全部，而是其中的一部分。



### 3xx 重定向

:::tip

​	`3xx` 类状态码表示客户端请求的资源发送了变动，需要客户端用新的 URL 重新发送请求获取资源，也就是**重定向**。

:::

- `300 Multiple Choices`: 多种选择。被请求的资源有一系列可供选择的回馈信息，用户或浏览器能够自行选择一个首选地址进行重定向
- `301 Moved Permanently` : 表示永久重定向，说明资源已经不在了，需改用新的URL再次访问。（响应头的`Location`字段）
- `302 Found`: 表示临时重定向，说明请求资源还在，但暂时需要用另一个URL来访问。（响应头的`Location`字段）
- ` 303 See Other`：查看其它地址。与301类似。使用GET和POST请求查看
- `304 Not Modified`： 不具有跳转的含义，表示资源未修改，重定向已存在的缓存文件，也称缓存重定向，用于缓存控制。
- `305 Use Proxy`: 使用代理。被请求的资源必须通过指定的代理才能被访问
- `306 Unused`: 在最新版的规范中，306状态码已经不再被使用
- `307 Temporary Redirect`: 临时重定向。请求的资源现在临时从不同的URI 响应请求，与302类似



### 4xx 客户端错误

:::tip

​	`4xx` 类状态码表示客户端发送的**报文有误**，服务器无法处理，也就是错误码的含义。

:::

- `400 Bad Request`: 表示客户端请求的报文有错误。
- `401 Unauthorized`: 表示未授权，当前请求需要用户验证
- `403 Forbidden`: 服务器已经理解请求，但是拒绝执行它
- `404 Not Found`: 表示请求的资源在服务器上不存在或找不到，所以无法提供客户端。
- `405 Method Not Allowed `: 客户端请求中的方法被禁止
- `406 Not Acceptable`: 请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体
- `407 Proxy Authentication Required`:与401响应类似，只不过客户端必须在代理服务器上进行身份验证
- `408 Request Time-out`: 请求超时。服务器等待客户端发送的请求时间过长，超时
- `409 Conflict` : 由于和被请求的资源的当前状态之间存在冲突，请求无法完成
- `410 Gone`: 被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址
- `411 Length Required `: 服务器拒绝在没有定义 Content-Length 头的情况下接受请求
- `412 Precondition Failed`: 客户端请求信息的先决条件错误
- `413 Request Entity Too Large`: 服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围
- `414 Request-URI Too Large` : 请求的 URI 长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务
- `415 Unsupported Media Type`: 服务器无法处理请求附带的媒体格式
- `416 Requested range not satisfiable` : 客户端请求的范围无效
- `417 Expectation Failed`:   服务器无法满足Expect的请求头信息





### 5xx 服务端错误

:::tip

​	`5xx` 类状态码表示客户端请求报文正确，但是**服务器处理时内部发生了错误**，属于服务器端的错误码。

:::

- `500 Internal Server Error`: 表示服务端出错
- `501 Not Implemented`: 表示客户端请求的功能还不支持
- `502 Bad Gateway`: 通常时服务器作为网关或代理时返回的错误码，表示服务器自身工作正常，访问后端服务器发生错误
- `503 Service Unavailable`： 表示服务器当前很忙，暂时无法响应服务器
- `504 Gateway Time-out`: 充当网关或代理的服务器，未及时从远端服务器获取请求
- `505  HTTP Version not supported` : 服务器不支持，或者拒绝支持在请求中使用的 HTTP 版本

