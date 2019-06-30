const mongoose = require('mongoose')
const {
  controller,
  get,
  post,
  put
} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

// 装饰器；控制器，前缀；外层 - 路径空间
@controller('/api/v0/movies')
export class movieController { // 暴露一个类

  @get('/')
  // 通过装饰器添加功能
  // @login // 登录
  // @admin(['developer']) // 权限
  // @log  // 打印日志
  async getMovies (ctx, next) {
    const { type, year } = ctx.query
    // 通过 service 获取
    const movies = await getAllMovies(type, year)

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // @post
  // @required({body: ['username', 'doubanId']}) 检查字段


  @get('/:id')
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}