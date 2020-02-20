---
title: redux 中间件
tags: redux
date: 2019-05-25
keywords:  redux,middleware
---

## 1. 什么是 redux 中间件

 > 我们在使用 react 开发应用的时候，一般都会用到 redux 来 管理我们的状态，设计到异步处理，我们一般也会使用 redux-thunk 来处理，而 redux 正是我们要讲的redux 中间件，redux 中间件在 redux 是最重要的概念，也许在 express 中，你也有中间件的一些概念，实际上原理差不多，都是为了留一些扩展根据不同的需要来增强应用的能力，下面我们就一步步解开 redux 中间件的面纱，最后我们一起实现一个 redux 中间件

## 2. redux 中间件原理

> redux 中间件原理, 要先从 applyMiddleware 和 compose 方法说起，下面是一段常见的 react 应用的 redux 中间件使用场景

```js
const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

```

<!--more-->

```js
    // applyMiddleware 方法
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }


  这样 compose 方法处理后 store 就返回了一个 增强的 dispatch 方法
  我们来看 compose 方法是怎样的

  compose(f, g, h)  <===>  (...args) => f(g(h(...args)))

  function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }

    if (funcs.length === 1) {
      return funcs[0]
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }

  // 实例
  function double(x) { return 2 * x }
  function square(x) { return x * x }
  let testCompose = compose(double, square)(5) // 50
```

## 3. redux-thunk 源码分析

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

// next => action => {}
{
  getState: store.getState,
  dispatch: (...args) => dispatch(...args)
}

// next <==> store.dispatch 转换后的 dispatch
// 中间件的执行顺序 [thunk, logger]

如果 action 是一个函数， thunk 中间件会拦截执行 action，
如果 action 是一个对象， 则执行 next 方法， next 就是 thunk 下一个中间件 action => { ... },
因为正常情况下 action 一般是 对象， 所以方法会一直执行，按照 middleware 数组顺序

action => {
  if (typeof action === 'function') {
    return action(dispatch, getState, extraArgument);
  }

  return next(action);
}

这里有一点疑问的是 action(dispatch, getState, extraArgument)

action 里面的 dispatch 是一个空方法，只是最后在 applyMiddleWare dispatch 最后会被覆盖
在之前的 v3 dispatch 就是 store.dispatch, 后面 v4 dispatch 改成 空方法，那这里的 dispatch
方法就没有 dispatch 的功能了，具体可以看这个 [issue](https://github.com/reduxjs/redux/issues/1485)
如果你对这里有什么还得理解，欢迎沟通

```

## 5. 实现自己的中间件

```js
({dispatch, getState}) => next => action => {
  try {
    console.log('log')
    next(action)
  } catch (err) {
    console.error('Error!', err)
  }
}

```