---
title: SQL注入
sidebar: 'auto'
date: 2021-11-06
categories:
- 前端安全
isShowComments: true
---

## 什么是SQL注入

SQL注入，就是通过SQL命令插入到Web表单提交、输入域名、页面请求的查询字符串，最终欺骗服务器执行恶意的SQL命令。

## 实例

```js
// 填入特殊密码
1'or'1'='1

// 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang'
AND password = '1'or'1'='1'
```

## 防范

-   **严格限制用户数据库操作权限**。给予用户仅仅能满足其工作的最低权限。
-   **后端代码检查输入的数据是否符合预期**。严格限制变量的类型，例如使用正则表达式进行一些匹配处理
-   **对进入数据库的特殊字符进行转义处理**
-   **所有的查询语句使用数据库提供的参数化查询接口**，比如使用？占位符

```sql
// 错误写法
const sql = `
    SELECT *
    FROM test.user
    WHERE username = '${ctx.request.body.username}'
    AND password = '${ctx.request.body.password}'
`
console.log('sql', sql)
res = await query(sql)
// 正确的写法
const sql = `
SELECT *
FROM test.user
WHERE username = ?
AND password = ?
`
console.log('sql', sql, )
res = await query(sql,[ctx.request.body.username, ctx.request.body.password])
```

## 参考

1.   [CSRF, XSS, Sql注入原理和处理方案](https://juejin.cn/post/6844903729217568776)

