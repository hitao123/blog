---
title: React 入门 
tags: react
date: 2016-10-10
categories:  react
keywords:  react
---

### react的生命周期

>在组件的整个生命周期中，随着组件的props或者state发生改变，其DOM表现也会有相应的变化。一个组件就是一个状态机，对于特定地输入，它总返回一致的输出。一个React组件的生命周期分为三个部分：实例化、存在期和销毁时。

#### 实例化(第一次)

##### 客户端

```下列方法依次被调用
  1. getDefaultProps()
  2. getInitialState()
  3. componentWillMount()
  4. render()
  5. componentDidMount() //发送ajax 或者 设定定时器
```

##### 服务端

```下列方法依次被调用
  1. getDefaultProps()
  2. getInitialState()
  3. componentWillMount()
  4. render()
  //5. componentDidMount() 该方法不会被调用（同构注意这一点） 
```

<!--more-->

#### 存在期

>此时组件已经渲染好并且用户可以与它进行交互，比如鼠标点击，或者其它的一些事件(发送请求的时候`dispatch()`)，导致应用状态的改变(`state` 或者 `props`)，下面的方法依次被调用

```
  1. componentWillReceiveProps(nextProps) 
  2. shouldComponentUpdate(nextProps, nextState) //默认true，返回 false 3-4-5 都不会被调用
  3. componentWillUpdate(nextProps, nextState) //类似前面的componentWillMount()
  4. render() 
  5. componentDidUpdate(prevProps, prevState) //类似componentDidMount()
```

#### 销毁期

**componentWillUnmount()**

>每当React使用完一个组件，这个组件必须从 DOM 中卸载后被销毁，此时 componentWillUnmout 会被执行，完成所有的清理和销毁工作，在 conponentDidMount 中添加的任务都需要再该方法中撤销，如创建的定时器或事件监听器。

[React LifeCycle](https://facebook.github.io/react/docs/react-component.html)
[React LifeCycle](https://segmentfault.com/a/1190000004168886)
![React LifeCycle](http://omla9ld8j.bkt.clouddn.com/IZ%28%5BWD%7BRART1EV0U%7BZ67GB6.png)

------------------------

### react的几种写法区别

#### ES5 写法

```
  //Photo组件
  var Photo = React.createClass({
      getDefaultProps: function() {
          return {
              height: 50
          };
      },
      getInitialState: function() {
          return {
              width: 50
          };
      },
      handleClick: function() {

      }, //自动绑定this scope
      propTypes: {
          height: React.PropTypes.number.isRequired
      },
      render: function() {
          return (
              <Image height={this.props.height} onClick={this.handleClick}/>
          );
      },
  }); 
```

#### ES6写法

```
   //Photo组件
   class Photo extends React.Component {
       constructor(props) {
           this.state = { width : 10 };
           //this.handleClick = this.handleClick.bind(this);
           //上面写了,这里才可以这么用 onClick={this.handleClick}
           //这次项目里面全部是ES6 this.signClick = () => {} 定义的，
           //并没有在构造函数里面绑定，所以运行时候没有报错
       }
       handleClick() {
        //和ES5 相比较
       }
       render() {  // 函数名简写 
           return (
               <Image height={this.props.height} onClick={ () => {this.handleClick}}/>
           );
       }
   }
   Photo.defaultProps = {
      height: 50
   };
   Photo.propTypes = {
       height: React.PropTypes.number.isRequired
   };

   //ES7  
   // static成员在IE10及之前版本不能被继承，而在IE11和其它浏览器上可以
   class Photo extends React.Component {
       static defaultProps = {
           height: 50   
       };  // 注意这里有分号
       static propTypes = {
           height: React.PropTypes.number.isRequired
       };  
       render() {  // 函数名简写 
           return (
               <Image height={this.props.height} />
           );
       }
   }
```

### `ES6 module` 

```export与export default
   //export class IndexList extends Component{}
   导出
   import { IndexList } from './index.js'
   //export  default class IndexList extends Component{}
   导出
   import IndexList/anyName from './index.js'

   2. import IndexList from './common'
   这种写法会自动去寻找 common 目录下 index 文件，(后缀省略是在webpack里面配置的)
   resolve: {
       extensions: ['', '.js', '.jsx'], //后缀名自动补全
   }
```

