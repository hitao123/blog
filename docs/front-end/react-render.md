---
title: react rerender 优化思路
tags: react
date: 2022-11-14
categories:  react
keywords:  react,web development
---

> 平时在开发过程中很少关注到 react 性能优化的部分，周末看了一下相关的文章，了解了一些常用的做法，做一个记录，以方便后续使用, 我们知道一个组件只有在 state props 发生改变的时候，才有可能发生 rerender, 下面我们一起来探讨一下不同的情形，也顺便了解一下 memo useCallback 的使用

## 常规使用

```js
// 每次点击按钮都会 render
function Counter({ children }) {
    console.log("Counter render");
    const [count, addCount] = useState(0);
    return (
      <div className="app">
        <div className="counter-num">{count}</div>
        <button
          onClick={() => {
            addCount(count + 1);
          }}
        >
          add
        </button>
      </div>
    );
}
```

```js
// 值类型，点击这里是不会重新渲染的， 原因 ，更新 state 的时候，会有一个新老 state 的比较，用的是 Object.is 进行比较，如果为 true 则直接返回不更新
function Counter() {
  console.log("counter render");
  const [count, addCount] = useState({ num: 0 });
  const clickHandler = () => {
    count.num++;
    addCount(count);
  };
  return (
    <div className="counter">
      <div className="counter-num">
        {count.num}
      </div>
      <button onClick={clickHandler}>add</button>
    </div>
  );
}
```

## 父组件更新引起子组件 re-render 情形一

```js
//  Hello 组件作为 子组件，虽然没有更新，但是父组件每次更新 引起了 Hello 组件更新，在这种业务场景，我们可以做一些优化

const Hello = ({ name }) => {
  console.log("hello render");
  return<div>hello {name}</div>;
};

const App = () => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
      <Hello name="react" />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

### 优化一

```js
// 将影响的部分单独拆成一个组件，平行放置
const Hello = ({ name }) => {
  console.log("hello render");
  return<div>hello {name}</div>;
};

const App = () => {
  console.log("app render");
  return (
    <div className="app">
      <Hello name="react" />
        <Counter />
    </div>
  );
};
```

### 优化二

```js
// 将不需要 re-render 的部分以 children 的方式渲染
// App 组件预留 children 位
const App = ({ children }) => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
        {children}
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};

// 使用
<App>
  <Hello name="react" />
</App>
```

### 优化三

```js
// 使用 React.memo 

const Hello = React.memo(({ name }) => {
  console.log("hello render");
  return<div>hello {name}</div>;
});

const App = () => {
  console.log("app render");
  const [count, addCount] = useState(0);
  return (
    <div className="app">
      <Hello name="react" />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};

```

## 父组件更新引起子组件 re-render 情形二

```js
// Hello 组件新增一个 onClick method， 这样由于每次每次点击计数，都会重新定义 clickHandler 处理函数， 所以这里 Hello 组件又被重新渲染了，所以很多时候我们在 Hello 组件写的 memo 毫无意义

const Hello = memo(({ name, onClick }) => {
  console.log("hello render");
  return<div onClick={onClick}>hello {name}</div>;
});

const App = ({ children }) => {
  console.log("counter render");
  const [count, addCount] = useState(0);
  
  // 新增处理函数
  const clickHandler = () => {
    console.log("hello click");
  };

  return (
    <div className="counter">
      <Hello name="react" onClick={clickHandler} />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};
```

### 方案一 (useCallback)

```js

// 使用 useCallback 包裹一下 onClick 方法, 但是当我们想输出 父组件的 count 时候，发现是不更新的，这个时候 使用 useRef & useEffect 可以解决我们的问题

const clickHandler = useCallback(() => {
  console.log("hello click");
}, []);


// 使用 useRef 来更新 count，使用 useEffect 来更新 countRef， 这个是推荐在业务中使用的
const App = ({ children }) => {
  console.log("counter render");
  const [count, addCount] = useState(0);
  
  // 1、创建一个 countRef 
  const countRef = useRef(count);
  
  // 2、依赖改成 countRef
  // 浅对比 countRef 时，将不会引起 callback 函数更新
  // callback 函数又中可以读取到 countRef.current 值，即 count 的最新值
  const clickHandler = useCallback(() => {
    console.log("count: ", countRef.current);
  }, [countRef]);
  
  // 3、当 count 更新时，更新 countRef 的值
  useEffect(() => {
      countRef.current = count;
  }, [count]);

  return (
    <div className="counter">
      <Hello name="react" onClick={clickHandler} />
      <div className="counter-num">{count}</div>
      <button
        onClick={() => {
          addCount(count + 1);
        }}
      >
        add
      </button>
    </div>
  );
};

```
