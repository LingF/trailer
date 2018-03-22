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
export class movieController {

  @get('/')
  async getMovies (ctx, next) {
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = {
      movies
    }
  }

  // @post
  // @required({body: ['username', 'doubanId']})


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