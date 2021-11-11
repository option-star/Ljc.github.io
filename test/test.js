// promise是一个类，我们可new Promise创造一个实例

let Promise = require('./promise');
console.log(Promise);

let promise = new Promise((resolve, reject) => {
    throw new Error("error");
    reject('fail') // 让promise变成成功态
});

promise.then((value) => {
    console.log(value, "success");
}, (reason) => {
    console.log(reason, "fail");
})