---
title: Vite原理
date: 2022-03-04
sidebar: 'auto'
tags:
- vite
categories:
- vite
isShowComments: truemo 
---



1. 默认会给vue的模块增加一个`@module`的前缀
2. 把.vue文件在后端解析成一个对象
3. 默认采用的是es6原生模块（唯一编译了.vue文件）
   1. import语法 在es6中默认会发送一个请求
4. 主要通过node koa ，快速搭建http服务



主要做的是

1. 需要通过http启动一个模块，内部是基于Koa
2. 添加依赖
   - es-modile-lexer ： vue模块增加@module前缀
   - koa : 启动http服务
   - koa-static : 启动静态服务
   - magic-string：重写字符串
3. 用户当运行dev时，在vite中创建一个http服务

