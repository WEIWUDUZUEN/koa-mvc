'use strict'

export default (app, { format, formats }, { User }) => {
  app.get('/home/category', (ctx) => {
    ctx.body = format('111111')
  })
}