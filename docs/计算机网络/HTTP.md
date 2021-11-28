---
title: HTTP状态码
date: 2021-11-27
sidebar: 'auto'
tags:
- http
categories:
- 计算机网络
isShowComments: true
---



## 1 HTTP状态码

### 1.1 2XX成功

#### 200 OK

![200](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271850448.jpeg)

请求成功



#### 204 No Content

![204](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271850571.jpeg)

请求处理成功，但是没有资源返回



#### 206 Partial Content

![206](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271851543.jpeg)

请求处理成功，返回部分资源



### 1.2 3XX重定向

> 3XX响应结果表明浏览器需要执行需要特殊的处理以正确处理请求

#### 301 Moved Permanently

![301](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271853740.jpeg)

永久性重定向。该状态码表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。也就是说，如果已经把资源对应的URI保存为书签了，这时应该按Location首部字段提示的URI重新保存。

#### 302 Found

![302](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271900846.jpeg)

临时性重定向表示已移动的资源对应的URI将来还有可能发生改变。比如，用户把URI保存成书签，但不会像301状态码出现时那样去更新书签，而是仍旧保留返回302状态码的页面对应的URI。

#### 303 See Other

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271903587.jpeg)

该状态码表示由于请求对应的资源存在着另一个URI，应使用GET方法定向获取请求的资源。

#### 304 Not Modified

![304](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271904187.jpeg)

该状态码表示客户端发送附带条件的请求时，服务器端允许请求访问资源，但因发生请求未满足条件的情况后，直接返回304 Not Modified



### 1.3 4XX客户端错误

#### 400 Bad Request

![400](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271911764.jpeg)

该状态码表示请求报文中存在语法错误。当错误发生时，需修改请求的内容后再次发送请求。



#### 401  Unauthorized

![401](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271912033.jpeg)

该状态码表示发送的请求需要有通过HTTP认证（BASIC认证、DIGEST认证）的认证信息。另外若之前已进行过1次请求，则表示用户认证失败。

返回含有401的响应必须包含一个适用于被请求资源的WWW-Authenticate首部用以质询（challenge）用户信息。当浏览器初次接收到401响应，会弹出认证用的对话窗口。

#### 403 Forbidden

![403](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271913505.jpeg)

#### 404 Not Found

![404](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271913184.jpeg)



### 1.4 5XX服务器错误

> 5XX的响应结果表明服务器本身发生错误。

#### 500 Internal Server Error

![500](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271914218.jpeg)

该状态码表明服务器端在执行请求时发生了错误。也有可能是Web应用存在的bug或某些临时的故障。

#### 503 Service Unavailable

![503](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271915016.jpeg)

该状态码表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。如果事先得知解除以上状况需要的时间，最好写入Retry-After首部字段再返回给客户端。