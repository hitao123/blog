---
title: AMD、CMD、UMD、CommonJS 认识
tags: modules
date: 2017-03-26
keywords:  AMD、CMD、UMD
---

>AMD(异步模块定义)、CMD(通用模块定义)、CommonJS()
这些东西都是js规范,前两个是为了实现浏览器端模块化开发。

|       服务器端JS  |     浏览器端JS    |
|:-----------------:|:---------------:  |
|相同的代码需要多次执行|代码需要从一个服务器端分发到多个客户端执行|
|CPU和内存资源是瓶颈|带宽是瓶颈         |
|加载时从磁盘中加载 |加载时需要通过网络加载|

<!--more-->

### AMD(Asynchronous Module Definition，异步加载，浏览器端)

>*RequireJS*实现了`AMD`规范出现的原因，同步等待，假如js文件很大，会造成阻塞。
它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

```定义方法，有点类似  `angular`的依赖注入
define(["require", "exports", "./mod"], function (require, exports, mod_1) {
    exports.t = mod_1.something + 1;
});
```

### CommonJS（适用于服务器端，同步加载）

>CommonJS定义的模块分为:{模块引用(require)} {模块定义(exports)} {模块标识(module)} 这里主要是`nodejs` 使用

```这里引入node里面的文件模块和http模块
var fs = require('fs');
var http = require('http');
//这里将example.js 的方法导出，以后再其他文件里面只需要require('example.js')即可
module.exports = {init: function(){}}
exports.func = function(){//dosomething;}

// var init = require('./index.js')
```


### CMD(lazyLoad)

>*SeaJS*实现了`CMD`规范 [SeaJS](https://www.zhihu.com/question/20351507/answer/14859415)

1. 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.
2. CMD 推崇依赖就近，AMD 推崇依赖前置。看代码：
3. AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供`seajs.use` 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹

```
// CMD
define(function(require, exports, module) {
var a = require('./a')
a.doSomething()
// 此处略去 100 行
var b = require('./b') // 依赖可以就近书写
b.doSomething()
// ... 
})

// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
a.doSomething()
// 此处略去 100 行
b.doSomething()
...
}) 
```

### UMD (Universal Module Definition)

>这种写法经常在Jquery库看到，之前一直看不懂

```
    (function (factory) {
        if (typeof module === "object" && typeof module.exports === "object") {
            let v = factory(require, exports); 
            if (v !== undefined) module.exports = v;
        } else if (typeof define === "function" && define.amd) {
            define(["require", "exports", "./mod"], factory);
        } else {
            window.factory = factory();
        }
    })(function (require, exports) {
        let mod_1 = require("./mod");
        exports.t = mod_1.something + 1;
    });
```


