---
title: webpack
date: 2021-11-17
sidebar: 'auto'
tags:
- webpack
categories:
- Webpack
isShowComments: true
---

![image-20211203083503739](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112030835876.png)

[官网](https://webpack.docschina.org/)

:::tip

- `Entry`: 编译入口，webpack编译的起点
- `Compiler`： 编译管理器，webpack启动后会启动`compiler`对象，该对象一直存活直到结束退出
- `Comoilation`: 单次编辑过程中的管理器，比如`watch = true`时，运行过程中只有一个`compiler`但每次文件变更触发重新编译时，都会创建一个新的`compilation`对象。
- `Dependence`： 依赖对象，webpack基于该类型记录模块间依赖关系。
- `Module`: webpack内部所有资源都会以`module`对象形式存在，所有关于资源的操作、转译、合并都是以`module`为基本单位进行的。
- `Chunk`: 编译完成准备输出时，webpack会将`module`按特定的规则组织成一个一个的`chunk` ，这些`chunk`某种程度上跟最终输出一一对应。
- `Loader`： 资源内容转换器，其实就是实现从内容A转换B的转换器
- `Plugin`: webpack构建过程中，会在特定的时机广播对应的事件，插件监听这些事件，在特定事件点接入编译过程。

:::



## 0 webpack构建流程

webpack主要实现了内容转换 + 资源合并的两种功能。

### 1 初始化阶段

1. **初始化参数**： 从配置文件、配置对象、Shell参数中读取，与默认配置结合得到最终参数。
2. **创建编译器对象**： 用上一步得到的参数创建`Compiler`对象。
3. **初始化编译环境**：包括注入内置的插件、注册各种模块工厂、初始化RuleSet集合、加载配置的插件等。
4. **开始编译**： 执行`compiler`对象的`run`方法
5. **确定入口**： 根据配置中的`entry`找出所有的入口文件，调用`compilition.addEntry`将入口文件转化为`dependence`对象。

### 2 构建阶段

1. **编译模块**： 根据`entry`对应的`dependence`创建的`module`对象，调用`loader`将模块转译为标准JS内容，调用JS解析器将内容转换为AST对象，从中找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
2. **完成模块编译**：由于递归处理每一个依赖到的模块后，就可以的得到模块翻译后的内容和模块之间的依赖关系。



### 3 生成阶段

1. **输出资源**: 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的`chunk`，再把每个`ChunK`转换成一个单独的文件加入到输出列表中(可以修改输出内容的最后一步)
2. **写入文件系统**： 在确定好输出内容之后，根据配置确定输出的路径和文件名，把文件内容写到文件系统



## 1 初始化阶段

> webpack初始化的过程：

![微信图片_20211203102228](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112031023375.jpg)

1. 将[process.argv](http://nodejs.cn/api/process/process_argv.html)(命令行参数) + `webpack.config.js`合并成用户的配置
2. 调用`validateSchema`校验配置
3. 调用`getNormalizedWebpackOptions  +  applyWebpackOptionsBaseDefaults`合并出最终配置
4. 创建`compiler`对象
5. 遍历用户定义的`plugins`集合，执行插件的`apply`方法
6. 调用`new WebpackOptionsApply().process`方法，加载各种内置插件



## 2 构建流程





## 参考

1. [[万字总结] 一文吃透 Webpack 核心原理](https://juejin.cn/post/6949040393165996040#comment)
2. [深入浅出 Webpack](https://webpack.wuhaolin.cn/)
3. [webpack官网](https://webpack.docschina.org/)

