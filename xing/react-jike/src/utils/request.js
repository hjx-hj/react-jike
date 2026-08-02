//axios的封装
import axios from 'axios'
import { getToken, removeToken } from './token'

const request = axios.create({
  baseURL: import.meta.env.PROD ? 'https://geek.itheima.net/v1_0' : '/api/v1_0',
  timeout: 5000
})

request.interceptors.request.use((config) => {
  console.log('发送请求:', config.url)
  console.log('请求参数:', config.data)
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  console.error('请求错误:', error)
  return Promise.reject(error)
})

request.interceptors.response.use(response => {

  return response.data
}, (error) => {
  console.dir(error)
  if (error.response.status === 401) {
    // 清除 token
    removeToken()
    // 跳转到登录页
    window.location.href = '/login'

  }
  return Promise.reject(error)
})

export default request
