const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-trailer'
const glob = require('glob')
const { resolve } = require('path')

// 使用nodejs原生的Promise,老版本mongoose的Promise跟标准的有差异
mongoose.Promise = global.Promise

exports.initSchemas = () => {
  // 逐个加载
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    // 断开则重连
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })

    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })

    mongoose.connection.on('open', () => {
      // //测试数据插入，验证数据库连接是否成功
      // const Movie = mongoose.model('Movie', { title: String })
      // const movie = new Movie({ title: '电影1' })
      // movie.save().then(() => {
      //   console.log('fang')
      // })

      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}