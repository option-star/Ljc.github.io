---
title: 工程化04:Git
date: 2022-03-23
sidebar: 'auto'
categories:
- 05 工程化
isShowComments: true
---



## 1. Git的工作区域和流程

![git](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203232203985.webp)

- `Workspace`: 工作区，就是平时进行开发改动的地方，是当前看到最新的内容，在开发的过程也就是对工作区的操作
- `Index`: 暂存区，当执行`git add`命令后，工作区的文件就会被移动入暂存区，暂存区标记了当前工作区中那些内容是被`Git`管理的，当完成某个需求或者功能后需要提交代码，第一步就是通过`git add`先提交到暂存区
- `Repository` : 本地仓库，位于自己的电脑上，通过`git commit`提交缓存区的内容，会进入本地仓库。
- `Remote`: 远程仓库，用来托管代码的服务器，远程仓库的内容能够给被分布在多个地点的处于协作关系的本地仓库修改，本地仓库修改完代码后，通过`git push`命令同步代码到远程仓库。

一般来说，Git的工作流程分为一下几步：

1. 在工作区开发、添加、修改文件
2. 将修改后的文件放入暂存区
3. 将暂存区域的文件提交到本地仓库
4. 将本地仓库的修改推送到远程仓库

## 2. Git基本操作

### 1）git add

```bash
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx

# 添加当前更改的所有文件到暂存区
git add .
```

### 2）git commit

```bash
# 提交暂存的更改，会新开编辑器进行编辑
git commit

# 提交暂存的更改，并记录下备注
git commit -m "message"

# 等同于 git add . && git commit -m
git commit -am

# 对最近的一次的提交的信息进行修改，此操作会修改commit的hash值
git commit --amend
```



### 3）git pull

```bash
# 从远程仓库拉取代码并合并到本地，可简写git pull 等同于git fetch && git merge
git pull <远程主机名> <远程分支名>:<本地分支名>

# 使用rebase的模式进行合并
git pull --rebase <远程主机名><远程分支名>:<本地分支名>
```



### 4）git fetch

与`git pull`不同的是`git fetch`操作仅仅只会拉去远程的更改，不会自动进行merge操作。对你当前的代码没有影响

```bash
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <远程分支>

# 获取远程仓库所有分支的更新
git fetch --all
```



### 5）git branch

```bash
# 新建本地分支，但不切换
git branch <branch-name> 

# 切换到对应分支
git checkout 分支名

# 查看本地分支
git branch

# 查看远程分支
git branch -r

# 查看本地和远程分支
git branch -a

# 删除本地分支
git branch -D <branch-nane>

# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```



## 3. Git常用命令

### 1）克隆远程分支仓库

```bash
git clone -b 分支名称 远程地址
```

git 克隆远程仓库项目时，如果不指定分支，只会克隆默认分支的内容。

### 2）查看用户名和邮箱

```bash
git config user.name
git config user.email
```



### 3） 查看commit历史

```bash
git log
git log --summary
```



### 4）设置git账号

```bash
git config --global user.name "foo"
git config --global user.email foo@gmail.com"
git config user.name "foo"
git config user.email "foo@gmail.com"
```



### 5）查看git 账号

```bash
# 查看所有账号信息
git config --global --list
git config --local --list

# 查看某一项的配置信息
git config --local user.name
```



### 6）回滚本次修改

```bash
git reset HEAD foo.js
git checkout -- foo.js
```



### 7）查看本次修改的代码

```bash
git diff
git diff HEAD
git diff --staged
```





## 参考

1. [我在工作中是如何使用 git 的](https://juejin.cn/post/6974184935804534815#heading-9)
2. [45 个 Git 经典操作场景，专治不会合代码](https://mp.weixin.qq.com/s/BzdgZXyM1UaNCUCXySL9Rw)
3. [一份工作4年前端的Git备忘指南](https://juejin.cn/post/6967634683811069982)

