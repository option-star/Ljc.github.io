---
title: Vue
date: 2021-12-12
sidebar: 'auto'
tags:
- Vue-router
categories:
- Vue
isShowComments: true
---



## 路由基本知识

> 什么叫路由

​	能根据不同的路径返回不同的资源。就前端而言，就是根据不同的路径渲染不同的组件。

​	早期实现跳转都是后端来跳转，spa应用不用向服务器发请求，可以直接进行跳转（在不刷新页面的情况下可以切换路径）

> vue中路由模式有几种

- `hash模式`： 路径后面带有# , hash模式缺点就是丑（不会向服务器发送请求）。服务器无法获取hash值，从而无法做seo优化（seo优化都是服务端返回一个完整的html字符串进行页面的渲染），如果不访问服务器，服务器就无法返回html字符串，所以hash模式是不支持seo优化。优点：方便不需要服务端支持。

- `historyApi` 默认不带`#`,优点：美观，支持服务端渲染

```js
// 跳转
history.pushState({a:1}, null, '/a')
```

​	当如果回车访问，会访问服务端，所以会服务端渲染，可以做seo优化。需要服务端支持（如果访问的资源不存在，我们可以跳转到首页，渲染首页内容，渲染的时候前端会取到路径渲染组件）。

- memoryHistory， 不会发生路径变化，但是可以切换组价。（微前端中我们希望不显示子应用路径）。



## 路由原理

> 路由的使用

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]
const router = new VueRouter({
  routes
})
```

​	由上可知，router的本质就是类，通过传入参数进行实例化。

所以代码实现如下

```js
class VueRouter {
    constructor(options = {}) {
	}
}

export default VueRouter
```

由于使用时会通过Vue.use对VueRouter进行处理，所以需要其内部需要实现install方法

```js
VueRouter.install = (_Vue) => {
}
```



> 那么Vue.use是怎么实现的呢？

```js
Vue.use = function (plugin) {
    plugin.install(this);
}
```



​	因为在根组件中注入的router需要共享给每个组件。可以在install方法中调用Vue.mixin实现。

```js
   const install = (_Vue) =>{
    Vue = _Vue;

    Vue.mixin({
        beforeCreate(){
            if(this.$options.router){ // 根组件

            }else if(this.$parent && this.$parent._routerRoot){ // 子组件
                
            }
        }
    })
    Vue.component('RouterLink',RouterLink)
    Vue.component('RouterView',RouterView)
}
```

​	那如何把根组件中的router分享给每个组件呢？父亲上有个router，它会先把自己暴露出去`this._routerRoot = this` , 然后把router保存在自己身上`this._router = router`，儿子就可以通过`this.$parent._routerRoot`获取到父亲本身，借而就可以拿到父亲的`_router`属性， 然后把根实例绑定在自己身上。再到孙子关系就可以直接拿到根组件的router了。具体实现如下：

```js
const install = (_Vue) =>{
    Vue = _Vue;

    Vue.mixin({
        beforeCreate(){
            if(this.$options.router){ // 父组件
                this._routerRoot = this;// 1. 将根组件暴露到了this上
                this._router = this.$options.router // 2. 在自己身上添加一个_router属性
                this._router.init(this); 
            }else if(this.$parent && this.$parent._routerRoot){
                // 每个组件都可以通过this._routerRoot拿到根组件的实例
                this._routerRoot =  this.$parent._routerRoot; 
            }
        }
    })

}
export default install
```



> 如果初始化router

​	然后我们还需要做路由的初始化，那在mixin中如何初始化？可以通过在根组件上调用router .init方法进行初始化。

```js
const install = (_Vue) =>{
    Vue = _Vue;

    Vue.mixin({
        beforeCreate(){ // 根组件
				// ...
                this._router.init(this); // 调用自身的init方法进行初始化 
            }else if(this.$parent && this.$parent._routerRoot){
			//...
        }
    })

}
export default install
```

​	而init的方法就写在了router类上

```js
class VueRouter {
  constructor(options = {}) {
	  //...
  }

  init(app) {

  }

}
```



​	首先，我们需要对用户的选项进行格式化，初始化的时候，就要去监听路由事件，根据路径的变化进行切换组件。所以，这个init方法主要的作用就是监听路径的变化，渲染对应的组件。

> 为什么需要对选项进行格式化呢？

​		由于用户传过来的选项比较模糊,如一下代码

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]
```

​	如果直接用以上代码，会比较不方便。为什么呢？我们希望的格式是，当访问对应的路径的时候，就有对应的记录`record`，如下格式

```js
{
    '/': record,
    '/a': record,
    '/b': record
}
```

​	所以为了实现以上的格式，需要对原选项进行扁平化 。这个功能靠createMatcher(option)实现。通过传入选项，该方法返回一个映射表matcher。其主要功能就是根据路由的配置参数进行格式化操作。

```js
class VueRouter {
  constructor(options = {}) {
    // 根据路由的配置参数进行格式化操作 {}
    // 创建一个匹配器 用于匹配记录 // 两个方法 match, addRoutes
    this.matcher = createMatcher(options.routes || []); 
  }
}
```

代码实现如下：

```js
export const createMatcher = (routes) => { // 匹配器
    
  // 创建一个路径和记录的映射表
  let { pathMap } = createRouteMap(routes); // {path:'/',record:{},path:'/about',record}

  function match(location) {
    // 路径对应的匹配路由是谁 matched:[about,aboutA]  this.$routes.matched
    let record = pathMap[location];
    return createRoute(record,{ // {path:/about/a,matched:[about,aboutA]}
        path:location
    })
     // 稍后会传入路径，我会将对应的记录匹配出来返回
  }
  function addRoutes(routes) {
    // 将新的routes 也增加到pathMap中
    return createRouteMap(routes, pathMap);
  }
  return {
    match,
    addRoutes,
    pathMap,
  };
};
```



​	在进行匹配之前， 还需要创建一个路径和记录的映射表。主要通过createRouteMap来实现。

```js
function createRouteMap(routes, oldMap) {
  const pathMap = oldMap || Object.create(null);
  routes.forEach((route) => {
    addRouteRecord(pathMap, route);
  });
  return {
    pathMap,
  };
}
```

​	具体该如何实现扁平化呢，可以对选项中的每一条路由做处理，并添加到pathMap中。具体的处理方法就是通过addRouteRecord（）方法，该方法就是往路由中添加记录的。为什么要这样处理呢？我们首先是根据用户配置添加pathMap，然后就是为了解决动态注册添加pathMap中。具体实现如下。

```js
// 构建父子关系 ， 稍后路径匹配的时候 /about/a -> 这个路径对应的记录，看记录中有没有parent，如果有将parent的记录也找到 [parentRecord，childRecord]
export const addRouteRecord = (route, pathMap, parent) => {
    let path = parent ? `${parent.path}/${route.path}` : route.path
    let record = {
        path: route.path, // 为了儿子能拿到父亲的路径
        name: route.name,
        component: route.component,
        parent
    }
    if (!pathMap[path]) { // 防止同一个路径 多次进行注册
        pathMap[path] = record
    }
    if (route.children) { // 拥有子路由的话就通过递归处理 
        route.children.forEach(child => {
            addRouteRecord(child, pathMap, record)
        });
    }
}
```

解析：

1. 主要就是构建记录record，然后创建映射表，直接放入pathMap中
2. 但是需要考虑是否重名的情况。通过`！pathMap[path]`判断，防止同一个路径多次进行注册
3. 第二步只是处理第一层，如果当前route中还有孩子，则通过遍历孩子递归调用addRouteRecord添加映射表。
4. 仅仅是这样在映射表中子路由的key值就是子路由的path，如`a`，没有父路由信息，例如`/home/a`， 所以在该函数中需要对path的值进行处理，如果存在父路由，就在子路由的path值上拼接父路由信息，如果没有就直接用本身的路由即可。
5. 在record中添加parent属性，构建父子关系，稍后路径匹配的时候 /about/a -> 这个路径对应的记录，看记录中有没有parent，如果有将parent的记录也找到 [parentRecord,childRecord]，等会就可以通过这样的一个列表去渲染route-view



​	 这样就完成映射表了。

​	我们可能还会遇到动态添加路由，会调用addRoutes方法进行动态添加路由

```js
export function createMatcher(routes) { // 匹配器 
    
    const { pathMap } = createRouteMap(routes); // 创建一个 路径和记录的映射表

    function addRoutes(routes) { // 在原来的基础上继续添加路由
        createRouteMap(routes, pathMap);
    }

    return {
        addRoutes, 
        match
    }
}
```

​	我们只需要调用createRouteMap方法，并和之前拥有的映射表一起合并，就是在原来基础上继续添加路由。

​	接下来还要实现一种方法，就是通过路径，就可以找到对应的record记录。

```js
export function createMatcher(routes) { // 匹配器 
    
    const { pathMap } = createRouteMap(routes);

    function addRoutes(routes) {}
    
    function match(location) { // 给我传递个路径 你帮我去匹配
        let record = pathMap[location]; // 根据路径找到一个匹配的数组
        if (record) {
            return createRoute(record, { path: location })
        }
        return createRoute(null, { path: location })
    }
    // 一个路径对应的记录是谁，这个记录有没有父亲 有父亲也要创造一个关联

    return {
        addRoutes, 
        match
    }
}
```

​	当传入path的之后，通过在映射表中查找path的值，就获取到对应的record记录值。其形式为

```js
{path : '/about/a', matched: [about组件, a组件]}
```

而这个形式主要就是靠createRoute函数实现：

```js
export const createRoute = (record, { path }) => {
    let matched = [];
    if (record){
        while (record) { // 有记录将自己插入到队列的头部
            matched.unshift(record);
            record = record.parent; // 一层层的向上找
        }
    }
    return {
        path,
        matched
    }
}
```

​	在这个函数中，如果有record，就先插入当前的，然后不停地查询父路由，如果有就插入matched的头部。

​	到目前为止，就可以通过输入路径，就可以找到这个路径所对应的路由。

比如输入`/about/a` ，就可以找到两条记录[ about组件，a组件 ]。

而createMatcher就具有动态添加路由与路由的匹配方法等核心功能。



后面，路径切换的时候，就可以获取到对应的matcher值。用于组件渲染。

下一步就是用哪一种的路由模式。

默认有三种，先说hash

## hash路由

​	一般只有hash和history两种，还有一种memoryHistory用在了服务端渲染上。

​	现阶段说一下hash路由模式如何实现对浏览器的历史管理。

​	hash与history都用了一种公共的类Base。

```js
class VueRouter { // 稍后new的时候会产生一个路由实例
    constructor(options = {}) {
        // matcher中有动态添加路由和 路由的匹配方法
        this.matcher = createMatcher(options.routes || []);

        if (options.mode === 'hash') {
            this.history = new HashHistroy(this); //hash
        } else {
            this.history = new BrowserHistory(this); // history
        }

    }

}

```

​	创建路由实例的时候，就通过new HashHistroy这个类来进行hash历史管理。默认情况下，通过history模式进行历史管理。

​	由于hash模式与history模式可能具有相同的方法，就创建一个基类Base进行存放。

对于hash，页面刷新的时候应该确保路径中具有`#/`。所以在HashHistroy实例化的时候，应该先执行ensureHash方法，用以确保刷新的时候有hash #。

```js
class HashHistroy extends Base{
    constructor(router){
        super(router);
        // 确保刷新的时候有hash #
        ensureHash()
    }
}
```

那如何确保有hash呢？

```js
function ensureHash(){
    if(window.location.hash)return

    window.location.hash = '/'
}
```

​	在ensureHash方法中，如果window.location.hash有值，就是具有hash值就直接返回即可。如果没有就通过window.location.hash设置。



现在我们就有了两个重要的概念。

- this.matcher.match 匹配规则
- this.history 路由系统

当我们初始化的时候，就可以监听路由的变化，进行路由跳转。



初始化函数如下：

```js
class VueRouter { // 稍后new的时候会产生一个路由实例
    constructor(options = {}) {
		//...
    }


    init(app) { // 进行路由的初始化
        const history = this.history;

        // 根据路径进行跳转 ，并且跳转完毕后 监听hash值的变化
        history.listen((route) => { // _route就是我们定义的响应式数据
            app._route = route; // 安插的回调每次都重新 渲染一下
        })
        
        const setupListenerHandler = () => {
            history.setupListener(); // 监听hash值的变化 
        }
       history.transitionTo(history.getCurrentLocation(), setupListenerHandler)
    }
}
```

​	在初始化函数init（）中，主要就是监听路径的变化，渲染对应的组件，以下是大概流程。

1. 先获取到目前的history模式。（先定路由模式为hash）

2. 那hash是如何监听路径的变化呢？老版本中hash的监控靠的是hashchange，新版本可以使用popstate。所以其使用策略就是支持popstate就用，不支持就用hashchange

3. 然后就先通过Base类中的transitionTo方法进行跳转，然后跳转完毕之后，再通过setupListenerHandler方法监听history的变化。因为页面渲染出来第一步都是跳转到默认路径。

   ```js
   class Base {
       constructor(router) {
           this.router = router;
           this.current = createRoute(null,{path:'/'})
       }
   
       listen(cb){
           this.cb = cb;
       }
   
   	// 根据路径进行跳转
       transitionTo(location,callback) {
           // 1. 根据路径进行匹配，匹配到对应的记录。
           let record = this.router.match(location);
           this.current =  createRoute(record,{path:location});
           this.cb && this.cb(this.current);
           // 2.只有传递了callback才调用，这个callback默认只有第一次传递。
           callback && callback();
       }   
   }
   ```

   在transitionTo()方法中，我们先根据路径进行匹配，匹配到对应的记录。