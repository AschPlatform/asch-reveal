const Koa = require('koa')
const render = require('koa-ejs')
const static = require('koa-static')
const fs = require('fs')
const path = require('path')

const EXT = '.html'

function getSlides(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err)
      const slides = []
      for (const f of files) {
        const ext = path.extname(f)
        const basename = path.basename(f, EXT)
        if (ext === EXT && basename !== 'index') {
          slides.push(basename)
        }
      }
      return resolve(slides)
    })
  })
}

function main() {
  const app = new Koa()

  const root = process.cwd()
  render(app, {
    root,
    layout: false,
    viewExt: 'html',
    cache: false,
  })

  app.use(static(__dirname))

  app.use(async ctx => {
    const slide = ctx.req.url.slice(1)
    if (!slide) {
      const slides = await getSlides(root)
      await ctx.render('index', { slides })
    } else {
      await ctx.render(slide)
    }
  });

  const port = Number(process.argv[2]) || 3000
  app.listen(port, (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Serving!\r\nhttp://localhost:${port}`)
  })
}

main()