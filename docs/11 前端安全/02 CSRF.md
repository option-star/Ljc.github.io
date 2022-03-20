---
title: CSRF攻击
date: 2021-11-06
sidebar: 'auto'
categories:
- 前端安全
isShowComments: true
---



## 什么是CSRF

CSRF（Cross-site request forgery）跨站请求伪造：黑客诱导用户进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求，利用用户在被攻击网站获得的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

## 攻击流程

1.   用户登录a.com，并保留了登录凭证（cookie）
2.   黑客诱导用户访问了b.com
3.   b.com向a.com发送了一个请求：a.com/act=xx...
4.   a.com接收到请求后，对请求进行验证，并确认是用户的凭证，误认为是受害者自己发送的请求。
5.   a.com 以受害者的名义执行了act=xx。
6.   攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作

![clipboard](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060947818.png)



## 攻击类型

### GET型

```js
 <img src="http://bank.example/withdraw?amount=10000&for=hacker" > 
```

在受害者访问有这个img的页面后，浏览器会自动向http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker发出一个HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。

### POST型

通常使用一个自动提交的表单，如

```js
 <form action="http://bank.example/withdraw" method=POST>
    <input type="hidden" name="account" value="xiaoming" />
    <input type="hidden" name="amount" value="10000" />
    <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script> 
```

访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作。

### 链接型

这种类型需要用户点击连接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击这通常以比较夸张的词语诱骗用户点击，例如：

```js
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
<a/>
```

## 特点

-   攻击由第三方网站发起，被攻击网站无法防止攻击发生
-   不能直接窃取用户数据。（只是利用用户的登录凭证）
-   难以追踪，请求有各种方式，图片url、超链接、第三方论坛、文章等。

## 防范

-   阻止不明外域的访问（CSRF发生在第三方域名）

-   -   同源检测
    -   Samesite Cookie

-   提交时要求附加本域才能获取的信息（CSRF攻击者不能获得Cookie等信息，只是使用）

-   -   CSRF Token
    -   双重Cookie验证

### 1. 同源策略

服务器可以通过解析请求头Origin Header、Referrer Header字段，确定请求的来源域。服务器通过直接阻止不可信的域名请求，达到对CSRF攻击的防御。

### 2. Samesite Cookie属性

通过设置Set-Cookie响应头的Samesite属性，用于标明该Cookie只能作为第一方的Cookie，不能作为第三方的Cookie

####  Strict值

```js
Set-Cookie: foo=1; Samesite=Strict
```

**严格模式**： Cookie在任何情况下都不能作为第三方Cookie

####  Lax值

```js
Set-Cookie: bar=2; Samesite=Lax
```

**宽松模式**：若请求作用是改变页面或者打开新页面，且是个get请求，则Cookie可以作为第三方Cookie

### 3. Token

用户请求时携带Token, 服务器通过验证是否携带正确的Token,来把正常请求和攻击请求区分，来防范CSRF攻击

#### 流程

1.   服务器通过加密算法对数据进行加密
2.   用户打开页面时，将获取到的token存储到sesson中
3.   页面提交的请求携带这个token
4.   服务器获取到请求的token, 对token进行解密，判断该token值是否有效。



#### 缺点

实现复杂，每个页面都需写入token, 后端对每个接口都需要验证，工作量巨大，可能会有遗漏。

### 4. 双重cookie验证

#### 实现流程

1.   用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串
2.   前端向后端发起请求时，取出cookie，并添加到URL的参数中
3.   后端接口验证时，把cookie字段和url参数字段进行对比，不一致就拒绝

#### 优点

1.   无需使用Session， 适用面更广
2.   Cookie存储在客户端中，不会给服务器带来压力
3.   前后端同意拦截，不用一个一个接口增加。

#### 缺点

1.   Cookie增加了额外字段
2.   如果有其它漏洞（XSS），攻击者可以注入Cookie,防御失效
3.   难以做到子域名隔离。 



### 5. 验证码

## 参考

1.   [**前端安全系列之二：如何防止CSRF攻击？**](https://juejin.cn/post/6844903689702866952#heading-35)

