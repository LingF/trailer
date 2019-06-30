const Router = require('koa-router')
const { resolve } = require('path')
const _ = require('lodash')
const glob = require('glob')

// es6 Symbol 类型
// symbolPrefix 唯一
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

// 封装了 Router -> Route
export class Route {
  constructor (app, apiPath) {
    // Koa 实例
    this.app = app
    // 路由所在目录
    this.apiPath = apiPath
    this.router = new Router()
  }

  init() {
    // path 里面任意js文件
    glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      // 1个或多个
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      // 前缀+当前path
      const routerPath = prefixPath + conf.path
      // this.router = koa-router | get/put/... method
      // 调用这个路由的函数
      this.router[conf.method](routerPath, ...controllers)
    }
    // 注册完这些中间件可以应用这些所有路由规则
    this.app.use(this.router.routes())
    // 应用所有请求的方法
    this.app.use(this.router.allowedMethods())
  }
}

// /开头返回path，否则加上
const normalizePath = path => path.startsWith('/') ? path : `/${path}`

// 修饰 +
// conf <= { method, path }
const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  console.log(conf)
  // key: target, method, path
  // value: 方法
  routerMap.set({
    target: target,
    // path: conf.path,
    // method: conf.method
    ...conf
  }, target[key])
}

// [装饰器] 接受一个地址参数
// symbolPrefix -> 唯一
export const controller = path => target => (target.prototype[symbolPrefix] = path)

// [装饰器] 获取数据
export const get = path => router({
  method: 'get',
  path: path
})

// [装饰器] 提交新建记录
export const post = path => router({
  method: 'post',
  path: path
})

// 修改记录
export const put = path => router({
  method: 'put',
  path: path
})

// 删除记录
export const del = path => router({
  method: 'del',
  path: path
})

// 使用中间件
export const use = path => router({
  method: 'use',
  path: path
})

// 处理所有请求
export const all = path => router({
  method: 'all',
  path: path
})