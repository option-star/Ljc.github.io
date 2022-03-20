## 作用

`instanceof`： 该运算符用于检测构造函数的`prototype`属性是否出现在某个实例对象的原型链上。

**举例**：

```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car);
// expected output: true

console.log(auto instanceof Object);
// expected output: true

```

## 思路

1. 首先获取类型的原型
2. 然后获取对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为null，因为原型链最终为null

## 实现

```js
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left); // 获取对象原型
    let prototype = right.prototype; // 获取构造函数的prototype对象

    // 判断构造函数的prototype对象是否在对象的原型链上
    while (true) {
        if (!proto) return false;
        if (proto == prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

```

