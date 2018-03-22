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
    glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require)

    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)

      const prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
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

// 修饰 + 地址
export const controller = path => target => (target.prototype[symbolPrefix] = path)

// 获取数据
export const get = path => router({
  method: 'get',
  path: path
})

// 提交新建记录
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