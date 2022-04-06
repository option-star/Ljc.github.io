---
title: CSS03 flex布局
date: 2022-03-29
sidebar: 'auto'
categories:
- 02CSS
isShowComments: true
---



## flex 基本概念

​	使用 flex 布局首先要设置父容器 `display: flex`，然后再设置 `justify-content: center` 实现水平居中，最后设置 `align-items: center` 实现垂直居中。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/leancloud-assets/933e6f0857399ccf7e83.png~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

​	flex 的核心的概念就是 **容器** 和 **轴**。容器包括外层的 **父容器** 和内层的 **子容器**，轴包括 **主轴** 和 **交叉轴**，可以说 flex 布局的全部特性都构建在这两个概念上。

### 1. 容器

> 容器具有这样的特点：父容器可以统一设置子容器的排列方式，子容器也可以单独设置自身的排列方式，如果两者同时设置，以子容器的设置为准。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291333277.webp)

#### 1.1 父容器

##### justify-content

- 设置子容器沿着主轴排列： `justify-content`

`justify-content`属性用于定于如何沿着主轴方向排列子容器。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291336726.webp)

> **flex-start**: 起始端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291337192.webp)

> **flex-end**: 末尾端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291342180.webp)

> **center**： 居中对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291343763.webp)

> **space-around**: 子容器沿主轴均匀分布，位于首位两端的子容器到父容器的距离是子容器间距的一半。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291344182.webp)

> **space-between**: 子容器沿主轴均匀分布，位于首尾两端的子容器与父容器相切

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291345865.webp)



##### align-items

- 设置子容器如何沿交叉轴排列：**align-items**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291347641.webp)

> **flex-start**: 起始端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291348945.webp)

> **flex-end**： 末尾端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291348365.webp)

> **center**: 居中对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291349306.webp)



> **baseline**: 基线对齐，这里的 `baseline` 默认是指首行文字，即 `first baseline`，所有子容器向基线对齐，交叉轴起点到元素基线距离最大的子容器将会与交叉轴起始端相切以确定基线。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291351406.webp)



> **stretch**：子容器沿交叉轴方向的尺寸拉伸至与父容器一致。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291351031.webp)



#### 1.2 子容器

##### flex

- 在主轴上如何伸缩： **flex**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291356374.webp)

子容器是有弹性的（flex 即弹性），它们会自动填充剩余空间，子容器的伸缩比例由 `flex` 属性确定。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291358696.webp)

> **flex-grow**: 在flex容器中分配剩余空间的相对比例



> **flex-shrink**: flex元素的收缩规则。flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值。



> **flex-basis**: 指定了 flex 元素在主轴方向上的初始大小



##### align-self

- 单独设置子容器如何沿交叉轴排列：**algin-self**

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291407959.webp)

​	每个子容器也可以单独定义沿交叉轴排列的方式，此属性的可选值与父容器 `align-items` 属性完全一致，如果两者同时设置则以子容器的 `align-self` 属性为准。

> **flex-start**: 起始端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291407109.webp)



> **flex-end**: 末尾端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291409974.webp)



> **center**：居中对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291409256.webp)

> **baseline**: 基线对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291409179.webp)



> **stretch**: 拉伸对齐

![](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291410285.webp)



### 2. 轴

​	在 flex 布局中，`flex-direction` 属性决定主轴的方向，交叉轴的方向由主轴确定。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291425148.webp)

#### 2.1 主轴

​	主轴的起始端由`flex-start`表示，末尾端由`flex-end`表示。不同的主轴方向对应的起始端、末尾端的位置也不相同。

> 向右： `flex-direction: row`

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291429379.webp)



> 向下： `flex-direction: column`

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291430106.webp)



> 向左： `flex-direction: row-reverse`

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291431359.webp)

> 向上：`flex-direction: column-reverse`

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291433840.webp)



#### 2.2 交叉轴

​	主轴沿逆时针方向旋转 90° 就得到了交叉轴，交叉轴的起始端和末尾段也由 `flex-start` 和 `flex-end` 表示。



## flex 进阶概念



### 1. 父容器

#### flex-wrap

- 设置换行方式: `flex-warp` 

设置子容器是否换行排列，不但可以顺序换行而且支持逆序换行。

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204060944416.webp)

> **nowrap**: 不换行

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204060945521.webp)

> **warp**: 换行

![img](https://cdn.jsdelivr.net/gh/option-star/imgs/202204060945776.webp)

> **warp-reverse**: 逆序换行

逆序换行是指沿着交叉轴的反方向换行

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291440762.webp)



#### flex-flow

- 轴向与换行组合设置： **flex-flow**

flow 即流向，也就是子容器沿着哪个方向流动，流动到终点是否允许换行，比如 `flex-flow: row wrap`，`flex-flow` 是一个复合属性，相当于 flex-direction 与 flex-wrap 的组合，可选的取值如下：

- `row`、`column` 等，可单独设置主轴方向
- `wrap`、`nowrap` 等，可单独设置换行方式
- `row nowrap`、`column wrap` 等，也可两者同时设置



#### align-content

- 多行沿交叉轴对齐： **align-content**

当子容器多行排列时，设置行与行之间的对齐方式。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291452817.webp)

> **flex-start**：起始端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291453048.webp)

> **flex-end**: 末尾端对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291456749.webp)



> **center**: 居中对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291457097.webp)



> **space-around**: 等边距均匀分布

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291457045.webp)



> **space-between**: 等边距均匀分布

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291458421.webp)



> **stretch**： 拉伸对齐

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291459446.webp)



### 2. 子容器

#### flex-basis

- 设置基准大小： **flex-basis**

`flex-basis` 表示在不伸缩的情况下子容器的原始尺寸。主轴为横向时代表宽度，主轴为纵向时代表高度。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291500315.webp)

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291500937.webp)



#### flex-grow

- 设置扩展比例： **flex-grow**

​	子容器弹性伸展的比例。如图，剩余空间按 1:2 的比例分配给子容器。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291501875.webp)

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291501606.webp)

#### flex-shrink

- 设置收缩比例： **flex-shrink**

子容器弹性收缩的比例。如图，超出的部分按 1:2 的比例从给子容器中减去。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291504118.webp)

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291504417.webp)

#### order

改变子容器的排列顺序，覆盖 HTML 代码中的顺序，默认值为 0，可以为负值，数值越小排列越靠前。

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203291536366.webp)



## 总结

​	flex 布局是 CSS3 新增的一种布局方式，可以通过将一个元素的 display 属性值设置为 flex 从而使它成为一个 flex 容器，它的所有子元素都会成为它的项目。

​	一个**容器**默认有两条轴：一个是水平的主轴，一个是与主轴垂直的交叉轴。可以使用 flex-direction 来指定主轴的方向。可以使用 justify-content 来指定元素在主轴上的排列方式，使用 align-items 来指定元素在交叉轴上的排列方式。还可以使用 flex-wrap 来规定当一行排列不下时的换行方式。

​	对于**容器中的项目**，可以使用 order 属性来指定项目的排列顺序，还可以使用f lex-grow 来指定当排列空间有剩余的时候，项目的放大比例，还可以使用 flex-shrink 来指定当排列空间不足时，项目的缩小比例。



## 参考

1. [一劳永逸的搞定 flex 布局](https://juejin.cn/post/6844903474774147086)
