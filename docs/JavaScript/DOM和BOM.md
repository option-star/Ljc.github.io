---
title:  DOM和BOM
date: 2021-11-10
sidebar: 'auto'
tags:
- DOM
- BOM
categories:
- JavaScript
isShowComments: true 
---

## DOM

​	DOM指的是文档对象模型，它指的是把文档当作一个对象对待，这个对象主要定义了处理网页内容的方法和接口。

## BOM

​	BOM指的是浏览器对象模型，它指的是把浏览器当作一个对象对待，这个对象主要定义了与浏览器进行交互的方法和接口。

​	BOM的核心是window，而window对象具有双重角色，它既是通过js访问浏览器窗口的一个接口，又是一个Global对象，这意味着在网页中定义的任何对象、变量和函数，都作为全局对象的一个属性或方法，window对象包含location对象、navigator 对象、screen 对象等子对象，并且 DOM 的最根本的对象 document 对象也是 BOM 的 window 对 象的子对象。

