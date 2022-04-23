---
title: React02 react技术揭秘
date: 2022-04-22
sidebar: 'auto'
categories:
- 13React
isShowComments: true
---



## 第一章 React理念

### React理念

#### React理念

我们可以从[官网 (opens new window)](https://zh-hans.reactjs.org/docs/thinking-in-react.html)看到`React`的理念：

> 我们认为，React 是用 JavaScript 构建**快速响应**的大型 Web 应用程序的首选方式。它在 Facebook 和 Instagram 上表现优秀。

可见，关键是实现`快速响应`。那么制约`快速响应`的因素是什么呢？

我们日常使用App，浏览网页时，有两类场景会制约`快速响应`：

- 当遇到大计算量的操作或者设备性能不足使页面掉帧，导致卡顿。
- 发送网络请求后，由于需要等待数据返回才能进一步操作导致不能快速响应。

这两类场景可以概括为：

- CPU的瓶颈
- IO的瓶颈

`React`是如何解决这两个瓶颈的呢？

#### CPU的瓶颈



#### IO的瓶颈



#### 总结

通过以上内容，我们可以看到，`React`为了践行“构建**快速响应**的大型 Web 应用程序”理念做出的努力。

其中的关键是解决CPU的瓶颈与IO的瓶颈。而落实到实现上，则需要将**同步的更新**变为**可中断的异步更新**。