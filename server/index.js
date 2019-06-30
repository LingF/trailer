const Koa = require('Koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['router', 'parcel']

const useMiddlewares = app => {
  R.map( // 遍历所有中间件
    R.compose( // 
      R.forEachObjIndexed( // 3. 每个对象
        initWidth => initWidth(app) // 4. 初始化每个暴露的函数
      ),
      require, // 2.
      name => resolve(__dirname, `./middlewares/${name}`) // 1. 文件路径，往上传给 require
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect()

  // 初始化 schema，然后都可以发布，生成模型，模型注入mongoose
  initSchemas()

  // 不同于发布，这里一个参数则是获取对应model
  // const Movie = mongoose.model('Movie')
  // const movies = await Movie.find({})
  // console.log(movies)

  // require('./tasks/movie')
  // require('./tasks/api')

  const app = new Koa()
  // 自己的理解：子进程开启对全局未处理rejection的处理
  // 暂不清楚性能影响，但对错误定位有奇效，切身体会
  process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error);
  });

  await useMiddlewares(app)

  app.listen(4455)

})()
