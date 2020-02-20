---
title: 原生js基础知识 
tags: js
date: 2016-10-09
keywords:  js,pattern
---
### 对象

#### 工厂模式
```创建对象模式
    function createPerson(name,age,job){
    var o = new Object ();
    o.name = name;
    o.age  = age;
    o.job  = job;
    o.sayName = function () {
    alert(this.name);
    }
    return o; 
    }

    var person1 =  createPerson("jack", 20,"student");
    var person2 =  createPerson("john", 21,"teacher");
    person1.sayName();      //jack
    person2.sayName();      //john
    alert(typeof person1);  //function Object() { [native code] }
    alert(person2.constructor); //undefined
   工厂模式问题，没有解决对象识别问题，（即怎样知道一个对象的类型)
```

<!--more-->

#### 构造函数模式
```
    function Person(name,age,job){
        this.name = name;
        this.age  = age;
        this.job  = job;
        this.sayName = function () {
            alert(this.name);
        } 
    }

    var person1 =  new Person("jack", 20,"student");
    var person2 =  new Person("john", 21,"teacher");
    person1.sayName();      //jack
    person2.sayName();      //john
    console.log(typeof person1);  //object
    console.log(typeof person2); //object
    console.log(person1.sayName == person1.sayName) //true
    构造函数模式和工厂模式相比较，优点就是将实例标示为一种特定的类型(object)，构造函数的问题就是每个方法都在每一个实例上重新定义一次
```

#### 原型模式
```
    function Person(){
    }

    Person.prototype.name = "Jack";
    Person.prototype.age = 21;
    Person.prototype.job = "teacher";
    Person.prototype.sayName = function(){
        console.log(this.name);
    };
    var person1 = new Person();
    var person2 = new Person();
    person1.sayName(); //Jack
    person2.sayName(); //Jack
    console.log(person1.sayName == person1.sayName); //true
    //原型对象的问题，由其共享本质所导致的
```

>1. 原型是一个需要被重点理解的点，每一个函数可以被看成一个对象，它有一个`prototype` 属性，指向函数的原型对象，在默认情况下，所有原型对象会获得一个`constructor`属性指向`prototype`所在那个函数，而对于每一个实例，则有一个`_proto_`属性，指向函数原型对象要明确一点，这个连接**`存在于实例和构造函数的原型对象`**之间，*而不是存在于实例与构造函数之间*。
![原型链图解](http://omla9ld8j.bkt.clouddn.com/$1JL%7B2%28YM5SS%5B0P5IU%25$Q%5DW.png)
2. 当为对象实例添加一个同名属性时，则会屏蔽原型链上的属性或方法
3. `getOwnPropertyNames(Object)`和`Object.keys(Object)`

```
    function Person() {}
    Person.prototype.sayHi = function() {};
    Person.prototype.weight = 120;
    var p1 = new Person();
    p1.name = "jack";
    p1.age = 12;
    Object.keys(p1); //["name","age"]; 所有可枚举
    Object.getOwnPropertyNames(Person.prototype); //["constructor",sayHi","sayHi"] 所有属性(包括函数名)

    //更简单的原型语法
    function Person() {
    }
    Person.prototype = {
        name : "Jack",
        age  : 21,
        job  : "teacher",
        sayName : function () {
        }
    }; //对象字面量写法
    写法确实简洁，方便，但是使用对象字面量创建的原型方法，会改写原来的指针， 具体来说， 原来`constructor`指向`prototype`所在的函数，但是现在重写之后，指向`Object`
```

#### 组合使用构造函数模式和原型模式

```
    function Person(name,age,job) {
        this.name = name;
        this.age  = age;
        this.job  = job;
        this.friends = ["tom","alice"];
    }
    Person.prototype = {
        constructor : Person,
        sayName : function () {
            alert(this.name);
        }
    }; //对象字面量写法
    var person1 = new Person("jack", 20,"student");
    var person2 = new Person("john", 21,"teacher");
    person1.friends.push("bob");
    alert(person1.friends);
    alert(person2.friends);
    alert(person1.friends === person2.friends);
    alert(person1.sayName === person2.sayName);
```

####  寄生构造函数模式

```
    function Person(name,age,job){
        var o = new Object ();
        o.name = name;
        o.age  = age;
        o.job  = job;
        o.sayName = function () {
            alert(this.name);
        }
        return o; 
     }
    var person1 =  new Person("jack", 20,"student");
    var person2 =  new Person("john", 21,"teacher");
    person1.sayName();      //jack
    person2.sayName();      //john
    alert(typeof person1);  //object
    alert(typeof person2); //object
    alert(person1 instanceof Person);  //false true
    alert(person2 instanceof Person); //false  true    
    跟工厂模式没什么区别，这里只是用 new 来创建对象，而之前就是通过函数返回对象来调用方法
```

### 继承

#### 原型链实现继承
```
    function SuperType() {
      this.property = true;
    }
    SuperType.prototype.getSuperValue = function (){
        return this.property;
    }
    function SubType() {
        this.subProperty= false;
    }
    SubType.prototype = new SuperType();
    SubType.prototype.getSubValue = function(){
    return this.subProperty;
    }
    var instance = new SubType();
    alert(instance.getSuperValue());
    alert(instance.getSubValue());
```

#### 借用构造函数
```
    function SuperType() {
        this.colors=["blue","black","white"];
    }

    function SubType () {
        SuperType.call(this);
    }

    var instance1 = new SubType();
    instance1.colors.push("grenn");
    alert(instance1.colors);

    var instance2 = new SubType();
    alert(instance2.colors);
```

#### 组合继承
```
    function SuperType(name) {
        this.name = name; //父类属性，子类都有副本
        this.colors = ["red","blue","green"];
    }

    SuperType.prototype.sayName = function () {
        alert(this.name); //父类原型方法
    };

    function SubType(name,age){
        SuperType.call(this,name); //调用父类构造函数
        this.age = age;
        console.log(this);
    }
    SubType.prototype = new SuperType();
    SubType.prototype.constructor = SubType();
    SubType.prototype.sayAge = function () {
    alert(this.age);
    }
    var instance1 = new SubType("Jack",26);
    instance1.colors.push("white");
    alert(instance1.colors);
    instance1.sayName();
    instance1.sayAge();

    var instance2 = new SubType("Bob", 45);
    alert(instance1.colors);
    instance1.sayName();
    instance1.sayAge();
```

#### 原型式继承

```
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
```

### `prototype和_proto_的区别`

```
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    var myPoint = new Point();
    // the following are all true
    myPoint.__proto__ == Point.prototype
    myPoint.__proto__.__proto__ == Object.prototype
    myPoint instanceof Point;
    myPoint instanceof Object;

    `_proto_`在每一个对象或者对象的原型上都存在，而`prototype`只存在于构造函数中，或者说函数中，`_proto_`都是指向他们的**“构造函数的原型”**比如上面的 `myPoint.__proto__ == Point.prototype` 和 `myPoint.__proto__.__proto__ == Object.prototype` 以及`myPoint._proto_ = Function.prototype`

```

### `js中的this和apply、call`

>在平常的学习过程中，对js中的this和apply、call认识比较模糊，通过查阅一些资料来加强认识。
`js 中 this 和 apply、call的理解，平常我们对this在一些面向对象的语言中，都有一些认识，在Java语言里一般会在构造函数里边使用`

```
    public class Person {
        private String name;
        private String sex;
        private int age;
        public Person(String name,String sex,int age){
            this.name = name;
            this.sex  = sex;
            this.age  = age;
        }
    .........
    }
```

>在js里面this 和 面向对象的 this 还是有一些差别，重点在于js里的this指针受到的影响较大，具体来说就是三个方面，**在全局环境中，this指向window全局变量，这里window对象其实也是系统实例化的一个对象，只是不需要我们手动去new，javascript里call和apply操作符可以随意改变this指向，这看起来很灵活，但是这种不合常理的做法破坏了我们理解this指针的本意，同时也让写代码时候很难理解this的真正指向，javascript里的函数是一个高阶函数，编程语言里的高阶函数是可以作为对象传递的，同时javascript里的函数还有可以作为构造函数，这个构造函数可以创建实例化对象，结果导致方法执行时候this指针的指向会不断发生变化，很难控制**而且js不是纯面向对象的语言，毕竟还是解释性语言，我们可以借助面向对象语言的认识来理解，但是javascript里的this在没有进行new操作也会生效，这时候this往往会指向全局对象window。

```
    var name = "huahaitao";
    console.log(name); //huahaitao
    console.log(this.name); //huahaitao
    console.log(this); //huahaitao
```

>在js里面对象字面量的写法和 new Object()一样，会改变this 的指向,这里要说明一点，在一般情况下，谁被 new，this就指向它。在js高程里面有如下定义，new操作符会让构造函数产生如下变化：

```
    1. 创建一个新对象；
    2. 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）；
    3. 执行构造函数中的代码（为这个新对象添加属性）；
    4. 返回新对象
```

```
    var obj = {
        name : "huahaitao",
        sex  : "male",
        age  : 22,
        show: function(){
            console.log(this.name+"  "+this.sex+"   "+this.age);
            console.log(this);
        }
    };
    var Otherobj = new Object();
    Otherobj.name = "huahaitao";
    Otherobj.sex  = "male";
    Otherobj.age  = 22;
    Otherobj.show = function(){
            console.log(this.name+"  "+this.sex+"   "+this.age);
            console.log(this);
    };
    obj.show(); //huahaitao male 22    Object()
    Otherobj.show(); //huahaitao male 22    Object()
```

>js 里面的apply和call是如何改变this的，还有一点就是apply和call传入参数的不同，apply() 方法在指定 this 值和参数（参数以数组或类数组对象的形式存在）的情况下调用某个函数，即fun.call(this,[arg1,arg2])，call()方法call() 方法在指定 this 值和参数（参数以参数列表的形式存在）的情况下调用某个函数，即fun.call(this,arg1,arg2).

```
    var name = "huahaitao";
    function test(name){
        console.log(name);
        console.log(this.name);
        console.log(this);
    }
    var obj = {
        name: "Alice"
    }
    test(); // undefined huahaitao window
    test.call(obj,"Bob"); // Bob Alice Object 这里this指向改变了
    test.apply(obj,["Alex"]); //Alex Alice Object 这里this指向改变了

```

>字面表示法在简单的表示里我们很容易知道this指向对象本身，但是这个对象会有方法，方法的参数可能会是函数，而这个函数的定义里也可能会使用this指针，如果传入的函数没有被实例化过和被实例化过，this的指向是不同，有时我们还想在传入函数里通过this指向外部函数或者指向被定义对象本身，这些乱七八糟的情况使用交织在一起导致this变得很复杂，结果就变得糊里糊涂。

    1. 传入的参数是函数的别名，那么函数的this就是指向window；
    2. 传入的参数是被new过的构造函数，那么this就是指向实例化的对象本身；
    3. 如果我们想把被传入的函数对象里this的指针指向外部字面量定义的对象，那么我们就是用apply和call

```
    var name = "I am window";
    var obj = {
        name : "huahaitao",
        fun1 : function(obj){  //传入参数是被new 过的构造函数
            obj.show();
        },
        fun2 : function(fun){    //传入参数是函数的别名
            fun();
        },
        fun3 : function(fun){   //使用call
            fun.call(this,"test");
        }
    }

    function Person(name){
        this.name = name;
        this.show = function(){
            console.log(name);
            console.log(this.name);
            console.log(this);
        }
    }
    function test(){
        console.log(name);
        console.log(this.name);
        console.log(this);
    }
    function test1(name){
        console.log(name);
        console.log(this.name);
        console.log(this);
    }
    var p = new Person("Alice");
    obj.fun1(p); //Alice Alice Object
    obj.fun2(test); //I am window  I am window  window
    obj.fun3(test1); //test huahaitao object
```

### `JSON语法，解析JSON，序列化JSON`

```
    1. JSON的语法可以表示以下三种类型的值，**常量 对象 数组**，不支持变量，函数或对象实例.
    2. 与JavaScript对象字面量相比，JSON对象有两个地方不一样，没有声明变量和末尾的分号，对象的属性必须加上双引号.
    3. 解析和序列化方法，`stringify()和 parse()`.
    //函数的参数，第一个是传进去的对象，第二个是过滤器，可以是数组或者函数，第三个是格式，
    //可以是字符串或者数字，为了json数据格式更好地展示
    stringify(obj,[],[string | number]) 
    var obj = {
    "name" : "hht",
    "age"  : 12,
    "sex"  : "male"
    }   
    var json = JSON.stringify(obj,["name"],5);
    console.log(json);
    /*{
           "name": "hht"
    }*/
    var test = JSON.parse(json);  
    console.log(test); //Object {name: "hht"}   __proto__ : Object
    
    //使用函数过滤
    var json = JSON.stringify(obj,function(key,value){
    switch(key){
    case "name" : return null;
    case "age"  : return value*3;
    case "sex"  : return undefined
    default :
    return value;
    }
    });
    console.log(json); // {"name":null,"age":36}
    var test = JSON.parse(json);  
    console.log(test); //Object {name:null, age:36}   __proto__ : Object
    
    //parse()
    var obj = JSON.parse(json,function(key,value){});
```

### `原型继承的几种写法比较`

```
//方式一    对象字面量的方式改变了 constructor的指向 ，指向object ，相当于 new object()  
   var Calculator1 = function (decimalDigits, tax) {
        this.decimalDigits = decimalDigits;
        this.tax = tax;
    };
    Calculator1.prototype = {
        add: function (x, y) {
        return x + y;
        },
        subtract: function (x, y) {
            return x - y;
        }
    };
    console.log(Calculator1 instanceof Object);
    var cal = new Calculator1();
    console.log(cal.constructor, cal._proto_);
    console.log(Calculator1.prototype.constructor);
    console.log((new Calculator1()).add(1, 3));
    
    //方式二    这种方式有助于封装函数
    Calculator2.prototype = function () {
            add = function (x, y) {
                return x + y;
            },

            subtract = function (x, y) {
                return x - y;
            }
            return {
                add: add,
                subtract: subtract
            }
        } ();

       
    //方式三    一条一条的添加，不推荐这种写法
    var Calculator3 = function (decimalDigits, tax) {
    this.decimalDigits = decimalDigits;
    this.tax = tax;
    };
    Calculator.prototype.add = function (x, y) {
        return x + y;
    };

    Calculator.prototype.subtract = function (x, y) {
        return x - y;
    };
```

   
### `bind方法`

>参考 [bind](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/) 

```
var myObj = {
    specialFunction: function () {
    },
    anotherSpecialFunction: function () {
    },
    getAsyncData: function (cb) {
        cb();
    },
    render: function () {
        var that = this;
        this.getAsyncData(function () {
            that.specialFunction();
            that.anotherSpecialFunction();
        });
    }
};
myObj.render();
//Uncaught TypeError: Object [object global] has no method 'specialFunction
改写一下
render: function () {
    this.getAsyncData(function () {
        this.specialFunction();
        this.anotherSpecialFunction();
    }.bind(this));
    
```           