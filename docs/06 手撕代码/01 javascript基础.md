## 1. 手写Object.create

**思路**：将传入的对象作为原型

**实现**：

```js
// Object.create
function create(obj) {
    function F() { }
    F.prototype = obj
    return new F()
}
```



## 2. 手写 instanceof方法

:::tip

- [instanceof](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) : 用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

:::

**思路**：

1. 首先获取类型的原型
2. 然后获取对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

**实现**：

```js
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left); // 获取对象的原型
    let prototype = right.prototype; // 获取构造函数的prototype对象
    // 判断构造函数的prototype对象是否在对象的原型链上
    while (true) {
        if (!proto) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
```



## 3. 手写new

**思路：**

在调用new的过程中会发生以上四件事情：

（1）首先创建了一个空对象

（2）设置原型，将对象的原型设置为函数的 prototype 对象。

（3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）

（4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

**实现：**

```js
function myNew() {
    // 创建一个新对象
    let newObject = null;
    // 获取传入的构造函数
    let constructor = Array.prototype.shift.call(arguments);
    let result = null;
    // 判断参数是否是一个函数
    if (typeof constructor !== 'function') {
        return;
    }
    // 新建一个对象，对象的原型为构造函数的 prototype 对象
    newObject = Object.create(constructor.prototype)

    // 将this指向新对象，并执行函数
    result = constructor.apply(newObject, arguments);
    // 判断返回对象
    let flag = result && (typeof result === "object" || typeof result === "function");
    // 判断返回结果
    return flag ? result : newObject;
}
// 使用方法
myNew(构造函数, 初始化参数)
```

## 4. 手写Promise



## 5. 手写Promise.all



## 6. 手写Promise.race



## 7. 手写Promise.allSetted



## 8. 手写Promise.finally



## 9. 手写防抖函数



## 10. 手写节流函数

**定义**：

​	函数节流是指规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内某事件被触发多次，只有一次能生效。节流可以使用在 scroll 函数的事件监听上，通过事件节流来降低事件调用的频率。

**实现**：

```js
// 函数节流的实现;
function throttle(fn, delay) {
  let curTime = Date.now();

  return function() {
    let context = this,
        args = arguments,
        nowTime = Date.now();

    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn.apply(context, args);
    }
  };
}

```







## 11. 手写类型判断函数



## 12. 手写call函数

**思路**：

**实现**

```js
Funciton.prototype.myCall = function (context) {
    // 判断调用对象
    if (typeof this !== "function") {
        console.error("type error");
    }
    // 获取参数
    let args = [...arguments].slice(1);
    // 存储函数执行结果
    let result = null;
    // 判断context是否传入，如果未传入则设置为window
    context = context || window;
    // 将调用函数设置对象的方法
    context.fn = this;
    // 调用函数
    result = context.fn(...args)
    // 将属性删除
    delete context.fn;
    return result;
}
```





## 13. 手写apply函数



## 14. 手写bind函数



## 15. 柯里化实现



## 16. 实现AJAX请求







## 17. 使用Promise封装AJAX请求



## 18. 实现浅拷贝



## 19. 实现深拷贝







