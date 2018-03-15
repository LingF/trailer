/**
 * 豆瓣电影地址
 * http://vt1.doubanio.com/201803152138/713edeeb7de9c2b70e2c8e441c28fb79/view/movie/M/302270587.mp4
 */

const puppeteer = require('puppeteer')

const base = 'https://movie.douban.com/subject/'
const doubanId = '26752852'
const videoBase = 'https://movie.douban.com/trailer/227587/#content'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })

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

  const data = {
    video,
    doubanId,
    cover: result.cover
  }

  browser.close()

  process.send(data)
  process.exit(0)
})()