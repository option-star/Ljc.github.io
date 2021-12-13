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

### 2.3 配置源码

> [源码地址](https://github.com/vuejs/vue-next)



## 3. Vue3响应式原理



###3.1 响应式API

```js
let { reactive, shallowReactive, readonly, shallowReadonly, effect } = VueReactivity;
let school = { name: 'zf', age: 12, address: { num: 517 } }
let proxy = reactive(school);

effect(() => {
    app.innerHTML = proxy.name + ':' + proxy.address.num
});
setTimeout(() => {
    proxy.name = 'jw'; //name 变化 对应的effect就会执行
}, 1000);   
```

-  **reactive**： 会将对象里的所有对象都进行代理。当我在effect中取值的时候回进行依赖收集，当赋值的时候 会重新执行effect
- **effect**:  第一次effect会默认执行，执行时会收集属性依赖。 当收集的值发生变化时，对应的effect就会执行。

> 平时用的到effect吗？

​	watch、computed都是基于这个effect来实现的，所以平时也算用的到，一般用的时候，会用它的变体——watch、computed.

剩余的响应式API的用法与`reactive`用法一致，下面是它们之间的区别 ：

- **reactive**：会将对象里的所有对象都进行代理 proxy
- **shallowReactive** ：只代理第一层对象
- **readonly**：表示会被代理， 但是不进行依赖收集，可以节约性能（处理不会改变的值）
- **shallowReadonly**： 因为外层没有收集依赖，虽然里层能改，但是不会更新视图

### 3.1 响应式原理实现

​	首先，我们发现响应式API中都是传入一个对象，但是有不一样的地方：

1. 是否是浅的，默认是深度。
2. 是否是仅读的，默认不是仅读的。

​	所以，我们就需要用两个变量来控制这两个不一样的地方。因为响应式API都差不多，所以写一个公共的方法对响应式API做统一处理。

```js
export function reactive(target) {
    return createReactiveObject(target, false, mutableHandler);
}
export function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers);
}
export function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers);
}
export function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHanlders);
}
```

​	由上可知，我们用createReactiveObject的方法对响应式API做统一处理，在这个方法中，可以根据我们传入的对象，是否是仅读的，还有对应的处理方法，来创造不同的代理对象。

然后我们具体来看看createReactiveObject方法如何实现：

```js
/**
 * 
 * @param target 创建代理的目标
 * @param isReadonly 当前是不是仅读的
 * @param baseHandler 针对不同的方式创建不同的代理对象  
 */
// weakMap(key只能是对象) map(key可以是其他类型)
const reactiveMap = new WeakMap(); // 目的是添加缓存
const readonlyMap = new WeakMap();
function createReactiveObject(target, isReadonly, baseHandler) {
    if(!isObject(target)){
        return target;
    }
    const proxyMap = isReadonly? readonlyMap:reactiveMap
    const existProxy = proxyMap.get(target);
    if(existProxy){
        return existProxy;// 如果已经代理过了，那就直接把上次的代理返回就可以的 
    }
    // 如果是对象 就做一个代理 new proxy
    const proxy = new Proxy(target,baseHandler);
    proxyMap.set(target,proxy);
    return proxy;
}
```

分析以上的代码，首先我们需要传入三个参数：

- `target`： 创建代理的目标
-  `isReadonly`: 判断当前是不是仅读的。
- `baseHandler`: 针对不同的方式创建不同的代理对象。

我们最后就落实到一个方法上，proxy。通过proxy做一个代理。

​	由于我们不做对象类型以外的数据做代理，所以通过isObject的方法进行判断target值是否是一个对象：

```js
export function isObject(val) {
    return typeof val == 'object' && val !== null;
}
```

​	当我们要使用一个对象的时候，可能会将一个对象代理两次，如下：

```js
let {reactive,shallowReactive,readonly,shallowReadonly,effect} = VueReactivity;
let school = {name:'zf',age:12,address:{num:517},arr:[1,2,3]}
let obj1 = reactive(school)
let obj2 = reactive(school)
```

​	但是问题来了，一个对象需要代理两次吗？肯定不需要，那同一个对象被两次包裹，其结果应该就是同一个，所以我们就可以想到，第一次代理完之后，给对象设置一个缓存，下一次调用之后，就可以使用上一次生成的缓存就好了。

​	那如何缓存呢？ Vue3中就是给某个对象对应了一个proxy, 如果该对象再次被代理，直接返回对应的prox即可。但是普通对象并没有这种功能。

```js
let obj = {
    school : proxy
}
```

因为普通对象会把school当做成key，为死数据。所以不能用普通对象做映射。

​	es6中新增了weakMap与map。其中weakMap的key只能是对象，而map可以是其他类型，而且weakMap是一个弱引用，如果这个对象被销毁了， weakMap可以自动释放掉。

​	所以在vue3中就利用weakMap来做这样一个缓存，如果代理的对象被清空了，weakMap也会自动把对象释放掉，所以缓存用weakMap而不用Map。

代码具体实现流程为:

1. 先通过get方法获取weakMap中对应target的值，如果没有就生成一个新的proxy，并通过set方法将target与proxy的值做映射，返回proxy
2. weakMap中存在对应target的proxy的值，则直接返回。

> 可能我用不同的响应式API对同一个对象做代理，该如何处理
>
> ```js
> let obj1 = reactive(school);
> let obj2 = readonly(school);
> ```

​	如果按上面的逻辑，obj1与obj2是同一个对象，理论上说，她们应该不是同一个对象。所以vue3在这里就用了两个weakMap做缓存。一个缓存仅读的，一个缓存响应的。

代码实现逻辑：

1. 首先根据判断是否是仅读的，如果是就用缓存仅读的weakMap，如果不是就用缓存响应的weakMap。
2. 然后就判断缓存中是否存在该对对象等等，与之前的缓存流程一致。

> 那proxy中如何代理呢？

其中主要靠的就是传入的baseHandler参数。分为一下四种情况讨论：

- mutableHandler
- shallowReactiveHandlers
- readonlyHandlers
- shallowReadonlyHanlders

​	我们在处理函数中就主要识别两个方法，取值get()与设置值set()。由于四个baseHandler都需要设置get与set，代码就很冗杂。它们的不同的就集中在是不是仅读的？是不是浅的？所以就把处理get与set的方法单独抽离出来，通过createGetter方法统一处理get，通过createSetter方法统一处理set。

具体代码实现如下：

对于get:

```js
function createGetter(isReadonly = false, shallow = false) {
    /**
     * target 是原来的对象
     * key 去取什么属性
     * recevier 代理对象
     */
    return function get(target, key, receiver) {
    }
}
```

代码分析：

其参数为

- isReadonly： 是不是仅读的
- shallow： 是不是浅的

所以我们就可以通过参数不同创建出不同的get

```js
const get = createGetter(); // 不是仅读的也不是浅的
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
```

所以我们就可以通过不同的响应式API设置不同的set。

```js
export const mutableHandler = { // reactive中的get和set
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
let readonlySet = {
    set(target, key) {
        console.warn(`cannot set ${JSON.stringify(target)} on  key ${key} falied`)
    }
}
export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySet)
export const shallowReadonlyHanlders = extend({
    get: shallowReadonlyGet
}, readonlySet)
```



对于get：

```js
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
    }
}
```

​	由于set方法不需要考虑仅读的情况，所以只需要判断是否为浅的情况即可。所以通过是否为浅的方式创建不同的set方法：

```js
const set = createSetter();
const shallowSet = createSetter(true); // readonly没有set
```

然后给不同的响应式API设置不同的set：

```js
export const mutableHandler = { // reactive中的get和set
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
```

对于仅读的响应式API处理，就是一调用set就报错。如下代码展示

```js
let readonlySet = {
    set(target, key) {
        console.warn(`cannot set ${JSON.stringify(target)} on  key ${key} falied`)
    }
}
export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySet)
export const shallowReadonlyHanlders = extend({
    get: shallowReadonlyGet
}, readonlySet)
```

其中的extend方法：用于合并对象

```js
export let extend = Object.assign; 
```



> 那代理中的get具体是怎么实现的呢？

具体代码如下：

```js
function createGetter(isReadonly = false, shallow = false) {
    /**
     * target 是原来的对象
     * key 去取什么属性
     * recevier 代理对象
     */
    return function get(target, key, receiver) {
        // return target[key];
        // Reflect 就是要后续慢慢替换掉Object对象，一般使用proxy 会配合Reflect
        const res = Reflect.get(target, key, receiver); // Reflect.ownKey Reflect.defineProperty
        if (!isReadonly) {
           track(target,'get',key);
        }
        if (shallow) {
            return res;
        }
        if (isObject(res)) { // 懒递归 当我们取值的时候才去做递归代理，如果不取默认值代理一层
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    }
    // vue3 针对的是对象来进行劫持， 不用改写原来的对象,如果是嵌套，当取值的时候才会代理
    // vue2 针对的是属性劫持，改写了原来对象，一上来就递归的
    // vue3 可以对不存在的属性进行获取，也会走get方法, proxy支持数组
}
```

代码解析：

其中默认参数：

- `target`: 原来的对象
- `key`： 去取什么属性
- `recevier`： 代理对象

 	当取值的时候，我们可以选择直接 在原对象target上取值：

```js
return target[key];
```

​	但是用proxy的时候一般会配合reflect来使用, 通过Reflect.get()方法将原来默认目标的值映射回去。其中Reflect就是后续慢慢换掉Object对象，一般使用proxy会配合Reflect。

```js
const res = Reflect.get(target, key, receiver);
return res;
```

​	由于proxy之后对最外面层对象做代理，所以我们可通过isReadonly参数对来判断是否需要做深层代理，如果做浅代理直接返回res的值。

​	如果需要做深层代理，则通过递归调用readonly()方法或者reactive()方法。**而这种递归是懒递归，当我们取值的时候才去做递归代理，如果不取默认值只代理一层。**

​	还有一种情况，如果target对象不是仅读的，则需要收集当前属性，如果这个属性变化了，稍后可能要更新视图。

:::tip

	1. Vue3针对的是对象进行劫持，不用改写原来的对象，如果是嵌套，当取值的时候才会代理。
	1. Vu2针对的是属性劫持，改写了原来的对象，一上来就是递归。
	1. vue3可以对不存在的属性进行获取，也会走get方法，proxy支持数组。

:::



> 那代理中的set是如何实现的呢？

```js
function createSetter(shallow = false) {
    // 针对数组而言 如果调用push方法，就会产生2次处罚 1.给数组新增了一项，同时也更改了长度 2.因为更改了长度再次触发set （第二次的触发是无意义的）
    return function set(target, key, value, receiver) {
        const oldValue = target[key]; // 获取老值
        // target[key] = value; // 如果设置失败 没有返回值
        // 有一个属性不能被修改 target[key] = value;  不会报错，但是通过Reflect.set 会返回false
        // 设置属性，可能以前有，还有可能以前没有 （新增和修改）
        // 如何判断数组是新增还是修改
       
        let hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const res = Reflect.set(target, key, value, receiver);
        if(!hadKey){
            trigger(target,'add',key,value);
        }else if (hasChanged(oldValue, value)) {
            trigger(target,'set',key,value,oldValue);
        }
     
        return res
    }
}
```

代码解析：

其中默认参数：

-  `target`: 原来的对象
- `key`： 去取什么属性
- `value`： 需要设置的值
- `recevier`： 代理对象

​	当设置值的时 候，我们可以通过`target[key] = value`设置，但是这样会出现一个问题，当设置值失败的时候，是没有返回值的。所以我们可以通过Reflect.set设置值, 可以返回false。

```js
const res = Reflect.set(target, key, value, receiver);
return res
```

