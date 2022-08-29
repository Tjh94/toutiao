// 全局封装axios 请求模块
import axios from 'axios'

// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'

// 如果一个项目中存在多个基本url的配置时，该如何配置baseURL？
// axios.create()通过axios实例创建基本请求对象
// 通过rxport进行按需导出，当使用时需要用import{}来进行引用
export const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/' // 基础路径
})

// export default request
