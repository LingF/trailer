const Bundler = require('parcel-bundler')
const views = require('koa-views')
const serve = require('koa-static')
const cors = require('koa2-cors')

const { resolve } = require('path')

const r = path => resolve(__dirname, path)

const bundler = new Bundler(r('../../../src/index.html'),{
  publicUrl: '/',
  watch: true
})

export const dev = async app => {
  await bundler.bundle()
  app.use(cors({
    origin: 'http://localhost:8080',
    allowedHeaders: 'Origin, x-requested-with, Content-Type, X-Token',
    credentials: true
  })) // self
  app.use(serve(r('../../../dist')))
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}