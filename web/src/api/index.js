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
