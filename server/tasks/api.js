const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

  const res = await rp(url)

  return res
}

;(async () => {
  let movies = [
    { doubanId: 26997533,
        title: '傲骨之战 第二季',
        rate: 9.6,
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2515458639.jpg' },
    { doubanId: 27600992,
        title: '弟之夫',
        rate: 8.2,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2513510133.jpg' }
  ]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags)
      console.log(movieData.tag)
    } catch (err) {
      console.log(err)
    }

    console.log(movieData)
  })

})()
