---
title: CSS07 BFC
date: 2022-04-2
sidebar: 'auto'
categories:
- 02CSS
isShowComments: true
---



## 1. 常见的定位方案

定位方案是控制元素的布局，有三种常见方案:

- 普通流 (normal flow)

> 在普通流中，元素按照其在 HTML 中的先后位置至上而下布局，在这个过程中，行内元素水平排列，直到当行被占满然后换行，块级元素则会被渲染为完整的一个新行，除非另外指定，否则所有元素默认都是普通流定位，也可以说，普通流中元素的位置由该元素在 HTML 文档中的位置决定。

- 浮动 (float)

> 在浮动布局中，元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或右边偏移，其效果与印刷排版中的文本环绕相似。

- 绝对定位 (absolute positioning)

> 在绝对定位布局中，元素会整体脱离普通流，因此绝对定位元素不会对其兄弟元素造成影响，而元素具体的位置由绝对定位的坐标决定。

## 2. BFC概念

​	BFC 即 Block Formatting Contexts (块级格式化上下文)，它属于上述定位方案的普通流。

​	**具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。**

​	通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。



## 3. 触发BFC

> 触发BFC的CSS属性

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

## 4.常见应用

### （1）解决margin的重叠问题

​	由于BFC是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个BFC，就解决了 margin 重叠的问题。**解决**： 通过给下面的元素用`p`标签包裹

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .box {
            margin: 10px;
            width: 100px;
            height: 100px;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
```

**效果：**

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9205525816724ed792539197e22ac098~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以看到上面我们为两个盒子的`margin`外边距设置的是`10px`，可结果显示两个盒子之间只有`10px`的距离，这就导致了`margin`塌陷问题，这时`margin`边距的结果为最大值，而不是合，为了解决此问题可以使用`BFC`规则（为元素包裹一个盒子形成一个完全独立的空间，做到里面元素不受外面布局影响），或者简单粗暴方法一个设置`margin`，一个设置`padding`。

**修改代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Margin边距重叠</title>
    <style>
        .box {
            margin: 10px;
            width: 100px;
            height: 100px;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <p><div class="box"></div></p> // 添加
    </div>
</body>
</html>
```

**效果：**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202204021530843.webp)

### （2）解决高度塌陷的问题

​	在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为0。解决这个问题，只需要把父元素变成一个 BFC。常用的办法是给父元素设置`display:inline-block`。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高度塌陷</title>
    <style>
        .box {
            margin: 100px;
            width: 100px;
            height: 100px;
            background: red;
            float: left;
        }
        .container {
            background: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
```

**效果：**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203181230077.webp)

​	可以看到上面效果给`box`设置完`float`结果脱离文档流，使`container`高度没有被撑开，从而背景颜色没有颜色出来，解决此问题可以给`container`触发`BFC`，上面我们所说到的触发`BFC`属性都可以设置。

**修改代码**

解决： 通过给父元素设置`display:inline-block`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>高度塌陷</title>
    <style>
        .box {
            margin: 100px;
            width: 100px;
            height: 100px;
            background: red;
            float: left;
        }
        .container {
            background: #000;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box"></div>
        <div class="box"></div>
    </div>
</body>
</html>
```

**效果：**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203181231160.webp)

### （3）创建自适应两栏布局

​	可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应。

​	左侧设置`float:left`，右侧设置`overflow: hidden`。这样右边就触发了BFC，BFC 的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠，实现了自适应两栏布局。

> 自适应两栏布局

```html
.left{
     width: 100px;
     height: 200px;
     background: red;
     float: left;
 }
 .right{
     height: 300px;
     background: blue;
     overflow: hidden;
 }
 
<div class="left"></div>
<div class="right"></div>
```

