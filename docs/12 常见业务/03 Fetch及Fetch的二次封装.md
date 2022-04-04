---
title: 业务03 fetch封装
date: 2022-03-21
sidebar: 'auto'
categories:
- 12常见业务
isShowComments: true
---



## 1. fetch的基本语法

:::tip

[fetch mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

:::



## 2. fetch与ajax的区别

1. 当接收到一个代表错误的 HTTP 状态码时，从 `fetch()` 返回的 Promise **不会被标记为 reject**， 只要返回了，就将Promise状态标记为resolve，只有网络故障时或请求阻止时，才会标记为`reject`。
2. fetch**默认不会发送跨域cookies**。可通过设置`credentials`来改变
   - `include `: 都允许
   - `same-origin` : 同源允许
   - `omit` : 都不允许

3. fetch 在当初设计的时候，并没有设置超时和断开，（XMLHttpRequest相对完善的），没有类似于XHR的监控上传下载进度。有一下两种方法解决

   - 通过promise.race的方法，传入一个失败的方法，来中断请求。

   - AbortController ： 处理fetch中断请求。

     ```js
     const controller = new AbortController();
     let signal = controller.signal;
     
     fetch(url, {signal}).then(function(response) {
         //...
       }).catch(function(e) {
         reports.textContent = 'Download error: ' + e.message;
       })
     }
     
     // 中断请求
     controller.abort();
     ```

4. fetch的兼容性比较差， IE都不支持，想要兼容基于@babel/polyfill是不够的，还需要基于fetch-polyfill处理



## 3. fetch二次封装

```js
/* Fetch的二次封装:让内置的fetch使用起来更加的方便「常用的默认值 & 约定的规范 & 对结果的处理...」 */
import tool from './tool';
import qs from 'qs';

let baseURL = '',
    env = process.env.NODE_ENV || 'development',
    inital = {
        method: 'GET',
        params: null,
        body: null,
        headers: {},
        cache: 'no-cache',
        credentials: 'include',
        responseType: 'JSON'
    };
switch (env) {
    case 'development':
        baseURL = 'http://127.0.0.1:9999';
        break;
    case 'production':
        baseURL = 'http://api.zhufengpeixun.cn';
        break;
}

export default function request(url, config) {
    // init params
    if (typeof url !== 'string') throw new TypeError('url must be required and of string type');
    if (!tool.isPlainObject(config)) config = {};
    config = tool.merge(true, {}, inital, config);
    let {
        method,
        params,
        body,
        headers,
        cache,
        credentials,
        responseType
    } = config;

    // 处理URL：请求前缀 & 问号参数
    if (!/^http(s?):\/\//i.test(url)) url = baseURL + url;
    if (params != null) {
        if (tool.isPlainObject(params)) params = qs.stringify(params);
        url += `${url.includes('?')?'&':'?'}${params}`;
    }

    // 根据自己的需求来:body传递的是普通对象，我们今天项目需要传递给服务器的是URLENCODED格式，我们才处理它的格式；如果用户传递的本身就不是普通对象(例如:文件流、字符串、FORM-DATA...)，还是以用户自己写的为主...
    if (tool.isPlainObject(body)) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = qs.stringify(body);
    } else if (typeof body === 'string') {
        try {
            // 是JSON字符串
            body = JSON.parse(body);
            headers['Content-Type'] = 'application/json';
        } catch (err) {
            // 不是JSON字符串:可以简单粗暴的按照URLECCODED格式字符串处理
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    }

    // 类似于AXIOS中的请求拦截器，例如：我们每一次发请求都需要携带TOKEN信息
    let token = localStorage.getItem('token');
    if (token) headers['Authorization'] = token;

    // 把config配置成为fetch需要的对象
    config = {
        method: method.toUpperCase(),
        headers,
        credentials,
        cache
    };
    if (/^(POST|PUT|PATCH)$/i.test(method) && body != null) config.body = body;

    // 发送请求
    return fetch(url, config).then(response => {
        let {
            status,
            statusText
        } = response;
        // 只要状态码是以2或者3开始的，才是真正的获取成功
        if (status >= 200 && status < 400) {
            let result;
            switch (responseType.toUpperCase()) {
                case 'JSON':
                    result = response.json();
                    break;
                case 'TEXT':
                    result = response.text();
                    break;
                case 'BLOB':
                    result = response.blob();
                    break;
                case 'ARRAYBUFFER':
                    result = response.arrayBuffer();
                    break;
            }
            return result;
        }
        return Promise.reject({
            code: 'STATUS ERROR',
            status,
            statusText
        });
    }).catch(reason => {
        if (reason && reason.code === 'STATUS ERROR') {
            // @1 状态码错误
            switch (reason.status) {
                case 400:
                    // ...
                    break;
                case 401:
                    // ...
                    break;
                case 404:
                    // ...
                    break;
            }
        } else if (!navigator.onLine) {
            // @2 网络中断
            // ...
        } else {
            // @3 请求被终止
            // ...
        }
        return Promise.reject(reason);
    });
};
```



