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

```css
/* Less */
.card() {
    background: #f6f6f6;
    -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
    box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
}
#wrap{
  .card();
}

/* 生成的 CSS */
#wrap{
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
}

```

> 注意

- `.`和`#`皆可作为方法前缀



### 2）默认参数方法

```less
/* Less */
.border(@a:10px,@b:50px,@c:30px,@color:#000){
    border:solid 1px @color;
    box-shadow: @arguments;//指代的是 全部参数
}
#main{
    .border(0px,5px,30px,red);//必须带着单位
}
#wrap{
    .border(0px);
}
#content{
  	.border;//等价于 .border()
}

/* 生成的 CSS */
#main{
    border:solid 1px red;
    box-shadow:0px,5px,30px,red;
}
#wrap{
    border:solid 1px #000;
    box-shadow: 0px 50px 30px #000;
}
#content{
    border:solid 1px #000;
    box-shadow: 10px 50px 30px #000;
}


```

> 注意

- 如果没传参数，则使用默认参数
- `@arguments`: 指代全部参数
- 参数必须带单位



### 3）方法的匹配模式

```less
/* Less */
.triangle(top,@width:20px,@color:#000){
    border-color:transparent  transparent @color transparent ;
}
.triangle(right,@width:20px,@color:#000){
    border-color:transparent @color transparent  transparent ;
}

.triangle(bottom,@width:20px,@color:#000){
    border-color:@color transparent  transparent  transparent ;
}
.triangle(left,@width:20px,@color:#000){
    border-color:transparent  transparent  transparent @color;
}
.triangle(@_,@width:20px,@color:#000){
    border-style: solid;
    border-width: @width;
}
#main{
    .triangle(left, 50px, #999)
}
/* 生成的 CSS */
#main{
  border-color:transparent  transparent  transparent #999;
  border-style: solid;
  border-width: 50px;
}

```

> **注意**

- 第一个参数`left`会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在样式覆盖替换
- 如果匹配的参数是变量，则将会匹配，如`@_`

### 4）方法的命名空间

```less
/* Less */
#card(){
    background: #723232;
    .d(@w:300px){
        width: @w;
        
        #a(@h:300px){
            height: @h;//可以使用上一层传进来的方法
        }
    }
}
#wrap{
    #card > .d > #a(100px); // 父元素不能加 括号
}
#main{
    #card .d();
}
#con{
    //不得单独使用命名空间的方法
    //.d() 如果前面没有引入命名空间 #card ，将会报错
    
    #card; // 等价于 #card();
    .d(20px); //必须先引入 #card
}

/* 生成的 CSS */
#wrap{
  height:100px;
}
#main{
  width:300px;
}
#con{
  width:20px;
}
```

> **注意**

- 通过`>`选择器，选择儿子元素
- 在引入命令空间时，如使用`>`选择器，父元素不能加括号
- 不得单独使用命名空间得方法，必须先引入命名空间，才能使用其中方法。
- 子方法可以是使用上一层传进来的方法

### 5）方法的条件筛选

`when`相当于JS的`if else`：

```less
/* Less */
#card{
    
    // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
    .border(@width,@color,@style) when (@width>100px) and(@color=#999){
        border:@style @color @width;
    }

    // not 运算符，相当于 非运算 !，条件为 不符合才会执行
    .background(@color) when not (@color>=#222){
        background:@color;
    }

    // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
    .font(@size:20px) when (@size>50px) , (@size<100px){
        font-size: @size;
    }
}
#main{
    #card>.border(200px,#999,solid);
    #card .background(#111);
    #card > .font(40px);
}

/* 生成后的 CSS */
#main{
  border:solid #999 200px;
  background:#111;
  font-size:40px;
}
```

> **注意**

- `=` 代表等于
- 除去关键字`true`以外的值被视为`false`

### 6）数量不定的参数

接受数量不定的参数，可用`...`

```ts
/* Less */
.boxShadow(...){
    box-shadow: @arguments;
}
.textShadow(@a,...){
    text-shadow: @arguments;
}
#main{
    .boxShadow(1px,4px,30px,red);
    .textShadow(1px,4px,30px,red);
}

/* 生成后的 CSS */
#main{
  box-shadow: 1px 4px 30px red;
  text-shadow: 1px 4px 30px red;
}
```



### 7）方法使用`!important`

在方法名后，加上关键字。

```less
/* Less */
.border{
    border: solid 1px red;
    margin: 50px;
}
#main{
    .border() !important;
}
/* 生成后的 CSS */
#main {
    border: solid 1px red !important;
    margin: 50px !important;
}
```

### 8）循环方法

通过递归实现 循环效果

```less
/* Less */
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
/* 生成后的 CSS */
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}

```

### 9）属性拼接方法

> **逗号** ：`+`

```less
/* Less */
.boxShadow() {
    box-shadow+: inset 0 0 10px #555;
}
.main {
  .boxShadow();
  box-shadow+: 0 0 20px black;
}
/* 生成后的 CSS */
.main {
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}

```



> **空格**： `+_`

```less
/* Less */
.Animation() {
  transform+_: scale(2);
}
.main {
  .Animation();
  transform+_: rotate(15deg);
}

/* 生成的 CSS */
.main {
  transform: scale(2) rotate(15deg);
}
```

### 10）示例

```less
/* Less */
.average(@x, @y) {
  @average: ((@x + @y) / 2);
}

div {
  .average(16px, 50px); // 调用 方法
  padding: @average;    // 使用返回值
}

/* 生成的 CSS */
div {
  padding: 33px;
}
```



## 4. 继承

### 1）extend关键字的使用

```less
/* Less */
.animation{
    transition: all .3s ease-out;
    .hide{
      transform:scale(0);
    }
}
#main{
    &:extend(.animation);
}
#con{
    &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation,#main{
  transition: all .3s ease-out;
}
.animation .hide , #con{
    transform:scale(0);
}

```



### 2）all全局搜索替换

使用all选择器匹配到全部声明。

```less
/* Less */
#main{
  width: 200px;
}
#main {
  &:after {
    content:"Less is good!";
  }
}
#wrap:extend(#main all) {}

/* 生成的 CSS */
#main,#wrap{
  width: 200px;
}
#main:after, #wrap:after {
    content: "Less is good!";
}

```



### 3）减少代码的重复性

​	从表面 看来，extend 与 方法 最大的差别，就是 extend 是同个选择器共用同一个声明，而 方法 是使用自己的声明，这无疑 增加了代码的重复性。

```less
/* Less */
.Method{
  width: 200px;
  &:after {
      content:"Less is good!";
  }
}
#main{
  .Method;
}
#wrap{
  .Method;
}

/* 生成的 CSS */
#main{
  width: 200px;
  &:after{
    content:"Less is good!";
  }  
}
#wrap{
  width: 200px;
  &:after{
    content:"Less is good!";
  }  
}
```

### 4）注意

- 选择器和扩展之间 是允许有空格的

```less
pre:hover:extend(div pre)
```

- 可以有多个扩展

```less
pre:hover:extend(div pre):extend(.bucket tr)
```

与以下代码一致

```less
pre:hover:extend(div pre, .bucket tr)
```

- 扩展必须写在最后
- 如果一个规则集包含多个选择器，所有选择器都可以使用`extend`关键字



## 5. 导入

### 1）导入`less`文件，可省略后缀

```less
import "main"; 
//等价于
import "main.less";
```



### 2）`@import`的位置可以随意放置

```less
#main{
  font-size:15px;
}
@import "style";
```



### 3）reference

​	使用`@import(reference)`导入外部文件，但不会添加把导入的文件编译到最终输出中，只引用。

```less
/* Less */
@import (reference) "bootstrap.less"; 

#wrap:extend(.navbar all){}
```



### 4）once

​	`@import`语句的默认行为。这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解析。

```less
@import (once) "foo.less";
@import (once) "foo.less"; // this statement will be ignored
```



### 5）multiple

​	使用`@import(multiple)`允许导入多个同名文件。

```less
/* Less */

// file: foo.less
.a {
  color: green;
}
// file: main.less
@import (multiple) "foo.less";
@import (multiple) "foo.less";

/* 生成后的 CSS */
.a {
  color: green;
}
.a {
  color: green;
}

```



## 6. 函数

### 1）类型判断

- `isnumber` : 判断给定的值是否是一个数字
- `iscolor`： 判断给定的值是否是一个颜色
- `isurl`: 判断给定的值是否是一个url



### 2）颜色操作

- `saturate` : 增加一定数值的颜色饱和度
- `lighten`: 增加一定数值的颜色亮度
- `darken`: 减低一定数值的颜色亮度
- `fade`: 给颜色设定一定数值的透明度
- `mix`： 根据比例混合两种颜色



### 3）数字函数

> [更多](http://lesscss.cn/functions/)

- `ceil`： 向上取整
- `floor`: 向下取整
- `percentage`: 将浮点数转换为百分比字符串
- `round` : 四舍五入
- `sqrt` : 计算一个数的平方根
- `abs`: 计算数字的绝对值，原样保持单位
- `pow`： 计算一个数的乘方



## 参考

1. [学习Less-看这篇就够了](https://juejin.cn/post/6844903520441729037#comment)
2. [less中文官网](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)