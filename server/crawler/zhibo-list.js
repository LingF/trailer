/**
 * 直播吧列表
 */

const puppeteer = require('puppeteer')

const url = 'https://www.zhibo8.cc/'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(3000)

  // await page.waitForSelector('a[aria-role="button"]')

  // for (let i = 0; i < 1; i++) {
  //   await sleep(3000)

  //   await page.click('a[aria-role="button"]')
  // }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.schedule_container .box:eq(0)').find('li')
    var context = []
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let time = it.data('time')
        let label = it.attr('label')
        let point = it.find('span').html()

        context.push({
          time, label, point
        })
      })
    }
    return context
  })

  browser.close()

  console.log(result)

})()