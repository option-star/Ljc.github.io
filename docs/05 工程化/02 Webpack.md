---
title: 工程化02 webpack 
date: 2022-03-23
sidebar: 'auto'
categories:
- 05工程化
isShowComments: true
---

## 0. webpack的作用

- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

- 编译兼容。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过`webpack`的`Loader`机制，不仅仅可以帮助我们对代码做`polyfill`，还可以编译转换诸如`.less, .vue, .jsx`这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

- 能力扩展。通过`webpack`的`Plugin`机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

## 1. Loader和Plugin的不同

> 作用不同

- `Loader`直译为加载器。Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。所以loader的作用就是让webpack拥有加载和解析非JavaScipt文件。
- `Plugin`直译为插件。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。在Webpack运行的生命周期中会广播出许多事件，Plugin可以监听这些事件，在合适的时机通过Webpack提供的API改变输出结果。

> 用法不同

- Loader在module.rules中的配置，也就是说作为模块的解析规则而存在。类型为数组，每一项都是一个Object, 里面描述了对于什么类型的文件（test），使用什么加载（loader）和使用的参数(参数（options）
- Plugin在plugins中单独配置。类型为数组，每一项是一个plugin的实例，参数都通过构造函数传入。



## 2. 常见的loader

- `raw-loader`：加载文件原始内容（utf-8）

- `file-loader`：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)

- `url-loader`：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)

- `source-map-loader`：加载额外的 Source Map 文件，以方便断点调试

- `svg-inline-loader`：将压缩后的 SVG 内容注入代码中

- `image-loader`：加载并且压缩图片文件

- `json-loader` 加载 JSON 文件（默认包含）

- `handlebars-loader`: 将 Handlebars 模版编译成函数并返回

- `babel-loader`：把 ES6 转换成 ES5

- `ts-loader`: 将 TypeScript 转换成 JavaScript

- `awesome-typescript-loader`：将 TypeScript 转换成 JavaScript，性能优于 ts-loader

- `sass-loader`：将SCSS/SASS代码转换成CSS

- `css-loader`：加载 CSS，支持模块化、压缩、文件导入等特性

- `style-loader`：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS

- `postcss-loader`：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀

- `eslint-loader`：通过 ESLint 检查 JavaScript 代码

- `tslint-loader`：通过 TSLint检查 TypeScript 代码

- `mocha-loader`：加载 Mocha 测试用例的代码

- `coverjs-loader`：计算测试的覆盖率

- `vue-loader`：加载 Vue.js 单文件组件

- `i18n-loader`: 国际化

- `cache-loader`: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

## 3. 有哪些常见的Plugin?

- `define-plugin`：定义环境变量 (Webpack4 之后指定 mode 会自动配置)
- `commons-chunk-plugin`: 提取公共代码
- ` js-webpack-plugin`； 通过`UglifyES`压缩`ES6`代码
- `ignore-plugin`：忽略部分文件
- `html-webpack-plugin`：简化 HTML 文件创建 (依赖于 html-loader)
- `web-webpack-plugin`：可方便地为单页应用输出 HTML，比 html-webpack-plugin 好用
- `uglifyjs-webpack-plugin`：不支持 ES6 压缩 (Webpack4 以前)
- `terser-webpack-plugin`: 支持压缩 ES6 (Webpack4)
- `webpack-parallel-uglify-plugin`: 多进程执行代码压缩，提升构建速度
- `mini-css-extract-plugin`: 分离样式文件，CSS 提取为独立文件，支持按需加载 (替代extract-text-webpack-plugin)
- `serviceworker-webpack-plugin`：为网页应用增加离线缓存功能
- `clean-webpack-plugin`: 目录清理
- `ModuleConcatenationPlugin`: 开启 Scope Hoisting
- `speed-measure-webpack-plugin`: 可以看到每个 Loader 和 Plugin 执行耗时 (整个打包耗时、每个 Plugin 和 Loader 耗时)
- `webpack-bundle-analyzer`: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)





## 4. 使用webpack开发时，你用过哪些可以提高效率的插件？

- `webpack-dashboard`：可以更友好的展示相关打包信息。

- `webpack-merge`：提取公共配置，减少重复配置代码

- `speed-measure-webpack-plugin`：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。

- `size-plugin`：监控资源体积变化，尽早发现问题

- `HotModuleReplacementPlugin`：模块热替换



## 5. source map是什么？生产环境怎么用？

`source map` 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。

`map`文件只要不打开开发者工具，浏览器是不会加载的。

线上环境一般有三种处理方案：

- `hidden-source-map`：借助第三方错误监控平台 Sentry 使用
- `nosources-source-map`：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
- `sourcemap`：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 `inline-` 和 `eval-`，因为它们会增加 bundle 体积大小，并降低整体性能。



## 6. 模块打包原理知道吗？



Webpack 实际上为每个模块创造了一个可以导出和导入的环境，本质上并没有修改 代码的执行逻辑，代码执行顺序与模块加载顺序也完全一致。

首先我们应该简单了解一下`webpack`的整个打包流程：

1、读取`webpack`的配置参数；

2、启动`webpack`，创建`Compiler`对象并开始解析项目；

3、从入口文件（`entry`）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；

4、对不同文件类型的依赖模块文件使用对应的`Loader`进行编译，最终转为`Javascript`文件；

5、整个过程中`webpack`会通过发布订阅模式，向外抛出一些`hooks`，而`webpack`的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

其中文件的解析与构建是一个比较复杂的过程，在`webpack`源码中主要依赖于`compiler`和`compilation`两个核心对象实现。

`compiler`对象是一个全局单例，他负责把控整个`webpack`打包的构建流程。 `compilation`对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，`compiler`都会重新生成一个新的`compilation`对象，负责此次更新的构建过程。

而每个模块间的依赖关系，则依赖于`AST`语法树。每个模块文件在通过`Loader`解析完成之后，会通过`acorn`库生成模块代码的`AST`语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。

最终`Webpack`打包出来的`bundle`文件是一个`IIFE`的执行函数。

和`webpack4`相比，`webpack5`打包出来的bundle做了相当的精简。在上面的打包`demo`中，整个立即执行函数里边只有三个变量和一个函数方法，`__webpack_modules__`存放了编译后的各个文件模块的JS内容，`__webpack_module_cache__ `用来做模块缓存，`__webpack_require__`是`Webpack`内部实现的一套依赖引入函数。最后一句则是代码运行的起点，从入口文件开始，启动整个项目。

其中值得一提的是`__webpack_require__`模块引入函数，我们在模块化开发的时候，通常会使用`ES Module`或者`CommonJS`规范导出/引入依赖模块，`webpack`打包编译的时候，会统一替换成自己的`__webpack_require__`来实现模块的引入和导出，从而实现模块缓存机制，以及抹平不同模块规范之间的一些差异性。



## 7. 文件监听原理呢？

在发现源码发生变化时，自动重新构建出新的输出文件。

Webpack开启监听模式，有两种方式：

- 启动 webpack 命令时，带上 --watch 参数
- 在配置 webpack.config.js 中设置 watch:true

缺点：每次需要手动刷新浏览器

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 后再执行。

```js
module.export ={
    // 默认false,也就是不开启
    watch: true,
     // 只有开启监听模式时，watchOptions才有意义
    watchOptions: {        
        // 默认为空，不监听的文件或者文件夹，支持正则匹配      
        ignored: /node_modules/,       
        // 监听到变化发生后会等300ms再去执行，默认300ms       
        aggregateTimeout:300,       
        // 判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll:1000    
    }
}
```



## ８．Ｗebpack的热更新原理

​		`Webpack` 的热更新又称热替换（`Hot Module Replacement`），缩写为 `HMR`。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112051605798.webp)

首先要知道server端和client端都做了处理工作

1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
7. 而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

​	

> 细节参考[Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

### 基础概念 

- `webpack compiler`： 将js编译成Bundle
- `Bundle Server`: 提供文件在浏览器的访问，实际上就是一个服务器
- `bundle.js`： 构建输出的文件
- `HMR Runtime`: 会注入到bundle.js中，与HRM Server通过webSocket连接，接收文件变化，并更新相应的文件
- `HMR Server`： 将热更新的文件输出给`HMR Runtime`

### 原理

#### 1. 启动阶段

- webpack Compilerji



## 9. 如何对bundle体积进行监控和分析？

`VSCode` 中有一个插件 `Import Cost` 可以帮助我们对引入模块的大小进行实时监测，还可以使用 `webpack-bundle-analyzer` 生成 `bundle` 的模块组成图，显示所占体积。

`bundlesize` 工具包可以进行自动化资源体积监控。



## 10. 文件指纹是什么？怎么用？

文件指纹是打包后输出的文件名的后缀。

- `Hash`：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改
- `Chunkhash`：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash
- `Contenthash`：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变

### JS的文件指纹设置

设置 output 的 filename，用 chunkhash。

```js
module.exports = {
    entry: {
        app: './scr/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name][chunkhash:8].js',
        path:__dirname + '/dist'
    }
}
```

### CSS的文件指纹设置

设置 MiniCssExtractPlugin 的 filename，使用 contenthash。

```js
module.exports = {
    entry: {
        app: './scr/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name][chunkhash:8].js',
        path:__dirname + '/dist'
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: `[name][contenthash:8].css`
        })
    ]
}
```

### 图片的文件指纹设置

设置file-loader的name，使用hash。

占位符名称及含义

- ext     资源后缀名
- name    文件名称
- path    文件的相对路径
- folder  文件所在的文件夹
- contenthash   文件的内容hash，默认是md5生成
- hash         文件内容的hash，默认是md5生成
- emoji        一个随机的指代文件内容的emoj

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist')
    },
    module:{
        rules:[{
            test:/\.(png|svg|jpg|gif)$/,
            use:[{
                loader:'file-loader',
                options:{
                    name:'img/[name][hash:8].[ext]'
                }
            }]
        }]
    }
}
```



## 11. 如何保证各个loader按照预想方式工作

可以使用 `enforce` 强制执行 `loader` 的作用顺序，`pre` 代表在所有正常 loader 之前执行，`post` 是所有 loader 之后执行。(inline 官方不推荐使用)



## 12. 如何优化 Webpack 的构建速度？



- 使用`高版本`的 Webpack 和 Node.js

- `多进程/多实例构建`：thread-loader

- 压缩代码

    - 多进程并行压缩
        - webpack-paralle-uglify-plugin
        - uglifyjs-webpack-plugin 开启 parallel 参数 (不支持ES6)
        - terser-webpack-plugin 开启 parallel 参数

    - 通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。

- 图片压缩

    - 使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)

    - 配置 image-webpack-loader

- `缩小打包作用域`：

    - exclude/include (确定 loader 规则范围)

    - resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)

    - resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)

    - resolve.extensions 尽可能减少后缀尝试的可能性

    - noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)

    - IgnorePlugin (完全排除模块)

    - 合理使用alias

- `提取页面公共资源`：
    - 基础包分离：
        - 使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中
        - 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件

- `DLL`：

    - 使用 DllPlugin 进行分包，使用 DllReferencePlugin(索引链接) 对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译浪费时间。

    - HashedModuleIdsPlugin 可以解决模块数字id问题

- `充分利用缓存提升二次构建速度`：

    - babel-loader 开启缓存

    - terser-webpack-plugin 开启缓存

    - 使用 cache-loader 或者 hard-source-webpack-plugin

- Tree shaking： 将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数`--optimize-minimize`来实现

    - 打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率

    - 禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking

    - 使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码
        - purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)

- Scope hoisting

    - 构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突

    - 必须是ES6的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 Scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的ES6模块化语法

- 动态Polyfill
    - 建议采用 polyfill-service 只给用户返回需要的polyfill，社区维护。 (部分国内奇葩浏览器UA可能无法识别，但可以降级返回所需全部polyfill)

> 更多优化参考[官网构建性能](https://www.webpackjs.com/guides/build-performance/)



## 13. 代码分割

代码分割的本质其实就是在`源代码直接上线`和`打包成唯一脚本main.bundle.js`这两种极端方案之间的一种更适合实际场景的中间状态。

**「用可接受的服务器性能压力增加来换取更好的用户体验。」**

- 源代码直接上线：虽然过程可控，但是http请求多，性能开销大。

- 打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好。(Easy peezy right)



## 14. 是否写过Loader？简单描述一下编写loader的思路？

[Loader的API](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpackjs.com%2Fapi%2Floaders%2F) 

Loader 支持链式调用，所以开发上需要严格遵循“单一职责”，每个 Loader 只负责自己需要负责的事情。

- Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用

- Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串，当某些场景下 Loader 处理二进制文件时，需要通过 exports.raw = true 告诉 Webpack 该 Loader 是否需要二进制数据

- 尽可能的异步化 Loader，如果计算量很小，同步也可以

- Loader 是无状态的，我们不应该在 Loader 中保留状态

- 使用 loader-utils 和 schema-utils 为我们提供的实用工具

- 加载本地 Loader 方法

    - Npm link
    - ResolveLoader
    
    

## 15.是否写过Plugin？简单描述一下编写Plugin的思路？

[Plugin的API](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpackjs.com%2Fapi%2Fplugins%2F) 

webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在特定的阶段钩入想要添加的自定义功能。Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好。

- compiler 暴露了和 Webpack 整个生命周期相关的钩子

- compilation 暴露了与模块和依赖有关的粒度更小的事件钩子

- 插件需要在其原型上绑定apply方法，才能访问 compiler 实例

- 传给每个插件的 compiler 和 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件

- 找出合适的事件点去完成想要的功能

    - emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)

    - watch-run 当依赖的文件发生变化时会触发

- 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

## 16. Babel原理

大多数JavaScript Parser遵循 `estree` 规范，Babel 最初基于 `acorn` 项目(轻量级现代 JavaScript 解析器) Babel大概分为三大部分：

- 解析：将代码转换成 AST

    - 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
    - 语法分析：分析token流(上面生成的数组)并生成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST

    - [Taro](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNervJS%2Ftaro%2Fblob%2Fmaster%2Fpackages%2Ftaro-transformer-wx%2Fsrc%2Findex.ts%23L15)就是利用 babel 完成的小程序语法转换
-  生成：以新的 AST 为基础生成代码
  

## 17. Webpack构建流程简单说一下？



### 1. 初始化参数

从配置文件和Shell语句中读取与合并参数，得出最终的参数



### 2. 开始编译

用上一步的得到的参数初始化Complier对象，加载所有的配置的插件，执行对象的run方法开始执行编译确定入口；

### 3. 确定入口

根据配置中的entry找出所有的入口文件。



### 4. 编译模块

从入口文件出发，调用所有配置的Loader对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有依赖的文件都经过本步骤的处理。

### 5. 完成模块编译

在经过第4步使用Loader翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系输出资源；

### 6. 输出资源

根据入口和模块的之间的模块关系，组装成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。

### 7. 输出完成

在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

### 注意

在以上过程中，Webpack会在特定的时间点广播特定的时间，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用Webpack提供的API改变webpack的运行结果。

### 整体流程

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
         * 4.1 根据入口和模块之间的依赖关系，组装成一个个包含各个模块的Chunk
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



## 18. 如何利用webpack来优化前端性能？（提高性能和体验）

用webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。

- 压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的`UglifyJsPlugin`和`ParalleUglifyPlugin`来压缩JS文件，利用`cssnano`来压缩CSS
- 利用CSS加速。在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于`output`参数和各loader的`publicPath`参数来修改资源路径
- 删除死代码（Tree Shaking）。将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数`--optimize-minimize`来实现
- 提取公共代码



## 19. Import和CommonJs在webpack打包过程中有什么不同？

1. es6模块调用commonjs模块: 可以直接使用commonjs模块，commonjs模块将不会被webpack的模板编译而是原样输出，并且commonjs模块没有default属性
2. es6模块调用es6模块：被调用的es6模块不会添加{esModule:true}，只有调用者才会添加{esModule:true}，并且可以进行tree-shaking操作,
    如果被调用的es6模块只是import进来，但是并没有被用到，那么被调用的es6模块将会被标记为/* unused harmony default export */，在压缩时此模块将被删除(如果被调用的es6模块里有立即执行语句，那么这些语句将会被保留)
3. commonjs模块引用es6模块： es6模块编译后会添加{__esModule:true}。如果被调用的es6模块中恰好后export default语句，那么编译后的es6模块将会添加default属性。
4. commonjs模块调用commonjs模块： commonjs模块会原样输出





## 20. 如何实现webpack持久化缓存？

- **服务端设置HTTP缓存头**（Cache-Control）等
- 打包依赖（dependencies）和运行时（runtime）到不同chunk(webpack中，编译后的单独文件称为chunk)，即作splitChunk，因为它们几乎是不变的。
- **延迟加载**： 使用**import()方式**，可以动态加载的文件分到独立的chunk，以得到自己的chunkhash
- **保证hash值稳定**：编译过程中文件内容的更改尽量不影响其他文件hash的计算。对于低版本webpack生成的增量数字ID不稳定问题，可以用HashedModulesPlugin基于文件路径生成解决。



## 21. webpack打包中hash码是如何生成的？

- **hash**：代表每次webpack编译中生成的hash值，所有使用这种方式的文件hash都相同。每次构建都会使webpack计算新的hash
- **chunkhash**：基于入口文件及其关联的chunk形成，某个文件的改动只会影响与它关联的chunk的hash值，不会影响其他文件。
- **contenthash**: 根据文件内容创建。当文件内容发生变化时，contenthash发生变化。



## 22. webpack如何解决本地开发跨域问题

```js

```







## 参考

1. [「吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487#heading-0)

