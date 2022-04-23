---
title: CSS09 less
date: 2022-04-23
sidebar: 'auto'
categories:
- 02CSS
isShowComments: true
---





## 1. 变量

### 1）属性值变量

> 使用

```css
/* Less */
@color: #999;
@bgColor: skyblue;//不要添加引号
@width: 50%;
#wrap {
  color: @color;
  background: @bgColor;
  width: @width;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
  background: skyblue;
  width: 50%;
}
```

> 定义

​	以`@`开头定义变量，并且使用时 直接 键入`@`名称。

> 应用

​	平时工作中，把常用的变量封装到一个文件中，有利于代码组织维护。

```css
@lightPrimaryColor: #c5cae9;
@textPrimaryColor: #fff;
@accentColor: rgb(99, 137, 185);
@primaryTextColor: #646464;
@secondaryTextColor: #000;
@dividerColor: #b6b6b6;
@borderColor: #dadada;
```

### 2）选择器变量

> 使用

```js
/* Less */
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector}{ //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}
.@{Wrap}{
  color:#ccc;
}
#@{Wrap}{
  color:#666;
}

/* 生成的 CSS */
#wrap{
  color: #999;
  width: 50%;
}
.wrap{
  color:#ccc;
}
#wrap{
  color:#666;
}
```

> 注意

1. 变量名必须使用大括号包裹



### 3）属性键变量

> 使用

```css
/* Less */
@borderStyle: border-style;
@Soild:solid;
#wrap{
  @{borderStyle}: @Soild;//变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap{
  border-style:solid;
}
```

> 注意

1. 变量名，必须使用大括号包裹



### 4）url变量

> 使用

```css
/* Less */
@images: "../img";//需要加引号
body {
  background: url("@{images}/dog.png");//变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url("../img/dog.png");
}
```

> 注意

- 变量名必须使用大括号包裹

### 5）声明变量

> 格式

- 结构： `@name: {属性:值}`
- 使用： `@name()`



> 使用

```less
/* Less */
@background: {background:red;};
#main{
    @background();
}
@Rules:{
    width: 200px;
    height: 200px;
    border: solid 1px red;
};
#con{
  @Rules();
}

/* 生成的 CSS */
#main{
  background:red;
}
#con{
  width: 200px;
  height: 200px;
  border: solid 1px red;
}
```

### 6）变量运算

> 使用

```js
/* Less */
@width:300px;
@color:#222;
#wrap{
  width:@width-20;
  height:@width-20*5;
  margin:(@width-20)*5;
  color:@color*2;
  background-color:@color + #111;
}

/* 生成的 CSS */
#wrap{
  width:280px;
  height:200px;
  margin:1400px;
  color:#444;
  background-color:#333;
}
```

> 注意

- 加减法时，以第一个数据单位为基准
- 乘除法时，注意单位一定要统一

### 7）变量作用域

> 使用

```less
/* Less */
@var: @a;
@a: 100%;
#wrap {
  width: @var;
  @a: 9%;
}

/* 生成的 CSS */
#wrap {
  width: 9%;
}
```

> 注意

- **就近原则**

### 8）用变量去定义变量

```less
/* Less */
@fnord:  "I am fnord.";
@var:    "fnord";
#wrap::after{
  content: @@var; //将@var替换为其值 content:@fnord;
}
/* 生成的 CSS */
#wrap::after{
  content: "I am fnord.";
}
```



## 2. 嵌套

### 1）&

> 定义

​	&： 代表的上一层选择器的名字

> 使用

```less
/* Less */
#header{
  &:after{
    content:"Less is more!";
  }
  .title{
    font-weight:bold;
  }
  &_content{//理解方式：直接把 & 替换成 #header
    margin:20px;
  }
}
/* 生成的 CSS */
#header::after{
  content:"Less is more!";
}
#header .title{ //嵌套了
  font-weight:bold;
}
#header_content{//没有嵌套！
    margin:20px;
}
```



### 2）媒体查询

> 未用less的媒体查询

```css
#wrap{
  width:500px;
}
@media screen and (max-width:768px){
  #wrap{
    width:100px;
  }
}

```

> less的媒体查询

```less
/* Less */
#main{
    //something...

    @media screen{
        @media (max-width:768px){
          width:100px;
        }
    }
    @media tv {
      width:2000px;
    }
}

/* 生成的 CSS */
@media screen and (maxwidth:768px){
  #main{
      width:100px; 
  }
}
@media tv{
  #main{
    width:2000px;
  }
}
```

> 缺点

- 每一个元素都会编译出自己的`@media`声明，并不会合并



## 3. 混合方法

### 1）无参数方法









## 参考

1. [学习Less-看这篇就够了](https://juejin.cn/post/6844903520441729037#comment)
2. [less中文官网](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)