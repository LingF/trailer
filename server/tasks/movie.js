const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = false
    let err = code === 0 ? null : new Error(`exit code ${code}`)

    console.log(err)
  })

  child.on('message', data => {
    let result = data.result

    console.log(result)
    result.forEach(async item => {
      // 逐条查找
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })
      // 未存储过则创建新数据
      if (!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
  })

})()