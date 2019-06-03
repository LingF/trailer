const qiniu = require('qiniu')
const nanoid = require('nanoid')  //随机id，作为静态资源的文件名
const config = require('../config')
const { connect, initSchemas } = require('../database/init')
const mongoose = require('mongoose')


const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}


;(async () => {
  // const movies = [{
  //   video: 'http://vt1.doubanio.com/201803152206/f9d1afcc4f83e86191cbc6ed9a5a6a1a/view/movie/M/302260797.mp4',
  //   doubanId: '26735288',
  //   poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2515201533.jpg',
  //   cover: 'https://img3.doubanio.com/img/trailer/medium/2512074391.jpg?'
  // }]
  await connect()

  // 初始化 schema，然后都可以发布，生成模型，模型注入mongoose
  initSchemas()

  // 不同于发布，这里一个参数则是获取对应model
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({})
  console.log(movies)

  movies.map(async movie => {
    if (movie.video && !movie.key) {
      try {
        console.log('开始传 video')
        let videoData = await uploadToQiniu(movie.video, `${nanoid()}.mp4`)
        console.log('开始传 cover')
        let coverData = await uploadToQiniu(movie.cover, `${nanoid()}.png`)
        console.log('开始传 poster')
        let posterData = await uploadToQiniu(movie.poster, `${nanoid()}.png`)

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }

        console.log(movie)
      } catch (err) {
        console.log(err)
      }
    }
  })
})()