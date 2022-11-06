import request from '@/utils/request'

/**
 * 注册接口
 */
export const getRegister = (data) => {
  return request({ method: 'post', url: '/api/user/register', data })
}

/**
 * 登录接口
 */
export const getLogin = (data) => {
  return request({ method: 'post', url: '/api/user/login', data })
}

/**
 * 获取用户信息接口开发
 */
export const getUserInfo = () => {
  return request({ method: 'get', url: '/api/user/userInfo' })
}
