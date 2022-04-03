---
title: 输出02 this
date: 2022-03-29
sidebar: 'auto'
categories:
- 07代码输出
isShowComments: true
---

## 1. 代码输出结果

```javascript
function foo() {
  console.log( this.a );
}

function doFoo() {
  foo();
}

var obj = {
  a: 1,
  doFoo: doFoo
};

var a = 2; 
obj.doFoo()
复制代码
```

输出结果：2

在Javascript中，this指向函数执行时的当前对象。在执行foo的时候，执行环境就是doFoo函数，执行环境为全局。所以，foo中的this是指向window的，所以会打印出2。

## 2. 代码输出结果

```javascript
var a = 10
var obj = {
  a: 20,
  say: () => {
    console.log(this.a)
  }
}
obj.say() 

var anotherObj = { a: 30 } 
obj.say.apply(anotherObj) 
复制代码
```

输出结果：10  10

我么知道，箭头函数时不绑定this的，它的this来自原其父级所处的上下文，所以首先会打印全局中的 a 的值10。后面虽然让say方法指向了另外一个对象，但是仍不能改变箭头函数的特性，它的this仍然是指向全局的，所以依旧会输出10。

但是，如果是普通函数，那么就会有完全不一样的结果：

```javascript
var a = 10  
var obj = {  
  a: 20,  
  say(){
    console.log(this.a)  
  }  
}  
obj.say()   
var anotherObj={a:30}   
obj.say.apply(anotherObj)
复制代码
```

输出结果：20 30

这时，say方法中的this就会指向他所在的对象，输出其中的a的值。

## 3. 代码输出结果

```javascript
function a() {
  console.log(this);
}
a.call(null);
复制代码
```

打印结果：window对象

根据ECMAScript262规范规定：如果第一个参数传入的对象调用者是null或者undefined，call方法将把全局对象（浏览器上是window对象）作为this的值。所以，不管传入null 还是 undefined，其this都是全局对象window。所以，在浏览器上答案是输出 window 对象。

要注意的是，在严格模式中，null 就是 null，undefined 就是 undefined：

```javascript
'use strict';

function a() {
    console.log(this);
}
a.call(null); // null
a.call(undefined); // undefined
复制代码
```

## 4. 代码输出结果

```javascript
var obj = { 
  name : 'cuggz', 
  fun : function(){ 
    console.log(this.name); 
  } 
} 
obj.fun()     // cuggz
new obj.fun() // undefined
复制代码
```

使用new构造函数时，其this指向的是全局环境window。

## 6. 代码输出结果

```javascript
var obj = {
   say: function() {
     var f1 = () =>  {
       console.log("1111", this);
     }
     f1();
   },
   pro: {
     getPro:() =>  {
        console.log(this);
     }
   }
}
var o = obj.say;
o();
obj.say();
obj.pro.getPro();
复制代码
```

输出结果：

```javascript
1111 window对象
1111 obj对象
window对象
复制代码
```

**解析：**

1. o()，o是在全局执行的，而f1是箭头函数，它是没有绑定this的，它的this指向其父级的this，其父级say方法的this指向的是全局作用域，所以会打印出window；
2. obj.say()，谁调用say，say 的this就指向谁，所以此时this指向的是obj对象；
3. obj.pro.getPro()，我们知道，箭头函数时不绑定this的，getPro处于pro中，而对象不构成单独的作用域，所以箭头的函数的this就指向了全局作用域window。

## 7. 代码输出结果

```javascript
var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log(this.foo);  
        console.log(self.foo);  
        (function() {
            console.log(this.foo);  
            console.log(self.foo);  
        }());
    }
};
myObject.func();
复制代码
```

输出结果：bar bar undefined bar

**解析：**

1. 首先func是由myObject调用的，this指向myObject。又因为var self = this;所以self指向myObject。
2. 这个立即执行匿名函数表达式是由window调用的，this指向window 。立即执行匿名函数的作用域处于myObject.func的作用域中，在这个作用域找不到self变量，沿着作用域链向上查找self变量，找到了指向 myObject对象的self。

## 8. 代码输出问题

```javascript
window.number = 2;
var obj = {
 number: 3,
 db1: (function(){
   console.log(this);
   this.number *= 4;
   return function(){
     console.log(this);
     this.number *= 5;
   }
 })()
}
var db1 = obj.db1;
db1();
obj.db1();
console.log(obj.number);     // 15
console.log(window.number);  // 40
复制代码
```

这道题目看清起来有点乱，但是实际上是考察this指向的:

1. 执行db1()时，this指向全局作用域，所以window.number * 4 = 8，然后执行匿名函数， 所以window.number * 5 = 40；
2. 执行obj.db1();时，this指向obj对象，执行匿名函数，所以obj.numer * 5 = 15。

## 9. 代码输出结果

```javascript
var length = 10;
function fn() {
    console.log(this.length);
}
 
var obj = {
  length: 5,
  method: function(fn) {
    fn();
    arguments[0]();
  }
};
 
obj.method(fn, 1);
复制代码
```

输出结果： 10 2

**解析：**

1. 第一次执行fn()，this指向window对象，输出10。
2. 第二次执行arguments[0](https://link.juejin.cn?target=)，相当于arguments调用方法，this指向arguments，而这里传了两个参数，故输出arguments长度为2。

## 10. 代码输出结果

```javascript
var a = 1;
function printA(){
  console.log(this.a);
}
var obj={
  a:2,
  foo:printA,
  bar:function(){
    printA();
  }
}

obj.foo(); // 2
obj.bar(); // 1
var foo = obj.foo;
foo(); // 1
复制代码
```

输出结果： 2 1 1

**解析：**

1. obj.foo()，foo 的this指向obj对象，所以a会输出2；
2. obj.bar()，printA在bar方法中执行，所以此时printA的this指向的是window，所以会输出1；
3. foo()，foo是在全局对象中执行的，所以其this指向的是window，所以会输出1；

## 11. 代码输出结果

```javascript
var x = 3;
var y = 4;
var obj = {
    x: 1,
    y: 6,
    getX: function() {
        var x = 5;
        return function() {
            return this.x;
        }();
    },
    getY: function() {
        var y = 7;
        return this.y;
    }
}
console.log(obj.getX()) // 3
console.log(obj.getY()) // 6
复制代码
```

输出结果：3  6

**解析：**

1. 我们知道，匿名函数的this是指向全局对象的，所以this指向window，会打印出3；
2. getY是由obj调用的，所以其this指向的是obj对象，会打印出6。

## 12. 代码输出结果

```javascript
 var a = 10; 
 var obt = { 
   a: 20, 
   fn: function(){ 
     var a = 30; 
     console.log(this.a)
   } 
 }
 obt.fn();  // 20
 obt.fn.call(); // 10
 (obt.fn)(); // 20
复制代码
```

输出结果： 20  10  20

**解析：**

1.  obt.fn()，fn是由obt调用的，所以其this指向obt对象，会打印出20；
2.  obt.fn.call()，这里call的参数啥都没写，就表示null，我们知道如果call的参数为undefined或null，那么this就会指向全局对象this，所以会打印出 10；
3.  (obt.fn)()， 这里给表达式加了括号，而括号的作用是改变表达式的运算顺序，而在这里加与不加括号并无影响；相当于  obt.fn()，所以会打印出 20；

## 13. 代码输出结果

```javascript
function a(xx){
  this.x = xx;
  return this
};
var x = a(5);
var y = a(6);

console.log(x.x)  // undefined
console.log(y.x)  // 6
复制代码
```

输出结果： undefined  6

**解析：**

1. 最关键的就是var x = a(5)，函数a是在全局作用域调用，所以函数内部的this指向window对象。**所以 this.x = 5 就相当于：window.x = 5。**之后 return this，也就是说 var x = a(5) 中的x变量的值是window，这里的x将函数内部的x的值覆盖了。然后执行console.log(x.x)， 也就是console.log(window.x)，而window对象中没有x属性，所以会输出undefined。
2. 当指向y.x时，会给全局变量中的x赋值为6，所以会打印出6。

## 14. 代码输出结果

```javascript
function foo(something){
    this.a = something
}

var obj1 = {
    foo: foo
}

var obj2 = {}

obj1.foo(2); 
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4)
console.log(obj1.a); // 2
console.log(bar.a); // 4
复制代码
```

输出结果： 2  3  2  4

**解析：**

1. 首先执行obj1.foo(2); 会在obj中添加a属性，其值为2。之后执行obj1.a，a是右obj1调用的，所以this指向obj，打印出2；
2. 执行 obj1.foo.call(obj2, 3) 时，会将foo的this指向obj2，后面就和上面一样了，所以会打印出3；
3. obj1.a会打印出2；
4. 最后就是考察this绑定的优先级了，new 绑定是比隐式绑定优先级高，所以会输出4。

## 15. 代码输出结果

```javascript
function foo(something){
    this.a = something
}

var obj1 = {}

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
复制代码
```

输出结果： 2  2  3

这道题目和上面题目差不多，主要都是考察this绑定的优先级。记住以下结论即可：**this绑定的优先级：new绑定 > 显式绑定 > 隐式绑定 > 默认绑定。**



