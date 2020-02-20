---
title: react-route 入门 
tags: react
date: 2016-10-12
categories:  react
keywords:  react,react-route
---

### React-router

>今天下午花了一下午时间看了React-route，只是大概了解一下如何在项目中使用，部分组件有省略

#### Rendering a Route

```js
// ...
import { Router, Route, hashHistory } from 'react-router'
//访问对应路径会加载相应的组件
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/repos" component={Repos}/>
    <Route path="/about" component={About}/>
  </Router>
), document.getElementById('app'))
```

<!--more-->

#### Navigating with Link

```js
//...
import { Link } from 'react-router'
//这里link标签基本上就是 a 标签的作用
<ul role="nav">
  <li><Link to="/about">About</Link></li>
  <li><Link to="/repos">Repos</Link></li>
</ul>
```
#### Nested Routes

```js
//优先匹配第一个
<App>       {/*  /          */} //这里的是路由路径
  <Repos>   {/*  /repos     */}
    <Repo/> {/*  /repos/123 */}
  </Repos>
</App>
```



```
And our UI something like:

         +-------------------------------------+
         | Home Repos About                    | <- App
         +------+------------------------------+
         |      |                              |
Repos -> | repo |  Repo 1                      |
         |      |                              |
         | repo |  Boxes inside boxes          |
         |      |  inside boxes ...            | <- Repo
         | repo |                              |
         |      |                              |
         | repo |                              |
         |      |                              |
         +------+------------------------------+
```

#### Active Links

```js
// 点击之后会有激活样式，样式就是我们这里设置的
<li><Link to="/about" activeStyle={{ color: 'red' }}>About</Link></li>
<li><Link to="/repos" activeStyle={{ color: 'red' }}>Repos</Link></li>

//第二种方式
<li><Link to="/about" activeClassName="active">About</Link></li>
<li><Link to="/repos" activeClassName="active">Repos</Link></li>

Nav Link Wrappers
// modules/NavLink.js 这里就是将activeClassName放在props里面
import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return <Link {...this.props} activeClassName="active"/>
  }
})
//使用起来更加简洁
import NavLink from './NavLink'
// ...
<li><NavLink to="/about">About</NavLink></li>
<li><NavLink to="/repos">Repos</NavLink></li>
```

#### URL Params

```
/repos/reactjs/react-router
/repos/facebook/react

/repos/:userName/:repoName
this.props.params[userName]或者this.props.params.userName //获取参数值
```

#### More Nesting

>First, nest the `Repo` route under the `Repos` route. Then go render
`this.props.children` in `Repos`.

```js
// index.js
// ...
<Route path="/repos" component={Repos}>
  <Route path="/repos/:userName/:repoName" component={Repo}/>
</Route>

// Repos.js
// ...
<div>
  <h2>Repos</h2>
  <ul>
    <li><Link to="/repos/reactjs/react-router">React Router</Link></li>
    <li><Link to="/repos/facebook/react">React</Link></li>
  </ul>
  {/* will render `Repo.js` when at /repos/:userName/:repoName */}
  {this.props.children}
</div>
```

#### Index Routes

>When we visit `/` in this app it's just our navigation and a blank page.
We'd like to render a `Home` component there. Lets create a `Home`
component and then talk about how to render it at `/`.这里的作用就像jsp里面存在一个默认页面`index.html`

```js
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
// and the Home component
import Home from './modules/Home'
// ...
render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>

      {/* add it here, as a child of `/` */}
      <IndexRoute component={Home}/> //在这里加上一个`IndexRoute`
      <Route path="/repos" component={Repos}>
        <Route path="/repos/:userName/:repoName" component={Repo}/>
      </Route>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
), document.getElementById('app'))
```

#### Index Links

```js
// App.js
import { IndexLink } from 'react-router'

// ...
<li><IndexLink to="/" activeClassName="active">Home</IndexLink></li>
//第二种方式
<Link to="/" activeClassName="active" onlyActiveOnIndex={true}>Home</Link>
<li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
```

