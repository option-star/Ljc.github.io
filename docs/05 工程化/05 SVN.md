---
title: 工程化05 SVN
date: 2022-04-21
sidebar: 'auto'
categories:
- 05工程化
isShowComments: true
---



## 1. 什么是SVN？

​	SVN（subversion），是一个开源代码的版本控制系统，通过采用分支管理系统的高效管理，简而言之就是用于多个人共同开发同一个项目，实现共享资源，实现最终集中式的管理。



## 2. SVN的中心化？

​	svn是有一个服务中心的，总的代码就在这个服务中心上，然后其他各个电脑上的客户端可以链接到这个中心，从而可以从中心拉取代码以及提交代码。

![在这里插入图片描述](https://cdn.jsdelivr.net/gh/option-star/imgs/202204211647370.png)



## 3. svn的工作原理

​	SVN是一个增量式的版本控制，它不会将各个版本的副本都完整保存下来，而只会记录下版本之间的差异，然后按照顺序更新或者恢复特定版本的数据。这使得服务端的存储量会非常低。

![](https://cdn.jsdelivr.net/gh/option-star/imgs/202204211643177.png)



## 4. 数据存储

> **BDB**

​	BDB，一种事务安全型类型，版本库可以使用的一种经过充分测试的后台**数据库**实现，不能再通过网络共享的文件系统上使用。但该方式在服务器中断时，有可能锁住数据。

​	BDB是Subversion1.2 版本以前的缺省版本库格式。



> **FSFS**

​	FSFS，一个专用于Subversion版本库的文件系统后端，可以使用网络**文件**系统。

​	是1.2版本及以后的缺省版本库格式。



## 5. SVN和Git的区别？

> SVN

​	SVN 是一种集中式管理的版本控制工具，分为服务器和客户端，客户端每次完成或修改代码需要联网提交到服务端进行存储，冲突主要源于时效性，操作重点在于先更新再提交。

> Git

​	Git 是一种分布式管理的版本控制工具，分为远程版本库和本地版本库，每个节点都是自己服务器兼客户端，完成或修改代码时直接提交到本地版本库节点，无需联网；只有推送和克隆版本呢库时需要联网和远程版本库进行ssh对接。



## 6. 命令

| 作用           | git                                      | svn                |
| -------------- | ---------------------------------------- | ------------------ |
| 版本库初始化   | git init                                 | svn create         |
| clone          | git clone                                | svn co（checkout） |
| add            | git add （.除去.gitignore，*所有的文件） | svn add            |
| commit         | git commit                               | svn commit         |
| pull           | git pull                                 | svn update         |
| push           | git push                                 | -                  |
| 查看工作状态   | git status                               | svn status         |
| 创建分支       | git branch <分支名>                      | svn cp <分支名>    |
| 删除分支       | git branch -d <分支名>                   | svn rm <分支名>    |
| 分支合并       | git merge <分支名>                       | svn merge <分支名> |
| 工作区差异     | git differ （-cached / head）            | svn diff           |
| 更新至历史版本 | git checkout                             | svn update -r      |
| 切换tag        | git checkout                             | svn switch         |
| 切换分支       | git checkout branch                      | svn switch branch  |
| 还原文件       | git checkout - path                      | svn revert path    |
| 删除文件       | git rm path                              | svn rm path        |
| 移动文件       | git mv path                              | svn mv path        |
| 清除未追踪文件 | git clean                                | svn status sed -e  |

:::tip

​	只是做了浅显的了解。

:::



## 参考

1. [菜鸟教程](https://www.runoob.com/svn/svn-tutorial.html)
2. [SVN工作原理](https://blog.csdn.net/potato512/article/details/83895244)
3. 