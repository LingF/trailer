const mongoose = require('mongoose')
const { controller, get, post, put } = require('../lib/decorator')

// 装饰器；控制器，前缀；外层 - 路径空间
@controller('/api/v0/movies')
export class movieController {

  @get('/')
  async getMovies (ctx, next) {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({}).sort({
      'meta.createdAt': -1
    })

    ctx.body = {
      movies
    }
  }

  // @post
  // @required({body: ['username', 'doubanId']})


  @get('/:id')
  async getMovieDetail (ctx, next) {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.find({_id: id})

    ctx.body = {
      movie
    }
  }
}