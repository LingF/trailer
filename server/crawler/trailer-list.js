/**
 * 豆瓣电影
 */

const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=R&range=0,10&tags='

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox']              // 启动非沙箱模式
  })

  const page = await browser.newPage()  // 开启新页面
  await page.goto(url, {                // 跳目标页面
    waitUntil: 'networkidle2'           // 何时为加载成功
  })

  await sleep(3000)

  await page.waitForSelector('.more')   // 等待.more（按钮）出现

  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')           // 等待后点击更多按钮
  }

  const result = await page.evaluate(() => {
    // 在页面上所执行的函数
    // 如果传递给frame.evaluate的函数返回一个Promise，那么frame.evaluate将等待承诺解析并返回其值。
    // 如果传递给frame.evaluate的函数返回一个·不可序列化·的值，那么frame.evaluate将解析为undefined
    var $ = window.$
    var items = $('.list-wp a')
    var links = []
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()

  console.log(result)

})()