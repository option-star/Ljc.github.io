---
title: 性能06 echart优化
date: 2022-04-09
sidebar: 'auto'
categories:
- 08性能
isShowComments: true
---



:::tip

​	数据量大，多个echart视图，卡顿问题

:::



## 1）使用svg作为图表的渲染器（最好不说）

- 需要创建很多echart实例且浏览器易奔溃的情况下，可以使用SVG渲染器来进行改善
- 数据量很大、较多交互时，可以选用Canvas渲染

> 使用

```js
// 使用 Canvas 渲染器（默认）
var chart = echarts.init(containerDom, null, {renderer: 'canvas'});
// 等价于：
var chart = echarts.init(containerDom);

// 使用 SVG 渲染器
var chart = echarts.init(containerDom, null, {renderer: 'svg'});
```



## 2）组件销毁时，仅清空echart实例，而非销毁

在之前的代码中，在组件销毁前，都使用dispose方法来销毁echart实例，在mounted生命周期钩子中，又重新创建echart实例。

将dispose方法改为仅用clear方法来清空图标后，页面明显不卡了。

> 实例

```js

mounted(){
 // 1. 创建图表实例
 if (!chart) {
    chart = this.$echarts.init(
      document.getElementById(this.id),
      "classic",
      {
        renderer: "svg",
      }
    );
  }
 
 ......
},

beforeDestroy() {
 if (!chart) {
   return;
 }
chart.clear();
}
```



## 3）echart实例不要挂载在vue实例上

​	echarts 图表实例不要放在 data 数据对象中，不然，每次构建响应式数据对象，都会耗费很多的时间和空间，容易出现页面卡顿的现象。

> 实现

```webpack
<script>
...
let chart = null;
...
</script>
```

