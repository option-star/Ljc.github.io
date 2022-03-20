---
title: webpack的构建流程
date: 2021-11-17
sidebar: 'auto'
tags:
- webpack
categories:
- Webpack
isShowComments: true
---



## 1. 初始化参数

​	从配置文件和Shell语句中读取与合并参数，得出最终的参数



## 2. 开始编译

​	用上一步的得到的参数初始化Complier对象，加载所有的配置的插件，执行对象的run方法开始执行编译确定入口；根据配置中的entry找出所有的入口文件。



## 3. 编译模块

​	从入口文件出发，调用所有配置的Loader对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有依赖的文件都经过本步骤的处理。

## 4. 完成模块编译

​	在经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系输出资源；根据入口和模块的之间的模块关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。

## 5. 输出完成

​	在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## 注意

​	在以上过程中，Webpack会在特定的时间点广播特定的时间，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变webpack的运行结果。

## 整体流程

> webpack工作流程

```js
/**
 * webpack的工作流程
 */
let { SyncHook } = require('tapable');
let fs = require("fs");

class Compiler {
    constructor(options) {
        this.options = options;

        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook()
        }
    }

    run() {
        let modules = []; // 存放Loader编译后的所有模块
        let chunks = [];
        let files = [];

        this.hooks.run.call(); // 触发run钩子执行
        let entry = path.join(this.options.context, this.options.entry) // context：根路径，entry：入口文件

        /**
         * 3.1 读取模块内容(es6)
         */
        let entryContent = fs.readFileSync(entry, 'utf8');

        /**
         * 3.2 将模块内容由es6转换为es5
         */
        let entrySource = babelLoader(entryContent);

        /**
         * 3.3 构建模块(webpack中每个文件都是一个模块)
         */
        let entryModule = {
            id: entry,
            source: entrySource
        };
        modules.push(entryModule)

        /**
         * 3.4 把入口模块的代码转成抽象语法树AST，分析里面的import和require依赖
         */
        //... (子模块递归进行3.1 ~　3.4的步骤)

        /**
         * 完成第3.*后，得到通过Loader翻译的所有模块modules
         */

        /**
         * 4.1 根据入口和模块之间的依赖关系，组装成一个个包含哥哥模块的Chunk
         */
        let chunk = { // 构建chunk
            name: "main",
            modules
        }
        chunks.push(chunk);  // 构建chunks

        /**
         * 4.2 把每个Chunk转换成一个单独的文件加入到输出列表
         */
        let file = {
            file: this.options.output.filename,
            source: 'xxx' // source为打包后的源代码
        }
        files.push(file);

        /**
         * 4.4 在确定好输出内容后，根据配置确定的路径和文件名 把文件内容写入到文件系统 
         */
        let outputPath = path.join( // 构建输出的路径
            this.options.output.path,
            this.options.output.filename
        )
        fs.writeFileSync(outputPath,file.source, 'utf8') // 写入磁盘

        this.hooks.done.call(); // 触发done事件
        
        /**
         * 注意：
         * 1. Webpack会在特定的时间点广播出特定的实例， 例如hooks.on、hooks.done
         * 2. 插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变webpack的运行结果
         * 例如插件在on\done执行自身的逻辑
         * 
         */

    }
}

/**
 * 1. 初始化参数： 从配置文件和shell语句中读取与合并参数，得出最终的参数
 */
let options = require('./webpack.config');

/**
 * 2.1 开始编译，用上一步得到的参数初始化Compiler对象
 */
let compiler = new Compiler(options);

/**
 * 2.2 加载所有配置的插件，执行对象的run方法开始执行编译
 */
if (option.plugins && Array.isArray(option.plugins)) { // 配置里存在插件且有多个（数组形式）
    for (const plugin of options.plugins) { // 通过循环对每个插件进行处理
        plugin.apply(compiler); // 通过调用插件内部的apply方法，进行编译  
    }
}

/**
 * 2.3 确定入口：根据配置中的entry找出所有的入口文件
 */
compiler.run();
```



