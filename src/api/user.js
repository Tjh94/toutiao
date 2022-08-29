// 用户相关接口

import {
  request
} from '../utils/request.js'
// 用户登录
// @params mobile 手机号
// @params code 验证码

export const login = data => request({
  method: 'POST',
  url: '/v1_0/authorizations',
  data
})
