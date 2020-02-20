---
title: Redux 入门 
tags: redux
date: 2016-10-09
categories:  react
keywords:  react,redux
---

>很早就听说过`Redux,React`,一直没有时间去学习一下，趁现在空闲的时间里，自己研究一下。**`Redux` 和 `React` 之间没有关系。`Redux`支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。**

### Action
>Action是将数据从应用传到Store的有效载体，是Store数据的唯一来源，
一般会通过 Store.dispatch() 将action 传到 Store。
```
action 定义 除了type字段，其他字段可以自定义，action 实质上就是一个对象
    const ADD_TODO = 'Add_todo'
    {
    type: ADD_TODO
    text: 'my first redux app'
    }
```
>Action 创建函数(简单返回一个action)

```
    function addTodo(text) {
      return {
        type: ADD_TODO,
        text
      }
    }
    - Redux 中只需把 action 创建函数的结果传给 dispatch() 方法即可发起一次 dispatch 过程
    dispatch(addTodo(text))
    - 或者创建一个 被绑定的 action 创建函数 来自动 dispatch：
    const boundAddTodo = (text) => dispatch(addTodo(text))
    boundAddTodo(text);
    - 项目里面大部分是通过react-redux 提供的 connect() 帮助器来调用dispatch。
```

<!--more-->

### Reducer

>`Action` 只是描述了有事情发生了这一事实，并没有指明应用如何更新 `state`。而这正是`reducer`要做的事情.`reducer` 就是一个纯函数，接收旧的 state 和`action`，返回新的 state。(纯函数可以简单的理解为，相同的输入一定有相同的输出)

```
(previousState, action) => newState

1. 不要在Reducer 里做以下三件事    
    - 修改传入参数；
    - 执行有副作用的操作，如 API 请求和路由跳转；
    - 调用非纯函数，如 Date.now() 或 Math.random()。

2. Redux 首次执行时，state 为 undefined，可以利用ES6 默认值

    function todoApp(state = initialState, action) {
      // 这里暂不处理任何 action，
      // 仅返回传入的 state。
      return state
    }

    //reducer

    function todoApp(state = initialState, action) {
      switch (action.type) {
        case SET_VISIBILITY_FILTER:
          return Object.assign({}, state, {
            visibilityFilter: action.filter
          })
        default:
          return state
      }
    }
    //使用tips: 不要修改 state。 使用 Object.assign() 新建了一个副本。不能这样使用 Object.assign(state, { visibilityFilter: action.filter })

3. Redux 提供了 combineReducers() 工具类
    import { combineReducers } from 'redux';

    const todoApp = combineReducers({
      visibilityFilter,
      todos
    })

    export default todoApp;
    ==================
    等价于下面这种写法
    ==================
    export default function todoApp(state = {}, action) {
      return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
      }
    }

```

### Store

>Store 有以下职责：
- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。

```
    import { createStore } from 'redux'
    let store = createStore(todoApp)
    //createStore() 的第二个参数是可选的, 用于设置 state 初始状态。
```
### react-redux 绑定库带来的变化
#### 容器组件（Container Components）
#### 展示组件（Presentational Components）

|-|展示组件|        容器组件                 |
|:-----------:|:--------:|:----------------:|
|作用|描述如何展现（骨架、样式）|描述如何运行（数据获取、状态更新）|
|直接使用Redux|否|是|
|数据来源|props|监听 Redux state|
|数据修改|从 props 调用回调函数|向 Redux 派发 actions|
|调用方式|手动|通常由 React Redux 生成|

>大部分的组件都应该是展示型的，但一般需要少数的几个容器组件把它们和 Redux store 连接起来。

#### 与使用`react-redux`之后相比较变化点

```
====================
//使用react-redux之前  需要 store.subscribe()
====================
const store = createStore(counter);
const rootEl = document.getElementById('root');
const render = () => ReactDOM.render(
        <Counter 
            value={store.getState()}
            onIncrement={() => store.dispatch({type: 'INCREMENT'})}
            onDecrement={() => store.dispatch({type: 'DECREMENT'})}
        />,
        rootEl
    );
render();
store.subscribe(render);
====================
//使用react-redux之后 全局store 
====================
const store = createStore(reducer)
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
//action   components containers reducers 分层

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter))
  }
})
const FilterLink = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
export default FilterLink

=======
reducers
=======
const todoApp = combineReducers({
  todos,
  visibilityFilter
})
export default todoApp
```

### 状态改变过程梳理(demo3) 

> 输入点击添加按钮    dispatch(addTodo(input.value))
 
#### action  

```
{
    type: 'ADD_TODO',
    id: 1,                  =========>action
    text: 1321
}
```

#### reducers

```
[{
    id: 1,
    text: 1321,   ========>state 
    completed: false
}]
store.subscribe() UI 更新
todolist 状态发生改变

todo 数组参数传递 
onTodoClick 函数传递  toggletodo

todolist 开始渲染
刚开始都是 仅仅只有All 为链接，其他为未激活状态，点击之后可以设置自己的状态
```

### 异步回调

#### createStore

```//const store = createStore(reducer,applyMiddleware(...middleware))

    function createStore(reducer, preloadedState, enhancer) {
      var _ref2;
    //出错处理，可以学习，代码健壮性
      if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState; //传入两个值的时候，会将 preloadedState 赋值给 enhancer ，而且enhancer 只能是applyMiddleware方法
        preloadedState = undefined;
      }
      if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error('Expected the enhancer to be a function.');
        }
        return enhancer(createStore)(reducer, preloadedState); //这里将createStore 传进去
      }
      if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.');
      }
      //全局变量
      var currentReducer = reducer;
      var currentState = preloadedState;
      var currentListeners = [];
      var nextListeners = currentListeners;
      var isDispatching = false;

      function getState() {
        return currentState;
      }

      function subscribe(listener) {
        if (typeof listener !== 'function') {
          throw new Error('Expected listener to be a function.');
        }
        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
          if (!isSubscribed) {
            return;
          }
          isSubscribed = false;

          ensureCanMutateNextListeners();
          var index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
        };
      }

      function dispatch(action) {
        if (!(0, _isPlainObject2['default'])(action)) {
          throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
        }

        if (typeof action.type === 'undefined') {
          throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
        }

        if (isDispatching) {
          throw new Error('Reducers may not dispatch actions.');
        }

        try {
          isDispatching = true;
          currentState = currentReducer(currentState, action);
        } finally {
          isDispatching = false;
        }

        var listeners = currentListeners = nextListeners;
        for (var i = 0; i < listeners.length; i++) {
          listeners[i]();
        }
        return action;
      }

      return _ref2 = {
        dispatch: dispatch,
        subscribe: subscribe,
        getState: getState
    }
```

#### Middleware

``` // applyMiddleware 参数是一个数组，里面传入中间件
    function applyMiddleware() {
     //Array(5) 产生大小为5的数组
      for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
        middlewares[_key] = arguments[_key];
      }

      return function (createStore) {
        return function (reducer, preloadedState, enhancer) {
          var store = createStore(reducer, preloadedState, enhancer);
          var _dispatch = store.dispatch; //包装全局 store.dispatch 方法
          var chain = []; 

          var middlewareAPI = {
            getState: store.getState,
            dispatch: function dispatch(action) {
              return _dispatch(action);
            }
          }; //将 getState dispatch 方法暴露给每一个中间件
          chain = middlewares.map(function (middleware) {
            return middleware(middlewareAPI); //
          });
          
          _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
               //compose(f, g, h) is identical to doing    * (...args) => f(g(h(...args))).

          return _extends({}, store, {
            dispatch: _dispatch //注意这里的store 还是原来的 store 但是 dispatch 是经过组合的dispatch
          });
        };
      };
    }
```

### 使用Redux开发过程遇到的问题

#### combineReducers

>`combineReducers` 辅助函数的作用是，把一个由多个不同` reducer `函数作为 value 的 object，合并成一个最终的 reducer 函数，然后就可以对这个 reducer 调用 createStore。合并后的 reducer 可以调用各个子 reducer，并把它们的结果合并成一个 state 对象。state 对象的结构由传入的多个 reducer 的 key 决定。

```
combineReducers({ todos: myTodosReducer, counter: myCounterReducer })
```

#### connect()

```
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])()
- mapStateToProps(state,ownsProps)省略，组件将不会监听 Redux store
- mapDispatchToProps(dispatch,ownsProps)
    1. 如果传递的是一个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，而且这个对象会与 Redux store 绑定在一起，其中所定义的方法名将作为属性名，合并到组件的 props 中。
    2.如果传递的是一个函数，该函数将接收一个 dispatch 函数，然后由你来决定如何返回一个对象，这个对象通过 dispatch 函数与 action creator 以某种方式绑定在一起（提示：你也许会用到 Redux 的辅助函数 bindActionCreators()）
    
```

#### 箭头函数

>如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。
```
var getTempItem = id => ({ id: id, name: "Temp" });
```
#### ES6扩展运算符

>扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中

```
//rest 参数 ，将参数放在数组里面，只能放在最后
function add(...values) {
   let sum = 0;

   for (var val of values) {
      sum += val;
   }

   return sum;
}
add(2, 5, 3) // 10

//对象扩展
let z = { a: 3, b: 4 };
let n = { ...z };
n // { a: 3, b: 4 }

function add(x, y) {
  return x + y;
}

var numbers = [4, 38];
add(...numbers) // 42
```

### 传统的异步与React异步有什么区别

>`React` 是通过状态来改变的，单项数据流，数据只能由父节点流向子节点，状态的改变会才会引起UI的变化，`Angular` 是双向数据流，任意方向的改变都会引起UI变化，数据可以从子节点流向父节点，在子类绑定`ng-model`,在父类显示
在`Angular`里面，发送`Ajax` 请求，返回一个promise 对象，`ui` 相关的变量可以再回调里面处理， 而在再`React` 里面要想改变UI必须重新设定`state` 假如是配合Redux 必须调用dispatch(action)，然后reducer 根据 oldState，action 返回 newState 来更新UI，而像`React`这样通过发起一次dispatch，再引起UI变化都是同步，React 要做到异步需要使用中间件的概念，`reducer、action、state` 里面都不适合处理，放在`dispatch(action)`里面比较合理，一般`dispatch(action)` 里面`action`只能是一个`Object`  操作开始时，送出一个 Action，触发 State 更新为"正在操作"状态，View 重新渲染 操作结束后，再送出一个 Action，触发 State 更新为"操作结束"状态，View 再一次重新渲染