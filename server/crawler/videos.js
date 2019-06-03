/**
 * 补全mongoose豆瓣电影地址
 */

const puppeteer = require('puppeteer')
const { connect, initSchemas } = require('../database/init')
const mongoose = require('mongoose')

const base = 'https://movie.douban.com/subject/'
// const doubanId = '26735288'
const videoBase = 'https://movie.douban.com/trailer/227587/#content'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const getVideoAndCover = async (doubanId) => {
    console.log(doubanId)
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    })
    console.log(1)
    const page = await browser.newPage()    // 开启新页面
    await page.goto(`${base}${doubanId}`, { // 跳目标页面
      waitUntil: 'networkidle2'             // 何时为加载成功
    })

    await sleep(1000)

    const result = await page.evaluate(() => {
      var $ = window.$
      var it = $('.related-pic-video')
      if (it && it.length) {
        var link = it.attr('href')
        var cover = it.find('img').attr('src')

        return {
          link,
          cover
        }
      }

      return {}
    })

    let video
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })

      await sleep(2000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }

    browser.close()

    return new Promise((resolve, reject) => {

      const data = {
        video,
        doubanId,
        cover: result.cover
      }

      resolve(data)
    // process.send()
    // process.exit(0)



    })
}


;(async () => {
  console.log('Start visit the target page')

  await connect()
  initSchemas()
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({})
  movies.map(async movie => {
    try {

      let doubanId = movie.doubanId
      let vac = await getVideoAndCover(doubanId)
      console.log(vac)

      await Movie.update({
        doubanId: doubanId
      }, { $set : { 'video': vac.video, 'cover': vac.cover} })
    } catch (err) {

    }
  })

  // process.send(data)
  process.exit(0)
})()