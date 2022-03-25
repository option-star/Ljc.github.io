---
title: VUE02: Vue基础
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
2. 如果传入的值是对象， 通过调用`walk`方法，循环遍历对象，通过`defineReactive`方法重新定义属性
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
