---
title: Object.create()
date: 2021-11-11
sidebar: 'auto'
tags:
- promise
categories:
- 手撕代码
isShowComments: truesh
---

## 手写规范

-   [promiseAplus规范](https://promisesaplus.com/) 

## promiseaPlus规范

### 1. 术语

-   `promise`：表示一个带有符合规范的then方法的对象或者函数
-   `thenable`： 表示一个定义了一个then方法的对象或者函数
-   `value`： 表示一个任意合法的JavaSript值（包括undefined，thenable或者promise）
-   `exception`： 表示一个使用throw语句抛出的值
-   `reason`: 表示一个指出为什么promise被rejected的值

### 2. 要求

#### 2.1 promise状态

`promise`必须是以下三种状态的其中一种:`pending`、`fulfilled`或者`rejected`。

##### 2.1.1 当``promise``处于`pending`状态时：

-   `pending`状态可以转变为`fulfilled`或者`rejected`状态

##### 2.1.2 当`promise`处于`fulfilled`状态时：

-   `fulfilled`状态一定不能转变为其他任何一种状态
-   必须有一个`value`，且这个`value`一定不能被改变

##### 2.1.3 当`promise`处于`rejected`状态时：

-   `rejected`状态一定不能转变为其他任何一种状态
-   必须有一个`reason`， 且这个`reason`一定不能被改变

::: warning

​	在这里，“一定不能被改变”意味着不可变的身份(即===)，但是并不意味着深层不变性。

​	也就是说，value/reason指向的地址不变，但是地址对应的堆空间的内容是可变的。

:::





## 实现基本的promise

### 实现流程

1.  promise是一个类，可以new Promise创建一个实例

2.  promise有三个状态

3.  1.  默认状态叫等待态 pending
    2.  resolve表示成功态 fulfilled
    3.  reject表示变成失败态 rejected

4.  只有在pending的状态的时候才能改变状态，不能从成功变成失败，不能从失败变成成功

5.  成功有成功的原因，失败同样有失败的原因，除了调用resolve和reject能改变状态外，还可以使用throwerror抛出异常也会执行失败的逻辑。

6.  then方法中提供两个参数，1.成功回调，2.失败回调

7.  then可以多次调用

8.  executor会默认被执行，同步执行

### 核心代码

```js
```



### 检测

-   resolve走成功态

```js
let promise = new Promise((resolve, reject) => {
    resolve('ok') // 让promise变成成功态
});

promise.then((value) => {
    console.log(value, "success");
}, (reason) => {
    console.log(reason, "fail");
})
```

![image-20211111100947144](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111111010346.png)

-   reject走失败态

```js
let promise = new Promise((resolve, reject) => {
    reject('fail')
});

promise.then((value) => {
    console.log(value, "success");
}, (reason) => {
    console.log(reason, "fail");
})
```

![image-20211111100923784](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111111011847.png)

-   一旦失败就不能成功，一旦成功就不能失败

```js
let promise = new Promise((resolve, reject) => {
    resolve('ok')
    reject('fail') 
});

promise.then((value) => {
    console.log(value, "success");
}, (reason) => {
    console.log(reason, "fail");
})
```

![image-20211111100250202](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111111002250.png)

-   除了调用resolve和reject能改变状态外，还可以使用throw error抛出异常，也会执行到失败的逻辑

```js

let promise = new Promise((resolve, reject) => {
    throw new Error("error");
    reject('fail') // 让promise变成成功态
});

promise.then((value) => {
    console.log(value, "success");
}, (reason) => {
    console.log(reason, "fail");
})
```

![image-20211111100556107](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111111005148.png)

