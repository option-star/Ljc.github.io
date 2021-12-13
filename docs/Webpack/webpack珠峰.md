## 1 webpack基本概念

### 1.1 安装

```shell
# 初始化
yarn init -y

# 安装
yarn add webpack webpack-cli -D
```



### 1.2 入口（entry）

- 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph)的开始。进入入口起点后, webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的
- 默认值是`./src/index.js` ，但你可以在`webpack configuration`中配置`entry`属性，来指定一个（或多个）不同的入口起点。

> webpack.config.js

```js
const path = require('path');
module.exports = {
    entry: './src/index.js'
}
```



#### 1.2.1 执行npm run build后发生什么？

> package.json

```js
{
  "name": "usage",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "build" : "webpack",
    "dev" : "webpack serve"
  },
  "license": "MIT",
  "devDependencies": {
    "webpack": "^5.64.4",
    "webpack-cli": "^4.9.1"
  }
}
```

1. 会去执行node_modules下bin目录下的webpack.cmd文件

![image-20211204103458743](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112041035882.png)

2. 执行webpack.cmd会运行`node_modules\webpack\bin\webpack.js`文件

![image-20211204103652215](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112041036268.png)



#### 1.2.2 npm run build后返回字段解析

```js
asset main.js 205 bytes [emitted] [minimized] (name: main)
./src/index.js 52 bytes [built] [code generated]
./src/title.js 25 bytes [built] [code generated]
```

- `asset main.js`  ： 编译后生成的文件为`main.js`
- `205 bytes` : 字节数
- `emitted` :  写入到硬盘
- `minimized` : 经过压缩
- `name`: 默认入口文件名称



### 1.3 输出（output）

- `output`属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件
- 主要输出文件的默认值是`./dist/main.js` ,其他生成文件默认放置在
    `./dist`文件夹中。

> webpack.config.js

```js
 const path = require('path');

module.exports = {
    entry: './src/index.js', 
    output: {
        path: path.resolve(__dirname, "dist"), // 输出目录
        filename: "main.js" // 文件名
    }
}
```



### 1.4 roader

- `webpack`只能理解`JavaScript`和 `JSON`文件
- `loader` 让`webpack `能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中

> webpack.config.js

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "dist"), 
        filename: "main.js"
    },
    module: {
        rules: [
            {
                // 如果加载的模块是以/\.txt$/的内容结尾，则使用raw-loader处理
                test: /\.txt$/, 
                use: 'raw-loader' // roader就是把webpack不认识的内容转换成webPack认识的内容
            }
        ]
    }
} 
```

#### join与resolve的区别？

```js
const path = require('path');
console.log(path.join('a','b'));//不一定是绝对
console.log(path.resolve('a','b'));//一定是绝对路径
```

> 执行结果

![image-20211204112227171](https://gitee.com/ljcdzh/my_pic/raw/master/img/202112041122207.png)



### 1.5 插件(plugin)

- loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括打包优化、资源管理、注入环境变量

> 将index.html打包到dist文件中，并插入打包后的main.js

目录结构：

```js
|-src
|--content.txt
|--index.html
|--index.js
|-webpack.config.js
|-package.json
```

> 安装插件依赖

```js
yarn add raw-roader
yarn add html-webpack-plugin
```

> src/context/txt

```js
内容
```

> src/index.html

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
</body>
</html>
```

> src/index.js

```js
let content = require('./content.txt')
console.log(content);
```

> webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "dist"), // 输出目录
        filename: "main.js" // 文件名
    },
    module: {
        rules: [
            {
                // 如果加载的模块是以/\.txt$/的内容结尾，则使用raw-loader处理
                test: /\.txt$/, 
                use: 'raw-loader' // roader就是把webpack不认识的内容转换成webPack认识的内容
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```

> 效果展示（dist/index.html）

```js
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Document</title>
    <script defer="defer" src="main.js"></script>
</head>

<body></body>

</html>
```



### 1.6 模式（mode）

- 日常开发中，一般有两套构建环境
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印debug的信息，包含sourcemap文件
- 一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印debug信息，静态文件不包括sourcemap
- webpack4.x版本引入了mode的概念
- 当指定使用production mode时，默认会启用各种性能优化功能，包括构建结果优化以及webpack运行性能优化。
- 当如果是development mode的话，则会开启debug工具，运行时打印详细的错误信息，以及更快的增量编译构建

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| development | 会将process.env.NODE_ENV的值设为development。启用NamedChunkPlugin和NamedModulesPlugin |
| production  | 会将 process.env.NODE_ENV的值设为 production。启用 FlagDependencyUsagePlugin,FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin,SideEffectsFlagPlugin和UglifyJsPlugin |

#### 1.6.1 环境差异

- 开发环境
    - 需要生成sourcemap文件
    - 需要打印debug信息
    - 需要live reload或者hot reload的功能
- 生产环境
    - 可能需要分离CSS成单独的文件，以便多个页面共享同一个CSS文件
    - 需要压缩HTML/CSS/JS代码
    - 需要压缩图片
- 默认值为



#### 1.6.2 区分环境

- `--mode`: 用来设置模块内的`process.env.NODE_ENV`
- `--env`: 用来设置webpack配置文件的函数参数
- `cross-env`: 用来设置node环境的`process.env.NODE_ENV`
- `DefinePlugin`:　用来设置模块内的全局变量

##### 1.6.2.1 --mode

- 优先级比webpack.config.js中配置mode高

> package.json

```js
// 设置
"scripts": {
    "build": "webpack --mode=production",
  },
```



> index.js

```js
// 获取
console.log(production.env.NODE_ENV) // production
```



##### 1.6.2.2 --env

- 无法在模块内通过`production.env.NODE_ENV`访问
- 可以通过`webpack`配置文件中通过函数获取当前环境变量

> package.json

```js
// 设置  
"scripts": {
    "build": "webpack --env=production",
},
```



> webpack.config.js

```js
// 获取
module.exports = (env, argv) => {
    console.log(env) // { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }
    console.log(argv) // {env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, production: true }  
}
}
```



> index.js

```js
// 获取
console.log(production.env.NODE_ENV) // undefined
```



- 作用：通过获取设置的值修改webpack.config.js中mode的值或者根据环境判断是否启用压缩等功能。

```js
// 修改mode的值
mode: env.production ? 'production':'development'

// 是否启用压缩
optimize : {
    env.production ? '启用压缩':'不启用压缩'
}
```



##### 1.6.2.3 DefinePlugin

- 设置全局变量（不是window）, 所有模块都能读取到该变量的值
- 可以在任意模块中通过`process.env.NODE_ENV`获取当前的环境变量
- 但无法在`node`环境（webpack配置文件中）下获取当前的环境变量

> webpack.config.js

```js
// 设置
const path = require('path');
const webpack = require('webpack') // 内置插件

module.exports ={
        mode: "production",
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "main.js"
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            }) 
        ]
}
```



> index.js

```js
// 获取
console.log(process.env.NODE_ENV) // development
```



:::tip

问：设置时为什么要加JSON.stringify？不加行不行？

运行本质是在编译的时候一个纯的字符串替换，并不会定义任何的变量。如果不加的话，值在编译时会变成一个变量，产生报错变量未定义。

:::



##### 1.6.2.4 cross-env

```shell
# 安装依赖
yarn add cross-env
```



> package.json

```js
// 设置
"scripts": {
    "build": "cross-env NODE_ENV=producion webpack"
 }
```



> webpack.config.js

```js
// 获取
console.log(process.env.NODE_ENV); // production
```



## 2 开发环境配置



### 2.1 开发服务器

#### 2.1.1 安装服务器

```shell
npm install webpack-dev-server --save-dev
```



#### 2.1.2 webpack.config.js



