---
title: js面试
date: 2021-11-11
sidebar: 'auto'
tags:
- js
categories:
- JavaScript
isShowComments: true
---


## 1 数据类型

### 1.1 JS原始数据类型有哪些？引用数据类型有哪些？

原始数据类型：

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

其中 Symbol 和 BigInt 是ES6 中新增的数据类型：

- Symbol 代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现的全局变量冲突的问题。
- BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

- 栈：原始数据类型（Undefined、Null、Boolean、Number、String）
- 堆：引用数据类型（对象、数组和函数）

两种类型的区别在于**存储位置的不同：**

- 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区：

- 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
- 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收。



### 1.2 说出下面运行的结果，解释原因。

```js
function test(person) {
  person.age = 26
  person = {
    name: 'hzj',
    age: 18
  }
  return person
}
const p1 = {
  name: 'fyq',
  age: 19
}
const p2 = test(p1)
console.log(p1) // -> ?
console.log(p2) // -> ?
```

结果：

```js
p1：{name: “fyq”, age: 26}
p2：{name: “hzj”, age: 18}
```

解释：

> 原因: 在函数传参的时候传递的是对象在堆中的内存地址值，test函数中的实参person是p1对象的内存地址，通过调用person.age = 26确实改变了p1的值，但随后person变成了另一块内存空间的地址，并且在最后将这另外一份内存空间的地址返回，赋给了p2。

### 3. null是对象吗？为什么？

结论: null不是对象。

解释: 虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object 。

```javascript
000: object   - 当前存储的数据指向一个对象。
  1: int      - 当前存储的数据是一个 31 位的有符号整数。
010: double   - 当前存储的数据指向一个双精度的浮点数。
100: string   - 当前存储的数据指向一个字符串。
110: boolean  - 当前存储的数据是布尔值。
```



### 4. '1'.toString()为什么可以调用？

其实在这个语句运行的过程中做了这样几件事情：

```js
var s = new Object('1'); // 1. 创建Object类实例
s.toString(); // 2. 调用实例方法
s = null; // 3. 销毁实例
```

### 5. 0.1+0.2为什么不等于0.3？

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。

### 6. 如何理解BigInt?

#### 什么是BigInt?

> BigInt是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们安全地对`大整数`执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

#### 为什么需要BigInt?

​	在JS中，所有的数字都以双精度64位浮点格式表示，所以这就导致JS中的Number无法表示非常大的整数，它会将非常大的整数四舍五入，确切来说，只能安全地表示-(2^53^-1)和2^53^-1，任何超出此范围的整数值都可能失去精度。

#### 如何创建并使用BigInt?

要创建BigInt，只需要在数字末尾追加n即可。

```js
console.log( 9007199254740995n );    // → 9007199254740995n	
console.log( 9007199254740995 );     // → 9007199254740996
```

另一种创建BigInt的方法是用BigInt()构造函数

```js
BigInt("9007199254740995");    // → 9007199254740995n
```

简单的使用如下：

```js
10n + 20n;    // → 30n	
10n - 20n;    // → -10n	
+10n;         // → TypeError: Cannot convert a BigInt value to a number	
-10n;         // → -10n	
10n * 20n;    // → 200n	
20n / 10n;    // → 2n	
23n % 10n;    // → 3n	
10n ** 3n;    // → 1000n	

const x = 10n;	
++x;          // → 11n	
--x;          // → 9n
console.log(typeof x);   //"bigint"

```

#### 值得警惕的点

1. BigInt不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js代码。
2. 因为隐式类型转换可能丢失信息，所以不允许在bigint和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由BigInt或Number精确表示。

```js
10 + 10n;    // → TypeError
```

3. 不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。

```js
Math.max(2n, 4n, 6n);    // → TypeError
```

4. 当 Boolean 类型与 BigInt 类型相遇时，BigInt的处理方式与Number类似，换句话说，只要不是0n，BigInt就被视为truthy的值。

```js
if(0n){//条件判断为false

}
if(3n){//条件为true

}
```

5. 元素都为BigInt的数组可以进行sort。
6. BigInt可以正常地进行位运算，如|、&、<<、>>和^

#### 浏览器兼容性

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211348361.webp)

其实现在的兼容性并不怎么好，只有chrome67、firefox、Opera这些主流实现。



### 7. null和undefined的区别

​	首先 Undefined 和 Null 都是基本数据类型，这两个基本数据类型分别都只有一个值，就是 undefined 和 null。

​	undefined 代表的含义是**未定义**，null 代表的含义是**空对象**。一般变量声明了但还没有定义的时候会返回 undefined，null主要用于赋值给一些可能会返回对象的变量，作为初始化。

​	undefined 在 JavaScript 中不是一个保留字，这意味着可以使用 undefined 来作为一个变量名，但是这样的做法是非常危险的，它会影响对 undefined 值的判断。我们可以通过一些方法获得安全的 undefined 值，比如说 void 0。

​	当对这两种类型使用 typeof 进行判断时，Null 类型化会返回 “object”，这是一个历史遗留的问题。当使用双等号对两种类型的值进行比较时会返回 true，使用三个等号时会返回 false。



### 8. 如何获取安全的undefined的值？

​	因为 undefined 是一个标识符，所以可以被当作变量来使用和赋值，但是这样会影响 undefined 的正常判断。表达式 void ___ 没有返回值，因此返回结果是 undefined。void 并不改变表达式的结果，只是让表达式不返回值。因此可以用 void 0 来获得 undefined。









## 2 数据类型检测

### 1. typeof 是否能正确判断类型？

对于原始类型来说，除了 null 都可以调用typeof显示正确的类型。

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```

但对于引用数据类型，除了函数之外，都会显示"object"。

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

因此采用typeof判断对象数据类型是不合适的，采用instanceof会更好，instanceof的原理是基于原型链的查询，只要处于原型链中，判断永远为true

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str1 = 'hello world'
str1 instanceof String // false

var str2 = new String('hello world')
str2 instanceof String // true
```

### 2. instanceof能否判断基本数据类型？

能。比如下面这种方式？

```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(111 instanceof PrimitiveNumber) // true
```

其实就是自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。

### 3. 能不能手动实现一下instanceof的功能？

核心：原型链的向上查找。

```js
function myInstanceof(left, right) {
    //基本数据类型直接返回false
    if(typeof left !== 'object' || left === null) return false;
    //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left);
    while(true) {
        //查找到尽头，还没找到
        if(!proto) return false;
        //找到相同的原型对象
        if(proto == right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
```

### 4. Object.js和===的区别？

Object在===的基础上修复了一些特殊情况下的失误，具体来说就是+0和-0，NaN和NAN。

源码如下：

```js
function is(x, y) {
  if (x === y) {
    //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x !== x && y !== y;
  }
```

### 5. 数据类型检测的方式有哪些？

#### 1. typeof

```js
console.log(typeof 2);               // number
console.log(typeof true);            // boolean
console.log(typeof 'str');           // string
console.log(typeof []);              // object    
console.log(typeof function(){});    // function
console.log(typeof {});              // object
console.log(typeof undefined);       // undefined
console.log(typeof null);            // object
```

其中数组、对象、null都会被判断为object，其他判断都正确。

#### 2. instanceof

`instanceof`可以正确判断对象的类型，**其内部运行机制是判断在其原型链中能否找到该类型的原型**。

```js
console.log(2 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false 
console.log('str' instanceof String);                // false 
 
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true
```

可以看到，`instanceof`**只能正确判断引用数据类型**，而不能判断基本数据类型。`instanceof` 运算符可以用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype` 属性。

#### 3. constructor

```js
console.log((2).constructor === Number); // true
console.log((true).constructor === Boolean); // true
console.log(('str').constructor === String); // true
console.log(([]).constructor === Array); // true
console.log((function() {}).constructor === Function); // true
console.log(({}).constructor === Object); // true
```

`constructor`有两个作用，一是判断数据的类型，二是对象实例通过 `constrcutor` 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了：

```js
function Fn(){};
 
Fn.prototype = new Array();
 
var f = new Fn();
 
console.log(f.constructor===Fn);    // false
console.log(f.constructor===Array); // true
```

#### 4. Object.prototype.toString.call()

`Object.prototype.toString.call()` 使用 Object 对象的原型方法 toString 来判断数据类型：

```js
var a = Object.prototype.toString;
 
console.log(a.call(2));
console.log(a.call(true));
console.log(a.call('str'));
console.log(a.call([]));
console.log(a.call(function(){}));
console.log(a.call({}));
console.log(a.call(undefined));
console.log(a.call(null));
```

同样是检测对象obj调用toString方法，obj.toString()的结果和Object.prototype.toString.call(obj)的结果不一样，这是为什么？

这是因为toString是Object的原型方法，而Array、function等**类型作为Object的实例，都重写了toString方法**。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串…），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object原型上的toString方法。

### 6. 判断数组的方式有哪些

- 通过Object.prototype.toString.call()做判断

```javascript
Object.prototype.toString.call(obj).slice(8,-1) === 'Array';
```

- 通过原型链做判断

```javascript
obj.__proto__ === Array.prototype;
```

- 通过ES6的Array.isArray()做判断

```javascript
Array.isArrray(obj);
```

- 通过instanceof做判断

```javascript
obj instanceof Array
```

- 通过Array.prototype.isPrototypeOf

```javascript
Array.prototype.isPrototypeOf(obj)
```



### 7. typeof NaN 的结果是什么？

NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

```javascript
typeof NaN; // "number"
复制代码
```

NaN 是一个特殊值，它和自身不相等，是唯一一个非自反（自反，reflexive，即` x === x` 不成立）的值。而 NaN !== NaN 为 true。

### 8. isNaN和Number.isNaN函数的区别？

- 函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会返回 true ，会影响 NaN 的判断。

- 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，不会进行数据类型的转换，这种方法对于 NaN 的判断更为准确。







## 3 数据类型转换

### 1. [] == ![] 结果是什么？为什么？

解析： 

​	==中，左右两边都需要转换为数字然后进行比较。[]转换数字为0，![]首先转换为布尔值，由于[]作为一个引用类型转换为布尔值为true。因此![]为false，进而再转换为数字，变为0。所以0 == 0，结果为true。

### 2. JS中类型转换有哪几种？

JS中，类型转换只有三种：

- 转换为数字
- 转换为布尔值
- 转换为字符串

转换具体规则如下：

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211544398)

### 3. == 和 === 有什么区别？

​	=== 叫做严格等于，是指：左右两边不仅值要相等，类型也要相等，例如`'1' === 1`的结果是false，因为一边是string，另一边是number。

​	== 不像===那样严格，对于一般情况下，只要值相等，就返回true，但`==` 还涉及一些类型转换，它的转换规则如下：

- 两边类型是否相同，相同的话就比较值的大小，例如1==2 ，返回false
- 判断的是否是null和undefined，是的话就返回true
- 判断类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
- 判断其中一方是否是Boolean，是的话就把Boolean转化为Number，再进行比较
- 如果一方为Object，且另一方为String、Number或者Symbol，会将Object转换为字符串，再进行比较。

```js
console.log({a: 1} == true);//false
console.log({a: 1} == "[object Object]");//true
```

### 4. 对象转原始类型是根据什么流程运行的？

对象转原始类型，会调用内置的[ToPrimitivel]函数，对于该函数而言，其逻辑如下：

1. 如果Symbol.toPrimitive()方法，优先调用再返回
2. 调用valueOf()，如果转换为原始类型，则返回
3. 调用toString()，如果转换为原始类型，则返回
4. 如果都没有原始类型，会报错

```js
var obj = {
  value: 3,
  valueOf() {
    return 4;
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  }
}
console.log(obj + 1); // 输出7
```

### 5. 如何让if(a === 1 && a == 2)条件成立？

其实就是上一个问题的应用。

```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2);//true
```

## 4 闭包

### 1. 什么是闭包

​	**闭包是指有权访问另一个函数作用域中变量的函数**，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

> 我的理解

​	闭包是一种机制，函数执行产生的私有上下文，一方面可以保护里面的私有变量不被污染，一方面如果不被释放，私有变量及相关信息也会被保存起来，把"保护" + "保存"的机制，称之为闭包。

### 2. 闭包产生的原因？

​	在ES5中只存在两种作用域——全局作用域和函数作用域，当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链。值得注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。 比如:

```js
var a = 1;
function f1() {
  var a = 2
  function f2() {
    var a = 3;
    console.log(a);//3
  }
}
```

在这段代码中，f1的作用域指向有全局作用域(window)和它本身，而f2的作用域指向全局作用域(window)、f1和它本身。而且作用域是从最底层向上找，直到找到全局作用域window为止，如果全局还没有的话就会报错。就这么简单一件事情！

闭包产生的本质就是，当前环境中存在指向父级作用域的引用。还是举上面的例子:

```js
function f1() {
  var a = 2
  function f2() {
    console.log(a);//2
  }
  return f2;
}
var x = f1();
x();
```

这里x会拿到父级作用域中的变量，输出2。因为在当前环境中，含有对f2的引用，f2恰恰引用了window、f1和f2的作用域。因此f2可以访问到f1的作用域的变量。

那是不是只有返回函数才算是产生了闭包呢？、

回到闭包的本质，我们只需要让父级作用域的引用存在即可，因此我们还可以这么做：

```js
var f3;
function f1() {
  var a = 2
  f3 = function() {
    console.log(a);
  }
}
f1();
f3();
```

让f1执行，给f3赋值后，等于说现在`f3拥有了window、f1和f3本身这几个作用域的访问权限`，还是自底向上查找，`最近是在f1`中找到了a,因此输出2。

在这里是外面的变量`f3存在着父级作用域的引用`，因此产生了闭包，形式变了，本质没有改变。



### 3. 闭包有哪些表现形式？

1. 返回一个函数
2. 作为函数参数传递
3. 在定时器、事件监听、Ajax请求、跨端口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
4. IIFE(立即执行函数表达式)创建闭包, 保存了`全局作用域window`和`当前函数的作用域`，因此可以全局的变量。

```js
var a = 2;
(function IIFE(){
  // 输出2
  console.log(a);
})();
```

### 4. 如何解决下面的循环输出问题？

```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
```

为什么会全部输出6？如何改进，让它输出1，2，3，4，5？(方法越多越好)



> 原因

因为setTimeout为宏任务，由于JS中单线程eventLoop机制，在主线程同步任务完后才会去执行宏任务，因此循环结束后setTimeout中的回调才依次执行，但输出i的时候当前作用域没有，往上一级再找，发现了i，此时循环结束，i变成了6，因此会全部输出6。

> 解决方法

1. 利用IIFE(立即执行函数表达式)当每次for循环时，把此时的i变量传递到定时器中

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

2. 给定时器传入第三个参数，作为timer函数的第一个函数参数

```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, 0, i)
}
```

3. 使用ES6中的let

```js
for(let i = 1; i <= 5; i++){
  setTimeout(function timer(){
    console.log(i)
  },0)
}
```

let让JS有函数作用域变为了块级作用域，用let后作用域链不复存在，代码的作用域以块级为单位，以上面代码为例：

```js
// i = 1
{
  setTimeout(function timer(){
    console.log(1)
  },0)
}
// i = 2
{
  setTimeout(function timer(){
    console.log(2)
  },0)
}
// i = 3
...
```

因此输出正确的答案

## 5 原型

### 1. `prototype`、`__proto__`

​	大部分“函数数据类型”的值都具备“`prototype`(原型/显式原型)”属性，属性值本身是一个对象，浏览器会为该对象开辟一个堆内存，用来存储当前类所属实例可以调用的公共的属性和方法，浏览器默认开辟的这个堆内存中[原型对象]有一个默认的属性“`construtor`(构造函数/构造器)”，属性值是当前函数/类本身。

​	每一个“对象数据类型值”都具备一个属性“`__proto__`（原型链/隐式原型）”，属性值指向“自己所属类的原型prototype”。



### 2. 能不能描述一下原型链？

​	对象会首先访问自己的私有属性，如果私有属性中是存在的，则直接使用私有的，如果访问成员在私有属性中没有，默认会基于`__proto__`找到所属类prototype上的属性/方法。如果所属类的prototype上没有，则继续基于`prototype.__proto__`向上查找，一直找到`Object.prototype`为止，这种成员调用的查找机制，称为“原型链”机制。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211555267.webp)

- 对象的hasOwnProperty()对象来检查对象自身中是否含有该属性
- 使用in检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回true



### 3. 不具备prototype的函数？

答：

1. 箭头函数
2. 基于ES6给对象某个成员赋值函数值的快捷操作

```js
// 箭头函数
let fn = () => {}

// 成员赋值
let obj = {
    fn1 : function() {}
    fn2 () {
        // 快捷写法
    }
}
dir(obj.fn1) // 有prototype
dir(obj.fn2) // 无prototype 

class Fn{
    fn() {} // 这样也不具备prototype属性
}
```



## 6 JS如何实现继承

### 1. 封装、继承、多态

​	JS本身是基于面向对象开发的编程语言。类具备封装、继承与多态。

- **封装**：类也是一个函数，把实现一个功能的代码进行封装，以此实现“低耦合高内聚”
- **多态**：重载、重写
    - 重写： 子类重写父类上的方法（伴随着继承运行的）
    - 重载： 相同的方法，由于参数或者返回值不同，具备了不同的功能（JS中不具备严格意义上的重载，JS中的重载：同一个方法内，根据传参不同实现不同的功能）
- **继承**：子类继承父类的方法

### 2. 继承的目的

让子类的实例同时具备父类中私有的属性和公共的方法

### 3. 原型继承

​	让子类的原型等于父类的实例。子类的实例，能够用子类私有的和原型上公有的。父类的实例，可以使用父类私有的和原型上公有的。

```js
/* 原型继承 */
Child.prototype = new Parent; 
```

![原型继承](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211623538.png)

特点：

1. 父类中私有和公有的属性方法，最后都变为子类实例公有的。
2. 和其他语言不同的是，原型继承并不会把父类的属性或方法“拷贝”给子类，而是让子类实例基于`__proto__`原型链找到自己定义的属性和方法。（指向、查找方式的）。

### 4. CALL继承

**CALL继承**：在子类构造函数中，把父类当作普通方法执行（没有父类实例，父类原型上的那些东西也就和它没有关系了）

核心代码如下：

```js
function Child () {
    // 让子类的实例继承了父类的私有的属性，并且也变为了子类私有属性(拷贝式的)
    Parent.call(this);
}
```

特点：

1. 只能继承父类中私有的，不能继承父类中共有的。
2. 把父类中私有的，变成子类私有的。

### 5. 寄生组合式继承

**寄生组合式继承**：CALL继承 + 另类原型继承

核心代码如下：

```js
function Child() {
    // 让父类私有的变成子类私有的
    Parent.call(this);
}
// 让父类公有的变成子类公有的
Child.prototype.__proto__ = Parent.prototype; // 法一：  IE不兼容

// 创建一个空对象，让其原型链指向Parent.prototype
Child.prototype = Object.create(Parent.prototype) // 法二： IE兼容
Child.prototype.constructor = Child; // 法二： 保证完整性
```

方法一：

```js
Child.prototype.__proto__ = Parent.prototype; // 法一
```

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211632923.png)

方法二：

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202111211633308.png)

### 6. ES6中的继承

核心代码如下：

```js
class Child extends Parent {
    constructor() {
        super() // => 类似于CAll继承
        /* super(100，200):相当于把Parent中的constructor执行，传递了100和200*/
    }
}
```

注意：

1. 继承后一定要在constructor第一行加上super。
2. ES6创建的就是类，不能当作普通函数执行，只能new执行。

### 7. 从设计思想上谈谈继承本身的问题

假如现在有不同品牌的车，每辆车都有drive、music、addOil这三个方法。

```js
class Car{
  constructor(id) {
    this.id = id;
  }
  drive(){
    console.log("wuwuwu!");
  }
  music(){
    console.log("lalala!")
  }
  addOil(){
    console.log("哦哟！")
  }
}
class otherCar extends Car{}
```

现在可以实现车的功能，并且以此去扩展不同的车。

但是问题来了，新能源汽车也是车，但是它并不需要addOil(加油)。

如果让新能源汽车的类继承Car的话，也是有问题的，俗称"大猩猩和香蕉"的问题。大猩猩手里有香蕉，但是我现在明明只需要香蕉，却拿到了一只大猩猩。也就是说加油这个方法，我现在是不需要的，但是由于继承的原因，也给到子类了。

> 继承最大的问题在于：无法决定继承哪些属性，所有属性都得继承。

当然你可能会说，可以再创建一个父类啊，把加油的方法给去掉，但是这也是有问题的，一方面父类是无法描述所有子类的细节情况的，为了不同的子类特性去增加不同的父类，`代码势必会大量重复`，另一方面一旦子类有所变动，父类也要进行相应的更新，`代码的耦合性太高`，维护性不好。

那如何来解决继承的诸多问题呢？

用组合，这也是当今编程语法发展的趋势，比如golang完全采用的是面向组合的设计方式。

顾名思义，面向组合就是先设计一系列零件，然后将这些零件进行拼装，来形成不同的实例或者类。

```js
function drive(){
  console.log("wuwuwu!");
}
function music(){
  console.log("lalala!")
}
function addOil(){
  console.log("哦哟！")
}

let car = compose(drive, music, addOil);
let newEnergyCar = compose(drive, music);
```

代码干净，复用性也很好。这就是面向组合的设计方式。



## 7 函数的arguments为什么不是数组？如何转化为数组？

因为arguments本身并不能调用数组方法，它是一个另外一种对象类型，只不过属性从0开始排，一次为0、1、2、…最后还有callee和length属性。我们也把这样的对象称为类数组。

常见的类数组还有：

1. 用getElementsByTagName/ClassName()获得的HTMLCollection
2. 用querySelector获得的nodeList

那这会导致很多数组的方法不能用了，必要时需要我们转换为数组，有哪些方法呢？

### 1. [Array.prototype.slice.call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

```js
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments);
  console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
```



### 2. [Array.from()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

```js
function sum(a, b) {
  let args = Array.from(arguments);
  console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
```

这种方法也可以用来转换Set和Map哦！



### 3. ES6展开运算符

```js
function sum(a, b) {
  let args = [...arguments];
  console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
```



### 4. 利用[concat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)+[apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

```js
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments);//apply方法会把第二个参数展开
  console.log(args.reduce((sum, cur) => sum + cur));//args可以调用数组原生的方法啦
}
sum(1, 2);//3
```

当然，最原始的方法就是再创建一个数组，用for循环把类数组的每个属性值放在里面，过于简单，就不浪费篇幅了。

## 8 forEach中return有效果吗？如何中断forEach循环？

在forEach中用return不会返回，函数会继续执行。

```js
let nums = [1, 2, 3];
nums.forEach((item, index) => {
  return;//无效
})
```

中断方法：

1. 使用try监视代码块，在需要中断的地方抛出异常
2. 官方推荐方法（替换方法）：用every和some替代forEach函数。every在碰到return false的时候，中止循环。some在碰到return true的时候，中止循环。

## 9 JS判断数组中是否包含某个值

### 1. array.indexOf

> 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1

```js
var arr=[1,2,3,4];
var index=arr.indexOf(3);
console.log(index);
```



### 2. array.includes(searcElement[,fromIndex])

> 此方法判断数组中是否包含某个值，存在返回true，否则返回false

```js
var arr=[1,2,3,4];
if(arr.includes(3))
    console.log("存在");
else
    console.log("不存在");
```



### 3. array.find(callback[,thisArg])

> 返回数组中满足条件的第一个元素的值，如果没有，返回undefined

```js
var arr=[1,2,3,4];
var result = arr.find(item =>{
    return item > 3
});
console.log(result);
```



### 4. array.findIndex(callback[,thisArg])

> 返回数组中满足条件的第一个元素的下标，如果没有找到，返回-1

```js
var arr=[1,2,3,4];
var result = arr.findIndex(item =>{
    return item > 3
});
console.log(result);
```



## 10 JS中flat——数组扁平化

需求： 多维数组=>一维数组

```js
let ary = [1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]
let str = JSON.stringify(ary);
```

### 1. 调用ES6中的flat方法

```js
ary = ary.flat(Infinity);
```

### 2. repalce + split

```js
ary = str.replace(/(\[|\])/g, '').split(',')
```

### 3. replace + JSON.parse

```js
str = str.replace(/(\[|\])/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
```

### 4. 普通递归

```js
let result = [];
let fn = function(ary) {
  for(let i = 0; i < ary.length; i++) {
    let item = ary[i];
    if (Array.isArray(ary[i])){
      fn(item);
    } else {
      result.push(item);
    }
  }
}
```

### 5. 利用reduce函数迭代

```s
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]]
console.log(flatten(ary))
```

### 6. 扩展运算符

```js
//只要有一个元素有数组，那么循环继续
while (ary.some(Array.isArray)) {
  ary = [].concat(...ary);
}
```



## 11 执行上下文

### 1. 执行上下文的类型

**（1）全局执行上下文**

任何不在函数内部的都是全局执行上下文，它首先会创建一个全局的window对象，并且设置this的值等于这个全局对象，一个程序中只有一个全局执行上下文。

**（2）函数执行上下文**

当一个函数被调用时，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个。

**（3）**`eval`**函数执行上下文**

执行在eval函数中的代码会有属于他自己的执行上下文，不过eval函数不常使用，不做介绍。



## 12 this/call/apply/bind

### 1. 对this对象的理解

this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断。

- 第一种是**函数调用模式**，当一个函数不是一个对象的属性时，直接作为函数来调用时，this 指向全局对象。
- 第二种是**方法调用模式**，如果一个函数作为一个对象的方法来调用时，this 指向这个对象。
- 第三种是**构造器调用模式**，如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象。
- 第四种是 **apply 、 call 和 bind 调用模式**，这三个方法都可以显示的指定调用函数的 this 指向。其中 apply 方法接收两个参数：一个是 this 绑定的对象，一个是参数数组。call 方法接收的参数，第一个是 this 绑定的对象，后面的其余参数是传入函数执行的参数。也就是说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来。bind 方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。这个函数的 this 指向除了使用 new 时会被改变，其他情况下都不会改变。

这四种方式，使用构造器调用模式的优先级最高，然后是 apply、call 和 bind 调用模式，然后是方法调用模式，然后是函数调用模式。

### 2. call()和apply的区别？

它们的作用一模一样，区别仅在于传入参数的形式的不同。

- apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数。
- call 传入的参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数。







## 参考

1. [(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.cn/post/6844903974378668039)
2. [(建议精读)原生JS灵魂之问(中)，检验自己是否真的熟悉JavaScript？](https://juejin.cn/post/6844903986479251464)
3. [(2.4w字,建议收藏)😇原生JS灵魂之问(下), 冲刺🚀进阶最后一公里(附个人成长经验分享)](https://juejin.cn/post/6844904004007247880)
3. [「2021」高频前端面试题汇总之JavaScript篇（上）](https://juejin.cn/post/6940945178899251230#heading-87)
3. [「2021」高频前端面试题汇总之JavaScript篇（下）](https://juejin.cn/post/6941194115392634888)