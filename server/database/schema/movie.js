/* 电影数据模型 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed  // 可以存任何类型

const movieSchema = new Schema({
  doubanId: String,
  rate: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  posterKey: String,
  coverKey: String,

  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,  // 单一字符串或数组
  year: Number,

  tags: [String], // or Array

  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 参数：模型名字，发布生成所需要的 Schema
mongoose.model('Movie', movieSchema)