---
title: VUE02:Vue基础
date: 2022-03-21
sidebar: 'auto'
categories:
- 04Vue
isShowComments: true
---

## 1. Vue的基本原理

​	当一个Vue实例创建时，Vue会遍历data中的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。

![0_tB3MJCzh_cB6i3mS-1.png](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202252848.webp)

## 2. 双向数据绑定的原理

Vue.js 是采用**数据劫持**结合**发布者-订阅者模式**的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

1. 需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202253821.webp)



## 3. data什么情况是对象？函数？

- 在根组件中，data不会被共享，可以放对象也可以放函数
- 在子组件中，data只能是一个函数，防止多个组件中共享一个数据



## 4. vue的初始化流程

1. new Vue时，传入options参数，并进行初始化操作_init
2. 该初始化函数_init在initMixin中定义，主要为了`_init`方法传递Vue构造函数，并在原型上挂载`_init`方法
3. 在`_init`方法中进行初始化
   - initState： 主要处理props、methods、data、computed、watch等对象
   - ….
4. 最后，在`_init`方法中判断有无传入el参数，如果传入则将数据挂载到页面上。

## 5. Vue中如何处理传入的data数据

:::tip

​	由于在初始化函数`_init`方法中，调用initState处理props、methods、data、computed、watch等数据，对于data通过`initData`的方法对数据进行处理

:::

`initData`函数的处理：

1. 如果传入的是一个函数，则让函数的this指向Vue实例，并将函数返回值作为对象；如果传入的是一个对象，则直接使用对象。
1. **数据代理** ：通过proxy的方法进行代理data数据，即`vm.name = vm._data.name`，实际还是通过`Object.defineProperty`方法进行劫持
2. 通过observe方法，重写 data对象的所有属性，将data变成响应式。



## 6. 如何将传入的data变成响应式？

:::tip

1. new Vue会调用_init方法进行初始化
2. 会将用户的选项放到vm.$options上
3. 会对当前属性上搜索有没有data数据 (initState)
4. 有data判断data是不是一个函数，如果是函数取返回值 (initData)
5. observe 去观测data中的对象
5. 如果更新对象不存在的属性，会导致视图不更新，如果是数组更新索引和长度不会触发更新。
5. 如果是替换成一个新对象，新对象会被进行劫持，如果是数组存放新内容 push unshift（）新增的内容也会被劫持
5. 通过`__ob__`进行标识这个对象被监控过。

:::

​	Vue中主要通过observe方法对data中数据进行观测：

1. 先判断传入的是否是对象， 如果不是对象，则直接return，不做观测
2. 通过Observe类来对data进行处理，如果观测过就跳过观测



## 7. Vue中如何识别被观测过的数据？

​	如果一个数据已经被观测过了，就不要观测了，用Observe类来实现，我观测过就增加一个标识`__ob_`，说明观测过了，在观测的时候，可以先检测是否观测过，如果观测过就跳过检测。

Observe类具体实现：

1. 在data上添加`__ob__`属性，为Observe类的实例，所有被劫持过的属性都有`__ob__`
2. 如果传入的值是对象， 通过调用`walk`方法，循环遍历对象，通过`defineReactive`方法重新定义属性, 进行数据劫持
3. 如果传入的值是数组
   - **先对数组的方法进行重写**，因为push、pop、shift、unshift、reverse、sort、splice，因为这些方法会改变数组本身。
   - 然后通过调用**observeArray**方法，使数组里的引用类型定义成响应式，实际上就是通过遍历数组对每一项进行observe函数进行处理



## 8. 闭包在Vue中的使用

​	在definedReactive中，通过使用Object.definedProperty方法定义对象属性，当获取对象属性值时，返回的是上一个作用域的变量的值，即defiendReactive的值，所以defiendReactive函数不会被销毁



## 9. Vue2中性能缺点

​	vue2应用了defineProperty需要一加载的时候，就进行递归操作，所以耗费性能，如果层次过深也会浪费性能。

> 性能优化原则：

1. 不要把所有的数据都放在data中，因为所有数据都会增加get和set
2. 不要写数据的时候 层次过深，尽量扁平化数据
3. 不要频繁获取数据，因为每次获取数据都会触发getter函数的逻辑
4. 如果数据不需要响应式，可以使用Object.freeze冻结属性。



## 10. 数组为什么不用defineProperty进行响应式处理

​	数组也可以使用defineProperty,但是我们很少采用 `arr[i] = xxx`，如果数组也使用了defineProperty还是可以实现修改索引触发更新的，但是这种操作概率低，所以源码没有采用这种方式。

​	所以数组修改索引不会导致视图更新，修改length也不会更新。

​	但是是vue3中为了兼容proxy，内部对数组用的就是defineProperty

## 11. 数组方法是如何重写的？

1. 会先调用数组原生的方法（通过apply方法改变this的指向）
2. 然后对于可以新增元素的方法（即push、unshift、splice），对其新增的元素通过observeArray方法进行数据劫持



## 12 .defineProperty中除了get和set还有什么属性？

- `enumrable`: 是否可枚举
- `writable`：值是否可修改
- `configurable`: 描述属性是否配置，以及是否删除

​	在已观测过的数据上增加`__ob_`属性， 其作用就是标识对象是否被观测过。其值为`Observe`类的实例

​	为了避免在`this.walk`方法中造成无限递归，所以使用`enumrable`的属性设置`__ob__`设置为不可枚举。



## 13. Vue中初始化完成后，如何进行挂载呢？

:::tip

​	在vue中，通过调用`Vue.prototpe.$mount`方法进行数据的挂载。

:::

在`$mount`中，主要进行了一下操作：

1. 通过传入的`el`属性，获取页面真实的元素
2. 先判断用户是否传入render函数
   - 存在render, 使用传入的render
   - 不存在render， 判断是否存在传入的template
     - 存在template，直接使用template
     - 不存在template，通过compileToFunction的方法将传入的el.outerHTML编译成render函数
3. 获取render函数后， 通过mountComponent方法进行挂载。在方法中，主要通过调用render方法生成虚拟节点vnode, 传入render函数中调用的方法，`_c`、、、



## 14. Vue中如何进行模板编译的？

:::tip

​	当Vue完成初始化阶段后，通过`$mount`的方法进入模板编译阶段。会去先判断是否存在render, 再去判断是否存在template，如果都没有，则会将传入的el元素通过outerHTML转为template 再将template编译成render函数，这其中通过`compileToFunction`进行转化

:::

> compileToFunction具体操作：

1. 将template模板变成ast语法树 （parseHTML）



## 15. Vue初始化过程？

1. 默认会调用`vue_init`方法将用户的参数挂载到`$option`选项中
2. vue会根据用户的参数进行数据的初始化 `props、computed、watch`，会获取到对象作为数据，可以通过`vm._data`方法访问到用户的数据
3. 对数据进行观测：对象（递归使用defineProperty）、数组（方法重写）
4. 将数据代理到vm上
5. 判断用户是否传入了el属性，内部会调用`$mount`方法，此方法也可以用户自己调用
6. 对模板的优先级处理 render/template/ outerHTML
7. 将模板那编译成函数，parseHTML解析模板 -> ast语法树，解析语法树生成code -> render函数
8. 通过render方法，生成虚拟dom + 真实的数据 =》真实dom（`vm._render`方法，render函数转虚拟节点）
9. 根据虚拟节点渲染真实节点（`vm._updata`）



## 16. render函数为什么用with函数包裹？

​	通过with函数传递作用域，获取变量的值时，可以通过上层作用域获取值。



## 17. 有了vnode之后如何生成真实dom （patch）

:::tip

​	通过`vm._render`方法创建vnode后，通过调用`vm._update`方法进行生成真实节点。`vm._update`函数在lifecycleMixin中定义，其`_update`方法主要通过`patch`方法将vnode生成真实dom

:::

> patch方法

1. 删除老节点，根据vnode创建新节点，替换掉老节点



## 18. 看源码思路

1. 先找package.json 找到 scripts.build
2. 找到打包时采用的入口方便分析 esm cjs / runtime 、compiler、full
3. 找到打包入口，文件在



## 19.如何将template转换成AST语法树 `parserHTML`

:::tip

​	在`$mount`的方法中会通过`compilerTounctionn`将`template`转换成`render`函数，会先通过`parserHTML`将`template`转换成`AST`语法树

:::

> parserHTML方法发生了什么？

parserHTML方法主要通过正则匹配构建ast语法树：

- `attribute` : 匹配标签属性正则
- `ncname` : 匹配标签名正则
- `qnameCapture`： 匹配命名空间正则
- `startTagOpen`: 匹配开始标签的前半部分
- `startTagClose`: 匹配开始标签的右尖部分
- `endTag`： 匹配尾标签： `/>` 或`>`
- `doctype`: 匹配`!DOCTYPE`
- `comment`: 匹配注释
- ` defaultTagRE`: 匹配双大括号，`{{xxx}}`

**思路**： 通过不停地截取模板，直到把模板全部解析完毕

1. 通过while循环，通过`advance`方法，将匹配到的内容从字符串中截取。获得匹配信息后通过栈来构建树形结构

2. 先获取`<`在html的位置，如果位置index为0，则证明是开始标签或者是结束标签

   - 如果匹配到开始标签

     - 首先通过`parseStartTag`获取匹配后的`match`信息

       1. 构造一个`match`对象, 其包含`tagName`： 标签名、`attrs`： 属性等信息。
       2. 然后通过循环匹配到属性信息，放入`match`对象中。
       3. 然后通过匹配到尾标签，通过`advance`截取。
       4. 最后返回`match`对象信息

     - 将`match`信息放到`start`方法处理

       1. 遇到开始标签，就取栈中的最后一个作为父节点

       2. 如果root为null，则说明当前节点为根节点，便把当前节点构造为一个root。

          ```js
          root = {
          	tag,
              type:1, // 元素
              children:[],
              p
          }
          ```

       3. 并维护元素的`parent`属性，和维护父元素的`children`属性。

   - 如果是结束标签

     - 将匹配到的信息放到`end`方法中处理， 就是把栈中的元素pop出去。

3. 如果匹配到文本，通过`text`方法处理， 直接接入到栈中最后一个元素的最后一项的children属性中。



## 20. vue3的模板编译原理与vue2的区别

​	vue3的编译原理比vue2里好很多，没有这么多正则。



## 21. 如何通过ast语法树生成模板字符串？ `generate`

:::tip

​	通过调用调用`compileToFunction`的方法将`tamplate`生成`render`函数，在函数中会先通过`parseHTML`生成ast语法树，ast语法树构建完成之后，会通过`generate`方法，将ast语法树构建成模板字符串。

:::

> generate方法具体发生了什么？

实际上genrate函数就是通过传入的ast语法树，进行字符串的拼接形成模板字符串。

- `_c`： 创建元素， `_c(标签名，属性，子元素)`
- 对于子元素的处理，就通过`genChildren`的方法递归调用generate的方法
- 对于文本节点处理： 
  1. 用`_v('文本内容')`
  2. 通过循环匹配表达式正则，处理`{{ xxx }}`的情况，需要将xxx表达式转换成普通值，即将表达式用`_s()`进行包裹。



## 22. 如何将模板字符串转化成render函数呢？

:::tip

​	通过`$mount`方法进入vue的挂载阶段，会先去判断options中有没有`render`，再去判断有没有`template`，如果没有`template`，则将`el.outerHTml`转换为`template`，最后通过`compilerToFunction`方法将`template`转换为`render`函数，其中函数会先去调用`parseHTML`方法转化为`AST`语法树，然后再通过`generate`方法将`AST`语法树转换为模板字符串，最后通过`new Function`妆化为`render`函数

:::

> new Function发生了什么？

`let render = new Function(with(this){return ${模板字符串}})`



## 23. 如何通过render构建成虚拟Dom, `_render`

:::tip

​	通过`parseHTML`获取ast语法树之后，通过递归调用`generate`构建模板字符串，再通过`new Function + with`的方法构建成render函数，最后获得的函数为`_c('标签名'， 属性，子元素)`， 主要通过`mountComponent`的方法对render方法进行调用，而`_render`方法主要在`renderMixin`的函数中进行原型上的挂载。

:::

> `renderMixin`函数是如何定义`render`的呢？

​	`mountComponent`函数主要就是对render方法的调用，而`vm._render`方法是在`renderMixin`的函数中在Vue原型挂载`_render`方法。

在`renderMixin`的函数中除了定义`render`方法，还定义了诸多方法：

- `_c` : 创建元素型的节点, 实际上是调用`createElement`方法返回虚拟节点
- `_v`： 创建文本型的节点， 实际上是调用`createText`方法返回虚拟节点
- `_s`: JSON.stringify

`_render`方法中核心就是执行render方法， 传入`_c`、`_v`、`_s`等函数。

其中`createElement`、`createText`等方法实际就是通过传入不同的参数，实例化`Vnode`的方法，创建 不同的虚拟DOM。

> 虚拟DOM结果如下：

```js

export default class VNode {
  // ...
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
}
```



## 24. 为什么有了ast语法树，还需要vnode呢？

​	其实vnode其实就是一个对象，用来描述节点的，这个和ast语法树长得很像啊？

​	ast语法树描述语法的，它并没有用户自己的逻辑，只是语法解析出来的内容。

​	vnode，它是描述dom结构的，可以扩展属性。



## 25. 虚拟节点如何去渲染成真实节点呢？ `_update`

:::tip

​	通过`compilerToFunction`将`template`转换成`render`函数后，通过调用`mountComponent`的方法，去运行render函数，将render函数转换为虚拟节点，实际就是执行render函数中的`_c、_v、_s`等方法，而这些方法实际上就是通过传入不同的参数，实例化`VNode`的一个类，创建虚拟节点。当创建完虚拟节点后，还需要在`mountComponent`方法中，调用`vm._update`的方法进行实例的挂载。

:::

​	通过`_render`方法构建好虚拟节点后，通过`_update`方法将虚拟节点变成真实节点。

​	而`_update`方法，在`lifecycleMixin`函数中挂载到`Vue`的原型上的。其核心思想就是，采用的是先序深度遍历，创建节点（也就是遇到节点就创建节点，递归创建）。

核心通过`patch`方法将虚拟节点转换为真实节点。

`patch`方法需要传入两个参数: 

- oldVnode : 旧节点
- Vnode : 新节点

`patch`方法就是主要通过删除老节点oldVnode，根据vnode创建新节点，替换掉老节点。

1. `patch`方法先通过`createElm`方法通过虚拟节点vnode创建真实节点。
2. 通过`nextSibing`方法获取旧节点的下一个节点
3. 然后通过`insertBefore`方法，将新创建的元素插入到旧节点下一个元素的前面 。如果通过`nextSibing`获取的值为null，则`insertBefore`就相当于`appendChild`
4. 然后通过`removeChild`的方法将旧节点删除掉。



## 26. 如果通过虚拟vnode创建元素呢？ `createElm`

1. 如果是元素节点，先通过`document.createElement`方法创建元素，如果该vnode还具有`children`属性，则通过递归调用`createElm`方法创建子节点， 并通过`appendChild`方法将子节点添加入元素中。
2. 并且在vnode上添加el属性（`vnode.el`），让虚拟节点和真实节点做一个映射关系，后续某个虚拟节点更新了，可以跟踪真实节点，并更新真实节点。
3. 对于元素的属性等，通过`updateProperties`方法进行处理，通过循环调用`setAttribute`方法添加属性。样式等处理后续完善。



## 27. vue更新阶段是怎么做的？

:::tip

​	从调用`_init`的方法进行初始化，然后调用`$mount`的方法进行挂载，先通过`compilerToFunction`方法将`template`转化为`render`函数，然后通过调用`_render`方法将`render`函数转化为`vnode`, 最后通过`patch`方法对`vnode`生成真实dom进行过载。

:::

- 只有根组件的情况： （每个属性都有一个dep）
  1. vue里面用到了观察者模式，默认组件渲染的时候，会创建一个watcher，（并渲染视图）
  2. 当渲染视图的时候，会取date中的数据，会走每个属性的get方法，就让这个属性的dep记录watcher
  3. 同时让watcher也记住dep，（dep和watcher是多对多的关系，因为一个属性可能对应多个视图，一个视图对应多个数据）
  4. 如果数据发生变化，会通知对应的属性的dep，依次通知存放的watcher去更新。



## 28. vue中对象是如何更新的？

> 核心思路

- **一个属性对应一个dep**: 一个属性可以在A组件和B组件里使用, 所以一个属性对应一个dep
- **一个dep对应多个watcher**： dep里存了A组件的watcher和B组件的watcher,所以一个dep对应斗个watcher
- **一个watcher可以对应多个dep**： 视图有多个数据，多个数据对应多个dep，所以一个watcher可以有多个dep

:::tip

可以理解 为： 一个组件对应一个watcher， 而watcher的目的就是用于更新。

:::



:::tip

​	当通过`compilerToFunction`方法生成render方法后，实际是通过`vm._update(vm._render)`执行，进行挂载，而源码中该函数执行即为`updateComponent`中。所以更新逻辑主要就是通过调用`updateComponent`执行。所以对象更新的核心思路就是： 如果数据变化了，可以调用`updateComponent`方法。所以可以借助`watcher`的概念，如果数据变了可以自动调用`updateCompoent`方法

:::

> 函数主要通过mountComponent方法进行更新挂载：

1. 初始化的时候通过调用`updateComponent`方法，即`vm._update(vm._render)`方法进行更新
2. 然后通过实例化渲染Watcher， 当数据变化的时候，调用`updateComponent`方法



## 29. vue中的更新逻辑和发布订阅有啥区别

发布订阅是手动触发更新，而vue则是自动触发更新的。



## 30. Watcher类是如何实现的？

- Watcher更新时，传入五个参数

  - `vm`: vue实例
  - `expOrFn`： 页面渲染逻辑
  - `cb` : 回调函数
  - `options`: 
  - `isRenderWatcher`: 是否为渲染Watcher
- 传入参数后，进行参数处理

  - `this.getter = fn` ：fn就是页面渲染逻辑
- 然后调用get方法，进行初始化`Watcher`。
  1. 调用`pushTarget`, 将当前Watcher放入到`Dep.target`中，用于依赖收集。
  2. 调用`this.getter`方法， 进行渲染逻辑
  3. 这样就可以保证之后当前渲染到的属性才能获取到当前的`Watcher`
- 当收集依赖的时候，会调用到`addDep`方法
  1. 其中维护着一个数组newDepIds， 用于Dep去重
  2. 然后把传入的Dep加入到`newDeps`中将Dep存储起来
  3. 然后通过调用`dep.addSub`的方法，将当前的`Watcher`存储入`Dep`的`subs`数组中。



## 31. Dep类是如何实现的？

1. Dep的属性：

   - `subs`: 用于存放`Watcher`的数组
   - `id` : 用于做唯一标识
   - `target`： 表示当前依赖的目标是谁（哪个Watcher）

2. 当用户取属性时，会触发`depend`的方法，调用`Watcher`即`Dep.target`的`addDep`方法， 用于`Dep`去重，然后Watcher存储当前dep , 然后调用`addSub`方法。
  
2. 当调用`addSub`方法，就是将当前Watcher存入`subs`数组中
  
   

## 32. 依赖收集的过程？`Dep.append`

:::tip

​	进行数据初始化的时候，如果是传入的值是对象的话通过调用`walk`方法，循环调用`defineReactive`方法对每个属性继续数据劫持。所以要为每个属性增加Dep的话，可以在`defineReactive`中定义。

:::

1. 页面更新的时候，会调用`mountComponent`的方法，在该方法中会在实例化一个渲染`Watcher`, 然后调用`Watcher`中的`get`方法，主要做以下工作：
   - 调用`pushTarget`， 将当前`Watcher`放到`Dep.target`的属性中
   - 然后调用`updateComponent`的方法，进行初渲染
   - 然后通过`popTarget`，重置`Dep.target`的值
2. 当用户取值时， 会调用`defineProperty`的`get`方法，这时触发`Dep.append`
3. 在`Dep.append`的方法中，会调用`Dep.target`（即`Watcher`）的addDep方法进行收集Watcher
4. 而`Watcher.addDep`方法，会通过id的方法，用Set的数据结构先对Dep进行去重，然后将`dep`收集到`newDeps`数组中，然后调用`Dep.addSub`方法，将当前Watcher放到`Dep.subs`数组中
5. 这样dep就收集到了多个`Watcher`, 而`Watcher`也收集到了`Dep`



## 33. 依赖收集后，数据该如何进行更新呢？`Dep.notify` `Watcher.update`

:::tip

​	用户取数据后，会调用`defineProperty`的get方法，进行依赖收集，即`Dep`获取多个`Watcher`, `Watcher`也获取了多个`Dep`

​	当用户修改数据的时候，会调用`Dep.notify`方法，进行数据更新。

:::

> notify实现逻辑？

```js
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
```

​	实际上的操作就是，通过循环`subs`数组中收集的`Watcher`，调用`Watcher`中的`update`方法， 实际上就是调用`Watcher`的`get`方法，进行渲染（`updateComponent`）

​	再`update`方法中可以做异步更新逻辑。



## 34. 如何实现vue的异步更新逻辑？`queueWatcher`

:::tip

​	当用户更新数据时，会调用`defineProperty`中的`set`方法，设置值后，会调用`Dep.notify`方法，进行循环调用`Watcher`中的`update`方法。

​	由于每次更新数据都会调用这个update方法，我们可以将更新的逻辑缓存起来，等到同步更新数据的逻辑执行完毕后，依次调用（含有去重逻辑）

:::

每次更新调用`update`方法，都会执行其`queueWatcher`方法

- **去重**： 维护着`has`数组，用于存储已有的`Watcher`的`id`， 用`has[id] == null`来判断是否重复
- **缓存**： 通过维护则`queue`队列，每次把`watcher`都存放入`queue`队列当中。
- **防抖**: 通过维护着`waitting`变量，默认值为false，只有清空`queue`中的watcher才会设置为`true`
- **异步**： 当`waitting`变量为`fasle`， 才会设置nextTick，清空queue队列，然后执行`flushSchedulerQueue`的方法，实际就是遍历每个watcher执行其`run()`的方法。



## 35. vue3和vue2中nextTick的区别？

vue3里面的nextTick就是promise, vue2里面做了一些兼容性处理



## 36. nextTick是如何实现的？

:::tip

​	当用户更新的时候，会调用`Dep.notify`方法，将`Dep`中的每一个`Watcher`的`update`方法，而`update`实际就是调用`queueWatcher`的方法，去对watcher进行去重、缓存、节流和异步执行，而异步执行就是调用`nextTick`的方法实现的。

:::

​	但是`nextTick`的方法，有vue内部的，用户也可以通过`$nextTick`方法进行定义。

​	所以，nextTick中也维护着一个`pending`变量，用于对nextTick多次执行，只调用一次。

​	并且维护着一个数组`callbacks`, 存放着调用`nextTick`所有的回调函数，等同步代码执行完再调用`flushCallbacks`方法进行异步执行，清空`callbacks`数组。即多次nextTick，只执行一次`then`方法



## 37.数组如何依赖收集？数组更新时，又如何触发更新？

:::tip

​	对数据进行响应式观测的时候，会调用`observe`的方法进行观测，然后在`observer`方法中，进行`new Observer`实例化

:::

> 数组依赖收集

1. 在实例化`Observer`类的时候，添加`dep`属性，值为`new Dep`
2. 当取属性值时，会调用`defineProperty`的`get`方法，在get方法中，调用数组或对象的Observer实例上的`dep.depend()`进行依赖收集
3. 如果是数组中嵌套着数组，通过调用`dependArray`方法，遍历数组每一项，调用`__ob__`的`dep.depend`方法，进行依赖收集，再递归调用`dependArray`。

```js
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
```

> 数组触发更新

:::tip

​	对于数组的响应式处理，是通过重写数组的七个方法进行处理的，只需要在重写的方法中，再调用数组本身的`dep.notify`方法。

:::



## 38. vue的响应式原理

1. 默认vue在初始化的时候，会对对象每个属性都进行劫持，增加dep属性，当取值的时候会做依赖收集
2. 默认还会对属性值是对象和 数组的本身进行增加dep属性，进行依赖收集
3. 如果属性变化，触发属性对应的dep去更新
4. 如果是数组更新，触发数组的本身的dep 进行更新
5. 如果取值的时候是数组还要让数组中的对象类型也进行依赖收集（递归依赖收集）
6. 如果数组里面放对象，默认对象里的属性是会进行依赖收集的，因为在取值时，会进行`JSON.stringify`操作。



## 39. vue中的生命周期是如何实现的？



## 40 Vue.mixin方法的实现？

:::tip

`Vue.mixin`:全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。

:::

```js
  Vue.mixin = function (mixin: Object) {
    /* 合并选项 */
    this.options = mergeOptions(this.options, mixin)
    return this
  }
```

​	通过`mergeOptions`将传入的`mixin`对象与`this.options`合并，然后将合并后的新对象作为`this.options`传给之后的所有`Vue`实例

 

## 41. vue中声明周期如何触发钩子函数 `callHook`

> 简易版的实现

```js
function callHook (vm, hook) {
	let handlers = vm.$options[hook];
    handlers && handlers.forEach(item => {
        item.call(vm); // 生命周期的this永远指向实例
    })
}
```

1. 先在`vm.$options`找到对应的钩子函数
2. 然后通过`forEach`循环调用



## 42. vue Diff算法如何实现？

:::tip

​	通过`patch(oldVnode, newVnode)`，比对两个虚拟节点的差异，更新需要更新的地方。

​	当`oldVnode`是真实元素，实际走的是一个初始化流程，否则才走diff算法流程

:::

1. 通过调用`sameVnode`方法，判断新旧节点的`key`和`tag`值，判断是否是同一个节点



## 43. diff算法中有啥性能问题？

​	因为diff只是同级的比对，但整颗diff树中，只有一个节点发生变化，需要递归整棵diff树进行比对，会有性能的损耗。

​	而vue3中会把动态节点（做标记）抽离到一个数组中，当diff比对时，只需要对数组中的元素进行处理即可。



## 44. 为什么用类来检测数据变化，而不是使用对象

​	类具有类型，可以知道谁是谁的实例，而对象没有类型，如果需要知道一个对象有没有监控过，只需要看是否是Observer的实例即可，而且方便扩展



## 45. 
