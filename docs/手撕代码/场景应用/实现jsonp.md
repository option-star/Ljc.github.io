## 问题

实现jsonp



## 思路

创建一个script标签，再传入src即可

1. 通过document.createElement, 创建script元素
2. 给script标签，赋src的值
3. 给script标签，赋type的值
4. 通过appendChild添加子元素
5. 最后可在传入路径中添加callback值用于接收回调结果



## 实现

```js
// 动态加载js文件
function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.type = "text/javascript";
    document.body.appendChild(script);
}

addScript('http://xxx.xxx.com/xxx.js?callback=handleRes');
// 设置一个全局的callback函数来接收回调结果
function handleRes(res) {
    console.log(res);
  }
  // 接口返回的数据格式
  handleRes({a: 1, b: 2});
```



