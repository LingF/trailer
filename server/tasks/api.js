const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`

  const res = await rp(url)

  let body

  try {
    body = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }

  console.log(body)

  return body
}

;(async () => {

  // 查找条件（不完整的数据）
  let movies = await Movie.find({
    $or: [ // 或的条件，满足以下任一条件
      { summary: { $exists: false } },
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })

  // [movies[0]] 限制1个，避免api请求过多被屏蔽
  for (let i = 0; i < (movies[0]).length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]

          let cat = await Category.findOne({
            name: item
          })

          // 类型不存在
          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else { // 已有类型
            if (cat.movies.indexOf(movie._id) === -1) { // 对应类型中未存此电影
              cat.movies.push(movie._id)
            }
          }
          // 保存类型
          await cat.save()

          // 当前电影的类型
          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }

  // movies.map(async movie => {
  //   let movieData = await fetchMovie(movie)

  //   try {
  //     movieData = JSON.parse(movieData)
  //     console.log(movieData.tags)
  //     console.log(movieData.tag)
  //   } catch (err) {
  //     console.log(err)
  //   }

  //   console.log(movieData)
  // })

})()
