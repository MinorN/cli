'use strict'
const axios = require('axios')

// TODO 修改为域名
const BASE_URL = process.env.MINORN_CLI_BASE_URL
  ? process.env.MINORN_CLI_BASE_URL
  : 'http://127.0.0.1:7001'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  timeoutErrorMessage: '请求超时',
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    Promise.reject(error)
  }
)

module.exports = request
