# vue-test

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## 文件目录
```
├── README.md                 项目介绍
├── index.html                入口页面
├── build                   构建脚本目录
│  ├── build-server.js        运行本地构建服务器，可以访问构建后的页面
│  ├── build.js               生产环境构建脚本
│  ├── dev-client.js          开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
│  ├── dev-server.js          运行本地开发服务器
│  ├── utils.js               构建相关工具方法
|  |── vue-loader.conf.js        判断环境       
│  ├── webpack.base.conf.js      wabpack基础配置
│  ├── webpack.dev.conf.js       wabpack开发环境配置
│  └── webpack.prod.conf.js      wabpack生产环境配置
├── config                项目配置
│  ├── dev.env.js           开发环境变量
│  ├── index.js             项目配置文件
│  ├── prod.env.js          生产环境变量
│  └── test.env.js          测试环境变量
├── package.json        npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
├── src                 源码目录 
|  ├── api                请求数据接口 
│  ├── main.js            入口js文件+根组件
│  ├── components         公共组件目录
│  |  └── filters           常用的过滤器
│  ├── assets             资源目录，这里的资源会被wabpack构建
│  │  └── images
│  │  └── style
│  ├── router             前端路由
|  ├── service            封装axios
│  ├── store              应用级数据（vuex）
│  └── views              页面目录
│    └── home               主页面
├── static            纯静态资源，不会被wabpack构建。
└── test              测试文件目录（unit&e2e）
  └── unit              单元测试
    ├── index.js            入口脚本
    ├── karma.conf.js       karma配置文件
    └── specs               单测case目录
      └── Hello.spec.js
```

## 过滤器在组件中直接使用即可
```
<span>{{ '8738668139' | readable() }}</span>
```

## 已配置项 axios scss vuex px转rem elint
