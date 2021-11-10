---
title: ajax
date: 2021-11-10
sidebar: 'auto'
tags:
- ajax
categories:
- 手撕代码
isShowComments: true
---



## 什么是ajax

​	**AJAX**(`**A**synchronous **J**avaScript **A**nd **X**ML`)的简称，它允许我们在不刷新整个页面的情况下，就可以异步获取数据，并更新页面的部分内容

## 核心代码

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111102204090.webp)

### promise版本

```js
const getJSON = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  });
};
```



## 参考

1.   [面试题：手写ajax](https://juejin.cn/post/6992604888165253156)



