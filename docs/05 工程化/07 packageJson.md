---
title: 工程化07 package.json
date: 2022-04-23
sidebar: 'auto'
categories:
- 05工程化
isShowComments: true
---



> package.json常见配置

![package.json.png](https://cdn.jsdelivr.net/gh/option-star/imgs/202204230949655.webp)

## 1. 基本属性

​	如果没有必须属性，就无法正常执行`npm install`命令。npm规定`package.json`文件是由名称和版本号作为唯一标识符。

### 1）`name`

**name**: 项目名称，它是一个字符串

> 命名规则

- 名称的长度必须小于或等于214个字符，不能以`.`和`_`开头，不能包含大写字母
  - 原因： 当软件包在`npm`上发布时，会基于此属性获得自己的URL，所以不能包含非URL安全字符（`non_url_safe`）
- 名称可以作为参数被传入`require("")`，用来导入模块，所以应当尽可能地简短、语义化；
- 名称不能和其他模块名称重复，可以使用`npm view`命令查询模块是否重复

### 2）`version`

**version**: 版本号，字符串类型。

> 版本号使用规范

- **格式**： 主版本号.次版本号.修订号
  - 主版本号：做了大的功能性的改动
  - 次版本号：新增了新功能
  - 修订号：修复了一些bug
- 如果某个版本的改动较大，并且不稳定，可能无法满足预期的兼容性需求，就需要发布先行版本，先行版本通常加在版本号的后面，通过`-`号连接以点分隔的标识符和版本编译信息
  - 内部版本： `alpha`
  - 公测版本：`beta`
  - 候选版本： `rc`, 即`release candiate`



## 2. 描述信息

### 1）`description`

**description**: 项目包描述，字符串类型。可以让其他开发者在npm的搜索发现我们的项目包



### 2）`keywords`

**keywords**: 项目包的关键词，字符串数组类型。



### 3）`author`

**author**： 项目包作者，字符串格式或者对象形式。

> 字符串格式

```json
"author": "CUGGZ <xxxxx@xx.com> (https://juejin.cn/user/3544481220801815)"
```

> 对象格式

```json
"author": {
  "name" : "CUGGZ",
  "email" : "xxxxx@xx.com",
  "url" : "https://juejin.cn/user/3544481220801815"
}
```



### 4）`contributors`

**contributors**: 项目包的贡献者，数组类型

> 类型一

```json
"contributors": [
  "CUGGZ0 <xxxxx@xx.com> (https://juejin.cn/user/3544481220801815)",
  "CUGGZ1 <xxxxx@xx.com> (https://juejin.cn/user/3544481220801815)"
 ]
```

> 类型二

```json
"contributors": [
  {
  	"name" : "CUGGZ0",
  	"email" : "xxxxx@xx.com",
  	"url" : "https://juejin.cn/user/3544481220801815"
	},
  {
  	"name" : "CUGGZ1",
  	"email" : "xxxxx@xx.com",
  	"url" : "https://juejin.cn/user/3544481220801815"
	}
 ]
```

### 5）`homepage`

**homepage**: 项目的主页地址，字符串类型



### 6）`repository`

**repository**： 代码的存放仓库地址。

> 字符串形式

```json
"repository": "https://github.com/facebook/react.git"
```

> 对象形式

```json
"repository": {
  "type": "git",
  "url": "https://github.com/facebook/react.git"
}
```



### 7）`bugs`

**bugs**： 项目提交问题的地址，对象类型。可添加一个提交问题的地址和反馈邮箱。

```json
"bugs": { 
  "url" : "https://github.com/facebook/react/issues",
  "email" : "xxxxx@xx.com"
}
```



## 3. 依赖配置

### 1）`depandencies`

**depandencies**: 生产环境所必须的依赖包。

> 新增

- 当使用`npm`或`yarn`安装`npm`包时，该`npm`包会被自动插入到此配置项中：

```shell
npm install <PACKAGENAME>
或
yarn add <PACKAGENAME>
```

- 当在安装依赖时使用`--save`参数，也会将新安装的npm包写入`dependencies`属性。

```shell
npm intalll --save <PACKAGENAME>
```

> 格式详情

​	对象类型，该对象的各个成员，分别由模块名和对应版本要求组成，表示依赖的模块及其版本范围。

```shell
"dependencies": {
   "react": "^17.0.2",
   "react-dom": "~17.0.2", 
   "react-scripts": "4.0.3", 
},
```

- **固定版本 **： 例如`4.0.3`，表示固定版本，安装时只安装这个指定版本
- **`~`**: 例如`~4.0.3`, 表示安装`4.0.x`的最新版本（不低于4.0.3）, 也就是说安装时不会改变主版本号和次版本号。
- **`^`**： 例如`^4.0.3`， 表示安装`4.x.x`的最新版本（不低于4.0.3）, 也就是说安装时不会改变主版本号。

### 2）`devDependencies`

**`devDependencies`**: 开发阶段的依赖包，如Webpack、Eslint、Babel等，用于辅助开发。

> 新增

```shell
npm install --save-dev <PACKAGENAME>

或

yarn add --dev <PACKAGENAME>
```



### 3）`peerDependencies`

**`peerDependencies`**: 用来供插件执行其所需要的主工具版本。

```shell
"name": "chai-as-promised",
"peerDependencies": {
   "chai": "1.x"
}
```

上面代码指定在安装chai-as-promised模块时，主程序chai必须一起安装，而且chai的版本必须是1.x。如果项目指定的依赖是chai的2.0版本，就会报错。

需要注意，从npm 3.0版开始，peerDependencies不再会默认安装了。



### 4）`optionalDependencies`

​	如果需要找不到包或者安装包失败时，npm仍然能够给继续运行，则可以将该包放在`optionalDependencies`对象中.

​	`optionalDependencies`对象中的包会覆盖`dependencies`中同名的包，所以只需在一个地方进行设置即可。

:::tip

​	由于`optionalDependencies`中的依赖可能并不会安装成功，所以一定要做异常处理，否则当获取这个依赖时，如果获取不到就会报错

:::

### 5）`bundledDependencies`

**`bundledDependencies`**: 将数组中的多个模块在包发布时一起打包，数组类型。



### 6）`engines`

**`engines`**: 对安装包的版本号要求说明

```shell
"engines": {
	"node": ">=8.10.3 <12.13.0",
  "npm": ">=6.9.0"
}
```

> 应用场景

​	当我们维护一些旧项目时，可能对`npm`包的版本或者`Node`版本由特殊要求，如果不满足条件就可能无法将项目跑起来。所以通过`engines`字段中说明具体的版本号。



## 4. 脚本配置

### 1）`scripts`

**`script`**: 指定了运行脚本命令的`npm`命令行缩写。

```json
"scripts": {
  "start": "node ./start.js"
}
```

比如start执行了运行`npm run start`时，所要执行的命令。

> 与npx的区别

`script`可以直接使用`node_modules`中安装的模块，这区别于直接运行需要使用`npx`命令。

```json
"scripts": {
  "build": "webpack"
}

// npm run build
// npx webpack
```



### 2）`config`

**config**: 用于添加命令行的环境变量

```json
{
  "name" : "ljc",
  "config" : { "port" : "8080" },
  "scripts" : { "start" : "node server.js" }
}
```

> 获取`config`字段的值

```js
console.log(process.env.npm_package_config_port); // 8080
```

> 修改`config`的值

```js
npm config set ljc:port 8000
```



## 5. 文件 & 目录‘

### 1）`main`

**`main`**： 用来指定加载的入口文件。

```json
{
	"main": "./src/index.js"
}
```

​	在浏览器和`Node`环境中都可以使用。如果我们将项目发布为npm包，那么当使用require导入npm包时，返回的就是main字段所列出的文件的module.exports属性。如果不指定该字段，默认时项目根目录下的index.js。如果没有找到就报错。



### 2）`browser`

**`browser`**: 定义npm包在`browser`环境下的入口文件。

```json
{
    "browser": "./src/index.js"
}
```

​	如果npm包只在web端使用，并且严禁在`server`端使用，使用`browser`来定义入口文件。



### 3）`module`

**`module`**: 定义npm包的ESM规范的入口文件。

​	browser环境和node环境均可使用，如果npm包导出的时ESM规范那个的包，使用module来定义入口文件。

```json
{
    "module": "./src/index.mjs",
}
```

:::tip

- `.js`文件是使用`commonJS`规范的语法(require(‘xxx’))
- `.mjs`文件是ESM规范的语法（import ‘xxx’）

:::



### 4）`bin`

**`bin`**: 指定每个内部命令对应的可执行文件的位置。

```json
"bin": {
  "webpack": "bin/index.js",
}
```

当我们执行`webpack`命令的时候就会执行`bin/index.js`文件中的代码。



### 5）`files`

**`files`**：用来描述当把npm包作为依赖包安装时需要说明的文件列表。

```json
{
    "files": [
    "LICENSE",
    "Readme.md",
    "index.js",
    "lib/"
 	]
}
```

​	当npm包发布时，files指定的文件会被推送到npm服务器中，如果指定的文件夹，那么该文件夹下所有文件都会被提交。

​	如果不想提交的文件，可以在项目根目录中新建一个`.npmignore`文件，并在其中说明不需要提交的文件，防止垃圾文件推送到npm。文件形式和`.gitignore`类似



### 6）`man`

**`man`**: 用来指定当前模块的`man`文档的位置。

```json
{
    "man" :[ "./doc/calc.1" ]
}
```



### 7）`directories`

**`directories`**: 指定一些方法来描述模块的结构，用于告诉用户每个目录在什么位置。

```json
"directories": {
    "bin": "./bin",
    "lib": "./lib",
    "doc": "./doc",
    "test" "./test",
    "man": "./man"
}
```



## 6. 发布配置

### 1）`private`

**`private`**： 如果这个属性被设置为`true`，`npm`将拒绝发布它，这是为了防止一个私有模块被无意间发布出去。

```json
{
	"private": true
}
```



### 2）`preferGlobal`

**`preferGlobal`**： 表示当用户不把该模块安装在全局模块时，如果设置为`true`就会显示警告。

```json
{
    "preferGlobal": true
}
```

​	它并不会真正地防护用户进行局部安装，只是对用户进行提示，防止产生误解。



### 3）`publishConfig`

**`publishConfig`**: 配置会在模块发布时生效，用于设置发布时一些配置项的集合。如果不想模块被默认标记为最新，或者不想发布到公共仓库，可以在这里配置tag或仓库地址。更详细的配置可以参考 [npm-config](https://link.juejin.cn?target=https%3A%2F%2Fdocs.npmjs.com%2Fcli%2Fv7%2Fusing-npm%2Fconfig)。 

通常情况下，publishConfig会配合private来使用，如果只想让模块发布到特定npm仓库，就可以这样来配置：

```javascript
"private": true,
"publishConfig": {
  "tag": "1.1.0",
  "registry": "https://registry.npmjs.org/",
  "access": "public"
}
```



### 4）`os`

**`os`**: 设置操作系统环境

```json
{
    "os": ["linux"]  // 适用的操作系统
	"os": ["!win32"]  // 禁用的操作系统

}
```



### 5）`cpu`

**`cpu`**： 限制模块只能在某种架构的`cpu`下运行

```json
{
    "cpu": ["x64", "AMD64"]   // 适用的cpu
	"cpu": ["!arm", "!mips"]  // 禁用的cpu
}
```



### 6）`license`

license 字段用于指定软件的开源协议，开源协议表述了其他人获得代码后拥有的权利，可以对代码进行何种操作，何种操作又是被禁止的。常见的协议如下：

- **`MIT`** ：只要用户在项目副本中包含了版权声明和许可声明，他们就可以拿你的代码做任何想做的事情，你也无需承担任何责任。
- **`Apache`** ：类似于 MIT ，同时还包含了贡献者向用户提供专利授权相关的条款。
- **`GPL`** ：修改项目代码的用户再次分发源码或二进制代码时，必须公布他的相关修改。



## 7. 第三方配置

### 1）`typings`

**`typings`**: 用来指定`TypeScript`的入口文件：

```json
{
    "typings": "types/index.d.ts",
}
```



### 2）`eslintConfig`

**`eslintConfig`**:  eslint的配置文件。

```json
{
    "eslintConfig": {
      "root": true,
      "env": {
        "node": true
      },
      "extends": [
        "plugin:vue/essential",
        "eslint:recommended"
      ],
      "rules": {},
      "parserOptions": {
        "parser": "babel-eslint"
     },
	}
}
```

:::tip

​	eslint的配置可以写在单独的配置文件.eslintrc.json 中，也可以写在package.json文件的eslintConfig配置项中。

:::



### 3）`babel`

**`babel`**：用来指定Babel的编译配置

```json
{
	"babel": {
		"presets": ["@babel/preset-env"],
		"plugins": [...]
	}
}
```



### 4）`unpkg`

`unpkg`: 让npm上所有的文件都开启CDN服务，该CDN服务由`unpkg`提供；

```json
{
	"unpkg": "dist/vue.js"
}
```



### 5）`lint-staged`

**`lint-staged`**:  一个在Git暂存文件上运行linters的工具，配置后每次修改一个文件即可给所有文件执行一次lint检查，通常配合gitHooks一起使用。

```json
"lint-staged": {
	"*.js": [
  	"eslint --fix",
    "git add"
  ]
}
```

使用lint-staged时，每次提交代码只会检查当前改动的文件。



### 6）`gitHooks`

​	**`gitHooks`**: 用来定义一个钩子，在提交（commit）之前执行ESlint检查。在执行lint命令后，会自动修复暂存区的文件。修复之后的文件并不会存储在暂存区，所以需要用git add命令将修复后的文件重新加入暂存区。在执行pre-commit命令之后，如果没有错误，就会执行git commit命令：

```json
"gitHooks": {
	"pre-commit": "lint-staged"
}
```



### 7）`browserslist`

`browserslist`： 用来告知支持哪些浏览器及版本。

```json
"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```

​	这里指定了一个对象，里面定义了生产环境和开发环境的浏览器要求。上面的development就是指定开发环境中支持最后一个版本的chrome、Firefox、safari浏览器。这个属性是不同的前端工具之间共用目标浏览器和 node 版本的配置工具，被很多前端工具使用，比如Babel、Autoprefixer等。



## 参考

1. [关于前端大管家 package.json，你知道多少？](https://juejin.cn/post/7023539063424548872#comment)
2. [你真的了解package.json吗？来看看吧，这可能是最全的package解析](https://juejin.cn/post/6987179395714646024#heading-28)