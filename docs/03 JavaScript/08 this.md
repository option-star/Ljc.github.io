---
title: JS08 this
date: 2022-03-19
sidebar: 'auto'
categories:
- 03JavaScript
isShowComments: true
---

## 1. 对this对象的理解

this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。



### 1. 全局上下文

​	全局上下文中的this: window

### 2. 块级上下文

​	块级上下文中没有自己的this, 所用this都是继承上级上下文中的this[类似箭头函数]

### 3. 事件绑定

1.   DOM0

```js
xxx.onxxx = function(){}
```

2.   DOM2

```js
// 不兼容IE678
xxx.addEventListener('xxx', function(){})
// 兼容IE678
xxx.attachEvent('onxxx',function() {})
```

​	给当前元素的某个事件行为绑定方法[此时是创建方法，方法没有执行]，当事件行为触发，浏览器会把绑定的函数执行，此时函数中的this -> 当前元素对象。

::: warning

注意： 基于`attachEvent`实现事件绑定，方法执行，方法中的this是window。

```js
document.body.addEventListener('click', function() {
    console.log(this); // <body></body>
})
```

![image-20211111084115674](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057659.png)

:::

### 4. 函数执行

```js
// "use strict" // 开启JS严格模式（默认是非严格模式）
function fn() {
    console.log(this);
}

let obj = {
    name: "ljc",
    fn
}
/* 普通函数执行 */
fn(); // window/undefined
obj.fn(); // obj

/* 括号表达式 */
(10, obj.fn)(); // this -> window/undefined

/* 函数表达式 */
var fn = function() {
    console.log(this);
}
fn(); // this -> window

/* 自执行函数 */
(function (x) {
    console.log(this); // this -> window/undefined
})(10)

/* 回调函数 */
function fn(callback) {
    // callback -> 匿名函数
    callback(); // window/undefined
}
fn(function () {
    console.log(this);
})
```

#### 4.1 普通函数执行

​	看函数执行前是否有点，"点"前面是谁this就是谁, 没有"点"，this是window。[严格模式下是undefined]

#### 4.2 匿名函数执行

##### 4.2.1 函数表达式

等同于普通函数或事件绑定机制

##### 4.2.2 自执行函数

-   非严格模式： window
-   严格模式： undefined

##### 4.2.3 回调函数

​	把一个函数A作为实参，传递给另外一个执行函数B[在B函数执行中，可以把A执行]

-   如果另外函数执行中，对回调函数的执行做了特殊处理，以自己处理的为主。例如： call、bind
-   一般情况下，非严格模式下为window,严格模式为undefined

##### 4.2.4 括号表达式

​	小括号中包含“多项”，这样也只取最后一项，但是this受影响。

-   非严格模式: window
-   严格模式: undefined

### 练习

#### （1）

```js
var x = 3, // 12
    obj = {x : 5}
obj.fn = (function () {
    this.x *= ++x; 
    return function(y) {
        this.x *= (++x)+y; 
        console.log(x); 
    }
})() 
var fn = obj.fn;
obj.fn(6);
fn(4); 
console.log(obj.x, x); 
```

![image-20211111085254260](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111110852296.png)

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057800.png)

#### （2）

```js
var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);
obj.fn(10);
console.log(num, obj.num);
```

![image-20211111085525967](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057823.png)

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057690.png)

#### （3）

```js
/*
 * EC(G)
 *   变量提升:-- 
 * ----VO(G)
 *   obj = 0x000
 *   fn = 0x001
 */
let obj = {
    // fn:0x001
    fn: (function () {
        /* 
         * EC(AN)
         *   作用域链:<EC(AN),EC(G)>
         *   初始THIS:window
         *   形参赋值:--
         *   变量提升:--
         */
        return function () {
            console.log(this);
        }; //return 0x001; [[scope]]:EC(AN)
    })()
};
obj.fn(); //this->obj 
let fn = obj.fn;
fn(); //this->window 
```

![、7](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111110906888.png)

#### （4）

```js
var fullName = 'language'; //window.fullName='language'
var obj = { //window.obj=0x000
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            return this.fullName;
        }
    }
};
console.log(obj.prop.getFullName()); //this->obj.prop   ->obj.prop.fullName  ->undefined
var test = obj.prop.getFullName;
console.log(test()); //this->window   ->window.fullName  ->'language'
```

![image-20211111091550233](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057071.png)

#### （5）

```js
var name = 'window';
var Tom = {
    name: "Tom",
    show: function () {
        // this->window
        console.log(this.name); //->'window'
    },
    wait: function () {
        // this->Tom
        var fun = this.show; //fun=Tom.show
        fun();
    }
};
Tom.wait(); 
```

![image-20211111091633849](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057094.png)

#### （6）

```js
window.val = 1; //val是GO的属性，“也可以说”是全局变量「val=100 / window.val=100」
var json = {
    // val是json对象的一个属性「json.val」
    val: 10,
    dbl: function () {
        this.val *= 2;
    }
}
json.dbl();
// this->json
// json.val *= 2  =>  json.val=json.val*2  => json.val=20
var dbl = json.dbl;
dbl();
// this->window
// window.val *= 2  =>  window.val=2
json.dbl.call(window);
// this->window 基于call方法强制改变方法中的this是window
// window.val *= 2  => window.val=4
console.log(window.val + json.val); //=>“24” 
```

![image-20211111091754950](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057250.png)

#### （7）

```js
(function () {
    // this->window
    var val = 1;
    var json = {
        val: 10,
        dbl: function () {
            // this->json
            // val不是json.val，是其上级上下文中的val变量
            val *= 2;
        }
    };
    json.dbl();
    console.log(json.val + val); //=>“12”
})(); 
```

![image-20211111091858470](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203202057097.png)





## 2. call()和apply()的区别

- **作用相同**
- **参数不同**
  - apply两个参数，一个this指向，一个参数数组
  - call参数不固定，一个this执行，另外都是传入的参数
