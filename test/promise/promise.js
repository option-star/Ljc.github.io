const PENDING = 'PENDING'; // 等待态
const FULFILLED = 'FULFILLED'; // 成功态
const REJECTED = 'REJECTED';  // 失败态

class Promise {
    constructor(executor) {
        this.status = PENDING; // 默认初始状态是等待态

        const resolve = () => { // 默认参数，resolve

        }

        const reject = () => { // 默认参数，reject

        }

        executor(resolve, reject); // 默认new Promise中的函数会立即执行
    }
}
module.exports = Promise