/**
 * 直播吧列表
 */

const puppeteer = require('puppeteer')

const url = 'https://www.zhibo8.cc/'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

// ;(async () => {
//   console.log('Start visit the target page')

//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox']
//   })

//   const page = await browser.newPage()

//   await page.goto(url, {
//     waitUntil: 'networkidle2'
//   })

//   await sleep(3000)

//   // await page.waitForSelector('a[aria-role="button"]')

//   // for (let i = 0; i < 1; i++) {
//   //   await sleep(3000)

//   //   await page.click('a[aria-role="button"]')
//   // }

//   const result = await page.evaluate(() => {
//     var $ = window.$
//     var items = $('.schedule_container .box:eq(0)').find('li')
//     var context = []
//     if (items.length >= 1) {
//       items.each((index, item) => {
//         let it = $(item)
//         let time = it.data('time')
//         let label = it.attr('label')
//         let point = it.find('span').html()

//         context.push({
//           time, label, point
//         })
//       })
//     }
//     return context
//   })

//   browser.close()

//   console.log(result)

// })()

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], 
    headless: true
  });
  const page = await browser.newPage();
  // await page.goto('http://localhost:8081/pages/planbkInPc.html?nw=1&uuid=3f8b0ddcd56d4fce8c2b41c88492e43e03c&rate=0.045&productId=172&cId=9ac78c37d5b44ceb9aae58f1f32e5ffb16', {
  //   waitUntil: 'networkidle2'
  // });
  await page.goto('http://manage-planbook.winbaoxian.cn/#/planBookList', {
    waitUntil: 'networkidle2'
  });
  await page.waitFor(300);

  //登录
  await page.type('input[placeholder="userName"]', "wfy");
  await page.type('input[placeholder="password"]', 'wangfeiyu');

  await page.click('.el-button.el-button--primary');

  //页面登录成功后，需要保证redirect 跳转到请求的页面
  await page.waitFor(3000);

  // await page.waitFor(300);
  await page.emulateMedia('print');
  await page.pdf({
    path: 'pb.pdf',
    format: 'A4',
    printBackground: true,
    landscape: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" }
  });

  await browser.close();
})()



// ;(async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   });
//   const page = await browser.newPage();

//   // Open page.
//   await page.goto('https://www.baidu.com');
//   await page.waitFor(300);
//   // Show search form.
//   // await page.click('#kw');

//   // Focus input field.
//   // await page.focus('');

//   // Type in query.
//   await page.type('#kw', 'puppeteer 可以当作服务来使用吗', {delay: 200});

//   // Submit the form.
//   // const searchForm = await page.$('#search-form-top');
//   // await searchForm.evaluate(searchForm => searchForm.submit());
// })()