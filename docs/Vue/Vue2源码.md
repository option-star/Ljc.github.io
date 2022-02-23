---
title: vue2
date: 2021-12-14
sidebar: 'auto'
tags:
- Vue
categories:
- Vue
isShowComments: true
---



## 零、 准备工作

### 0.1 目录设计

Vue.js 的源码都在 src 目录下，其目录结构如下。

```text
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

#### compiler

​	compiler 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

#### core

​	core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

#### platform

​	Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。我们会重点分析 web 入口打包后的 Vue.js，对于 weex 入口打包的 Vue.js，感兴趣的同学可以自行研究。

####server

​	Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

#### sfc

​	通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

#### shared

​	Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

#### 总结

​	从 Vue.js 的目录设计可以看到，作者把功能模块拆分的非常清楚，相关的逻辑放在一个独立的目录下维护，并且把复用的代码也抽成一个独立目录。这样的目录设计让代码的阅读性和可维护性都变强，是非常值得学习和推敲的。



### 0.2 源码构建

Vue.js 源码是基于 [Rollup](https://github.com/rollup/rollup) 构建的，它的构建相关配置都在 scripts 目录下。

#### 0.2.1 构建脚本

​	通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目的描述文件，它的内容实际上是一个标准的 JSON 对象。我们通常会配置 `script` 字段作为 NPM 的执行脚本，Vue.js 源码构建的脚本如下：

```json
{
  "script": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
  }
}
 
```

​	这里总共有 3 条命令，作用都是构建 Vue.js，后面 2 条是在第一条命令的基础上，添加一些环境参数。当在命令行运行 `npm run build` 的时候，实际上就会执行 `node scripts/build.js`，接下来我们来看看它实际是怎么构建的。

#### 0.2.2 构建过程

​	我们对于构建过程分析是基于源码的，先打开构建的入口 JS 文件，在 `scripts/build.js` 中：

```js
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)
```

​	这段代码逻辑非常简单，先从配置文件读取配置，再通过命令行参数对构建配置做过滤，这样就可以构建出不同用途的 Vue.js 了。接下来我们看一下配置文件，在 `scripts/config.js` 中：

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // ...
}
```

​	这里列举了一些 Vue.js 构建的配置，关于还有一些服务端渲染 webpack 插件以及 weex 的打包配置就不列举了。

​	对于单个配置，它是遵循 Rollup 的构建规则的。其中 ：

- `entry` 属性表示构建的入口 JS 文件地址
- `dest` 属性表示构建后的 JS 文件地址
- `format` 属性表示构建的格式
  - `cjs` 表示构建出来的文件遵循 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规范
  - `es` 表示构建出来的文件遵循 [ES Module](http://exploringjs.com/es6/ch_modules.html) 规范
  -  `umd` 表示构建出来的文件遵循 [UMD](https://github.com/umdjs/umd) 规范。

​	以 `web-runtime-cjs` 配置为例，它的 `entry` 是 `resolve('web/entry-runtime.js')`，先来看一下 `resolve` 函数的定义。

源码目录：`scripts/config.js`

```js
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

​	这里的 `resolve` 函数实现非常简单，它先把 `resolve` 函数传入的参数 `p` 通过 `/` 做了分割成数组，然后取数组第一个元素设置为 `base`。在我们这个例子中，参数 `p` 是 `web/entry-runtime.js`，那么 `base` 则为 `web`。`base` 并不是实际的路径，它的真实路径借助了别名的配置，我们来看一下别名配置的代码，在 `scripts/alias` 中：

```js
const path = require('path')

module.exports = {
  vue: path.resolve(__dirname, '../src/platforms/web/entry-runtime-with-compiler'),
  compiler: path.resolve(__dirname, '../src/compiler'),
  core: path.resolve(__dirname, '../src/core'),
  shared: path.resolve(__dirname, '../src/shared'),
  web: path.resolve(__dirname, '../src/platforms/web'),
  weex: path.resolve(__dirname, '../src/platforms/weex'),
  server: path.resolve(__dirname, '../src/server'),
  entries: path.resolve(__dirname, '../src/entries'),
  sfc: path.resolve(__dirname, '../src/sfc')
}
```

​	很显然，这里 `web` 对应的真实的路径是 `path.resolve(__dirname, '../src/platforms/web')`，这个路径就找到了 Vue.js 源码的 web 目录。然后 `resolve` 函数通过 `path.resolve(aliases[base], p.slice(base.length + 1))` 找到了最终路径，它就是 Vue.js 源码 web 目录下的 `entry-runtime.js`。因此，`web-runtime-cjs` 配置对应的入口文件就找到了。

​	它经过 Rollup 的构建打包后，最终会在 dist 目录下生成 `vue.runtime.common.js`。

#### 0.2.3 Runtime Only VS Runtime + Compiler

​	通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 Runtime Only 版本的还是 Runtime + Compiler 版本。下面我们来对比这两个版本。

- Runtime Only

​	我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

- Runtime + Compiler

​	我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

```js
// 需要编译器的版本
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

​	因为在 Vue.js 2.0 中，最终渲染都是通过 `render` 函数，如果写 `template` 属性，则需要编译成 `render` 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。

很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js。

#### 0.2.4 总结

​	通过这一节的分析，我们可以了解到 Vue.js 的构建打包过程，也知道了不同作用和功能的 Vue.js 它们对应的入口以及最终编译生成的 JS 文件。尽管在实际开发过程中我们会用 Runtime Only 版本开发比较多，但为了分析 Vue 的编译过程，我们这门课重点分析的源码是 Runtime + Compiler 的 Vue.js。

### 0.3 从入口开始

​	我们之前提到过 Vue.js 构建过程，在 web 应用下，我们来分析 Runtime + Compiler 构建出来的 Vue.js，它的入口是 `src/platforms/web/entry-runtime-with-compiler.js`：

```js
/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

// 引入Vue
import Vue from './runtime/index'
import { query } from './util/index'

//...

Vue.compile = compileToFunctions

export default Vue
```

​	那么，当我们的代码执行 `import Vue from 'vue'` 的时候，就是从这个入口执行代码来初始化 Vue， 那么 Vue 到底是什么，它是怎么初始化的，我们来一探究竟。

#### 0.3.1 Vue的入口

​	在这个入口 JS 的上方我们可以找到 `Vue` 的来源：`import Vue from './runtime/index'`，我们先来看一下这块儿的实现，它定义在 `src/platforms/web/runtime/index.js` 中：

```js
import Vue from 'core/index' // 重点
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'

// ...

export default Vue
```

​	这里关键的代码是 `import Vue from 'core/index'`，之后的逻辑都是对 Vue 这个对象做一些扩展，可以先不用看，我们来看一下真正初始化 Vue 的地方，在 `src/core/index.js` 中：

```js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
```

​	这里有 2 处关键的代码，`import Vue from './instance/index'` 和 `initGlobalAPI(Vue)`，初始化全局 Vue API（我们稍后介绍）

##### Vue 的定义

我们先来看第一部分，在 `src/core/instance/index.js` 中：

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/**
 * Vue的构造函数
 * @param {*} options 用户传入的选项，el、data、、
 */
function Vue (options) {

  /* 
  NODE_ENV是一个用户自定义的变量，在webpack中它的用途是判断生产环境或开发环境。
  */

  // 开发环境下错误提示
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  /* 
    1. 所有组件也要创建实例，所以把_init方法变成一个公共实例
    2. _init命名：由于init的方法是源码私有的，不想被外面调用，所以增加了`_`
  */

  this._init(options)
}

/* 扩展原型的方法 */

initMixin(Vue) // 定义 Vue.prototype._init方法
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue) // 定义_update方法用于将虚拟dom生成真实dom
renderMixin(Vue) // 定义vm._render方法用于生成虚拟dom

export default Vue // 导出Vue构造函数
```

​	在这里，我们终于看到了 Vue 的庐山真面目，它实际上就是一个用 Function 实现的类，我们只能通过 `new Vue` 去实例化它。

​	有些同学看到这不禁想问，为何 Vue 不用 ES6 的 Class 去实现呢？我们往后看这里有很多 `xxxMixin` 的函数调用，并把 `Vue` 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法（这里具体的细节会在之后的文章介绍，这里不展开），Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理，这种编程技巧也非常值得我们去学习。



##### `initGlobalAPI`

​	Vue.js 在整个初始化过程中，除了给它的原型 prototype 上扩展方法，还会给 `Vue` 这个对象本身扩展全局的静态方法，它的定义在 `src/core/global-api/index.js` 中：

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```

​	这里就是在 Vue 上扩展的一些全局方法的定义，Vue 官网中关于全局 API 都可以在这里找到，这里不会介绍细节，会在之后的章节我们具体介绍到某个 API 的时候会详细介绍。有一点要注意的是，`Vue.util` 暴露的方法最好不要依赖，因为它可能经常会发生变化，是不稳定的。

#### 0.3.2 总结

​	那么至此，Vue 的初始化过程基本介绍完毕。这一节的目的是让同学们对 Vue 是什么有一个直观的认识，它本质上就是一个用 Function 实现的 Class，然后它的原型 prototype 以及它本身都扩展了一系列的方法和属性，那么 Vue 能做什么，它是怎么做的，我们会在后面的章节一层层帮大家揭开 Vue 的神秘面纱。



## 一、 数据驱动

### 1.1 介绍

​	Vue.js 一个核心思想是数据驱动。所谓数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据。它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。

在 Vue.js 中我们可以采用简洁的模板语法来声明式的将数据渲染为 DOM：

```html
<div id="app">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
```

​	最终它会在页面上渲染出 `Hello Vue`。接下来，我们会从源码角度来分析 Vue 是如何实现的，分析过程会以主线代码为主，重要的分支逻辑会放在之后单独分析。数据驱动还有一部分是数据更新驱动视图变化，这一块内容我们也会在之后的章节分析，这一章我们的目标是弄清楚模板和数据如何渲染成最终的 DOM。

### 1.2 new Vue发生了什么

​	从入口代码开始分析，我们先来分析 `new Vue` 背后发生了哪些事情。我们都知道，`new` 关键字在 Javascript 语言中代表实例化是一个对象，而 `Vue` 实际上是一个类，类在 Javascript 中是用 Function 来实现的，来看一下源码，在`src/core/instance/index.js` 中。

```js
/**
 * Vue的构造函数
 * @param {*} options 用户传入的选项，el、data、、
 */
function Vue (options) {

  /* 
  NODE_ENV是一个用户自定义的变量，在webpack中它的用途是判断生产环境或开发环境。
  */

  // 开发环境下错误提示
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }

  /* 
    1. 所有组件也要创建实例，所以把_init方法变成一个公共实例
    2. _init命名：由于init的方法是源码私有的，不想被外面调用，所以增加了`_`
  */

  this._init(options)
}
```

​	可以看到 `Vue` 只能通过 new 关键字初始化，然后会调用 `this._init` 方法， 该方法在 `src/core/instance/init.js` 中定义。wang

```js
/**
 * 负责Vue的初始化过程
 * @param {*} options 用户传入的options对象
 */
Vue.prototype._init = function (options?: Object) {

    // vm ： Vue实例
    const vm: Component = this

    // 每个 vue 实例都有一个 _uid，并且是依次递增的
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        startTag = `vue-perf-start:${vm._uid}`
        endTag = `vue-perf-end:${vm._uid}`
        mark(startTag)
    }

    // a flag to avoid this being observed（一个避免被发现的标记）
    vm._isVue = true

    // merge options（合并options）
    if (options && options._isComponent) {
        /* 
            optimize internal component instantiation
            since dynamic options merging is pretty slow, and none of the
            internal component options needs special treatment.
        */


        /* 
          性能优化，
          将组件配置对象上的一些深层次属性放到vm.$options选项中，
          以提高代码的执行效率
        */
        initInternalComponent(vm, options)
    } else {

        /**
         * 初始化根组件时走这里，合并 Vue 的全局配置到根组件的局部配置，比如 Vue.component 注册的全局组件会合并到 根实例的 components 选项中
         * 至于每个子组件的选项合并则发生在两个地方：
         *   1、Vue.component 方法注册的全局组件在注册时做了选项合并
         *   2、{ components: { xx } } 方式注册的局部组件在执行编译器生成的 render 函数时做了选项合并，包括根组件中的 components 配置
         */

        //  外界可通过vm.$options获取传给VUE的选项(将内部与外部options合并)
        vm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
        )
    }

    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
        // 设置代理，将vm实例上的属性代理到 vm._renderProxy
        initProxy(vm)
    } else {
        vm._renderProxy = vm
    }

    // expose real self（暴露真实的自己）
    vm._self = vm

    // 初始化组件实例关系属性，比如 $parent、$children、$root、$refs 等
    initLifecycle(vm)

    /**
    * 初始化自定义事件，这里需要注意一点，所以我们在 <comp @click="handleClick" /> 上注册的事件
    * ，监听者不是父组件，
    * 而是子组件本身，也就是说事件的派发和监听者都是子组件本身，和父组件无关
    */
    initEvents(vm)

    /*
     解析组件的插槽信息，得到 vm.$slot，处理渲染函数，
    得到 vm.$createElement 方法，即 h 函数
     */
    initRender(vm)

    /* 调用beforeCreate钩子函数 */
    callHook(vm, 'beforeCreate')

    /*   初始化组件的 inject 配置项，得到 result[key] = val 形式的配置对象，
    然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例*/
    initInjections(vm) // resolve injections before data/props

    // 数据劫持，处理 props、methods、data、computed、watch
    initState(vm)

    // 解析组件配置项上的 provide 对象，将其挂载到 vm._provided 属性上
    initProvide(vm) // resolve provide after data/props

    // 调用created钩子函数
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        vm._name = formatComponentName(vm, false)
        mark(endTag)
        measure(`vue ${vm._name} init`, startTag, endTag)
    }

    /* 
     如果发现配置项上有 el 选项，则自动调用 $mount 方法进行对数据的挂载
     也就是说有了 el 选项，就不需要再手动调用 $mount，
     反之，没有 el 则必须手动调用 $mount

     执行完所有初始化函数后，开始挂载Vue到dom上
    */
    if (vm.$options.el) {

        /* 
          $mount方法定义：
          1. src/core/platforms/web/runtime/index.js
          2. src/platforms/web/entry-runtime-with-compiler.js
        */

        // 调用 $mount 方法，进入挂载阶段
        vm.$mount(vm.$options.el)
    }
}
```

​	Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。

#### 总结

​	Vue 的初始化逻辑写的非常清楚，把不同的功能逻辑拆成一些单独的函数执行，让主线逻辑一目了然，这样的编程思想是非常值得借鉴和学习的。由于我们这一章的目标是弄清楚模板和数据如何渲染成最终的 DOM，所以各种初始化逻辑我们先不看。在初始化的最后，检测到如果有 `el` 属性，则调用 `vm.$mount` 方法挂载 `vm`，挂载的目标就是把模板渲染成最终的 DOM，那么接下来我们来分析 Vue 的挂载过程。

### 1.3 Vue实例挂载的实现

​	Vue 中我们是通过 `$mount` 实例方法去挂载 `vm` 的，`$mount` 方法在多个文件中都有定义，如 `src/platform/web/entry-runtime-with-compiler.js`、`src/platform/web/runtime/index.js`、`src/platform/weex/runtime/index.js`。因为 `$mount` 这个方法的实现是和平台、构建方式都相关的。接下来我们重点分析带 `compiler` 版本的 `$mount` 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。

#### 1.3.1 Complier版本的`$mount`

​	`compiler` 版本的 `$mount` 实现非常有意思，先来看一下 `src/platform/web/entry-runtime-with-compiler.js` 文件中定义：

```js
// 缓存运行时候定义的公共$mount方法
const mount = Vue.prototype.$mount

// 拓展$mount方法
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 通过query方法重写el
  el = el && query(el)

  /* istanbul ignore if */
  // 提示不能把body/html作为挂载点, 开发环境下给出错误提示
  // 因为挂载点是会被组件模板自身替换点, 显然body/html不能被替换
  if (el === document.body || el === document.documentElement) { // vue不能挂载在body、html这样的根节点上。
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options

  // resolve template/el and convert to render function（解析模板/el并转换为渲染函数）

  // 如果包含render函数则执行跳出，直接执行运行时版本的$mount方法
  if (!options.render) {
    // 没有render函数时候，优先考虑template属性
    let template = options.template

    if (template) {
      // template存在且template的类型是字符串
      if (typeof template === 'string') {
        // template存在且template的类型是字符串

        if (template.charAt(0) === '#') {
          // template是ID
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        // template的类型是元素节点，则使用该元素的innerHTML作为模板
        template = template.innerHTML

      } else {

        // 开发环境下提示，当前的template选项是无效的
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 如果template选项不存在，那么使用el元素的outerHTML作为模板内容
      template = getOuterHTML(el)
    }

    // template：存储这最终用来生成渲染函数的字符串
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
 
      /* 
        compileToFunctions: src\compiler\to-function.js
      */

      // 获取转换后的render函数与staticRenderFns，并挂载在$options上 
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      // options.render 渲染函数

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }

  // 调用公共的mount方法（执行默认的挂载功能）   
  // 重写$mount方法是为了添加模板编译的功能
  return mount.call(this, el, hydrating)
}
```

​	这段代码首先缓存了原型上的 `$mount` 方法，再重新定义该方法，我们先来分析这段代码。

1. 首先，它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上。
2. 接下来的是很关键的逻辑 —— 如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的，编译过程我们之后会介绍。
3. 最后，调用原先原型上的 `$mount` 方法挂载。

#### 1.3.2 原型上的`$mount`

原先原型上的 `$mount` 方法在 `src/platform/web/runtime/index.js` 中定义，之所以这么设计完全是为了复用，因为它是可以被 `runtime only` 版本的 Vue 直接使用的。

> src/platform/web/runtime/index.js

```js
/**
 * public mount method（公共的mount方法）
 * @param {*} el vm.$options.el(表示挂载的元素)
 * @param {*} hydrating 是Virtual Dom的补丁算法参数
 * @returns 
 */
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {

  //通过传入的el属性，获得el对应的元素
  el = el && inBrowser ? query(el) : undefined
  
  // 执行真正的挂载并返回
  return mountComponent(this, el, hydrating)
}
```

​	`$mount` 方法支持传入 2 个参数，

-  `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 `query` 方法转换成 DOM 对象的。
- `hydrating`:  和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。

​	`$mount` 方法实际上会去调用 `mountComponent` 方法

#### 1.3.3 mountComponent

`mountComponent`方法定义在 `src/core/instance/lifecycle.js` 文件中：

> src/core/instance/lifecycle.js

```js
/**
 * 组件挂载流程
 * @param {*} vm 实例
 * @param {*} el el元素
 * @param {*} hydrating 
 * @returns 
 */
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {

  /* 
      把模板转换对应的渲染函数， 引入虚拟dom概念 vnode, 用户更新数据，则利用diff算法更新虚拟节点
    dom => 产生真实节点，更新
  */

  vm.$el = el

  // 没有用户自定义的render方法
  if (!vm.$options.render) {

    vm.$options.render = createEmptyVNode
    
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }

  callHook(vm, 'beforeMount')

  let updateComponent // 更新函数，数据变化后，会再次调用此函数

  /* istanbul ignore if(容错处理) */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      /* 
        1. 调用render函数，生成虚拟dom （_render）
        2. 通过_update用虚拟函数，生成真实dom
      */
      vm._update(vm._render(), hydrating) // 后续更新可以调用updateComponent方法
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, { // 实例化一个渲染watcher
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) { // 如果是根节点往下执行
    vm._isMounted = true // true ： 表示这个实例已经挂载了，同时执行`mounted`钩子函数
    callHook(vm, 'mounted')
  }
  return vm
}
```

​	从上面的代码可以看到，`mountComponent` 核心就是先实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 DOM。

​	`Watcher` 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数，这块儿我们会在之后的章节中介绍。

​	函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`， 表示这个实例已经挂载了，同时执行 `mounted` 钩子函数。 这里注意 `vm.$vnode` 表示 Vue 实例的父虚拟 Node，所以它为 `Null` 则表示当前是根 Vue 的实例。

#### 总结

​	`mountComponent` 方法的逻辑也是非常清晰的，它会完成整个渲染工作，接下来我们要重点分析其中的细节，也就是最核心的 2 个方法：`vm._render` 和 `vm._update`。



### 1.4 render

​	Vue 的 `_render` 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。

`_render`方法的定义在 `src/core/instance/render.js` 文件中：

```js
  /**
   * 将render函数转换为虚拟节点
   * @returns 
   */
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options // render:解析出来的render方法,同时也可能是用户写的
 
    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm

      vnode = render.call(vm._renderProxy, vm.$createElement) // render函数执行返回一个虚拟节点 
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```

​	这段代码最关键的是 `render` 方法的调用，我们在平时的开发工作中手写 `render` 方法的场景比较少，而写的比较多的是 `template` 模板，在之前的 `mounted` 方法的实现中，会把 `template` 编译成 `render` 方法，但这个编译过程是非常复杂的，我们不打算在这里展开讲，之后会专门花一个章节来分析 Vue 的编译过程。

​	在 Vue 的官方文档中介绍了 `render` 函数的第一个参数是 `createElement`，那么结合之前的例子：

```html
<div id="app">
  {{ message }}
</div>
```

相当于我们编写如下 `render` 函数：

```js
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

再回到 `_render` 函数中的 `render` 方法的调用：

```js
vnode = render.call(vm._renderProxy, vm.$createElement) // render函数执行返回一个虚拟节点 
```

可以看到，`render` 函数中的 `createElement` 方法就是 `vm.$createElement` 方法。

`vm.$createElement`方法定义在`src/core/instance/render.js`:

```js
export function initRender (vm: Component) {
  // ...
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```

​	实际上，`vm.$createElement` 方法定义是在执行 `initRender` 方法的时候，可以看到除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被模板编译成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法。

#### 总结

​	`vm._render` 最终是通过执行 `createElement` 方法并返回的是 `vnode`，它是一个虚拟 Node。Vue 2.0 相比 Vue 1.0 最大的升级就是利用了 Virtual DOM。因此在分析 `createElement` 的实现前，我们先了解一下 Virtual DOM 的概念。

### 1.5 Virtual DOM

​	Virtual DOM 这个概念相信大部分人都不会陌生，它产生的前提是浏览器中的 DOM 是很“昂贵"的，为了更直观的感受，我们可以简单的把一个简单的 div 元素的属性都打印出来，如图所示：

![DOM属性](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112151746367.png)

​	可以看到，真正的 DOM 元素是非常庞大的，因为浏览器的标准就把 DOM 设计的非常复杂。当我们频繁的去做 DOM 更新，会产生一定的性能问题。

​	而 Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。在 Vue.js 中，Virtual DOM 是用 `VNode` 这么一个 Class 去描述。

#### 1.5.1 VNode

`VNode`是定义在 `src/core/vdom/vnode.js` 中的:

```js
export default class VNode {
  tag: string | void; // 标签名
  data: VNodeData | void; // 标签属性
  children: ?Array<VNode>; // 孩子
  text: string | void; // 文本
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void; // 有唯一的key，后面用于更新
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    /* 当前节点的标签名 */
    this.tag = tag
    /* 当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型 */
    this.data = data
    /* 当前节点的子节点，是一个数组 */
    this.children = children
    /* 当前节点的文本 */
    this.text = text
    /* 当前虚拟节点的真实dom节点 */
    this.elm = elm
    /* 当前节点的名字空间 */
    this.ns = undefined
    /* 编译作用域 */
    this.context = context
    /* 函数化组件作用域 */
    this.fnContext = undefined
    /* 函数化组件的option选项 */
    this.fnOptions = undefined
    this.fnScopeId = undefined
    /* 节点的key属性，被当做节点的标志，用于优化 */
    this.key = data && data.key
    /* 组价的option选项 */
    this.componentOptions = componentOptions
    /* 当前节点对应的组件的实例 */
    this.componentInstance = undefined
    /* 当前节点的父节点 */
    this.parent = undefined
    /* 是否是原生HTML或者只是普通文本，innerHTML的时候是true. textContent的时候是false */
    this.raw = false
    /* 静态节点标志 */
    this.isStatic = false
    /* 作为根节点插入 */
    this.isRootInsert = true
    /* 是否为注释接地那 */
    this.isComment = false
    /* 是否为克隆节点 */
    this.isCloned = false
    /* 是否有v-once指令 */
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

​	可以看到 Vue.js 中的 Virtual DOM 的定义还是略微复杂一些的，因为它这里包含了很多 Vue.js 的特性。这里千万不要被这些茫茫多的属性吓到，实际上 Vue.js 中 Virtual DOM 是借鉴了一个开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现，然后加入了一些 Vue.js 特色的东西。我建议大家如果想深入了解 Vue.js 的 Virtual DOM 前不妨先阅读这个库的源码，因为它更加简单和纯粹。

#### 1.5.2 总结

​	其实 VNode 是对真实 DOM 的一种抽象描述，它的核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法，因此它是非常轻量和简单的。

​	Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。那么在 Vue.js 中，VNode 的 create 是通过之前提到的 `createElement` 方法创建的，我们接下来分析这部分的实现。



### 1.6 createElement





### 1.7 update





## 二、组件化

### 介绍

Vue.js 另一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套。

我们在用 Vue.js 开发实际项目的时候，就是像搭积木一样，编写一堆组件拼装生成页面。在 Vue.js 的官网中，也是花了大篇幅来介绍什么是组件，如何编写组件以及组件拥有的属性和特性。

那么在这一章节，我们将从源码的角度来分析 Vue 的组件内部是如何工作的，只有了解了内部的工作原理，才能让我们使用它的时候更加得心应手。

接下来我们会用 Vue-cli 初始化的代码为例，来分析一下 Vue 组件初始化的一个过程。

```js
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  // 这里的 h 是 createElement 方法
  render: h => h(App)
})
```

这段代码相信很多同学都很熟悉，它和我们上一章相同的点也是通过 `render` 函数去渲染的，不同的这次通过 `createElement` 传的参数是一个组件而不是一个原生的标签，那么接下来我们就开始分析这一过程。



## 三、深入响应式原理

### 3.0 介绍

​	前面 2 章介绍的都是 Vue 怎么实现数据渲染和组件化的，主要讲的是初始化的过程，把原始的数据最终映射到 DOM 中，但并没有涉及到数据变化到 DOM 变化的部分。而 Vue 的数据驱动除了数据渲染 DOM 之外，还有一个很重要的体现就是数据的变更会触发 DOM 的变化。

​	其实前端开发最重要的 2 个工作:一个是把数据渲染到页面，另一个是处理用户交互。Vue 把数据渲染到页面的能力我们已经通过源码分析出其中的原理了，但是由于一些用户交互或者是其它方面导致数据发生变化重新对页面渲染的原理我们还未分析。

考虑如下示例：

```html
<div id="app" @click="changeMsg">
  {{ message }}
</div>
```

```js
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  methods: {
    changeMsg() {
      this.message = 'Hello World!'
    }
  }
})
```

​	当我们去修改 `this.message` 的时候，模板对应的插值也会渲染成新的数据，那么这一切是怎么做到的呢？

​	在分析前，我们先直观的想一下，如果不用 Vue 的话，我们会通过最简单的方法实现这个需求：监听点击事件，修改数据，手动操作 DOM 重新渲染。这个过程和使用 Vue 的最大区别就是多了一步“手动操作 DOM 重新渲染”。这一步看上去并不多，但它背后又潜在的几个要处理的问题：

1. 我需要修改哪块的 DOM？
2. 我的修改效率和性能是不是最优的？
3. 我需要对数据每一次的修改都去操作 DOM 吗？
4. 我需要 case by case 去写修改 DOM 的逻辑吗？

​	如果我们使用了 Vue，那么上面几个问题 Vue 内部就帮你做了，那么 Vue 是如何在我们对数据修改后自动做这些事情呢，接下来我们将进入一些 Vue 响应式系统的底层的细节。

### 3.1 响应式对象

#### 1. 核心： Object.defineProperty

​	`Object.defineProperty` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象，先来看一下它的语法：

```js
Object.defineProperty(obj, prop, descriptor)
```

- `obj` 是要在其上定义属性的对象；
- `prop` 是要定义或修改的属性的名称；
- `descriptor` 是将被定义或修改的属性描述符。

​	比较核心的是 `descriptor`，它有很多可选键值，具体的可以去参阅它的[文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)。这里我们最关心的是 `get` 和 `set`，`get` 是一个给属性提供的 getter 方法，当我们访问了该属性的时候会触发 getter 方法；`set` 是一个给属性提供的 setter 方法，当我们对该属性做修改的时候会触发 setter 方法。

​	一旦对象拥有了 getter 和 setter，我们可以简单地把这个对象称为响应式对象。那么 Vue.js 把哪些对象变成了响应式对象了呢，接下来我们从源码层面分析。

#### 2. initState

​	在 Vue 的初始化阶段，`_init` 方法执行的时候，会执行 `initState(vm)` 方法，它的定义在 `src/core/instance/state.js` 中。

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props) // 1. 初始化props
  if (opts.methods) initMethods(vm, opts.methods) 
  if (opts.data) {
    initData(vm) // 初始化data
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

​	**`initState` 方法主要是对 `props`、`methods`、`data`、`computed` 和 `wathcer` 等属性做了初始化操作**。这里我们重点分析 `props` 和 `data`，对于其它属性的初始化我们之后再详细分析。

##### initProps

```js
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) { // 核心： 遍历定义的 `props` 配置
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => { 
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value) //通过 `defineReactive`把`props` 中对应的属性代理到`vm._props.xxx`
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key) //  通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上
    }
  }
  toggleObserving(true)
}
```

​	`props` 的初始化主要过程，就是**遍历定义的 `props` 配置**。遍历的过程主要做两件事情：

1. 调用 `defineReactive` 方法把每个 `prop` 对应的值变成响应式，可以通过 `vm._props.xxx` 访问到定义 `props` 中对应的属性。对于 `defineReactive` 方法，我们稍后会介绍；
2. 通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上，我们稍后也会介绍。

##### initData

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

​	`data` 的初始化主要过程也是做两件事:

1. 对定义 `data` 函数返回对象的遍历，通过 `proxy` 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上；
2. 调用 `observe` 方法观测整个 `data` 的变化，把 `data` 也变成响应式，可以通过 `vm._data.xxx` 访问到定义 `data` 返回函数中对应的属性，`observe` 我们稍后会介绍。

​	可以看到，无论是 `props` 或是 `data` 的初始化都是把它们变成响应式对象，这个过程我们接触到几个函数，接下来我们来详细分析它们。

####3. proxy

​	首先介绍一下代理，代理的作用是把 `props` 和 `data` 上的属性代理到 `vm` 实例上，这也就是为什么比如我们定义了如下 props，却可以通过 vm 实例访问到它。

```js
let comP = {
  props: {
    msg: 'hello'
  },
  methods: {
    say() {
      console.log(this.msg)
    }
  }
}
```

​	我们可以在 `say` 函数中通过 `this.msg` 访问到我们定义在 `props` 中的 `msg`，这个过程发生在 `proxy` 阶段：

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

​	`proxy` 方法的实现很简单，通过 `Object.defineProperty` 把 `target[sourceKey][key]` 的读写变成了对 `target[key]` 的读写。所以对于 `props` 而言，对 `vm._props.xxx` 的读写变成了 `vm.xxx` 的读写，而对于 `vm._props.xxx` 我们可以访问到定义在 `props` 中的属性，所以我们就可以通过 `vm.xxx` 访问到定义在 `props` 中的 `xxx` 属性了。同理，对于 `data` 而言，对 `vm._data.xxxx` 的读写变成了对 `vm.xxxx` 的读写，而对于 `vm._data.xxxx` 我们可以访问到定义在 `data` 函数返回对象中的属性，所以我们就可以通过 `vm.xxxx` 访问到定义在 `data` 函数返回对象中的 `xxxx` 属性了。

####4. `observe`

`observe` 的功能就是用来监测数据的变化，它的定义在 `src/core/observer/index.js` 中：

```js
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```

`observe` 方法的作用就是给非 VNode 的对象类型数据添加一个 `Observer`，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象实例。接下来我们来看一下 `Observer` 的作用。

####5. Observer

`Observer` 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：

```js
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

`Observer` 的构造函数逻辑很简单，首先实例化 `Dep` 对象，这块稍后会介绍，接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 `__ob__` 属性上，`def` 的定义在 `src/core/util/lang.js` 中：

```js
/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

`def` 函数是一个非常简单的`Object.defineProperty` 的封装，这就是为什么我在开发中输出 `data` 上对象类型的数据，会发现该对象多了一个 `__ob__` 的属性。

回到 `Observer` 的构造函数，接下来会对 `value` 做判断，对于数组会调用 `observeArray` 方法，否则对纯对象调用 `walk` 方法。可以看到 `observeArray` 是遍历数组再次调用 `observe` 方法，而 `walk` 方法是遍历对象的 key 调用 `defineReactive` 方法，那么我们来看一下这个方法是做什么的。

####6. defineReactive

`defineReactive` 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter，它的定义在 `src/core/observer/index.js` 中：

```js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

`defineReactive` 函数最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 getter 和 setter。最后利用 `Object.defineProperty` 去给 `obj` 的属性 `key` 添加 getter 和 setter。而关于 getter 和 setter 的具体实现，我们会在之后介绍。

## [#](https://ustbhuangyi.github.io/vue-analysis/v2/reactive/reactive-object.html#总结)总结

这一节我们介绍了响应式对象，核心就是利用 `Object.defineProperty` 给数据添加了 getter 和 setter，目的就是为了在我们访问数据以及写数据的时候能自动执行一些逻辑：getter 做的事情是依赖收集，setter 做的事情是派发更新，那么在接下来的章节我们会重点对这两个过程分析。



## 四、编译

之前我们分析过模板到真实 DOM 渲染的过程，中间有一个环节是把模板编译成 `render` 函数，这个过程我们把它称作编译。

虽然我们可以直接为组件编写 `render` 函数，但是编写 `template` 模板更加直观，也更符合我们的开发习惯。

Vue.js 提供了 2 个版本，一个是 Runtime + Compiler 的，一个是 Runtime only 的，前者是包含编译代码的，可以把编译过程放在运行时做，后者是不包含编译代码的，需要借助 webpack 的 `vue-loader` 事先把模板编译成 `render`函数。

这一章我们就来分析编译的过程，对编译过程的了解会让我们对 Vue 的指令、内置组件等有更好的理解。不过由于编译的过程是一个相对复杂的过程，我们只要求理解整体的流程、输入和输出即可，对于细节我们不必抠太细。有些细节比如对于 `slot` 的处理我们可以在之后去分析插槽实现的时候再详细分析。

### 4.1 编译入口

当我们使用 Runtime + Compiler 的 Vue.js，它的入口是 `src/platforms/web/entry-runtime-with-compiler.js`，看一下它对 `$mount` 函数的定义：

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

这段函数逻辑之前分析过，关于编译的入口就是在这里：

```js
const { render, staticRenderFns } =  compileToFunctions(template, {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
  }, this)
options.render = render
options.staticRenderFns = staticRenderFns
```

`compileToFunctions` 方法就是把模板 `template` 编译生成 `render` 以及 `staticRenderFns`，它的定义在 `src/platforms/web/compiler/index.js` 中：

```js
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

可以看到 `compileToFunctions` 方法实际上是 `createCompiler` 方法的返回值，该方法接收一个编译配置参数，接下来我们来看一下 `createCompiler` 方法的定义，在 `src/compiler/index.js` 中：

```js
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

`createCompiler` 方法实际上是通过调用 `createCompilerCreator` 方法返回的，该方法传入的参数是一个函数，真正的编译过程都在这个 `baseCompile` 函数里执行，那么 `createCompilerCreator` 又是什么呢，它的定义在 `src/compiler/create-compiler.js` 中：

```js
export function createCompilerCreator (baseCompile: Function): Function {
  return function createCompiler (baseOptions: CompilerOptions) {
    function compile (
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg)
      }

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules)
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      const compiled = baseCompile(template, finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast))
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}
```

可以看到该方法返回了一个 `createCompiler` 的函数，它接收一个 `baseOptions` 的参数，返回的是一个对象，包括 `compile` 方法属性和 `compileToFunctions` 属性，这个 `compileToFunctions` 对应的就是 `$mount` 函数调用的 `compileToFunctions` 方法，它是调用 `createCompileToFunctionFn` 方法的返回值，我们接下来看一下 `createCompileToFunctionFn` 方法，它的定义在 `src/compiler/to-function/js` 中：

```js
export function createCompileToFunctionFn (compile: Function): Function {
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          )
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template, options)

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        warn(
          `Error compiling template:\n\n${template}\n\n` +
          compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
          vm
        )
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(msg => tip(msg, vm))
      }
    }

    // turn code into functions
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
          fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
          vm
        )
      }
    }

    return (cache[key] = res)
  }
}
```

至此我们总算找到了 `compileToFunctions` 的最终定义，它接收 3 个参数、编译模板 `template`，编译配置 `options` 和 Vue 实例 `vm`。核心的编译过程就一行代码：

```js
const compiled = compile(template, options)
```

`compile` 函数在执行 `createCompileToFunctionFn` 的时候作为参数传入，它是 `createCompiler` 函数中定义的 `compile` 函数，如下：

```js
function compile (
  template: string,
  options?: CompilerOptions
): CompiledResult {
  const finalOptions = Object.create(baseOptions)
  const errors = []
  const tips = []
  finalOptions.warn = (msg, tip) => {
    (tip ? tips : errors).push(msg)
  }

  if (options) {
    // merge custom modules
    if (options.modules) {
      finalOptions.modules =
        (baseOptions.modules || []).concat(options.modules)
    }
    // merge custom directives
    if (options.directives) {
      finalOptions.directives = extend(
        Object.create(baseOptions.directives || null),
        options.directives
      )
    }
    // copy other options
    for (const key in options) {
      if (key !== 'modules' && key !== 'directives') {
        finalOptions[key] = options[key]
      }
    }
  }

  const compiled = baseCompile(template, finalOptions)
  if (process.env.NODE_ENV !== 'production') {
    errors.push.apply(errors, detectErrors(compiled.ast))
  }
  compiled.errors = errors
  compiled.tips = tips
  return compiled
}
```

`compile` 函数执行的逻辑是先处理配置参数，真正执行编译过程就一行代码：

```js
const compiled = baseCompile(template, finalOptions)
```

`baseCompile` 在执行 `createCompilerCreator` 方法时作为参数传入，如下：

```js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  optimize(ast, options)
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

所以编译的入口我们终于找到了，它主要就是执行了如下几个逻辑：

- 解析模板字符串生成 AST

```js
const ast = parse(template.trim(), options)
```

- 优化语法树

```js
optimize(ast, options)
```

- 生成代码

```js
const code = generate(ast, options)
```

那么接下来的章节我会带大家去逐步分析这几个过程。

#### 总结

编译入口逻辑之所以这么绕，是因为 Vue.js 在不同的平台下都会有编译的过程，因此编译过程中的依赖的配置 `baseOptions` 会有所不同。而编译过程会多次执行，但这同一个平台下每一次的编译过程配置又是相同的，为了不让这些配置在每次编译过程都通过参数传入，Vue.js 利用了函数柯里化的技巧很好的实现了 `baseOptions` 的参数保留。同样，Vue.js 也是利用函数柯里化技巧把基础的编译过程函数抽出来，通过 `createCompilerCreator(baseCompile)` 的方式把真正编译的过程和其它逻辑如对编译配置处理、缓存处理等剥离开，这样的设计还是非常巧妙的。

### 4.2 parse

编译过程首先就是对模板做解析，生成 AST，它是一种抽象语法树，是对源代码的抽象语法结构的树状表现形式。在很多编译技术中，如 babel 编译 ES6 的代码都会先生成 AST。

这个过程是比较复杂的，它会用到大量正则表达式对字符串解析，如果对正则不是很了解，建议先去补习正则表达式的知识。为了直观地演示 `parse` 的过程，我们先来看一个例子：

```html
<ul :class="bindCls" class="list" v-if="isShow">
    <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
</ul>
```

经过 `parse` 过程后，生成的 AST 如下：

```js
ast = {
  'type': 1,
  'tag': 'ul',
  'attrsList': [],
  'attrsMap': {
    ':class': 'bindCls',
    'class': 'list',
    'v-if': 'isShow'
  },
  'if': 'isShow',
  'ifConditions': [{
    'exp': 'isShow',
    'block': // ul ast element
  }],
  'parent': undefined,
  'plain': false,
  'staticClass': 'list',
  'classBinding': 'bindCls',
  'children': [{
    'type': 1,
    'tag': 'li',
    'attrsList': [{
      'name': '@click',
      'value': 'clickItem(index)'
    }],
    'attrsMap': {
      '@click': 'clickItem(index)',
      'v-for': '(item,index) in data'
     },
    'parent': // ul ast element
    'plain': false,
    'events': {
      'click': {
        'value': 'clickItem(index)'
      }
    },
    'hasBindings': true,
    'for': 'data',
    'alias': 'item',
    'iterator1': 'index',
    'children': [
      'type': 2,
      'expression': '_s(item)+":"+_s(index)'
      'text': '{{item}}:{{index}}',
      'tokens': [
        {'@binding':'item'},
        ':',
        {'@binding':'index'}
      ]
    ]
  }]
}
```

可以看到，生成的 AST 是一个树状结构，每一个节点都是一个 `ast element`，除了它自身的一些属性，还维护了它的父子关系，如 `parent` 指向它的父节点，`children` 指向它的所有子节点。先对 AST 有一些直观的印象，那么接下来我们来分析一下这个 AST 是如何得到的。

####整体流程

首先来看一下 `parse` 的定义，在 `src/compiler/parser/index.js` 中：

```js
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  getFnsAndConfigFromOptions(options)

  parseHTML(template, {
    // options ...
    start (tag, attrs, unary) {
      let element = createASTElement(tag, attrs)
      processElement(element)
      treeManagement()
    },

    end () {
      treeManagement()
      closeElement()
    },

    chars (text: string) {
      handleText()
      createChildrenASTOfText()
    },
    comment (text: string) {
      createChildrenASTOfComment()
    }
  })
  return astRootElement
}
```

`parse` 函数的代码很长，贴一遍对同学的理解没有好处，我先把它拆成伪代码的形式，方便同学们对整体流程先有一个大致的了解。接下来我们就来分解分析每段伪代码的作用。

##### 从 options 中获取方法和配置

对应伪代码：

```js
getFnsAndConfigFromOptions(options)
```

`parse` 函数的输入是 `template` 和 `options`，输出是 AST 的根节点。`template` 就是我们的模板字符串，而 `options` 实际上是和平台相关的一些配置，它的定义在 `src/platforms/web/compiler/options` 中：

```js
import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
```

这些属性和方法之所以放到 `platforms` 目录下是因为它们在不同的平台（web 和 weex）的实现是不同的。

我们用伪代码 `getFnsAndConfigFromOptions` 表示了这一过程，它的实际代码如下：

```js
warn = options.warn || baseWarn

platformIsPreTag = options.isPreTag || no
platformMustUseProp = options.mustUseProp || no
platformGetTagNamespace = options.getTagNamespace || no

transforms = pluckModuleFunction(options.modules, 'transformNode')
preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

delimiters = options.delimiters
```

这些方法和配置都是后续解析时候需要的，可以不用去管它们的具体作用，我们先往后看。

##### 解析 HTML 模板

对应伪代码：

```js
parseHTML(template, options)
```

对于 `template` 模板的解析主要是通过 `parseHTML` 函数，它的定义在 `src/compiler/parser/html-parser` 中：

```js
export function parseHTML (html, options) {
  let lastTag
  while (html) {
    if (!lastTag || !isPlainTextElement(lastTag)){
      let textEnd = html.indexOf('<')
      if (textEnd === 0) {
         if(matchComment) {
           advance(commentLength)
           continue
         }
         if(matchDoctype) {
           advance(doctypeLength)
           continue
         }
         if(matchEndTag) {
           advance(endTagLength)
           parseEndTag()
           continue
         }
         if(matchStartTag) {
           parseStartTag()
           handleStartTag()
           continue
         }
      }
      handleText()
      advance(textLength)
    } else {
       handlePlainTextElement()
       parseEndTag()
    }
  }
}
```

由于 `parseHTML` 的逻辑也非常复杂，因此我也用了伪代码的方式表达，整体来说它的逻辑就是循环解析 `template` ，用正则做各种匹配，对于不同情况分别进行不同的处理，直到整个 template 被解析完毕。 在匹配的过程中会利用 `advance` 函数不断前进整个模板字符串，直到字符串末尾。

```js
function advance (n) {
  index += n
  html = html.substring(n)
}
```

为了更加直观地说明 `advance` 的作用，可以通过一副图表示：

![img](https://ustbhuangyi.github.io/vue-analysis/assets/advance-1.png)

调用 `advance` 函数：

```js
advance(4)
```

得到结果：

![img](https://ustbhuangyi.github.io/vue-analysis/assets/advance-2.png)

匹配的过程中主要利用了正则表达式，如下：

```js
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
```

通过这些正则表达式，我们可以匹配注释节点、文档类型节点、开始闭合标签等。

- 注释节点、文档类型节点

对于注释节点和文档类型节点的匹配，如果匹配到我们仅仅做的是做前进即可。

```js
if (comment.test(html)) {
  const commentEnd = html.indexOf('-->')

  if (commentEnd >= 0) {
    if (options.shouldKeepComment) {
      options.comment(html.substring(4, commentEnd))
    }
    advance(commentEnd + 3)
    continue
  }
}

if (conditionalComment.test(html)) {
  const conditionalEnd = html.indexOf(']>')

  if (conditionalEnd >= 0) {
    advance(conditionalEnd + 2)
    continue
  }
}

const doctypeMatch = html.match(doctype)
if (doctypeMatch) {
  advance(doctypeMatch[0].length)
  continue
}
```

对于注释和条件注释节点，前进至它们的末尾位置；对于文档类型节点，则前进它自身长度的距离。

- 开始标签

```js
const startTagMatch = parseStartTag()
if (startTagMatch) {
  handleStartTag(startTagMatch)
  if (shouldIgnoreFirstNewline(lastTag, html)) {
    advance(1)
  }
  continue
}
```

首先通过 `parseStartTag` 解析开始标签：

```js
function parseStartTag () {
  const start = html.match(startTagOpen)
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index
    }
    advance(start[0].length)
    let end, attr
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      advance(attr[0].length)
      match.attrs.push(attr)
    }
    if (end) {
      match.unarySlash = end[1]
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}
```

对于开始标签，除了标签名之外，还有一些标签相关的属性。函数先通过正则表达式 `startTagOpen` 匹配到开始标签，然后定义了 `match` 对象，接着循环去匹配开始标签中的属性并添加到 `match.attrs` 中，直到匹配的开始标签的闭合符结束。如果匹配到闭合符，则获取一元斜线符，前进到闭合符尾，并把当前索引赋值给 `match.end`。

`parseStartTag` 对开始标签解析拿到 `match` 后，紧接着会执行 `handleStartTag` 对 `match` 做处理：

```js
function handleStartTag (match) {
  const tagName = match.tagName
  const unarySlash = match.unarySlash
  
  if (expectHTML) {
    if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
      parseEndTag(lastTag)
    }
    if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
      parseEndTag(tagName)
    }
  }
  
  const unary = isUnaryTag(tagName) || !!unarySlash
  
  const l = match.attrs.length
  const attrs = new Array(l)
  for (let i = 0; i < l; i++) {
    const args = match.attrs[i]
    if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
      if (args[3] === '') { delete args[3] }
      if (args[4] === '') { delete args[4] }
      if (args[5] === '') { delete args[5] }
    }
    const value = args[3] || args[4] || args[5] || ''
    const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
      ? options.shouldDecodeNewlinesForHref
      : options.shouldDecodeNewlines
    attrs[i] = {
      name: args[1],
      value: decodeAttr(value, shouldDecodeNewlines)
    }
  }
  
  if (!unary) {
    stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs })
    lastTag = tagName
  }
  
  if (options.start) {
    options.start(tagName, attrs, unary, match.start, match.end)
  }
}
```

`handleStartTag` 的核心逻辑很简单，先判断开始标签是否是一元标签，类似 `<img>、<br/>` 这样，接着对 `match.attrs` 遍历并做了一些处理，最后判断如果非一元标签，则往 `stack` 里 push 一个对象，并且把 `tagName` 赋值给 `lastTag`。至于 `stack` 的作用，稍后我会介绍。

最后调用了 `options.start` 回调函数，并传入一些参数，这个回调函数的作用稍后我会详细介绍。

- 闭合标签

```js
const endTagMatch = html.match(endTag)
if (endTagMatch) {
  const curIndex = index
  advance(endTagMatch[0].length)
  parseEndTag(endTagMatch[1], curIndex, index)
  continue
}
```

先通过正则 `endTag` 匹配到闭合标签，然后前进到闭合标签末尾，然后执行 `parseEndTag` 方法对闭合标签做解析。

```js
function parseEndTag (tagName, start, end) {
  let pos, lowerCasedTagName
  if (start == null) start = index
  if (end == null) end = index
  
  if (tagName) {
    lowerCasedTagName = tagName.toLowerCase()
  }
  
  if (tagName) {
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === lowerCasedTagName) {
        break
      }
    }
  } else {
    pos = 0
  }
  
  if (pos >= 0) {
    for (let i = stack.length - 1; i >= pos; i--) {
      if (process.env.NODE_ENV !== 'production' &&
        (i > pos || !tagName) &&
        options.warn
      ) {
        options.warn(
          `tag <${stack[i].tag}> has no matching end tag.`
        )
      }
      if (options.end) {
        options.end(stack[i].tag, start, end)
      }
    }
    stack.length = pos
    lastTag = pos && stack[pos - 1].tag
  } else if (lowerCasedTagName === 'br') {
    if (options.start) {
      options.start(tagName, [], true, start, end)
    }
  } else if (lowerCasedTagName === 'p') {
    if (options.start) {
      options.start(tagName, [], false, start, end)
    }
    if (options.end) {
      options.end(tagName, start, end)
    }
  }
}
```

`parseEndTag` 的核心逻辑很简单，在介绍之前我们回顾一下在执行 `handleStartTag` 的时候，对于非一元标签（有 endTag）我们都把它构造成一个对象压入到 `stack` 中，如图所示：

![img](https://ustbhuangyi.github.io/vue-analysis/assets/stack.png)

那么对于闭合标签的解析，就是倒序 `stack`，找到第一个和当前 `endTag` 匹配的元素。如果是正常的标签匹配，那么 `stack` 的最后一个元素应该和当前的 `endTag` 匹配，但是考虑到如下错误情况：

```html
<div><span></div>
```

这个时候当 `endTag` 为 `</div>` 的时候，从 `stack` 尾部找到的标签是 `<span>`，就不能匹配，因此这种情况会报警告。匹配后把栈到 `pos` 位置的都弹出，并从 `stack` 尾部拿到 `lastTag`。

最后调用了 `options.end` 回调函数，并传入一些参数，这个回调函数的作用稍后我会详细介绍。

- 文本

```js
let text, rest, next
if (textEnd >= 0) {
  rest = html.slice(textEnd)
  while (
    !endTag.test(rest) &&
    !startTagOpen.test(rest) &&
    !comment.test(rest) &&
    !conditionalComment.test(rest)
  ) {
    next = rest.indexOf('<', 1)
    if (next < 0) break
    textEnd += next
    rest = html.slice(textEnd)
  }
  text = html.substring(0, textEnd)
  advance(textEnd)
}

if (textEnd < 0) {
  text = html
  html = ''
}

if (options.chars && text) {
  options.chars(text)
}
```

接下来判断 `textEnd` 是否大于等于 0 的，满足则说明到从当前位置到 `textEnd` 位置都是文本，并且如果 `<` 是纯文本中的字符，就继续找到真正的文本结束的位置，然后前进到结束的位置。

再继续判断 `textEnd` 小于 0 的情况，则说明整个 `template` 解析完毕了，把剩余的 `html` 都赋值给了 `text`。

最后调用了 `options.chars` 回调函数，并传 `text` 参数，这个回调函数的作用稍后我会详细介绍。

因此，在循环解析整个 `template` 的过程中，会根据不同的情况，去执行不同的回调函数，下面我们来看看这些回调函数的作用。

##### 处理开始标签

对应伪代码：

```js
start (tag, attrs, unary) {
  let element = createASTElement(tag, attrs)
  processElement(element)
  treeManagement()
}
```

当解析到开始标签的时候，最后会执行 `start` 回调函数，函数主要就做 3 件事情，创建 AST 元素，处理 AST 元素，AST 树管理。下面我们来分别来看这几个过程。

- 创建 AST 元素

```js
// check namespace.
// inherit parent ns if there is one
const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

// handle IE svg bug
/* istanbul ignore if */
if (isIE && ns === 'svg') {
  attrs = guardIESVGBug(attrs)
}

let element: ASTElement = createASTElement(tag, attrs, currentParent)
if (ns) {
  element.ns = ns
}

export function createASTElement (
  tag: string,
  attrs: Array<Attr>,
  parent: ASTElement | void
): ASTElement {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent,
    children: []
  }
}
```

通过 `createASTElement` 方法去创建一个 AST 元素，并添加了 namespace。可以看到，每一个 AST 元素就是一个普通的 JavaScript 对象，其中，`type` 表示 AST 元素类型，`tag` 表示标签名，`attrsList` 表示属性列表，`attrsMap` 表示属性映射表，`parent` 表示父的 AST 元素，`children` 表示子 AST 元素集合。

- 处理 AST 元素

```js
if (isForbiddenTag(element) && !isServerRendering()) {
  element.forbidden = true
  process.env.NODE_ENV !== 'production' && warn(
    'Templates should only be responsible for mapping the state to the ' +
    'UI. Avoid placing tags with side-effects in your templates, such as ' +
    `<${tag}>` + ', as they will not be parsed.'
  )
}

// apply pre-transforms
for (let i = 0; i < preTransforms.length; i++) {
  element = preTransforms[i](element, options) || element
}

if (!inVPre) {
  processPre(element)
  if (element.pre) {
    inVPre = true
  }
}
if (platformIsPreTag(element.tag)) {
  inPre = true
}
if (inVPre) {
  processRawAttrs(element)
} else if (!element.processed) {
  // structural directives
  processFor(element)
  processIf(element)
  processOnce(element)
  // element-scope stuff
  processElement(element, options)
}
```

首先是对模块 `preTransforms` 的调用，其实所有模块的 `preTransforms`、 `transforms` 和 `postTransforms` 的定义都在 `src/platforms/web/compiler/modules` 目录中，这部分我们暂时不会介绍，之后会结合具体的例子说。接着判断 `element` 是否包含各种指令通过 `processXXX` 做相应的处理，处理的结果就是扩展 AST 元素的属性。这里我并不会一一介绍所有的指令处理，而是结合我们当前的例子，我们来看一下 `processFor` 和 `processIf`：

```js
export function processFor (el: ASTElement) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (process.env.NODE_ENV !== 'production') {
      warn(
        `Invalid v-for expression: ${exp}`
      )
    }
  }
}

export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
const stripParensRE = /^\(|\)$/g
export function parseFor (exp: string): ?ForParseResult {
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  const res = {}
  res.for = inMatch[2].trim()
  const alias = inMatch[1].trim().replace(stripParensRE, '')
  const iteratorMatch = alias.match(forIteratorRE)
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '')
    res.iterator1 = iteratorMatch[1].trim()
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim()
    }
  } else {
    res.alias = alias
  }
  return res
}
```

`processFor` 就是从元素中拿到 `v-for` 指令的内容，然后分别解析出 `for`、`alias`、`iterator1`、`iterator2` 等属性的值添加到 AST 的元素上。就我们的示例 `v-for="(item,index) in data"` 而言，解析出的的 `for` 是 `data`，`alias` 是 `item`，`iterator1` 是 `index`，没有 `iterator2`。

```js
function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}
export function addIfCondition (el: ASTElement, condition: ASTIfCondition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition)
}
```

`processIf` 就是从元素中拿 `v-if` 指令的内容，如果拿到则给 AST 元素添加 `if` 属性和 `ifConditions` 属性；否则尝试拿 `v-else` 指令及 `v-else-if` 指令的内容，如果拿到则给 AST 元素分别添加 `else` 和 `elseif` 属性。

- AST 树管理

我们在处理开始标签的时候为每一个标签创建了一个 AST 元素，在不断解析模板创建 AST 元素的时候，我们也要为它们建立父子关系，就像 DOM 元素的父子关系那样。

AST 树管理相关代码如下：

```js
function checkRootConstraints (el) {
  if (process.env.NODE_ENV !== 'production') {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        `Cannot use <${el.tag}> as component root element because it may ` +
        'contain multiple nodes.'
      )
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' +
        'it renders multiple elements.'
      )
    }
  }
}


// tree management
if (!root) {
  root = element
  checkRootConstraints(root)
} else if (!stack.length) {
  // allow root elements with v-if, v-else-if and v-else
  if (root.if && (element.elseif || element.else)) {
    checkRootConstraints(element)
    addIfCondition(root, {
      exp: element.elseif,
      block: element
    })
  } else if (process.env.NODE_ENV !== 'production') {
    warnOnce(
      `Component template should contain exactly one root element. ` +
      `If you are using v-if on multiple elements, ` +
      `use v-else-if to chain them instead.`
    )
  }
}
if (currentParent && !element.forbidden) {
  if (element.elseif || element.else) {
    processIfConditions(element, currentParent)
  } else if (element.slotScope) { // scoped slot
    currentParent.plain = false
    const name = element.slotTarget || '"default"'
    ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
  } else {
    currentParent.children.push(element)
    element.parent = currentParent
  }
}
if (!unary) {
  currentParent = element
  stack.push(element)
} else {
  closeElement(element)
}
```

AST 树管理的目标是构建一颗 AST 树，本质上它要维护 `root` 根节点和当前父节点 `currentParent`。为了保证元素可以正确闭合，这里也利用了 `stack` 栈的数据结构，和我们之前解析模板时用到的 `stack` 类似。

当我们在处理开始标签的时候，判断如果有 `currentParent`，会把当前 AST 元素 push 到 `currentParent.chilldren` 中，同时把 AST 元素的 `parent` 指向 `currentParent`。

接着就是更新 `currentParent` 和 `stack` ，判断当前如果不是一个一元标签，我们要把它生成的 AST 元素 push 到 `stack` 中，并且把当前的 AST 元素赋值给 `currentParent`。

`stack` 和 `currentParent` 除了在处理开始标签的时候会变化，在处理闭合标签的时候也会变化，因此整个 AST 树管理要结合闭合标签的处理逻辑看。

##### 处理闭合标签

对应伪代码：

```js
end () {
  treeManagement()
  closeElement()
}
```

当解析到闭合标签的时候，最后会执行 `end` 回调函数：

```js
// remove trailing whitespace
const element = stack[stack.length - 1]
const lastNode = element.children[element.children.length - 1]
if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
  element.children.pop()
}
// pop stack
stack.length -= 1
currentParent = stack[stack.length - 1]
closeElement(element)
```

首先处理了尾部空格的情况，然后把 `stack` 的元素弹一个出栈，并把 `stack` 最后一个元素赋值给 `currentParent`，这样就保证了当遇到闭合标签的时候，可以正确地更新 `stack` 的长度以及 `currentParent` 的值，这样就维护了整个 AST 树。

最后执行了 `closeElement(element)`：

```js
function closeElement (element) {
  // check pre state
  if (element.pre) {
    inVPre = false
  }
  if (platformIsPreTag(element.tag)) {
    inPre = false
  }
  // apply post-transforms
  for (let i = 0; i < postTransforms.length; i++) {
    postTransforms[i](element, options)
  }
}
```

`closeElement` 逻辑很简单，就是更新一下 `inVPre` 和 `inPre` 的状态，以及执行 `postTransforms` 函数，这些我们暂时都不必了解。

##### 处理文本内容

对应伪代码：

```js
chars (text: string) {
  handleText()
  createChildrenASTOfText()
}
```

除了处理开始标签和闭合标签，我们还会在解析模板的过程中去处理一些文本内容：

```js
const children = currentParent.children
text = inPre || text.trim()
  ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
  // only preserve whitespace if its not right after a starting tag
  : preserveWhitespace && children.length ? ' ' : ''
if (text) {
  let res
  if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
    children.push({
      type: 2,
      expression: res.expression,
      tokens: res.tokens,
      text
    })
  } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
    children.push({
      type: 3,
      text
    })
  }
}
```

文本构造的 AST 元素有 2 种类型，一种是有表达式的，`type` 为 2，一种是纯文本，`type` 为 3。在我们的例子中，文本就是 `:`，是个表达式，通过执行 `parseText(text, delimiters)` 对文本解析，它的定义在 `src/compiler/parser/text-parser.js` 中：

```js
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

const buildRegex = cached(delimiters => {
  const open = delimiters[0].replace(regexEscapeRE, '\\$&')
  const close = delimiters[1].replace(regexEscapeRE, '\\$&')
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
})

export function parseText (
  text: string,
  delimiters?: [string, string]
): TextParseResult | void {
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE
  if (!tagRE.test(text)) {
    return
  }
  const tokens = []
  const rawTokens = []
  let lastIndex = tagRE.lastIndex = 0
  let match, index, tokenValue
  while ((match = tagRE.exec(text))) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index))
      tokens.push(JSON.stringify(tokenValue))
    }
    // tag token
    const exp = parseFilters(match[1].trim())
    tokens.push(`_s(${exp})`)
    rawTokens.push({ '@binding': exp })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex))
    tokens.push(JSON.stringify(tokenValue))
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}
```

`parseText` 首先根据分隔符（默认是 `{{}}`）构造了文本匹配的正则表达式，然后再循环匹配文本，遇到普通文本就 push 到 `rawTokens` 和 `tokens` 中，如果是表达式就转换成 `_s(${exp})` push 到 `tokens` 中，以及转换成 `{@binding:exp}` push 到 `rawTokens` 中。

对于我们的例子 `:`，`tokens` 就是 `[_s(item),'":"',_s(index)]`；`rawTokens` 就是 `[{'@binding':'item'},':',{'@binding':'index'}]`。那么返回的对象如下：

```js
return {
 expression: '_s(item)+":"+_s(index)',
 tokens: [{'@binding':'item'},':',{'@binding':'index'}]
}
```

#### 流程图

![img](https://ustbhuangyi.github.io/vue-analysis/assets/parse.png)

#### 总结

那么至此，`parse` 的过程就分析完了，看似复杂，但我们可以抛开细节理清它的整体流程。`parse` 的目标是把 `template` 模板字符串转换成 AST 树，它是一种用 JavaScript 对象的形式来描述整个模板。那么整个 `parse` 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。

AST 元素节点总共有 3 种类型，`type` 为 1 表示是普通元素，为 2 表示是表达式，为 3 表示是纯文本。其实这里我觉得源码写的不够友好，这种是典型的魔术数字，如果转换成用常量表达会更利于源码阅读。

当 AST 树构造完毕，下一步就是 `optimize` 优化这颗树。

### 4.3 optimize

当我们的模板 `template` 经过 `parse` 过程后，会输出生成 AST 树，那么接下来我们需要对这颗树做优化，`optimize` 的逻辑是远简单于 `parse` 的逻辑，所以理解起来会轻松很多。

为什么要有优化过程，因为我们知道 Vue 是数据驱动，是响应式的，但是我们的模板并不是所有数据都是响应式的，也有很多数据是首次渲染后就永远不会变化的，那么这部分数据生成的 DOM 也不会变化，我们可以在 `patch` 的过程跳过对他们的比对。

来看一下 `optimize` 方法的定义，在 `src/compiler/optimizer.js` 中：

```js
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}
```

我们在编译阶段可以把一些 AST 节点优化成静态节点，所以整个 `optimize` 的过程实际上就干 2 件事情，`markStatic(root)` 标记静态节点 ，`markStaticRoots(root, false)` 标记静态根。

#### 标记静态节点

```js
function markStatic (node: ASTNode) {
  node.static = isStatic(node)
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
  }
}

function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```

首先执行 `node.static = isStatic(node)`

`isStatic` 是对一个 AST 元素节点是否是静态的判断，如果是表达式，就是非静态；如果是纯文本，就是静态；对于一个普通元素，如果有 pre 属性，那么它使用了 `v-pre` 指令，是静态，否则要同时满足以下条件：没有使用 `v-if`、`v-for`，没有使用其它指令（不包括 `v-once`），非内置组件，是平台保留的标签，非带有 `v-for` 的 `template` 标签的直接子节点，节点的所有属性的 `key` 都满足静态 key；这些都满足则这个 AST 节点是一个静态节点。

如果这个节点是一个普通元素，则遍历它的所有 `children`，递归执行 `markStatic`。因为所有的 `elseif` 和 `else` 节点都不在 `children` 中， 如果节点的 `ifConditions` 不为空，则遍历 `ifConditions` 拿到所有条件中的 `block`，也就是它们对应的 AST 节点，递归执行 `markStatic`。在这些递归过程中，一旦子节点有不是 `static` 的情况，则它的父节点的 `static` 均变成 false。

#### 标记静态根

```js
function markStaticRoots (node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for)
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor)
      }
    }
  }
}
```

`markStaticRoots` 第二个参数是 `isInFor`，对于已经是 `static` 的节点或者是 `v-once` 指令的节点，`node.staticInFor = isInFor`。 接着就是对于 `staticRoot` 的判断逻辑，从注释中我们可以看到，对于有资格成为 `staticRoot` 的节点，除了本身是一个静态节点外，必须满足拥有 `children`，并且 `children` 不能只是一个文本节点，不然的话把它标记成静态根节点的收益就很小了。

接下来和标记静态节点的逻辑一样，遍历 `children` 以及 `ifConditions`，递归执行 `markStaticRoots`。

回归我们之前的例子，经过 `optimize` 后，AST 树变成了如下：

```js
ast = {
  'type': 1,
  'tag': 'ul',
  'attrsList': [],
  'attrsMap': {
    ':class': 'bindCls',
    'class': 'list',
    'v-if': 'isShow'
  },
  'if': 'isShow',
  'ifConditions': [{
    'exp': 'isShow',
    'block': // ul ast element
  }],
  'parent': undefined,
  'plain': false,
  'staticClass': 'list',
  'classBinding': 'bindCls',
  'static': false,
  'staticRoot': false,
  'children': [{
    'type': 1,
    'tag': 'li',
    'attrsList': [{
      'name': '@click',
      'value': 'clickItem(index)'
    }],
    'attrsMap': {
      '@click': 'clickItem(index)',
      'v-for': '(item,index) in data'
     },
    'parent': // ul ast element
    'plain': false,
    'events': {
      'click': {
        'value': 'clickItem(index)'
      }
    },
    'hasBindings': true,
    'for': 'data',
    'alias': 'item',
    'iterator1': 'index',
    'static': false,
    'staticRoot': false,
    'children': [
      'type': 2,
      'expression': '_s(item)+":"+_s(index)'
      'text': '{{item}}:{{index}}',
      'tokens': [
        {'@binding':'item'},
        ':',
        {'@binding':'index'}
      ],
      'static': false
    ]
  }]
}
```

我们发现每一个 AST 元素节点都多了 `staic` 属性，并且 `type` 为 1 的普通元素 AST 节点多了 `staticRoot` 属性。

#### 总结

那么至此我们分析完了 `optimize` 的过程，就是深度遍历这个 AST 树，去检测它的每一颗子树是不是静态节点，如果是静态节点则它们生成 DOM 永远不需要改变，这对运行时对模板的更新起到极大的优化作用。

我们通过 `optimize` 我们把整个 AST 树中的每一个 AST 元素节点标记了 `static` 和 `staticRoot`，它会影响我们接下来执行代码生成的过程。

### 4.4 codegen

编译的最后一步就是把优化后的 AST 树转换成可执行的代码，这部分内容也比较多，我并不打算把所有的细节都讲了，了解整体流程即可。部分细节我们会在之后的章节配合一个具体 case 去详细讲。

为了方便理解，我们还是用之前的例子：

```html
<ul :class="bindCls" class="list" v-if="isShow">
    <li v-for="(item,index) in data" @click="clickItem(index)">{{item}}:{{index}}</li>
</ul>
```

它经过编译，执行 `const code = generate(ast, options)`，生成的 `render` 代码串如下：

```js
with(this){
  return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
}
```

这里的 `_c` 函数定义在 `src/core/instance/render.js` 中。

```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
```

而 `_l`、`_v` 定义在 `src/core/instance/render-helpers/index.js` 中：

```js
export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber
  target._s = toString
  target._l = renderList
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
}
```

顾名思义，`_c` 就是执行 `createElement` 去创建 VNode，而 `_l` 对应 `renderList` 渲染列表；`_v` 对应 `createTextVNode` 创建文本 VNode；`_e` 对于 `createEmptyVNode`创建空的 VNode。

在 `compileToFunctions` 中，会把这个 `render` 代码串转换成函数，它的定义在 `src/compler/to-function.js` 中：

```js
const compiled = compile(template, options)
res.render = createFunction(compiled.render, fnGenErrors)

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```

实际上就是把 `render` 代码串通过 `new Function` 的方式转换成可执行的函数，赋值给 `vm.options.render`，这样当组件通过 `vm._render` 的时候，就会执行这个 `render` 函数。那么接下来我们就重点关注一下这个 `render` 代码串的生成过程。

#### generate

```js
const code = generate(ast, options)
```

`generate` 函数的定义在 `src/compiler/codegen/index.js` 中：

```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

`generate` 函数首先通过 `genElement(ast, state)` 生成 `code`，再把 `code` 用 `with(this){return ${code}}}` 包裹起来。这里的 `state` 是 `CodegenState` 的一个实例，稍后我们在用到它的时候会介绍它。先来看一下 `genElement`：

```js
export function genElement (el: ASTElement, state: CodegenState): string {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    let code
    if (el.component) {
      code = genComponent(el.component, el, state)
    } else {
      const data = el.plain ? undefined : genData(el, state)

      const children = el.inlineTemplate ? null : genChildren(el, state, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    // module transforms
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code)
    }
    return code
  }
}
```

基本就是判断当前 AST 元素节点的属性执行不同的代码生成函数，在我们的例子中，我们先了解一下 `genFor` 和 `genIf`。

#### `genIf`

```js
export function genIf (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  el.ifProcessed = true // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  const condition = conditions.shift()
  if (condition.exp) {
    return `(${condition.exp})?${
      genTernaryExp(condition.block)
    }:${
      genIfConditions(conditions, state, altGen, altEmpty)
    }`
  } else {
    return `${genTernaryExp(condition.block)}`
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}
```

`genIf` 主要是通过执行 `genIfConditions`，它是依次从 `conditions` 获取第一个 `condition`，然后通过对 `condition.exp` 去生成一段三元运算符的代码，`:` 后是递归调用 `genIfConditions`，这样如果有多个 `conditions`，就生成多层三元运算逻辑。这里我们暂时不考虑 `v-once` 的情况，所以 `genTernaryExp` 最终是调用了 `genElement`。

在我们的例子中，只有一个 `condition`，`exp` 为 `isShow`，因此生成如下伪代码：

```js
return (isShow) ? genElement(el, state) : _e()
```

#### `genFor`

```js
export function genFor (
  el: any,
  state: CodegenState,
  altGen?: Function,
  altHelper?: string
): string {
  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
      `v-for should have explicit keys. ` +
      `See https://vuejs.org/guide/list.html#key for more info.`,
      true /* tip */
    )
  }

  el.forProcessed = true // avoid recursion
  return `${altHelper || '_l'}((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      `return ${(altGen || genElement)(el, state)}` +
    '})'
}
```

`genFor` 的逻辑很简单，首先 AST 元素节点中获取了和 `for` 相关的一些属性，然后返回了一个代码字符串。

在我们的例子中，`exp` 是 `data`，`alias` 是 `item`，`iterator1` ，因此生成如下伪代码：

```js
_l((data), function(item, index) {
  return genElememt(el, state)
})
```

#### `genData` & `genChildren`

再次回顾我们的例子，它的最外层是 `ul`，首先执行 `genIf`，它最终调用了 `genElement(el, state)` 去生成子节点，注意，这里的 `el` 仍然指向的是 `ul` 对应的 AST 节点，但是此时的 `el.ifProcessed` 为 true，所以命中最后一个 else 逻辑：

```js
// component or element
let code
if (el.component) {
  code = genComponent(el.component, el, state)
} else {
  const data = el.plain ? undefined : genData(el, state)

  const children = el.inlineTemplate ? null : genChildren(el, state, true)
  code = `_c('${el.tag}'${
    data ? `,${data}` : '' // data
  }${
    children ? `,${children}` : '' // children
  })`
}
// module transforms
for (let i = 0; i < state.transforms.length; i++) {
  code = state.transforms[i](el, code)
}
return code
```

这里我们只关注 2 个逻辑，`genData` 和 `genChildren`：

- genData

```js
export function genData (el: ASTElement, state: CodegenState): string {
  let data = '{'

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  const dirs = genDirectives(el, state)
  if (dirs) data += dirs + ','

  // key
  if (el.key) {
    data += `key:${el.key},`
  }
  // ref
  if (el.ref) {
    data += `ref:${el.ref},`
  }
  if (el.refInFor) {
    data += `refInFor:true,`
  }
  // pre
  if (el.pre) {
    data += `pre:true,`
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += `tag:"${el.tag}",`
  }
  // module data generation functions
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el)
  }
  // attributes
  if (el.attrs) {
    data += `attrs:{${genProps(el.attrs)}},`
  }
  // DOM props
  if (el.props) {
    data += `domProps:{${genProps(el.props)}},`
  }
  // event handlers
  if (el.events) {
    data += `${genHandlers(el.events, false, state.warn)},`
  }
  if (el.nativeEvents) {
    data += `${genHandlers(el.nativeEvents, true, state.warn)},`
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += `slot:${el.slotTarget},`
  }
  // scoped slots
  if (el.scopedSlots) {
    data += `${genScopedSlots(el.scopedSlots, state)},`
  }
  // component v-model
  if (el.model) {
    data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`
  }
  // inline-template
  if (el.inlineTemplate) {
    const inlineTemplate = genInlineTemplate(el, state)
    if (inlineTemplate) {
      data += `${inlineTemplate},`
    }
  }
  data = data.replace(/,$/, '') + '}'
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data)
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data)
  }
  return data
}
```

`genData` 函数就是根据 AST 元素节点的属性构造出一个 `data` 对象字符串，这个在后面创建 VNode 的时候的时候会作为参数传入。

之前我们提到了 `CodegenState` 的实例 `state`，这里有一段关于 `state` 的逻辑：

```js
for (let i = 0; i < state.dataGenFns.length; i++) {
  data += state.dataGenFns[i](el)
}
```

`state.dataGenFns` 的初始化在它的构造器中。

```js
export class CodegenState {
  constructor (options: CompilerOptions) {
    // ...
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
    // ...
  }
}
```

实际上就是获取所有 `modules` 中的 `genData` 函数，其中，`class module` 和 `style module` 定义了 `genData` 函数。比如定义在 `src/platforms/web/compiler/modules/class.js` 中的 `genData` 方法：

```js
function genData (el: ASTElement): string {
  let data = ''
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`
  }
  return data
}
```

在我们的例子中，`ul` AST 元素节点定义了 `el.staticClass` 和 `el.classBinding`，因此最终生成的 `data` 字符串如下：

```js
{
  staticClass: "list",
  class: bindCls
}
```

- genChildren

接下来我们再来看一下 `genChildren`，它的定义在 `src/compiler/codegen/index.js` 中：

```js
export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  const children = el.children
  if (children.length) {
    const el: any = children[0]
    if (children.length === 1 &&
      el.for &&
      el.tag !== 'template' &&
      el.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el, state)
    }
    const normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0
    const gen = altGenNode || genNode
    return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
  }
}
```

在我们的例子中，`li` AST 元素节点是 `ul` AST 元素节点的 `children` 之一，满足 `(children.length === 1 && el.for && el.tag !== 'template' && el.tag !== 'slot')` 条件，因此通过 `genElement(el, state)` 生成 `li` AST元素节点的代码，也就回到了我们之前调用 `genFor` 生成的代码，把它们拼在一起生成的伪代码如下：

```js
return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return genElememt(el, state)
      })
    ) : _e()
```

在我们的例子中，在执行 `genElememt(el, state)` 的时候，`el` 还是 `li` AST 元素节点，`el.forProcessed` 已为 true，所以会继续执行 `genData` 和 `genChildren` 的逻辑。由于 `el.events` 不为空，在执行 `genData` 的时候，会执行 如下逻辑：

```js
if (el.events) {
  data += `${genHandlers(el.events, false, state.warn)},`
}
```

`genHandlers` 的定义在 `src/compiler/codegen/events.js` 中：

```js
export function genHandlers (
  events: ASTElementHandlers,
  isNative: boolean,
  warn: Function
): string {
  let res = isNative ? 'nativeOn:{' : 'on:{'
  for (const name in events) {
    res += `"${name}":${genHandler(name, events[name])},`
  }
  return res.slice(0, -1) + '}'
}
```

`genHandler` 的逻辑就不介绍了，很大部分都是对修饰符 `modifier` 的处理，感兴趣同学可以自己看，对于我们的例子，它最终 `genData` 生成的 `data` 字符串如下：

```js
{
  on: {
    "click": function($event) {
      clickItem(index)
    }
  }
}
```

`genChildren` 的时候，会执行到如下逻辑：

```js
export function genChildren (
  el: ASTElement,
  state: CodegenState,
  checkSkip?: boolean,
  altGenElement?: Function,
  altGenNode?: Function
): string | void {
  // ...
  const normalizationType = checkSkip
    ? getNormalizationType(children, state.maybeComponent)
    : 0
  const gen = altGenNode || genNode
  return `[${children.map(c => gen(c, state)).join(',')}]${
    normalizationType ? `,${normalizationType}` : ''
  }`
}

function genNode (node: ASTNode, state: CodegenState): string {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}
```

`genChildren` 的就是遍历 `children`，然后执行 `genNode` 方法，根据不同的 `type` 执行具体的方法。在我们的例子中，`li` AST 元素节点的 `children` 是 type 为 2 的表达式 AST 元素节点，那么会执行到 `genText(node)` 逻辑。

```js
export function genText (text: ASTText | ASTExpression): string {
  return `_v(${text.type === 2
    ? text.expression
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}
```

因此在我们的例子中，`genChildren` 生成的代码串如下：

```js
[_v(_s(item) + ":" + _s(index))]
```

和之前拼在一起，最终生成的 `code` 如下：

```js
 return (isShow) ?
    _c('ul', {
        staticClass: "list",
        class: bindCls
      },
      _l((data), function(item, index) {
        return _c('li', {
          on: {
            "click": function($event) {
              clickItem(index)
            }
          }
        },
        [_v(_s(item) + ":" + _s(index))])
      })
    ) : _e()
```

#### 总结

这一节通过例子配合解析，我们对从 `ast -> code` 这一步有了一些了解，编译后生成的代码就是在运行时执行的代码。由于 `genCode` 的内容有很多，所以我对大家的建议是没必要把所有的细节都一次性看完，我们应该根据具体一个 case，走完一条主线即可。

在之后的章节我们会对 `slot` 的实现做解析，我们会重新复习编译的章节，针对具体问题做具体分析，有利于我们排除干扰，对编译过程的学习有更深入的理解。





## 五、扩展



## 六、Vue Router



## 七、Vuex

### 7.1 介绍

#### 7.1.1 什么是Vuex

​	Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

#### 7.1.2 什么是“状态管理模式”？

让我们从一个简单的 Vue 计数应用开始：

```js
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```

这个状态自管理应用包含以下几个部分：

- state，驱动应用的数据源；
- view，以声明方式将 state 映射到视图；
- actions，响应在 view 上的用户输入导致的状态变化。

以下是一个表示“单向数据流”理念的极简示意：

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112151758323.png)

但是，当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

​	对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。

​	因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为。

#### 7.1.3 Vuex的核心思想

​	Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。有些同学可能会问，那我定义一个全局对象，再去上层封装了一些数据存取的接口不也可以么？

Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

​	另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112151803312.png)

### 7.2 Vuex初始化

​	这一节我们主要来分析 Vuex 的初始化过程，它包括安装、Store 实例化过程 2 个方面。

#### 7.2.1 安装

​	当我们在代码中通过 `import Vuex from 'vuex'` 的时候，实际上引用的是一个对象，它的定义在 `src/index.js` 中：

```js
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

##### （1）install

​	和 Vue-Router 一样，Vuex 也同样存在一个静态的 `install` 方法，它的定义在 `src/store.js` 中：

```js
import applyMixin from './mixin'
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

​	`install` 的逻辑很简单:

1. 把传入的 `_Vue` 赋值给 `Vue` 
2. 执行了 `applyMixin(Vue)` 方法



##### （2）applyMixin

`applyMixin`的定义在 `src/mixin.js` 中：

```js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit }) // 全局混入了一个beforeCreate钩子函数
  } else { // 兼容Vue1.0版本
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function' // 把 options.store 保存在所有组件的 this.$store 中
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
```

​	`applyMixin` 就是这个 `export default function`，它还兼容了 Vue 1.0 的版本，这里我们只关注 Vue 2.0 以上版本的逻辑。

`applyMixin`逻辑：

1. 全局混入了一个 `beforeCreate` 钩子函数（vuexInit）
2. `vuexInit()`逻辑 ：把 `options.store` 保存在所有组件的 `this.$store` 中，这个 `options.store` 就是我们在实例化 `Store` 对象的实例，稍后我们会介绍，这也是为什么我们在组件中可以通过 `this.$store` 访问到这个实例。



#### 7.2.2 Store 实例化

​	我们在 `import Vuex` 之后，会实例化其中的 `Store` 对象，返回 `store` 实例并传入 `new Vue` 的 `options` 中，也就是我们刚才提到的 `options.store`。

举个简单的例子，如下：

```js
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules
  // ...
})
```

​	`Store` 对象的构造函数接收一个对象参数，它包含 `actions`、`getters`、`state`、`mutations`、`modules` 等 Vuex 的核心概念。

`Store`类的定义在 `src/store.js` 中：

```js
export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `Store must be called with the new operator.`)
    }

    const {
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options) // 构建树形结构
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._watcherVM = new Vue()

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))

    if (Vue.config.devtools) {
      devtoolPlugin(this)
    }
  }
} 
```

​	我们把 `Store` 的实例化过程拆成 3 个部分，分别是初始化模块，安装模块和初始化 `store._vm`，接下来我们来分析这 3 部分的实现。

##### （1）初始化模块

​	在分析模块初始化之前，我们先来了解一下模块对于 Vuex 的意义：由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，当应用变得非常复杂时，`store` 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 `store` 分割成模块（module）。每个模块拥有自己的 `state`、`mutation`、`action`、`getter`，甚至是嵌套子模块——从上至下进行同样方式的分割：

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... },
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

​	所以从数据结构上来看，模块的设计就是一个树型结构，`store` 本身可以理解为一个 `root module`，它下面的 `modules` 就是子模块，Vuex 需要完成这颗树的构建，构建过程的入口就是：

> src/store.js

```js
this._modules = new ModuleCollection(options)
```

###### 1. ModuleCollection

`ModuleCollection` 的定义在 `src/module/module-collection.js` 中：

```js
export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }

  /**
   * 
   * @param {*} path 父模块的 path
   * @returns 
   */
  get (path) {
    return path.reduce((module, key) => { // 1. 从根模块开始，通过 reduce 方法一层层去找到对应的模块
      return module.getChild(key) // 
    }, this.root)
  }

  getNamespace (path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  }

  update (rawRootModule) {
    update([], this.root, rawRootModule)
  }

  /**
   * 每个子模块通过路径找到它的父模块，然后通过父模块的 addChild 方法建立父子关系，递归执行这样的过程，最终就建立一颗完整的模块树
   * @param {*} path 在构建树的过程中维护的路径
   * @param {*} rawModule 定义模块的原始配置
   * @param {*} runtime 是否是一个运行时创建的模块。
   */
  register (path, rawModule, runtime = true) {
    if (__DEV__) {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime) // 1.  创建了一个 Module 的实例

    if (path.length === 0) { // 2.1  判断当前的 path 的长度如果为 0，则说明它是一个根模块
      this.root = newModule // newModule 赋值给了 this.root
    } else { // 2.2 否则就需要建立父子关系了
      const parent = this.get(path.slice(0, -1)) // 首先根据路径获取到父模块
      parent.addChild(path[path.length - 1], newModule) // 调用父模块的 addChild 方法建立父子关系
    }

    // register nested modules(译) 注册模块嵌套
    if (rawModule.modules) { // 3. 遍历当前模块定义中的所有 modules，根据 key 作为 path，递归调用 register 方法
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }

  unregister (path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]
    const child = parent.getChild(key)

    if (!child) {
      if (__DEV__) {
        console.warn(
          `[vuex] trying to unregister module '${key}', which is ` +
          `not registered`
        )
      }
      return
    }

    if (!child.runtime) {
      return
    }

    parent.removeChild(key)
  }

  isRegistered (path) {
    const parent = this.get(path.slice(0, -1))
    const key = path[path.length - 1]

    if (parent) {
      return parent.hasChild(key)
    }

    return false
  }
}
```

​	`ModuleCollection` 实例化的过程:

1. 执行了 `register` 方法, `register` 接收 3 个参数
   -  `path` 表示路径，因为我们整体目标是要构建一颗模块树，`path` 是在构建树的过程中维护的路径
   - `rawModule` 表示定义模块的原始配置
   - `runtime` 表示是否是一个运行时创建的模块。
2. `register` 方法首先通过 `const newModule = new Module(rawModule, runtime)` 创建了一个 `Module` 的实例，`Module` 是用来描述单个模块的类。



###### 2. Module

`Module`的类定义在`src/module/module.js`中：

```js
export default class Module { // 用来描述单个模块的类
  constructor (rawModule, runtime) {
    this.runtime = runtime 
    // Store some children item
    this._children = Object.create(null) // this._children ： 表示它的所有子模块
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule // this._rawModule 表示模块的配置
    const rawState = rawModule.state

    // Store the origin module's state（译）存储源模块的状态
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {} // this.state :  表示这个模块定义的 state。
  }

  get namespaced () {
    return !!this._rawModule.namespaced
  }

  /**
   * 添加到当前模块的子模块的数组中（建立父子连接）
   * @param {*} key 
   * @param {*} module 
   */
  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  /**
   *  返回当前模块的 _children 中对应 key 的模块
   * @param {*} key 
   * @returns 
   */
  getChild (key) {
    return this._children[key]
  }

  hasChild (key) {
    return key in this._children
  }

  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
```

​	来看一下 `Module` 的构造函数，对于每个模块而言，`this._rawModule` 表示模块的配置，`this._children` 表示它的所有子模块，`this.state` 表示这个模块定义的 `state`。

###### 3. ModuleCollection

> src/module/module-collection.js

```js
  /**
   * 每个子模块通过路径找到它的父模块，然后通过父模块的 addChild 方法建立父子关系，递归执行这样的过程，最终就建立一颗完整的模块树
   * @param {*} path 在构建树的过程中维护的路径
   * @param {*} rawModule 定义模块的原始配置
   * @param {*} runtime 是否是一个运行时创建的模块。
   */
  register(path, rawModule, runtime = true) {
    if (__DEV__) {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime) // 1.  创建了一个 Module 的实例

    if (path.length === 0) { // 2.1  判断当前的 path 的长度如果为 0，则说明它是一个根模块
      this.root = newModule // newModule 赋值给了 this.root
    } else { // 2.2 否则就需要建立父子关系了
      const parent = this.get(path.slice(0, -1)) // 首先根据路径获取到父模块
      parent.addChild(path[path.length - 1], newModule) // 调用父模块的 addChild 方法建立父子关系
    }

    // register nested modules(译) 注册模块嵌套
    if (rawModule.modules) { // 3. 遍历当前模块定义中的所有 modules，根据 key 作为 path，递归调用 register 方法
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
```

​	回到 `register`，那么在实例化一个 `Module` 后，判断当前的 `path` 的长度如果为 0，则说明它是一个根模块，所以把 `newModule` 赋值给了 `this.root`，否则就需要建立父子关系了：

```js
const parent = this.get(path.slice(0, -1))
parent.addChild(path[path.length - 1], newModule)
```

​	我们先大体上了解它的逻辑：首先根据路径获取到父模块，然后再调用父模块的 `addChild` 方法建立父子关系。

​	`register` 的最后一步，就是遍历当前模块定义中的所有 `modules`，根据 `key` 作为 `path`，递归调用 `register` 方法，这样我们再回过头看一下建立父子关系的逻辑，首先执行了 `this.get(path.slice(0, -1)` 方法：

```js
get (path) {
  return path.reduce((module, key) => {
    return module.getChild(key)
  }, this.root)
}
```

​	传入的 `path` 是它的父模块的 `path`，然后从根模块开始，通过 `reduce` 方法一层层去找到对应的模块，查找的过程中，执行的是 `module.getChild(key)` 方法：

```js’
getChild (key) {
  return this._children[key]
}
```

​	其实就是返回当前模块的 `_children` 中对应 `key` 的模块，那么每个模块的 `_children` 是如何添加的呢，是通过执行 `parent.addChild(path[path.length - 1], newModule)` 方法：

```js
addChild (key, module) {
  this._children[key] = module
}
```

​	所以说对于 `root module` 的下一层 `modules` 来说，它们的 `parent` 就是 `root module`，那么他们就会被添加的 `root module` 的 `_children` 中。每个子模块通过路径找到它的父模块，然后通过父模块的 `addChild` 方法建立父子关系，递归执行这样的过程，最终就建立一颗完整的模块树。



##### （2）安装模块

​	初始化模块后，执行安装模块的相关逻辑，它的目标就是对模块中的 `state`、`getters`、`mutations`、`actions` 做初始化工作，它的入口代码是：

> src/store.js

```js
const state = this._modules.root.state
installModule(this, state, [], this._modules.root)
```

来看一下 `installModule` 的定义：

> src/store.js

```js
function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

`installModule` 方法支持 5 个参数: 

- `store` 表示 `root store`；
- `state` 表示 `root state`；
- `path` 表示模块的访问路径；
- `module` 表示当前的模块
- `hot` 表示是否是热更新。

​	接下来看函数逻辑，这里涉及到了命名空间的概念，默认情况下，模块内部的 `action`、`mutation` 和 `getter` 是注册在全局命名空间的——这样使得多个模块能够对同一 `mutation` 或 `action` 作出响应。如果我们希望模块具有更高的封装度和复用性，可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 `getter`、`action` 及 `mutation` 都会自动根据模块注册的路径调整命名。例如：

```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

回到 `installModule` 方法，我们首先根据 `path` 获取 `namespace`：

```js
const namespace = store._modules.getNamespace(path)
```

`getNamespace` 的定义在 `src/module/module-collection.js` 中：

```js
getNamespace (path) {
  let module = this.root
  return path.reduce((namespace, key) => {
    module = module.getChild(key)
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
}
```

​	从 `root module` 开始，通过 `reduce` 方法一层层找子模块，如果发现该模块配置了 `namespaced` 为 true，则把该模块的 `key` 拼到 `namesapce` 中，最终返回完整的 `namespace` 字符串。

回到 `installModule` 方法，接下来把 `namespace` 对应的模块保存下来，为了方便以后能根据 `namespace` 查找模块：

```js
if (module.namespaced) {
  store._modulesNamespaceMap[namespace] = module
}
```

接下来判断非 `root module` 且非 `hot` 的情况执行一些逻辑，我们稍后再看。

接着是很重要的逻辑，构造了一个本地上下文环境：

```js
const local = module.context = makeLocalContext(store, namespace, path)
```

来看一下 `makeLocalContext` 实现：

```js
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}
```

​	`makeLocalContext` 支持 3 个参数相关，`store` 表示 `root store`；`namespace` 表示模块的命名空间，`path` 表示模块的 `path`。

​	该方法定义了 `local` 对象，对于 `dispatch` 和 `commit` 方法，如果没有 `namespace`，它们就直接指向了 `root store` 的 `dispatch` 和 `commit` 方法，否则会创建方法，把 `type` 自动拼接上 `namespace`，然后执行 `store` 上对应的方法。

​	对于 `getters` 而言，如果没有 `namespace`，则直接返回 `root store` 的 `getters`，否则返回 `makeLocalGetters(store, namespace)` 的返回值：

```js
function makeLocalGetters (store, namespace) {
  const gettersProxy = {}

  const splitPos = namespace.length
  Object.keys(store.getters).forEach(type => {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) return

    // extract local getter type
    const localType = type.slice(splitPos)

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: () => store.getters[type],
      enumerable: true
    })
  })

  return gettersProxy
}
```

​	`makeLocalGetters` 首先获取了 `namespace` 的长度，然后遍历 `root store` 下的所有 `getters`，先判断它的类型是否匹配 `namespace`，只有匹配的时候我们从 `namespace` 的位置截取后面的字符串得到 `localType`，接着用 `Object.defineProperty` 定义了 `gettersProxy`，获取 `localType` 实际上是访问了 `store.getters[type]`。

​	回到 `makeLocalContext` 方法，再来看一下对 `state` 的实现，它的获取则是通过 `getNestedState(store.state, path)` 方法：

```js
function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}
```

​	`getNestedState` 逻辑很简单，从 `root state` 开始，通过 `path.reduce` 方法一层层查找子模块 `state`，最终找到目标模块的 `state`。

​	那么构造完 `local` 上下文后，我们再回到 `installModule` 方法，接下来它就会遍历模块中定义的 `mutations`、`actions`、`getters`，分别执行它们的注册工作，它们的注册逻辑都大同小异。

- `registerMutation`

```js
module.forEachMutation((mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})

function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
```

- `registerAction`

```js
module.forEachAction((action, key) => {
  const type = action.root ? key : namespace + key
  const handler = action.handler || action
  registerAction(store, type, handler, local)
})

function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

首先遍历模块中的 `actions` 的定义，拿到每一个 `action` 和 `key`，并判断 `action.root`，如果否的情况把 `key` 拼接上 `namespace`，然后执行 `registerAction` 方法。该方法实际上就是给 `root store` 上的 `_actions[types]` 添加 `wrappedActionHandler` 方法，该方法的具体实现我们之后会提到。注意，同一 `type` 的 `_actions` 可以对应多个方法。

- `registerGetter`

```js
module.forEachGetter((getter, key) => {
  const namespacedType = namespace + key
  registerGetter(store, namespacedType, getter, local)
})


function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

​	首先遍历模块中的 `getters` 的定义，拿到每一个 `getter` 和 `key`，并把 `key` 拼接上 `namespace`，然后执行 `registerGetter` 方法。该方法实际上就是给 `root store` 上的 `_wrappedGetters[key]` 指定 `wrappedGetter` 方法，该方法的具体实现我们之后会提到。注意，同一 `type` 的 `_wrappedGetters` 只能定义一个。

​	再回到 `installModule` 方法，最后一步就是遍历模块中的所有子 `modules`，递归执行 `installModule` 方法：

```js
module.forEachChild((child, key) => {
  installModule(store, rootState, path.concat(key), child, hot)
})
```

之前我们忽略了非 `root module` 下的 `state` 初始化逻辑，现在来看一下：

```js
if (!isRoot && !hot) {
  const parentState = getNestedState(rootState, path.slice(0, -1))
  const moduleName = path[path.length - 1]
  store._withCommit(() => {
    Vue.set(parentState, moduleName, module.state)
  })
}
```

​	之前我们提到过 `getNestedState` 方法，它是从 `root state` 开始，一层层根据模块名能访问到对应 `path` 的 `state`，那么它每一层关系的建立实际上就是通过这段 `state` 的初始化逻辑。`store._withCommit` 方法我们之后再介绍。

​	所以 `installModule` 实际上就是完成了模块下的 `state`、`getters`、`actions`、`mutations` 的初始化工作，并且通过递归遍历的方式，就完成了所有子模块的安装工作。

##### （3）初始化`store._vm`

​	`Store` 实例化的最后一步，就是执行初始化 `store._vm` 的逻辑，它的入口代码是：

```js
resetStoreVM(this, state)
```

来看一下 `resetStoreVM` 的定义：

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

​	`resetStoreVM` 的作用实际上是想建立 `getters` 和 `state` 的联系，因为从设计上 `getters` 的获取就依赖了 `state` ，并且希望它的依赖能被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。因此这里利用了 Vue 中用 `computed` 计算属性来实现。

​	`resetStoreVM` 首先遍历了 `_wrappedGetters` 获得每个 `getter` 的函数 `fn` 和 `key`，然后定义了 `computed[key] = () => fn(store)`。我们之前提到过 `_wrappedGetters` 的初始化过程，这里 `fn(store)` 相当于执行如下方法：

```js
store._wrappedGetters[type] = function wrappedGetter (store) {
  return rawGetter(
    local.state, // local state
    local.getters, // local getters
    store.state, // root state
    store.getters // root getters
  )
}
```

​	返回的就是 `rawGetter` 的执行函数，`rawGetter` 就是用户定义的 `getter` 函数，它的前 2 个参数是 `local state` 和 `local getters`，后 2 个参数是 `root state` 和 `root getters`。

接着实例化一个 Vue 实例 `store._vm`，并把 `computed` 传入：

```js
store._vm = new Vue({
  data: {
    $$state: state
  },
  computed
})
```

​	我们发现 `data` 选项里定义了 `$$state` 属性，而我们访问 `store.state` 的时候，实际上会访问 `Store` 类上定义的 `state` 的 `get` 方法：

```js
get state () {
  return this._vm._data.$$state
}
```

​	它实际上就访问了 `store._vm._data.$$state`。那么 `getters` 和 `state` 是如何建立依赖逻辑的呢，我们再看这段代码逻辑：

```js
forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })
```

​	当我根据 `key` 访问 `store.getters` 的某一个 `getter` 的时候，实际上就是访问了 `store._vm[key]`，也就是 `computed[key]`，在执行 `computed[key]` 对应的函数的时候，会执行 `rawGetter(local.state,...)` 方法，那么就会访问到 `store.state`，进而访问到 `store._vm._data.$$state`，这样就建立了一个依赖关系。当 `store.state` 发生变化的时候，下一次再访问 `store.getters` 的时候会重新计算。

我们再来看一下 `strict mode` 的逻辑：

```js
if (store.strict) {
  enableStrictMode(store)
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `Do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}
```

​	当严格模式下，`store._vm` 会添加一个 `wathcer` 来观测 `this._data.$$state` 的变化，也就是当 `store.state` 被修改的时候, `store._committing` 必须为 true，否则在开发阶段会报警告。`store._committing` 默认值是 `false`，那么它什么时候会 true 呢，`Store` 定义了 `_withCommit` 实例方法：

```js
_withCommit (fn) {
  const committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
}
```

它就是对 `fn` 包装了一个环境，确保在 `fn` 中执行任何逻辑的时候 `this._committing = true`。所以外部任何非通过 Vuex 提供的接口直接操作修改 `state` 的行为都会在开发阶段触发警告。

#### 7.2.3 总结

​	那么至此，Vuex 的初始化过程就分析完毕了，除了安装部分，我们重点分析了 `Store` 的实例化过程。我们要把 `store` 想象成一个数据仓库，为了更方便的管理仓库，我们把一个大的 `store` 拆成一些 `modules`，整个 `modules` 是一个树型结构。每个 `module` 又分别定义了 `state`，`getters`，`mutations`、`actions`，我们也通过递归遍历模块的方式都完成了它们的初始化。为了 `module` 具有更高的封装度和复用性，还定义了 `namespace` 的概念。最后我们还定义了一个内部的 `Vue` 实例，用来建立 `state` 到 `getters` 的联系，并且可以在严格模式下监测 `state` 的变化是不是来自外部，确保改变 `state` 的唯一途径就是显式地提交 `mutation`。

​	这一节我们已经建立好 `store`，接下来就是对外提供了一些 API 方便我们对这个 `store` 做数据存取的操作，下一节我们就来从源码角度来分析 `Vuex` 提供的一系列 API。

### 7.3 API



### 7.4 插件

