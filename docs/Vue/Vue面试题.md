---
title: Vue面试题
date: 2021-11-18
sidebar: 'auto'
tags:
- Vue
categories:
- Vue
isShowComments: true

---



## 1. 什么是Vue的响应式原理

![image-20211119135640581](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111191356740.png)

1. 在vue初始化的时候，会调用一个方法，这个方法叫initData，他会拿到当前用户传入的数据
2. 然后对这个数据进行观测，这里就有个new Observer，就是创建一个观测类，去观测用户传入的数据
3. 如果我们的数据是个对象类型，就会调用this.walk的方法
4. this.walk内部会对数据进行遍历，用defineReactive重新定义
5. defineReactive采用的就是Object.defineProperty
6. 用户取值的时候，就会调用get方法。调用get的时候就会收集依赖（watcher）, 等会数据变了，会去通知watcher去更新数据
7. 那这时候就在set方法里，数据一更新就判断，如果当前的值和新的值不一样的话，就会调用一个核心的方法叫notify，这个notify方法就会通知视图更新





## 2. Vue的SSR是什么？有什么好处？

- SSR就是服务端渲染
- 基于`nodejs serve`服务环境开发，所有`html`代码在服务端渲染
- 数据返回给前端，然后前端进行“激活”，即可成为浏览器识别的html代码
- `SSR`首次加载更快，有更好的用户体验，有更好的seo优化，因为爬虫能看到整个页面的内容，如果是vue项目，由于数据还要经过解析，这就造成爬虫并不会等待你的数据加载完成，所以其实Vue项目的seo体验并不是很好



## 3. **vue3 为什么要用 proxy？**

1. 可以监听数组内部的变化
2. 可以劫持整个对象，并返回一个新对象，无需递归
3. 可以对外界的访问进行过滤和改写。proxy在目标对象之前假设一层拦截，外界对对像的访问，都必须通过这层拦截
4. 问题：兼容性，因为proxy是es6语法，无法用polyfill实现。



## 4. MVVM、MVC的区别

### MVC

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111192025964.jpeg)

​	MVC，即model模型、view视图、controller控制器 。其中model负责在数据库中存储数据，view负责用户的显示，controller负责从视图读取数据，控制数据输入，并向模型发送数据。用户操作界面，想获取一些数据，view层会向后端发起一些请求，请求会被路由拦截，并把请求转发给对应的控制器来处理，控制器会获取model层数据。最终将结果返回给view，页面重新渲染。

### MVVM

​	MVVM即model、view、ViewModel.其中model负责存储数据，view负责用户的显示，viewmodel则具有两个功能，一是通过数据绑定，将后端传递的数据转换为所看到的页面。二是通过DOM事件监听将用户所看到的页面转换为后端的数据。

### MVVM与MVC

他们之间的最大区别就是MVVM实现了View和model的自动同步，也就是model的数据改变，会自动改变view层对应的显示。这样就简化了业务和界面的依赖关系，还解决了数据频繁更新的问题。

### 为什么官方要说 Vue 没有完全遵循 MVVM 思想呢

​	严格的mvvm要求view与model不能直接通信，但是vue提供了$refs属性，让model可以直接操作view.

## 5. 为什么 data 是一个函数

​	因为每个vue文件都先当于一个组件，都有可能会被实例化复用。当data采用对象的形式时，所有组件的实例都共用了同一个data，就会造成数据污染的问题。当采用函数的形式时，每次复用组件的时候，data函数都会返回一个新的data，相当于给组件创建了一个私有的数据空间。



## 6. Vue 组件通讯有哪几种方式

1. `props` ，父组件想子组件通过prop传递
2. `$emit`，子组件通过`$emit`调用父组件的方法，传参传值
3. `$parent`, 获取当前父组件实例，` $children`, 获取当前子组件实例
4. `$attrs`和`$listeners`
5. `vuex`, 状态管理
6. `$refs`, 获取组件实例，进而获取数据
7. `eventBus`，进行跨组件触发时间，进而传递数据
8. `provide`和`inject`，依赖注入
9. 使用浏览器本地缓存，例如`localStrorage`

## 7.Object.defineProperty

### 1. 对象新属性无法更新视图，删除属性无法更新视图，为什么？怎么办？

- 原因： `Object.defineProperty`没有对对象的新属性进行属性劫持
- 对象新属性无法更新视图：使用`Vue.$set(obj, key, value)`，组件中`this.$set(obj, key, value)`
- 删除属性无法更新视图：使用`Vue.$delete(obj, key)`，组件中`this.$delete(obj, key)`

### 2. 直接arr[index] = xxx无法更新视图怎么办？为什么？怎么办？

- 原因：Vue没有对数组进行`Object.defineProperty`的属性劫持，所以直接arr[index] = xxx是无法更新视图的

- 使用数组的splice方法，`arr.splice(index, 1, item)`

- 使用`Vue.$set(arr, index, value)`

### 3. 使用 Object.defineProperty() 进行数据劫持有什么缺点？

1. 无法监听数组的变化，因此 vue 中是在 `Array` 的方法上增加拦截器（对方法重写）【这个不是 defineProperty 的缺点，只是 vue 为了减少性能消耗才这样做的】
2. 只能劫持对象的属性，因此我们需要对每个对象的每个属性进行遍历，如果属性值是一个对象那么需要深度遍历。
3. 无法监听新增或者删除的属性，只能监听已经存在的响应式数据

## 8. 异步请求在哪一步发起？

- 在created的时候，视图中的dom并没有渲染出来，所以如果此时直接去操作dom节点，无法找相关元素
- 在mounted的时候，由于此时dom已经渲染出来，所以可以直接操作dom节点。

​	一般情况下，都放在mounted中，保证逻辑的统一性因为是生命周期是同步执行的

​	但是由于服务端渲染不支持mounted方法，所以在服务端渲染的情况下统一放在created中。

## 9. v-if和v-show的区别

- v-if ：通过控制dom元素的删除和生成来实现显隐，每次显隐都会使组件重新跑一遍生命周期，因为显隐决定了组价的生成和销毁
- v-show：通过控制display:none将对应样式进行隐藏。
- 频繁或大数量显隐使用`v-show`，否则使用`v-if`



## 10. vue的内置指令



## 11. 怎么理解vue的单向数据流

​	数据总是从父组件流向子组件，而子组件并不能修改父组件的原始数据。这样防止，子组件意外改变父组件的状态，导致应用的数据流向难以理解

## 12.  computed 和 watch 的区别和运用的场景

- computed和watch都是基于Watcher来实现的
- computed属性具备缓存，依赖的只不发生变化，对其取值时计算属性方法不会重新执行
- watch则是监控值的变化，当值发生变化时调用对应的回调函数

> src/core/instance/state.js:58

> src/core/instance/state.js:241 计算属性取值函数

> src/core/instance/state.js:345 watch的实现




## 13. v-if与v-for为什么不建议一起使用

​	因为v-for的优先级比v-if高，当同时使用来操作标签时，会先执行v-for遍历完成，在执行v-if的话，如果值为false，就会渲染无用节点

## 14. Vue2.0的响应式原理

整体的思路就是数据劫持+观察者模式

对于对象内部，通过defineReactive方法，使用Object.defineProperty对属性进行劫持，当页面使用对应的属性时，每个属性都有自己的Dep属性，存放他所依赖的watcher（收集依赖），当属性变化后会通自己对应的watcher去更新。

## 15. Vue如何检测数组变化

​	Vue中并没有使用defineProperty去重新定义数组的每一项。我们都知道经常用的方法有七种 push、shift。这七种方法都可以去更改数组的内容， 只要改了数组内容，就更新就好了，所以Vue将数组的原型方法进行重写，重写出一个新的原型，



## 16. 生命周期

### 1. Vue的父子组件生命周期钩子函数执行顺序

- 加载渲染过程: 父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted
- 更新过程: 父 beforeUpdate->子 beforeUpdate->子 updated->父 updated
- 销毁过程: 父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed

### 2. Vue 的生命周期方法有哪些？

| 声明周期      | 什么时候被调用                                               | 适合做什么事 |
| ------------- | ------------------------------------------------------------ | ------------ |
| beforeCreate  | 实例初始化之后，数据观测之前                                 |              |
| created       | 实例已经创建完成之后被调用。实例已完成配置：数据观测、属性和方法的运用，watch/event事件回调 |              |
| beforeMount   |                                                              |              |
| mounted       |                                                              |              |
| beforeUpadate |                                                              |              |
| updated       |                                                              |              |
| beforeDestroy |                                                              |              |
| destroyed     |                                                              |              |



- **beforeCreate**，初始化实例后：数据观测，watch/event事件回调
- **created** ，创建实例后：属性方法运行
- **beforeMount**，挂载前调用：render函数首次调用
- **mounted**，挂载后调用：Dom挂载完成（可访问），数据完成双向绑定
- **beforeUpdate**：数据更新时：虚拟dom未重新渲染，未打补丁（patch）
- **updated**：更新完成后，组件dom完成更新
- **beforeDestroy**，实例销毁前：实例可用
- **destroyed**，实例销毁后：vue实例数据被解绑，事件监听被移除，子实例被销毁

### 3. vue的生命周期钩子是如何实现的？

- Vue的生命周期钩子就是回调函数，当创建组件实例的过程中会调用对应的钩子方法
- 内部会对钩子函数进行处理，将钩子函数维护成数组的形式



## 17. 虚拟dom是什么，有什么优缺点



## 18. Vue-Router

### 1. Vue-Router的两种模式的区别

- Vue-Router有三种模式： `hash`、`history`、`abstract`

- `abstract`模式是在不支持浏览器API环境使用，不依赖浏览器历史
- `hash`模式： `hash` + `popState/hashChange`兼容性好但是不够美观，hash服务端无法获取。不利于seo优化
- `history`模式： `historyApi` + `popState`美观，刷新会出现404

> 回答

​	Vue-Router有三种模式： hash、history、abstract，前两种是浏览器中的模式，而abstract表示如果我们是跨端的，就没有浏览器的api，会默认降级为abstract，为了保证浏览器不支持支持hash、history方法的话，可以降级为abstract，但是核心router的实现还是两种，一种是hash，一种是history。hash模式内部用的就是hash，因为hash值的变化不会触发页面的更新，这时候就可以监控hash值的变化，做自己想做的事，其内部会先采用popstate，如果popstate不兼容，会采用hashChange，虽然hash方法兼容性好，但是不够美观， 例如路径后面有个#。#后面的值服务器是拿不到的，所以这样就不理于seo优化，比如说，我们想访问/admin的时候，可以渲染出/admin的页面，但是用#admin的话，就找不到对应的页面渲染。所以如果做服务端渲染是不支持hash模式的。所以一般情况下还是采用history模式，history模式采用的就是HTML5的historyAPI，就是pushState、replaceState，再加上popState， 那它的好处就是美观，但是使用的时候会产生404，因为访问一个页面的时候，会访问服务器，服务器没有这个页面的时候，服务器应该配置一下到首页，否则会出现404。但是我们开发的时候基本上不会出现404，VueCli内部集成了一个webpack插件——history-fallback





### hash模式

hash表示的是地址栏URL中#符号, location.hash的值实际上就是URL中#后面的东西， hash虽然会出现在URL中, 但是不会被包含在Http请求中, 因此hash值改变不会重新加载页面.

当hash（window.location.hash）改变时, 会触发hashchange事件，且在浏览器的访问历史中增加一个记录。

### history模式

history模式中，通过`pushState()`和`replaceState()`两个api切换url，触发`popstate`事件，实现路由跳转不会重新加载页面。

### 区别

​	history模式比hash模式好，因为hash模式是基于URL的，如果传递复杂的数据，会存在体积限制，但是history模式不仅可以在URL传参，还可以饭在特定的对象中。

## 19.diff算法

​	Vue的diff算法是平级比较，不考虑跨级比较的情况。内部采用深度递归的方式 + 双指针的方式进行比较

1. 先比较是否是相同节点
2. 相同节点比较属性，并复用老节点
3. 比较儿子节点，考虑老节点和新节点儿子的情况
4. 优先比较：头头、尾尾、头尾、尾头
5. 比对查找进行复用

> 



## 20. 为何Vue采用异步渲染？



## 21. nextTick实现原理

- `nextTick`中回调是在下次DOM更新循环结束之后执行的延迟回调。
- 可用于获取更新后的DOM
- Vue中数据更新时异步的，使用`nextTick`方法可以保证用户定义的逻辑在更新之后执行。

> src/sore/util/nextTick.js :89

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

-  当我们修改了数据后，并不会马上更新视图，而是等到渲染watcher队列中任务执行完之后才去更新视图



## 22. Vue中Computed的特点



## 23. watch

### 1.watch有哪些属性，分别有什么用？

> 监听基本类型

```js
watch: {
    value () {
        // do something
    }
}
```

> 监听引用类型

```js
watch: {
    obj: {
       handler () { // 执行回调
           // do something
       },
       deep: true, // 是否进行深度监听
       immediate: true // 是否初始执行handler函数
    }
}
```

### 2.  watch中的deep：true是如何实现的



## 24. 何时需要使用beforeDestroy

- 解绑$on事件
- 清除自定义的定时器
- 解除原生的dom事件的绑定，eg: scroll、mousemove

## 25. Vue中模板编译原理

核心问题：将template转化为render函数

主要分为三步

1. 将template模板转换成ast语法树 - `parserHTML`
2. 对静态语法做静态标记（diff来做优化，静态节点跳过diff操作，静态？有有无动态绑定，v-if，v-for） - `markUp`
3. 重新生成代码 （通过ast语法树拼接字符串： _c(div)，最终添加with）- `codeGen`

> src/compiler/index.js

```js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {

  /* html => 词法解析（开始标签，结束标签。。） => ast（只能描述已经存在的语法） => render函数（字符串形式） => 虚拟dom (增加额外的属性) => 生成真实dom  */

  const ast = parse(template.trim(), options) // 1. 解析ast语法树

  if (options.optimize !== false) {
    optimize(ast, options) // 2.对ast树进行标记，标记静态节点
  }

  const code = generate(ast, options) // 3. 生成代码

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```



## 26.key

### 1. v-for中为什么要用key（图解）



### 2.为什么不建议用index做key？为什么不建议使用随机数做key



## 27. 描述组件的渲染和更新过程



## 28. Vue中事件绑定的原理



## 29. v-model中的实现原理及如何自定义v-model



## 30. vue中v-html会导致哪些问题？

- 可能会导致xss攻击。
- v-html会替换掉标签内部的子元素 



## 31. 为什么要使用异步组件？



## 32. 什么是作用域插槽？



## 33. Vue中常见性能优化

### 1. 编码优化



### 2. vue加载性能优化



### 3. 用户体验

- app-skeleton骨架屏



### 4. SEO优化



## 34. Vue3.0你知道有哪些改进？





## 35. Vue-Router中导航守卫有哪些？



## 36. action和mutation区别



## 37. Vuex有哪些属性？用处是什么？

![image.png](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111191608222.webp)

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。

- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。

- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。

- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。

- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中

## 38. 双向绑定和vuex是否冲突



## 39. Vue中内置组件transition、transition-group的源码实现原理



## 40. patch函数里都做了哪些



## 41. vue生命周期内部怎么实现的



## 42. ssr项目如果并发很大服务器性能怎么优化



## 43. 项目如何实现权限校验



## 44. vue-lazyloader的原理，手写伪代码



## 45. Vue.set的原理？

>  set的作用：设置响应式数据

1. 先判断值是否是数组类型，如果是数组类型，则内部会调用数组的splice方法处理
2. 然后排除对象是响应式的情况
3. 在对对象调用defineReactive的方法进行响应式处理

```js
function set(target, key, val) {
    // 判断是否是数组
    if (Array.isArray(target)) {
        // 判断谁大谁小
        target.length = Math.max(target.length, key)
        // 执行splice
        target.splice(key, 1, val)
        return val
    }

    const ob = target.__ob__

    // 如果此对象没有不是响应式对象，直接设置并返回
    if (key in target && !(key in target.prototype) || !ob) {
        target[key] = val
        return val
    }

    // 否则，新增属性，并响应式处理
    defineReactive(target, key, val)
    return val
}
```





## 46. vue compile过程说一下，指令、插槽表达式等vue语法如何生效的。



## 47. vue的优点？Vue的缺点？

- 优点：渐进式，组件化，轻量级，虚拟dom，响应式，单页面路由，数据与视图分开

- 缺点：单页面不利于seo，不支持IE8以下，首屏加载时间长

## 48. 为什么说Vue是一个渐进式框架？

渐进式： 通俗点说就是，想用什么就用什么，比如vuex用也行不用也行

![image.png](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111191544314.webp)

49.Vue和JQuery的区别在哪？为什么放弃JQuery用Vue？

​	已知Vue不直接操作DOM，JQuery会直接操作DOM。	在频繁操作DOM的场景下，JQuery直接操作DOM，会损耗大量性能，而Vue通过虚拟dom性能更强。

## 50. Vue修饰符有哪些？

![截屏2021-07-11 下午9.56.53.png](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111191549605.webp)

## 51. 内置指令

![image.png](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111191550093.webp)

## 52. 如何设置动态class，动态style?

```html
// 动态class对象
<div :class="{ 'is-active': true, 'red': isRed }"></div>
// 动态数组
<div :class="['is-active', isRed ? 'red' : '' ]"></div>

// 动态style对象
<div :style="{ color: textColor, fontSize: '18px' }"></div>

// 动态style数组
<div :style="[{ color: textColor, fontSize: '18px' }, { fontWeight: '300' }]"></div>
```

## 53. 不需要响应式的数据应该如何处理

> **死数据**： 就是不会改变的数据，如果响应式处理的话，会消耗性能。

- 方法一：将数据定义在data之外

```js
data () {
    this.list1 = { xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx }
    this.list2 = { xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx }
    this.list3 = { xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx }
    this.list4 = { xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx }
    this.list5 = { xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx }
    return {}
 }
```

- 方法二：Object.freeze()

```js
data () {
    return {
        list1: Object.freeze({xxxxxxxxxxxxxxxxxxxxxxxx}),
        list2: Object.freeze({xxxxxxxxxxxxxxxxxxxxxxxx}),
        list3: Object.freeze({xxxxxxxxxxxxxxxxxxxxxxxx}),
        list4: Object.freeze({xxxxxxxxxxxxxxxxxxxxxxxx}),
        list5: Object.freeze({xxxxxxxxxxxxxxxxxxxxxxxx}),
    }
 }
```

## 54. Vue中如何进行依赖收集

![image-20211119204022792](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111192040963.png)

- 每个属性都有自己的dep属性，存放他所依赖的watcher，当属性变化后会通知自己对应的watcher去更新
- 默认在初始化时会调用render函数，此时会触发属性依赖收集，`dep.depend`
- 当属性发生修改时，会触发watcher更新。`dep.notify()`



## 参考

1. https://juejin.cn/post/6984210440276410399#heading-47
