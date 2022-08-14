const mysql = require('../db/mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../config/jwtSecretKey')

/**
 * 注册接口逻辑
 */
exports.registerController = (req, res) => {
  // 用户名或者密码判空的校验
  let { userName, password, name, user_department, user_type } = req.body
  if (!userName || !password) {
    return res.send({ code: 1, message: '用户名或者密码不能为空！' })
  }
  // 用户名查重的逻辑
  const userSelectSql = 'select * from users where username=?'
  mysql.query(userSelectSql, userName, (err, results) => {
    if (err) {
      return res.send({ code: 1, message: err.message })
    }

    //判断用户是否在数据库中存在
    if (results.length > 0) {
      return res.send({ code: 1, message: '该用户名已经存在' })
    }

    //用户密码加密
    const bcrypt = require('bcryptjs')
    const passwordB = bcrypt.hashSync(password, 10)

    //用户信息插入数据库
    const userInsertSql =
      'insert into users (username,password,name,user_createtime,user_department,user_type) value (?,?,?,NOW(),?,?)'
    mysql.query(
      userInsertSql,
      [userName, passwordB, name, user_department, user_type],
      (err, results) => {
        if (err) {
          return res.send({ code: 1, message: err.message })
        }
        res.send({
          code: 0,
          data: {
            message: '注册成功',
          },
        })
      }
    )
  })
}

/**
 * 登录接口逻辑
 */
exports.loginController = (req, res) => {
  let { userName, password } = req.body
  const userSelectSql = 'select * from users where username=?'
  mysql.query(userSelectSql, userName, (err, results) => {
    //错误日志返回
    if (err) {
      return res.send({ code: 1, message: err.message })
    }

    //账号存在与否判断
    if (results.length === 0) {
      return res.send({ code: 1, message: '账号不存在，请先注册！' })
    }

    //判断密码是否正确
    const compareState = bcrypt.compareSync(password, results[0].password)
    if (!compareState) {
      return res.send({ code: 1, message: '密码错误！' })
    }

    //声明需要拼接token的用户信息
    const user = { ...results[0], password: '' }

    //生成token
    const token = jwt.sign(user, jwtSecretKey, { expiresIn: '24h' })

    //响应数据
    res.send({
      code: 0,
      data: {
        message: '登录成功',
        token: 'Bearer ' + token,
      },
    })
  })
}

/**
 * 用户信息查询逻辑
 */
exports.userInfoController = (req, res) => {
  //获取token
  const token = req.headers.authorization

  //解析token获取用户数据
  const userInfo = jwt.verify(token.split('Bearer ')[1], jwtSecretKey)

  res.send({
    code: 0,
    data: { name: userInfo.name, user_type: userInfo.user_type },
  })
}
