const mongoose = require('mongoose')
const {
  controller,
  get,
  post,
  put
} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')

// 装饰器；控制器，前缀；外层 - 路径空间
@controller('/api/v0/user')
export class userController {
  @post('/')
  async login(ctx, next) {
    const { email, password } = await parsePostData(ctx)//ctx.request.body
    const matchData = await checkPassword(email, password)

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }

    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })

  }
}

function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end", function () {
        let parseData = parseQueryStr(postdata)
        resolve(parseData)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function parseQueryStr(queryStr) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log('queryStrList', queryStrList)
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}