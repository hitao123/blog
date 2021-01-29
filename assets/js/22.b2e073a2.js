(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{497:function(e,t,n){"use strict";n.r(t);var r=n(12),o=Object(r.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("blockquote",[n("p",[e._v("AMD(异步模块定义)、CMD(通用模块定义)、CommonJS()\n这些东西都是js规范,前两个是为了实现浏览器端模块化开发。")])]),e._v(" "),n("table",[n("thead",[n("tr",[n("th",{staticStyle:{"text-align":"center"}},[e._v("服务器端JS")]),e._v(" "),n("th",{staticStyle:{"text-align":"center"}},[e._v("浏览器端JS")])])]),e._v(" "),n("tbody",[n("tr",[n("td",{staticStyle:{"text-align":"center"}},[e._v("相同的代码需要多次执行")]),e._v(" "),n("td",{staticStyle:{"text-align":"center"}},[e._v("代码需要从一个服务器端分发到多个客户端执行")])]),e._v(" "),n("tr",[n("td",{staticStyle:{"text-align":"center"}},[e._v("CPU和内存资源是瓶颈")]),e._v(" "),n("td",{staticStyle:{"text-align":"center"}},[e._v("带宽是瓶颈")])]),e._v(" "),n("tr",[n("td",{staticStyle:{"text-align":"center"}},[e._v("加载时从磁盘中加载")]),e._v(" "),n("td",{staticStyle:{"text-align":"center"}},[e._v("加载时需要通过网络加载")])])])]),e._v(" "),n("h3",{attrs:{id:"amd-asynchronous-module-definition-异步加载-浏览器端"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#amd-asynchronous-module-definition-异步加载-浏览器端"}},[e._v("#")]),e._v(" AMD(Asynchronous Module Definition，异步加载，浏览器端)")]),e._v(" "),n("blockquote",[n("p",[n("em",[e._v("RequireJS")]),e._v("实现了"),n("code",[e._v("AMD")]),e._v("规范出现的原因，同步等待，假如js文件很大，会造成阻塞。\n它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。")])]),e._v(" "),n("p",[e._v("```定义方法，有点类似  "),n("code",[e._v("angular")]),e._v('的依赖注入\ndefine(["require", "exports", "./mod"], function (require, exports, mod_1) {\nexports.t = mod_1.something + 1;\n});')]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("\n### CommonJS（适用于服务器端，同步加载）\n\n>CommonJS定义的模块分为:{模块引用(require)} {模块定义(exports)} {模块标识(module)} 这里主要是`nodejs` 使用\n\n```这里引入node里面的文件模块和http模块\nvar fs = require('fs');\nvar http = require('http');\n//这里将example.js 的方法导出，以后再其他文件里面只需要require('example.js')即可\nmodule.exports = {init: function(){}}\nexports.func = function(){//dosomething;}\n\n// var init = require('./index.js')\n")])])]),n("h3",{attrs:{id:"cmd-lazyload"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#cmd-lazyload"}},[e._v("#")]),e._v(" CMD(lazyLoad)")]),e._v(" "),n("blockquote",[n("p",[n("em",[e._v("SeaJS")]),e._v("实现了"),n("code",[e._v("CMD")]),e._v("规范 "),n("a",{attrs:{href:"https://www.zhihu.com/question/20351507/answer/14859415",target:"_blank",rel:"noopener noreferrer"}},[e._v("SeaJS"),n("OutboundLink")],1)])]),e._v(" "),n("ol",[n("li",[e._v("对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.")]),e._v(" "),n("li",[e._v("CMD 推崇依赖就近，AMD 推崇依赖前置。看代码：")]),e._v(" "),n("li",[e._v("AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供"),n("code",[e._v("seajs.use")]),e._v(" 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("// CMD\ndefine(function(require, exports, module) {\nvar a = require('./a')\na.doSomething()\n// 此处略去 100 行\nvar b = require('./b') // 依赖可以就近书写\nb.doSomething()\n// ... \n})\n\n// AMD 默认推荐的是\ndefine(['./a', './b'], function(a, b) { // 依赖必须一开始就写好\na.doSomething()\n// 此处略去 100 行\nb.doSomething()\n...\n}) \n")])])]),n("h3",{attrs:{id:"umd-universal-module-definition"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#umd-universal-module-definition"}},[e._v("#")]),e._v(" UMD (Universal Module Definition)")]),e._v(" "),n("blockquote",[n("p",[e._v("这种写法经常在Jquery库看到，之前一直看不懂")])]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('    (function (factory) {\n        if (typeof module === "object" && typeof module.exports === "object") {\n            let v = factory(require, exports); \n            if (v !== undefined) module.exports = v;\n        } else if (typeof define === "function" && define.amd) {\n            define(["require", "exports", "./mod"], factory);\n        } else {\n            window.factory = factory();\n        }\n    })(function (require, exports) {\n        let mod_1 = require("./mod");\n        exports.t = mod_1.something + 1;\n    });\n')])])])])}),[],!1,null,null,null);t.default=o.exports}}]);