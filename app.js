const Koa = require('koa')
const render = require('koa-ejs')
const static = require('koa-static')

const app = new Koa();

const root = __dirname
render(app, {
  root,
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: true,
})

app.use(static(root))

app.use(async function (ctx) {
  await ctx.render(`slides/${ctx.req.url.slice(1)}`)
});

app.listen(3000, () => {
  console.log('Server started successfully!')
})