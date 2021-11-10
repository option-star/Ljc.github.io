---
title: Object.create()
date: 2021-11-10
sidebar: 'auto'
tags:
- 原型链
categories:
- 手撕代码
isShowComments: true
---



## 作用

-   Object.create([obj])：创建一个空对象，并且让空对象.__proto__指向[obj]
-   [obj]可以是一个对象或者是null,但是不能是其他的值
-   Object.create(null)：创建一个不具备__proto__属性对象的值[不是任何类的实例]

## 核心代码

```js
/*
 * create : Object.create
 * @params
 *    prototype: 指向的原型
 * @return
 *    指向prototype的对象
 */
Object.create = function create(prototype) {
    if (prototype !== null && typeof prototype !== "object") throw new TypeError('Object prototype may only be an Object or null');
    var Proxy = function Proxy() {} // 创建一个类
    Proxy.prototype = prototype; // 将该类的原型替代为传入的原型
    return new Proxy; // 返回类的实例对象
};
```

