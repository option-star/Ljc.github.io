

[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

Object.create(): 该方法创建一个新对象，使用现有的对象来提供新创建对象的`__proto_`。

思路：将传入对象当作原型

```js
function create (obj) {
	function F() {}
    F.prototype = obj
    return new F()
}
```

