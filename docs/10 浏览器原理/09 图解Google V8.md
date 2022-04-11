---
title: 浏览器08 v8
date: 2022-04-10
sidebar: 'auto'
categories:
- 10浏览器
isShowComments: true
---



![image.png](https://cdn.jsdelivr.net/gh/option-star/imgs/202204102315302.webp)

## 1. 什么是V8？

​	V8是一个由Google开发的开源JavaScript引擎，其核心功能是执行易于人类理解的JavaScript代码。



## 2. 执行高级语言的方式

- **解释执行**： 需要先将输入的源代码通过解析器编译成中间代码，之后直接使用解释器解释执行中间代码，然后直接输出结果。

![image.png](https://cdn.jsdelivr.net/gh/option-star/imgs/202204102329215.webp)

- **编译执行**： 先将源代码通过编译器转换为中间代码，然后编译器再将中间代码编译成机器代码。

![image.png](https://cdn.jsdelivr.net/gh/option-star/imgs/202204102333639.webp)

:::tip

​	通常编译成的及其代码是以二进制文件形式存储的，需要执行这段程序的时候直接 执行二进制文件。还可以使用虚拟机将编译后的及其代码保存在内存中，然后直接 执行内存中的二进制代码。

:::
