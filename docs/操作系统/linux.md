---
title: linux
date: 2021-12-14
sidebar: 'auto'
tags:
- linux
categories:
- 操作系统
isShowComments: true
---

## 第一章 认识linux系统

### 1.1 Linux系统的发展与应用

- Linux是一套免费使用和自由传播的类Unix操作系统；
- Linux是一个基于POSIX和UNIX的多用户、多任务、支持多线程和多CPU的操作系统。
- Linux继承了Unix以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。
- Linux能运行主要的UNIX工具软件、应用程序和网络协议；
- Linux支持32位和64位硬件。



#### 1.1.1 Linux系统的诞生与发展

![image-20211214151709882](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141517033.png)

##### （1）UNIX操作系统

​		**世界上第一个完善的网络操作系统**。Unix是1969年由美国电话电报公司(AT&T)贝尔实验室的两个工程师所创造的操作系统，它允许计算机同时处理多用户和程序。目前大型政府单位、大型企业、航空公司、金融机构多在使用，价钱昂贵，但性能和稳定性也相当地好。70年代，用C语言重新编写了一遍1973年正式发布。

###### UNIX系统的发展历史

**Multics与星际旅行**

	1. 1965年，AT&T贝尔实验室（Bell Labs）、通用电气公司、麻省理工学院MAC课题组一起联合为美国国防部研制开发了一个称为Multics（MULTiplexed Information and Computing System）的新操作系统。Multics系统的核心内容是能够很漂亮地支持大群用户对大型计算机的交互式分时使用。
	1. Multics项目终止后，当贝尔实验室从Multics研究联盟中退出时，Ken Thompson写出了一个名叫“星际旅行（Space Travel）”的游戏程序，并找到一台废弃的DEC PDP-7计算机运行他的程序。
	1. Ken Thompson和Dennis Ritchie一起着手开发DEC PDP-7上的操作环境，为支持游戏开发而在PDP-7上编制的实用程序成了UNIX的核心。它的文件系统很原始，也没有实行现在的标准，没有分时使用能力
	1. UNIX最初的名字是“UNICS”（Uniplexed Information and Computing System）。1970年，贝尔实验室的另一位研究员Brian Kernighan提出UNIX这个名字，UNIX中的Uni与Multi相对应，意为没有那么复杂，而x则是cs的谐音。
 	5. 最初的UNIX用汇编语言写成，应用程序用汇编语言和解释型语言B混合编写。
 	6. 1971年起由B语言演化成了C语言。
 	7. 1973年11月，Thompson和Ritchie等人用C语言重写了UNIX，这是UNIX操作系统迈向成功之路的关键一步，也成为“可移植操作系统”的开端。

**UNIX与黑客文化**

1. 与UNIX传统的历史交织在一起的有一种隐性文化，这是一种传达着有关美和优秀设计价值体系的文化，人们把这种文化称为“黑客文化”。
2. 这里的黑客（hacker）指的是水平极高的，热衷于编程和计算机事业的优秀人士。
3. 为了满足黑客和爱好者们的需要，AT&T公司在签署简单协议的前提下，将UNIX系统无偿地提供给大学，以供教学与研究。

**System V和BSD UNIX**

1. AT&T公司与美国司法部的法律大战终于在1982年达到终点，AT&T被重新允许进入计算机市场。
2. 贝尔实验室先后在1983年发行了System V和几种微处理机上的UNIX，1984年发行了System V Release2（SVR2）；1986年，UNIX System V发展到了修订版Res2.1和Res3.0；1987年发行了SVR3。
3. System V引入许多新特征、新设施，最有代表性的就是进程间通信机制（IPC）。

**System V和BSD UNIX**

1. UNIX系统的另外一个最重要的分支BSD UNIX的大部分特点（如C Shell、vi编辑器、作业控制、动态安装文件系统和快速文件系统）与System V UNIX都差不多，但是促使其迅速流行的原因是加州大学伯克利分校计算机系统研究小组（CSRG）最早发表的一个包括页式内存管理的UNIX版本的一系列成就。
2. FreeBSD是UNIX众多分支中相当优秀的一支，是著名的BSD UNIX的一个继承者，SUN OS和Solaris也是在BSD上发展起来的。

**UNIX与TCP/IP**

1. 1980年，国防部高级研究计划局（DARPA，Defense Advanced Research Projects Agency)需要请人在UNIX环境下的VAX机上实现全新的TCP/IP协议栈。伯克利在虚存、开放源代码方面的工作和拥有最强大开发工具的优势促使美国国防部高级计划研究署选择了伯克利UNIX作为平台，决定支持伯克利的UNIX系统开发。
2. 1983年夏天，支持TCP/IP协议版本的UNIX—BSD 4.2公开发行了，这宣布了TCP/IP的诞生，具有划时代意义。

**UNIX向GUI发展**

1. 图形用户接口（GUI）在20世纪70年代或更早就开始流传，大部分GUI从Xerox的Palo A1to研究中心的工作中演变而来。
2. GUI是一个用图形（称为图标）表示操作系统的组成部分，GUI的最初设想是创建一个友好的用户环境并以一致的隐喻来理解操作系统。
3. GUI使用方便，不是因为容易理解，而是因为使用的一致性，当用户学会在一种GUI环境下运行一个程序后，就可以容易地运行相同环境中的其他程序。

**UNIX系统的商业化**

1. UNIX系统的不断发展吸引了许多计算机公司，每一家都以AT&T或BSD为蓝本，将它们移植到自己的硬件上，并加上一些自己的“增值”功能：
2. Sun Microsystems公司基于BSD开发、发行了Sun OS，后来又基于SVR4发行了Solaris系统。
3. 微软与SCO公司合作发行了XENIX系统。
4. SCO公司将SVR3移植到386上，并将其命名为SCO UNIX。
5. IBM公司开发了AIX操作系统。
6. HP公司开发了HP-UX。
7. Digital公司开发了Digital UNIX。
8. 还有著名教授Andrew S. Tanenbaum为了教学开发的MINIX系统，以及可爱的小企鹅—Linux操作系统。

**UNIX系统的标准化**

1. 随着UNIX的商业化，UNIX的源代码开始枯竭，各大UNIX厂商也都想通过个性发展来谋取优势，各种UNIX变种的泛滥造成许多不兼容问题。
2. 美国IEEE（Institute of Electrical and Electronics Engineers，美国电气和电子工程师学会）组织成立了POSIX（Portable Operating System Interface of UNIX，可移植操作系统接口）委员会专门从事UNIX的标准化工作。
3. POSIX标准基于现有的UNIX实践和经验，描述了操作系统的系统调用接口，用于保证编制的应用程序可以在源代码一级上、在多种操作系统上移植运行。UNIX标准意味着一个可以运行UNIX应用软件的平台，它为用户提供一个标准的开发界面，而不在于系统内部如何实现。
4. POSIX委员会完成了UNIX系统标准化，各UNIX厂商要按其定义重新实现UNIX。

###### UNIX系统的特点

1. 多任务
2. 多用户
3. 并行处理能力
4. 设备无关性
5. 工具
6. 错误处理
7. 强大的网络功能
8. 开放性



##### （2）MINIX系统

​	MINIX 系统是由荷兰阿姆斯特丹vrije大学Andrew S. Tanenbaum(AST)教授开发的。他为了保持minix 的小型化，能让学生在一个学期内就能学完，而没有接纳全世界许多人对Minix 的扩展要求。

​	作为一个操作系统，MINIX 并不是优秀者，但它同时提供了用C 语言和汇编语言写的系统源代码。这是第一次使得有抱负的程序员或hacker 能够阅读操作系统的源代码，在当时这种源代码是软件商一直小心地守护着的。



##### （3）GUN项目及GPL、LGPL协议

​	GNU计划和自由软件基金会（Free Software Foundation，FSF）是由Richard M. Stallman于1984年创办的，旨在开发一个类似UNIX并且是自由软件的完整操作系统：GNU系统。

> 官方网站：http://www.gnu.org  

​	为了保证GNU软件可自由地“使用、复制、修复、修改和发布”，所有GNU软件必须遵守GNU的通用公共许可证GPL（GNU General Public License，GNU GPL）。

​	GNU GPL创造性提出了“反版权”（Copyleft），这是一个不同于商业软件“版权所有”（Copyright）的法律概念，它不否认版权，也不反对发布软件时收取费用或取得利益。它的核心是必须把发布者的一切权利给予接受者，必须保证接受者能同时或通过其他渠道得到源程序，并将GNU GPL条款附加到软件的版权声明中，使接受者知道自己的权利。

​	LGPL（Lesser General Public License）LGPL相对于GPL较为宽松，允许不公开全部源代码为基于Linux平台开发商业软件提供了更多空间。

​	现在各种使用Linux作为核心的GNU操作系统正在被广泛使用，虽然它们通常被称作“Linux”，但是严格地说，它们应该被称为GNU/Linux系统。

##### （4）Linux操作系统

- 1991年8月25日，Linus Torvalds在comp.os.minix新闻组上发表的一篇文章

![image-20211214153849886](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141538948.png)

- 1991年的10月5日，Linus Torvalds在comp.os.minix新闻组上发布消息，正式向外宣布Linux内核的诞生。
- Linux是一套免费使用和自由传播的类Unix操作系统，是一个**基于POSIX和UNIX的多用户、多任务、支持多线程和多CPU的操作系统**。它能运行主要的UNIX工具软件、应用程序和网络协议。它支持32位和64位硬件。Linux继承了Unix以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。

##### （5）Internet

- 托瓦兹的 Linux 得益于自愿传送修补程式的骇客志工， 其实都没有见过面，而且彼此在地球的各个角落，大家群策群力的共同发展出现今的 Linux ， 我们称这群人为虚拟团队！
- 为了虚拟团队资料的传输，Linux 便成立的核心网站： http://www.kernel.org 



#### 1.1.2 Linux系统的特点

![image-20211214154434505](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141544557.png)

- 完全免费
- 开放性
- 多用户、多任务
- 丰富的网络功能
- 可靠安全、性能稳定
- 支持多种平台

#### 1.1.3 Linux操作系统的组成

Linux系统一般有4个主要部分：

- **内核**
- **Shell**
- **文件系统**
- **应用程序**

![image-20211214161610291](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141616343.png)

##### （1）内核

​	 内核是操作系统的核心，具有很多最基本的功能，如虚拟内存、多任务、共享库、需求加载、可执行程序和TCP/IP网络功能。

​	Linux内核的主要模块分为**存储管理**、**CPU和进程管理**、**文件系统**、**设备管理和驱动**、**网络通信**、**系统的初始化**和**系统调用**等几个部分。

##### （2）Shell

- Shell是系统的**用户界面**，提供了**用户**与**内核**进行交互操作的一种接口。它接收用户输入的命令并把它送入内核去执行。
- Shell是一个**命令解释器**，它解释由用户输入的命令并且将它们送到内核。
- Shell也可作为**编程语言**，具有普通编程语言的很多特点，用这种编程语言编写的Shell程序与其他应用程序具有同样的效果。 

##### （3）文件系统

​	文件系统是文件存放在磁盘等存储设备上的**组织方法**。 Linux系统能支持多种目前流行的文件系统，如ext3、ext4、XFS、FAT、VFAT、NTFS和ISO9660等。

##### （4）应用程序

​	标准的Linux系统都有一套称为**应用程序**的程序集，它包括**文本编辑器**、**编程语言**、**X Window**、**办公软件**和**Internet工具**等。 

#### 1.1.4 Linux版本

- **内核版本**：1993年3月14日，Linux推出第一个正式的内核版本1.0，首次成为一个完整的操作系统，在后来的发展中，Linux内核版本的命名一直遵从以下规则：即内核版本号由形如 x1.x2.x3这三组数字组成，例如：3.10.0-327、4.4.3-1、5.3.6-1等等。
- **发行版本**：基于Linux内核的图形界面，同时配上很多功能强大的应用软件。

##### （1）内核版本

![image-20211214162208323](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141622392.png)

![image-20211214162221883](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141622939.png)



##### （2）发行版本

- Linux发行版本构成：
  - Linux内核 ＋ 各种自由软件 ＝ 完整的操作系统
  - 厂商提供的辅助安装、软件包管理等程序
- 发行版的名称、版本由发行厂商决定
  - Red Hat Enterprise Linux 7，由Red Hat公司发布
  - Suse Linux 11，由Novell公司发布
  - Debian Linux 7.5，由Debian社区发布
  - CentOS7为Red Hat的社区版本，它是来自于Red Hat Enterprise Linux依照开放源代码规定释出的源代码所编译而成，与RedHat的企业版7完全兼容

**软件发行的三种形式**

- 商业软件（Commercial Software）：先购买后使用，典型代表是Microsoft的Windows。
- 共享软件（Share Software）：先使用后付费，通常不提供源代码，到期未购买仍在继续使用者被认为是侵权。
- 自由软件（Free Software）：在发布时向用户提供源代码。通常用户通过网络等多种渠道可得到发布版本。如果用户付费，将得到完美的服务和文档。



**发行版本的获得**

Red Hat Linux：http://www.redhat.com
Fedora Linux：	http://www.fedoraproject.org
CentOS Linux:	http://www.CentOS.org
Debian Linux：	http://www.debian.org
Ubuntu Linux：	http://www.Ubuntu.com
SuSE Linux：	http://www.SuSE.com
红旗Linux：  	http://www.redflag-linux.com
中软麒麟：   	http://www.cs2c.com.cn
深度操作系统： 	https://www.deepin.org
华为云镜像： 	http://mirrors.huaweicloud.com
阿里云镜像： 	http://mirrors.aliyun.com



### 1.2理解系统启动过程

1. BIOS启动引导阶段: 大多数Linux发行版本使用的引导加载程序有三种：GRUB，GRUB2和LILO。GRUB2是最新的，也是同类程序中使用最广的。
2. GRUB2启动引导阶段: GRUB2是CentOS7默认的引导加载程序，GRUB2的配置文件位于/boot/grub2/grub.cfg。GRUB2将vmlinuz内核映像文件加载到内存中。
3. 内核阶段: 内核是操作系统的核心，是系统启动时加载的第一个程序。系统启动内核从initrd.img（initrd是一种基于内存的文件系统，启动过程中，系统在访问真正的根文件系统时，会先访问initrd文件系统）将所有必需驱动模块加载到Linux系统中并运行1号进程systemd。
4. systemd进程初始化 :  Systemd 进程是在Linux系统上运行的第一个进程（PID为1），它初始化系统并启动init（/etc/init.d）进程曾经启动的所有服务，读取配置文件，在目标runlevel.target中加载操作系统。

### 1.3 系统初步使用

  	Linux的运维服务一般是在命令行下进行的，在Linux系统的图形化桌面环境中提供了模拟终端命令行界面的方式，终端方式允许用户通过输入命令使用计算机。

![image-20211214163054654](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141630720.png)

#### 1.3.1 约定

- 图形界面被称为GUI（Graphic User Interface）
- 字符界面是基于传统UNIX的字符终端操作界面，又被称为TUI（Terminal User Interface）。
- CLI：在图形界面下，还可开启一个或多个字符界面，并在项目执行命令，被称为模拟终端命令行界面，简称CLI。

#### 1.3.2 图形界面下模拟终端命令行界面

<img src="https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141633907.png" alt="image-20211214163321866" style="zoom:150%;" />

其中：

- `@`符号之前，是当前登录的用户名
- `@`符号之后到`~`符号之前，是计算机的主机名（hostname）。
- `~`符号是当前目录。
- `$`符号，是普通用户的命令提示符，提示用户可以在此提示符之后输入`Shell`命令。
- `#`符号，Linux的最高权限用户root的提示符

默认普通用户是用$作为提示符的

#### 1.3.3 Linux字符界面

​	安装Linux系统后，系统默认进入的是图形化界面。

![image-20211214163548335](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112141635374.png)





## 第二章 shell命令



## 第三章 用户、组和密码管理



## 第四章 文件系统及管理



## 第五章 进程



## 第六章 脚本程序设计



## 第七章 GUN C开发环境



## 第八章 文件编程



## 第九章进程编程



## 第十章 网络管理



## 习题



### 选择题

#### 1. 关于 Linux 内核版本的说法，以下错误的是（ C ）

A．表示为主版本号.次版本号.修正号 B．1.2.3 表示稳定的发行版

C．1.3.3 表示稳定的发行版                D．2.2.5 表示对内核 2.2 的第 5 次修正



### 填空题

#### 1. Linux 最初是基于（ Minix ）操作系统开发出来的。

#### 2. 





