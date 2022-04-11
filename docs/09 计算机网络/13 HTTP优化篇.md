---
title: 计网13 HTTP优化篇
date: 2022-04-11
sidebar: 'auto'
categories:
- 09计网
isShowComments: true
---



## 1. 如何避免发送HTTP请求？



### 1）利用浏览器缓存

> 开启强缓存

只需在响应头部添加`Cache-Control`字段设置`max-age`的值即可。

```js
Router.get('/', async (ctx) => {
    const getResource = () => {
        return new Promise((res) => {
            fs.readFile("./fs/a.txt", (err, data) => {
                if (err) {
                    return;
                }
                res(data)
            })
        })
    }
    //设置强缓存，过期时间为10秒
    ctx.set('Cache-Control', 'max-age=10')  
    ctx.body = await getResource(); 
})

```

> 开启协商缓存

浏览器第一次请求一个资源是，服务器返回header中会加上`Last-Modify`的头部字段，当再次请求时，request的请求头中会包含`if-modified-since`，该值为缓存之前返回的`Last-Modify`。

```js
Router.get('/pp', async (ctx) => {
    const ifModifiedSince = ctx.request.header['if-modified-since'];
    const getResource = () => {
        return new Promise((res) => {
            fs.stat("./fs/a.txt", (err, stats) => {
                if (err) {
                    console.log(err);
                }
                res(stats)
            })
        })
    }
    let resource = await getResource();
    // atime	Access Time	访问时间	
    // 最后一次访问文件（读取或执行）的时间
    // ctime	Change Time	变化时间	
    // 最后一次改变文件（属性或权限）或者目录（属性或权限）的时间
    // mtime	Modify Time	修改时间	
    // 最后一次修改文件（内容）或者目录（内容）的时间
    if (ifModifiedSince === resource.mtime.toGMTString()) { //把具体的日期转换为（根据 GMT）字符串
        ctx.status = 304;
    }
    ctx.set('Last-Modified', resource.mtime.toGMTString());
    ctx.body = resource
})

```



## 2. 如何减少HTTP请求次数？

### 1）减少重定向请求次数

​	重定向的工作交给代理服务器完成，就能减少HTTP请求次数了

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204111351472.png)

### 2）合并请求

> CSS-sprites

​	**通过将多个小图片合并成一个大图片来减少HTTP请求的次数，以减少HTTP请求得次数，从而减少网络的开销**。该图片使用CSS `background`和`background-position`属性渲染。

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204111340879.webp)



> webpack压缩

- css压缩：MiniCssExtractPlugin

```js
npm i mini-css-extract-plugin -D
// 入口：index.js
import './style.css';
// 配置：webpack.config.js
module: {
    rules: [
        {
            test: /\.css$/,
            include: resolve('src-es6/css'), // test、include、exclude 缩小查找范围
            use: [
                MiniCssExtractPlugin.loader, // 放在css-loader前
                { loader: 'css-loader',
                  options: { sourceMap: true } } // 影响所有依赖css-loader的插件生成sourceMap
            ]
        }
    ]
},
plugins: [
  new MiniCssExtractPlugin({
      filename: 'style.css', // 指定文件名 生产环境可写成 style.[contenthash].css 避免缓存问题
  }),
]
```

- js压缩：uglifyjs-webpack-plugin

```js
//webpack.config.js
const uglifyJsWebpackPlugin=require('uglifyjs-webpack-plugin')

module.exports = {
    optimization:{   
        minimizer:[
            new uglifyJsWebpackPlugin({
                cache:true,  //是否缓存
                parallel:true,  //是否并发打包，同时打包多个文件
                sourceMap:true  //打包后的代码与源码的映射，方便调试
            })
            ...
        ]
        ...
}        
```



> 图片用base64编码存于url中



### 3） 延迟发送请求

​	请求页面的时候，没必要把全部资源都获取到，而是只获取当前用户所看到的页面资源，当用户向下滑动页面的时候，再向服务器获取接下来的资源，这样就达到了延迟发送请求的效果。

> 举例：[图片懒加载(v-lazy指令)](https://option-star.github.io/blog/docs/12-chang-jian-ye-wu/01-tu-pian-lan-jia-zai.html#_3-%E5%AE%9E%E7%8E%B0)

1. 通过Vue.directive注册全局自定义指令

2. 在bind钩子中，实现初始化

   - 设置data-src的属性值，存储真实src
   - 设置src属性值，存储loading图

3. 在inserted钩子中，实现监听（兼容性处理）

   - 通过实例化IntersectionObserver，调用其observe方法实现监听

   - 通过监听srcoll事件实现监听

     1. 先获取窗口视图的高度： document.documentElement.clientHeight

     2. 然后获取元素的top相对于窗口的高度：*el*.getBoundingClientRect().top;

     3. 然后获取元素的bottom相对于窗口的高度： *el*.getBoundingClientRect().bottom;

     4. 获取真实realSrc的图片真实路径

     5. 加载时机：

        - top值 - 窗口高度 < 0 控制下方是否加载

        - bottom > 0 控制上方是否加载





## 3. 如何减少HTTP响应的数据？

> 图片压缩： WebP格式

​	相同图片质量下，WebP 格式的图片大小都比 Png 格式的图片小，所以对于大量图片的网站，可以考虑使用 WebP 格式的图片，这将大幅度提升网络传输的性能。

![来源于：https://isparta.github.io/compare-webp/index.html](https://cdn.jsdelivr.net/gh/option-star/imgs/202204111353310.png)

> gzip压缩

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204111354021.webp)



## 参考

1. [前端面试常见的浏览器缓存（强缓存、协商缓存），代码实操](https://juejin.cn/post/7083178636852854792)
2. [3.2 HTTP/1.1如何优化？](https://xiaolincoding.com/network/2_http/http_optimize.html#%E5%A6%82%E4%BD%95%E9%81%BF%E5%85%8D%E5%8F%91%E9%80%81-http-%E8%AF%B7%E6%B1%82)
2. [css sprite雪碧图制作，使用以及相关，图文gif。](https://juejin.cn/post/6844903473364860935)

