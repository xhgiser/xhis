const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const expressJoi = require('@escook/express-joi')
const userCheck = require('../utils/check')

//注册
router.post(
  '/register',
  expressJoi(userCheck.userRegisterCheck),
  userController.registerController
)

//登录
router.post(
  '/login',
  expressJoi(userCheck.userLoginCheck),
  userController.loginController
)

//查询
router.get('/userInfo', userController.userInfoController)

module.exports = router
