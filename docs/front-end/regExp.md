---
title: 正则表达式
tags: regExp
date: 2017-04-25
keywords:  js,regExp,捕获分组，非捕获分组
---

|方法|描述|用法|
|:--:|:--:|:--:|
|字符串方法|-|-|
|match|返回一个数组，失败返回null，类似于 RegExp.exec()方法|str.match(reg)|
|search|返回匹配到的位置索引，失败时返回-1|str.search(regexp)|
|replace|使用替换字符串替换掉匹配到的子字符串。|str.replace(str或reg,substr或 function)|
|split|返回一个数组|str.split([separator或reg[, limit]])|
|regEXp对象方法|-|-|
|test|成功返回true,失败返回false|regexObj.test(str)|
|exec|返回一个数组,失败返回null,[0]匹配的全部字符串[1]...[n]括号中的分组捕获,index  匹配到的字符位于原始字符串的基于0的索引值,input 原始字符串|regexObj.exec(str)|
|igm|匹配模式，可选|i,忽略大小写，g,全局匹配，m,匹配多行|
<!--more-->

```
\s 匹配空白字符 匹配一个空白字符，包括空格、制表符、换页符和换行符
\S 匹配非空白字符 [^\f\n\r\t\v]
\d 匹配数字 [0-9]
\D 匹配非数字 [^0-9]
\w 匹配单字字符 [0-9A-Za-z_]
\W 匹配非单字字符 [^0-9A-Za-z_]
\b 匹配边界 /\bm/匹配“moon”中得‘m’ ,/\w\b\w/将不能匹配任何字符串
\r 匹配回车符
\n 匹配换行符
\t 匹配制表符
\1 匹配捕获的，在正则表达式里面用，外部用 $1
.  匹配除了换行符的单个字符
?  匹配前面表达式 {0,1}
{n,m} 至少匹配n个，最多匹配m个
*  匹配前面表达式 {0,}
+  匹配前面表达式 {1,}
(x) 匹配 'x' 并且记住匹配项
(?:) 匹配括号里面的，但不捕获
(?=) 正向肯定查找 /Jack(?=Sprat)/会匹配到'Jack'仅仅当它后面跟着'Sprat'
(?!) 正向否定查找 /Jack(?!Sprat)/会匹配到'Jack'仅仅当它后面没有跟着'Sprat'
(?<= x) 正向回查 '2000 (?<=Office|Word|Excel)'匹配 " Office2000" 中的 "2000"
(?<!= x) 负向回查 '2000 (?<!Office|Word|Excel)'匹配 " Windows2000" 中的 "2000"

捕获分组会消耗字符串，不捕获分组不会消耗字符串
捕获分组可以被引用，不捕获分组不能被引用，不占用索引（从1开始），没有保存
在内存中
```







