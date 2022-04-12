---
title: 业务05 转驼峰
date: 2022-04-12
sidebar: 'auto'
categories:
- 12常见业务
isShowComments: true
---

> 后端返回数据

```js
let data = {
 user_name: 'name1',
 user_id: 1000,
 age: 10,
 detail: {
   user_avatar_url: 'xxx',
   object_one: {
     a_num: 1,
     str: 'str1'
   },
   array_one: [
     [
       {
         a_num: 111,
         b_num: 222
       }
     ],
     [
       {
         c_obj: {
           c_num: 333,
           str: 'str111'
         }
       }
     ]
   ]
 }
};
```

> 具体实现

```js

// 主函数
function hump(param) {
    Object.keys(param).map((key) => {
        let item = param[key];
        // 数组、对象递归处理
        if (item instanceof Object || item instanceof Array) {
            hump(item);
        }
        if (hump_(key) !== key) {
            param[hump_(key)] = param[key];
            delete param[key]
        }
    })
    return param;
}
// 下划线转字符串
function hump_(key) {
    let keyArr = key.split('_');
    for (let i = 1; i < keyArr.length; i++) {
        keyArr[i] = keyArr[i][0].toUpperCase() + keyArr[i].substr(1);
    }
    return keyArr.join('');
}
console.log(hump(data));
```



