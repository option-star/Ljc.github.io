---
title: Vue3
date: 2021-11-27
sidebar: 'auto'
tags:
- Vue3
categories:
- Vue
isShowComments: true
---



## 1 区别介绍

> 架构上变化

- 源码采用`monorepo`方式进行管理，将模块拆分到package目录中。
- `Vue3`采用`ts`开发，增强类型检测。`Vue2`采用`flow`
- `Vue3`的性能优化，支持tree-shaking，也就是说不使用就不会被打包
- `Vue2`后期引入RFC，使每个版本改动可控。Vue3会遵循该RFC。[[rfc](https://github.com/vuejs/rfcs)]

> 内部代码优化

- `Vue3`劫持数据采用proxy，Vue2劫持数据采用的是defineProperty。defineProperty有性能问题和缺陷

- `Vue3`中对模板编译进行了优化，编译是生成Block tree，可以对子节点的动态节点进行收集，更新时可以减少比较，并且采用了`patchFlag`标记动态节点

- `Vue3`采用`compositionApi`进行组织功能，解决反复横条，优化复用逻辑（mixin带来的数据来源不清晰

    、命名冲突等），相比`optionsApi`类型推断更加方便。

- 增加了`Fragment`、`Teleport`、`Suspense`组件。



### 1.1 monorepo？

​	有很多项目，每个项目都有自己的仓库，把仓库分开管理， 无法统一管理项目，而monorepo可以在一个项目下可以管理很多个项目。Vue源码把Vue拆分为一个个子包，把子包封装到一个Vue项目中，可以选择采用哪些功能。

### 1.2 proxy？

defineProperty的缺陷。所有属性都需要拦截， 将属性全部重写为get和set的写法。如果一个对象里面有非常多的属性， 而且层级非常深，Vue2默认把对象迭代一遍，将属性全部重写，性能就很差。

Vue3采用的是proxy，proxy的好处就是代理，我们不需要改变对象中的属性，对对象进行代理，当对对象取值或设置值可以执行自己的逻辑，不需一开始就对对象数据递归改写一遍，这就是Vue3中proxy的好处。

proxy解决了递归问题，而且不需要改写对象本身，但是兼容性不好。

### 1.3 compositionApi

Vue2中，实现某个功能，需要把代码分散到data、computed等函数中，若功能越来越多的时候，所有功能代码就混杂在一起，难以区分，而compositionApi就是把功能封装成一个函数。



## 2 Vue3架构分析

> [Vue3官网](https://v3.cn.vuejs.org/guide/introduction.html)

### 2.1 Monorepo介绍

Monorepo是管理项目代码的一个方式，指在一个项目仓库（repo）中管理多个模块/包（package）

- 一个仓库可维护多个模块，不用到处找仓库
- 方便版本管理和依赖管理，模块之间的引用，调用都非常方便

> 缺点：仓库体积会变大



### 2.2 Vue3项目结构

> /packages

![image-20211127174541143](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271745307.png)

- `reactivity`: 响应式系统
- `runtime-core`: 与平台无关的运行时核心（可以创建针对特定平台的运行时- 自定义渲染器）
- `runtime-dom`：针对浏览器的运行时。包括`DOM API`、属性、事件处理等
- `runtime-test`: 用于测试
- `server-renderer`: 用于服务器端渲染
- `compiler-core`： 与平台无关的编译器核心
- `compiler-dom`: 针对浏览器的编译模块
- `compiler-ssr`：针对服务器渲染的编译模块
- `compiler-sfc`：针对单文件解析
- `size-cleck`: 用于测试代码体积
- `template-exporer`: 用于调试编译器输出的开发工具
- `shared`: 多个包之间共享的内容
- `vue`: 完整版本，包括运行时和编译器

> 核心模块

![核心模块](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111271753417.png)

