---
title: Node01 Glob
date: 2022-04-25
sidebar: 'auto'
categories:
- 16Node
isShowComments: true
---

## 1. 概述

​	`node`的`glob`模块允许你使用`*`等符号，来写一个`glob`规则，像在`shell`里一样，获取配置对应规则的文件。这个`glob`工具基于`javascript`, 它使用了`minimatch`库来进行匹配。



## 2. 匹配规则

### 1）`*`

**`*`**: 匹配0或多个字符，但不包括`/`

> 匹配目录下所有的js文件

```js
  var glob = require('glob');
  var pattern = '*.js';
  
  glob(pattern, function(err, files){
     console.log(files);
  });
```

### 2）`？`

**`?`**: 匹配1个字符

```js
  var pattern = 'node_modules/glo?.js';
  glob(pattern, function(err, files){
     console.log(files);
  });
```

### 3）`**`匹配多个任意字符

```js
var pattern = 'node_modules/**.js';
```

- 匹配`node_modules`目录下的js文件，不匹配子目录中的文件
- 当设置`options`中的`moatchBase:true`时则匹配`node_modules`所有文件

### 4）[pattren|pattren]

**`[pattren|pattern]`**: 匹配其中的一个



### 5）?(pattren|pattren)

**`?(pattren|pattren)`**: 匹配其中的一个或0个；不可以组合。

> 匹配a.js,b.js；不匹配ab.js

```js
var pattern = 'node_modules/?(a|b).js';
```

### 6）+(pattern|pattern)

**`+(pattern|pattern)`**: 匹配其中一个或多个，可任意组合

>  匹配a.js,b.js,ab.js,aab.js,abb.js；不匹配abc.js

```js
var pattern = 'node_modules/+(a|b).js'
```



### 7）`*(pattern|pattern)`

**`*(pattern|pattern)`**: 匹配其中0个或多个。可以组合。

> 匹配a.js,b.js,ab.js,aab.js,abb.js；不匹配abc.js


```js
var pattren = 'node_modules/*(a|b).js';
```



### 8）`@(pattern|pattern)`

`@(pattern|pattern)`: 匹配其中的一个，不能为空；不可组合

> 与？(pattern|pattern)相似


```js
var pattren = 'node_modules/@(a|b).js';
```











## 参考

1. [Node-glob模块（github）](https://github.com/isaacs/node-glob)
1. [Node glob语法](https://juejin.cn/post/6844903906024095758#heading-10)
1. [node-glob模块](https://www.kancloud.cn/diaoyundexia/text/149921)