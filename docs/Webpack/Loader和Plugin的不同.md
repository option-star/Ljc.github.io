---
title: Loader和Plugin的不同
date: 2021-11-17
sidebar: 'auto'
tags:
- webpack
categories:
- Webpack
isShowComments: true
---



## Loader和Plugin的不同

- `Loader`直译为加载器。Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。所以loader的作用就是让webpack拥有加载和解析非JavaScipt文件。
- `Plugin`直译为插件。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。在Webpack运行的生命周期中会广播出许多事件，Plugin可y以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果。

