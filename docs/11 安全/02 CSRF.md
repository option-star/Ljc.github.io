---
title: 安全02 CSRF攻击
date: 2021-11-06
sidebar: 'auto'
categories:
- 11安全
isShowComments: true
---



## 1. 什么是CSRF

​	CSRF（Cross-site request forgery）指的是**跨站请求伪造攻击**：攻击者诱导用户进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。如果用户在被攻击攻击网站中保存了登录状态，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户向服务器执行一些操作。

> 本质

​	CSRF攻击的本质是利用cookie会在同源请求中携带发送给服务器的特点，以此实现用户的冒充。



##2. 攻击流程

1.   用户登录a.com，并保留了登录凭证（cookie）
2.   黑客诱导用户访问了b.com
3.   b.com向a.com发送了一个请求：a.com/act=xx...
4.   a.com接收到请求后，对请求进行验证，并确认是用户的凭证，误认为是受害者自己发送的请求。
5.   a.com 以受害者的名义执行了act=xx。
6.   攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作

![clipboard](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060947818.png)



## 3. 攻击类型

### 1）GET型

> 概念

​	比如在网站中的一个img标签里构建一个请求，当用户打开这个网站的时候就会自动发起提交



> 实例

```js
 <img src="http://bank.example/withdraw?amount=10000&for=hacker" > 
```

​	在受害者访问有这个img的页面后，浏览器会自动向http://bank.example/withdraw?account=xiaoming&amount=10000&for=hacker发出一个HTTP请求。bank.example就会收到包含受害者登录信息的一次跨域请求。



### 2）POST型

> 概念

​	比如构建一个表单，然后隐藏它，当用户进入页面时，自动提交这个表单。



> 实例

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



### 3）链接型

​	这种类型需要用户点击连接才会触发。比如在a标签的href属性里构建一个请求，然后诱导用户点击。

```js
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
  重磅消息！！
<a/>
```



## 4. 特点

-   攻击由第三方网站发起，被攻击网站无法防止攻击发生
-   不能直接窃取用户数据。（只是利用用户的登录凭证）
-   难以追踪，请求有各种方式，图片url、超链接、第三方论坛、文章等。



## 5. 防范

-   阻止不明外域的访问（CSRF发生在第三方域名）
    -   同源检测
    -   Samesite Cookie

-   提交时要求附加本域才能获取的信息（CSRF攻击者不能获得Cookie等信息，只是使用）
    -   CSRF Token
    -   双重Cookie验证


### 1） 进行同源检测

:::tip

- `referer`: 说明从哪个页面跳转过来的

```js
referer: "https://baidu.com"
```



- `Origin` : 用于指明当前请求来自于哪个站点

```js
Origin: "https://baidu.com"
```

:::

> 概念

​	服务器可以通过解析请求头Origin、Referrer字段，确定请求的来源域。服务器通过直接阻止不可信的域名请求，达到对CSRF攻击的防御。

> 缺点

- 有些情况下`referer`可以被伪造，同时还会把搜索引擎的链接也给屏蔽掉。



### 2） Cookie Samesite 

通过设置Set-Cookie响应头的Samesite属性，用于标明该Cookie只能作为第一方的Cookie，不能作为第三方的Cookie

>  Strict值 (**严格模式**) :  Cookie在任何情况下都不能作为第三方Cookie

```js
Set-Cookie: foo=1; Samesite=Strict
```



> Lax值(**宽松模式**)：若请求作用是页面跳转或者打开新页面，且是个get请求，则Cookie可以作为第三方Cookie

```js
Set-Cookie: bar=2; Samesite=Lax
```



### 3） 使用 Token 验证

用户请求时携带Token, 服务器通过验证是否携带正确的Token,来把正常请求和攻击请求区分，来防范CSRF攻击

> 流程

1.   服务器通过加密算法对数据进行加密
2.   用户打开页面时，将获取到的token存储到sesson中
3.   页面提交的请求携带这个token
4.   服务器获取到请求的token, 对token进行解密，判断该token值是否有效。

> 缺点

实现复杂，每个页面都需写入token, 后端对每个接口都需要验证，工作量巨大，可能会有遗漏。





### 4） 双重cookie验证

> 实现流程

1.   用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串
2.   前端向后端发起请求时，取出cookie，并添加到URL的参数中
3.   后端接口验证时，把cookie字段和url参数字段进行对比，不一致就拒绝

> 优点

1.   无需使用Session， 适用面更广
2.   Cookie存储在客户端中，不会给服务器带来压力
3.   前后端同意拦截，不用一个一个接口增加。

> 缺点

1.   Cookie增加了额外字段
2.   如果有其它漏洞（XSS），攻击者可以注入Cookie,防御失效
3.   难以做到子域名隔离。 



## 6. 参考

1.   [**前端安全系列之二：如何防止CSRF攻击？**](https://juejin.cn/post/6844903689702866952#heading-35)

