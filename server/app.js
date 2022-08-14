const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

/**
 * 解析post请求的body数据
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extend: false }))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * 解析token校验是否正确|哪些接口需要token校验
 */
const { expressjwt: jwt } = require('express-jwt')
const { jwtSecretKey } = require('./config/jwtSecretKey')

app.use(
  jwt({ secret: jwtSecretKey, algorithms: ['HS256'] }).unless({
    path: ['/api/user/login', '/api/user/register'],
  })
)

/**
 * 调用路由
 */
//用户相关接口
const userRouter = require('./routes/user')
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

//错误中间件
const joi = require('joi')
app.use(function (err, req, res, next) {
  //joi 参数校验失败
  if (err instanceof joi.ValidationError) {
    return res.send({
      status: 1,
      message: err.message,
    })
  }
  //未知错误
  res.send({
    status: 1,
    message: err.message,
  })
})
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
