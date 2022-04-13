---
title: 业务06 zipPlugin
date: 2022-04-13
sidebar: 'auto'
categories:
- 12常见业务
isShowComments: true
---

> 需求

​	实现一个生成一个zip包的webpack插件

> 实现

```js
// zipPlugin.js
const JSZip = require('jszip');
const zip = new JSZip();
const path = require('path');
const RawSource = require('webpack-sources').RawSource; //文件写入需要用到

module.exports = class ZipPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        // 输入资源之前，异步执行插件
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            // 创建压缩目录名称
            const folder = zip.folder(this.options.filename);
            // 遍历compilation.assets对象
            for (let filename in compilation.assets) {
                // 获取source
                const source = compilation.assets[filename].source();
                // 将source添加到folder中
                folder.file(filename, source);
            }

            // 将内容生成zip
            zip.generateAsync({
                type: 'nodebuffer' // 压缩类型
            }).then((content) => {
                // 获取output（绝对路径）
                const outputPath = path.join(
                    compilation.options.output.path,
                    this.options.filename + '.zip'
                );

                // 获取输出资源的相对路径
                const outputRelativePath = path.relative(
                    compilation.options.output.path,
                    outputPath
                );
                
                // 将内容挂载到compilation.assets上，并将buffer转换为source
                compilation.assets[outputRelativePath] = new RawSource(content);

                callback();
            });
        });
    }
}

```

