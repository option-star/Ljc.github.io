---
title: 手撕01:基础
date: 2022-03-24
sidebar: 'auto'
categories:
- 06 手撕
isShowComments: true
---

## 1. 手写Object.create

**思路**：将传入的对象作为原型

**实现**：

```js
/*
 * create : Object.create
 * @params
 *    prototype: 指向的原型
 * @return
 *    指向prototype的对象
 */
Object.create = function create(prototype) {
    if (prototype !== null && typeof prototype !== "object") throw new TypeError('Object prototype may only be an Object or null');
    var Proxy = function Proxy() {} // 创建一个类
    Proxy.prototype = prototype; // 将该类的原型替代为传入的原型
    return new Proxy; // 返回类的实例对象
};
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

```js
// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// 新建 MyPromise 类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING;

  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象
  // 成功之后的值
  value = null;
  // 失败之后的原因
  reason = null;

  // 存储成功回调函数
  onFulfilledCallbacks = [];
  // 存储失败回调函数
  onRejectedCallbacks = [];

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;
      // 保存成功之后的值
      this.value = value;
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED;
      // 保存失败后的原因
      this.reason = reason;
      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {

      const fulfilledMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectedMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask()
      } else if (this.status === REJECTED) {
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    })

    return promise2;
  }

  catch(onRejected) {
    // 只需要进行错误处理
    this.then(undefined, onRejected);
  }

  // resolve 静态方法
  static resolve(parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve => {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

}

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }

  if (typeof x === 'object' || typeof x === 'function') {
    // 这个坑是跑测试的时候发现的，如果x是null，应该直接resolve
    if (x === null) {
      return resolve(x);
    }

    let then;
    try {
      // 把 x.then 赋值给 then 
      then = x.then;
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      // 名字重名了，我直接用匿名函数了
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return;
            called = true;
            reject(r);
          });
      } catch (error) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;

        // 否则以 e 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}


module.exports = MyPromise
```





## 5. 手写Promise.all

> 实现

```js
Promise.myAll = (promises) =>{
	let arr = [], count = 0;
    return new Promise((resolve, reject) =>{
 		promises.forEach((item, i) =>{
			Promise.resolve(item).then(
        	(res) =>{
                arr.push(res);
                count++;
                if(count == promises.length) return resolve(arr)
            }, 
            reject
        	)
    	})
    })
}
```

> 测试

```js
const p1 = Promise.resolve('p1')
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p2 延时一秒')
    }, 1000)
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p3 延时两秒')
    }, 2000)
})

const p4 = Promise.reject('p4 rejected')

const p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('p5 rejected 延时1.5秒')
    }, 1500)
})

Promise.MyAll = (promises) => {
    let arr = [], count = 0;
    return new Promise((resolve, reject) => {
        promises.forEach((item) => {
            Promise.resolve(item).then(
                (res) => {
                    arr.push(res);
                    count++;
                    if (count == promises.length) return resolve(arr)
                },
                reject
            )
        })
    })
}

// 所有 Promsie 都成功
Promise.MyAll([p1, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // 2秒后打印 [ 'p1', 'p2 延时一秒', 'p3 延时两秒' ]

// 一个 Promise 失败
Promise.MyAll([p1, p2, p4])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p4 rejected

// 一个延时失败的 Promise
Promise.MyAll([p1, p2, p5])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // 1.5秒后打印 p5 rejected 延时1.5秒

// 两个失败的 Promise
Promise.MyAll([p1, p4, p5])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p4 rejected
```





## 6. 手写Promise.race

> 实现

```js
Promise.MyRace = (promises) => {
    return new Promise((resolve, reject) => {
        for (item of promises) {
            Promise.resolve(item).then(resolve, reject)
        }
    })
}
```

> 测试

```js
const p1 = Promise.resolve('p1')
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p2 延时一秒')
    }, 1000)
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p3 延时两秒')
    }, 2000)
})

const p4 = Promise.reject('p4 rejected')

const p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('p5 rejected 延时1秒')
    }, 1500)
})

Promise.MyRace = (promises) => {
    return new Promise((resolve, reject) => {
        for (item of promises) {
            Promise.resolve(item).then(resolve, reject)
        }
    })
}

// p1无延时，p2延时1s，p3延时2s
Promise.MyRace([p1, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p1

// p4无延时reject
Promise.MyRace([p4, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p4 rejected

// p5 延时1.5秒reject，p2延时1s
Promise.MyRace([p5, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // 1s后打印: p2 延时一秒
```



## 7. 手写promise.any

:::tip

​	`Promise.any` 与 `Promise.all` 可以看做是相反的。`Promise.any` 中只要有一个 `Promise` 实例成功就成功，只有当所有的 `Promise` 实例失败时 `Promise.any` 才失败，此时`Promise.any` 会把所有的失败/错误集合在一起，返回一个失败的 `promise` 和`AggregateError`类型的实例。

:::

> 实现

```js
Promise.MyAny = (promises) => {
    let arr = [], count = 0
    return new Promise((resolve, reject) => {
        promises.forEach(item => {
            Promise.resolve(item).then(resolve, err => {
                arr.push({ status: 'rejected', val: err })
                count++;
                if (count == promises.length) reject(new Error('没有promise成功'))
            })
        });
    })
}
```

> 测试

```js
const p1 = Promise.resolve('p1')
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p2 延时一秒')
    }, 1000)
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p3 延时两秒')
    }, 2000)
})

const p4 = Promise.reject('p4 rejected')

const p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('p5 rejected 延时1.5秒')
    }, 1500)
})

Promise.MyAny = (promises) => {
    let arr = [], count = 0
    return new Promise((resolve, reject) => {
        promises.forEach(item => {
            Promise.resolve(item).then(resolve, err => {
                arr.push({ status: 'rejected', val: err })
                count++;
                if (count == promises.length) reject(new Error('没有promise成功'))
            })
        });
    })
}

// 所有 Promise 都成功
Promise.MyAny([p1, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p1

// 两个 Promise 成功
Promise.MyAny([p1, p2, p4])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p1

// 只有一个延时成功的 Promise
Promise.MyAny([p2, p4, p5])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // p2 延时1秒

// 所有 Promise 都失败
Promise.MyAny([p4, p5])
    .then(res => console.log(res))
    .catch(err => console.log(err)) // 没有promise成功

```



## 8. 手写Promise.allSetted

> 实现

```js
Promise.MyAllSettled = (promises) => {
    let arr = [], count = 0

    return new Promise((resolve, reject) => {
        const resovlePromise = (status, val) => {
            arr.push({
                status,
                val
            })
            count++;
            if (count == promises.length) resolve(arr)

        }

        promises.forEach(item => {
            Promise.resolve(item).then(
                val => {
                    resovlePromise('fulfilled', val)
                },
                err => {
                    resovlePromise('rejected', err)
                }
            )
        })
    })
}
```

> 原理

```js
const p1 = Promise.resolve('p1')
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p2 延时一秒')
    }, 1000)
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('p3 延时两秒')
    }, 2000)
})

const p4 = Promise.reject('p4 rejected')

const p5 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('p5 rejected 延时1.5秒')
    }, 1500)
})

Promise.MyAllSettled = (promises) => {
    let arr = [], count = 0

    return new Promise((resolve, reject) => {
        const resovlePromise = (status, val) => {
            arr.push({
                status,
                val
            })
            count++;
            if (count == promises.length) resolve(arr)

        }

        promises.forEach(item => {
            Promise.resolve(item).then(
                val => {
                    resovlePromise('fulfilled', val)
                },
                err => {
                    resovlePromise('rejected', err)
                }
            )
        })
    })
}

// 所有 Promise 实例都成功
Promise.MyAllSettled([p1, p2, p3])
    .then(res => console.log(res))
    .catch(err => console.log(err))
// [
//   { status: 'fulfilled', value: 'p1' },
//   { status: 'fulfilled', value: 'p2 延时一秒' },
//   { status: 'fulfilled', value: 'p3 延时两秒' }
// ]

// 有一个 MyAllSettled 失败
Promise.allSettled([p1, p2, p4])
    .then(res => console.log(res))
    .catch(err => console.log(err))
// [
//   { status: 'fulfilled', value: 'p1' },
//   { status: 'fulfilled', value: 'p2 延时一秒' },
//   { status: 'rejected' , value: 'p4 rejected' }
// ]

// 所有 MyAllSettled 都失败
Promise.allSettled([p4, p5])
    .then(res => console.log(res))
    .catch(err => console.log(err))
// [
//   { status: 'rejected', reason: 'p4 rejected' },
//   { status: 'rejected', reason: 'p5 rejected 延时1.5秒' }
// ]
```



## 9. 手写Promise.finally

:::tip

​	Promise.prototype.finally()` 是 ES2018 新增的特性，它回一个 `Promise` ，在 `promise` 结束时，无论 `Promise` 运行成功还是失败，都会运行 `finally` ，类似于我们常用的  `try {...} catch {...} finally {...}

:::

```js
Promise.prototype.MyFinally = (cb) => {
    return this.then(
        val => {
            return Promise.resolve(cb()).then(() => {
                return val
            })
        },
        err => {
            return Promise.reject(cb()).then(() => {
                throw err
            })
        }
    )
}
```



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



## 11. 手写防抖函数

:::tip

​	函数防抖是指在实践被触发n秒后再执行回调，如果在这n秒内事件又被触发，则重新计时。这可以使用在一些点击请求事件中，避免因为用户的多次点击向后端发送多次请求。

:::

```js
// 函数防抖
function debounce(fn, wait) {
    let timer = null;
    return function () {
        // 如果此时存在定时器的话，则取消之前的定时器重新记时
        if (timer) {
            clearTimeout(timer);
        }
        // 设置定时器，使事件间隔指定事件后执行
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, wait);
    };
}
```

> 测试

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div>
        <button id="btn">点击</button>
    </div>
    <script>
        // 函数防抖的实现
        function debounce(fn, wait) {
            let timer = null;
            return function () {
                // 如果此时存在定时器的话，则取消之前的定时器重新记时
                if (timer) {
                    clearTimeout(timer);
                }
                // 设置定时器，使事件间隔指定事件后执行
                timer = setTimeout(() => {
                    fn.apply(this, arguments);
                }, wait);
            };
        }

        function fn2(a) {
            console.log(a, 111)
        }

        let fn3 = debounce(fn2, 1000)
        let btn = document.getElementById("btn");
        btn.addEventListener('click', function (e) {
            fn3(1);
        })

    </script>
</body>

</html>
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

:::tip

- [XHR](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

​	AJAX是 Asynchronous JavaScript and XML 的缩写，指的是通过 JavaScript 的 异步通信，从服务器获取 XML 文档从中提取数据，再更新当前网页的对应部分，而不用刷新整个网页。

:::

**创建AJAX请求的步骤**：

- 创建一个XMLHttpRequest对象
- 使用open方法创建http请求
  - 请求方法
  - 请求地址
  - 是否异步
  - 用户的认证信息
- 发送请求前，可以为这个对象添加一些信息和监听函数
- 调用sent方法向服务器发送请求





## 17. 使用Promise封装AJAX请求



## 18. 实现浅拷贝



## 19. 实现深拷贝

- 定义一个工具函数，判断传入值是否是空或函数、对象

- 实现deepClone函数，第一个参数为克隆对象，第二个参数是是一个weakMap对象，记录循环引用

- 通过instanceof判断是不是set，是直接返回

- 判断instanceof判断是不是map，是直接返回

- 通过typeof判断是不是symbol，是通过获取其description创建返回一个新的symbol

- 通过typeof判断是不是函数，是直接返回

- 判断是不是对象，不是直接返回

- 判断是不是已经在map存在，是获取返回

- 当以上条件都不满足判断对象是数组还是对象，并创建一个空对象或数组，并将判断对象作为key，新对象作为value存入map

- 递归处理object和symbol

  通过Object.keys()和Object.getOwnPropertySymbols()获取key，递归处理

  ```js
  //实现深层对象深拷贝
  /*
  	1.判断类型是不是对象，如果是对象就继续遍历key
  	2.函数无需实现深拷贝
  	3.如果是对象判断是不是数组
  	4.处理Symbol为key Object.getOwnPropertySymbol(originValue)
  	5.循环引用时重点
  */
  //当value不为null且是一个对象或函数返回true
  function isObject(value){
      const valueType = typeof value
      return (value !==null)&&(valueType === 'object' || valueType === 'function')
  }
  
  function deepClone(originValue, map = new WeakMap()){
      //处理值为set 和 map的情况
      if(originValue instanceof Set){
          return new Set([...originValue])
      }
      if(originValue instanceof Map){
          return new Map([...originValue])
      }
      
      // 如果是Symbol的value，创建一个symbol
      if(typeof originValue === 'symbol'){
          return Symbol(originValue.description)
      }
      
      //函数无需深拷贝
      if(typeof originValue === 'function'){
          return originValue
      }
      
      //判断是不是对象，不是直接返回
      if (!isObject(originValue)){
          return originValue
      }
      
      //处理循环引用
      if(map.has(originValue)){
          return map.get(originValue);
      }
      
      
      //判断是不是数组
      const newObj = Array.isArray(originValue)?[]:{};	//判断数组还是对象
      map.set(originValue, newObj);
      
      //处理key为stirng类型的
      Object.keys(originValue).forEach(key=>{
          newObj[key] = deepClone(originValue[key], map);
      })
      
      //对Symbol特殊处理
      const sumbolKeys = Object.getOwnPropertySymbols(originValue)
      for(let key of sumbolKeys){
          newObj[key] = deepClone(originValue[key], map);
      }
      
      return newObj;
  }
  ```

  



