---
title: console 的使用
date: 2022-10-09
tag: frontend
---


## 几种常用的 console 技巧

```js
// 明显的打印
let test = 'hello world';
console.log(`%c ${test}`, 'color:red; font-size: 24px')
// 表格输出 对象数组
console.table();

// 计算执行时间
console.time()
console.timeEnd();
```
