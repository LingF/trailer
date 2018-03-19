const Koa = require('Koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

;(async () => {
  await connect()

  // 初始化 schema，然后都可以发布，生成模型，模型注入mongoose
  initSchemas()

  // 不同于发布，这里一个参数则是获取对应model
  // const Movie = mongoose.model('Movie')
  // const movies = await Movie.find({})
  // console.log(movies)

  // require('./tasks/movie')
  require('./tasks/api')

})()

const app = new Koa()

app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'Luke',
    me: 'LingF'
  })
})

// 自己的理解：子进程开启对全局未处理rejection的处理
// 暂不清楚性能影响，但对错误定位有奇效，切身体会
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});

app.listen(4455)