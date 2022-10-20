/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-27 14:30:37
 */
import { getToken } from "@/libs/common/auth";
import axios from 'axios'
import router from "@/router";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

console.log(process.env)
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_ENV == 'development' ? '/api' : window.$config.baseURL,
  timeout: 15000, // 请求超时时间
  withCredentials: true //带上cookie
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['AUTHTOKEN'] = getToken();
    // config.headers['nonce'] = 'ied8szjomxibx0hs1ah4g3xhj1wnpn39jvmlkn7ep81zutt9nv5bwkklw5crm6gcer6sy6jlb6cnlsikhh66ypfamh0zar79t3b2tfsurziris19dohjfvydoiqmif3u'
    // config.headers['appKey'] = 1252
    // config.headers['curTime'] = 1610357629
    // config.headers['checkSum'] = '099cdedd562d2537586acd76e68b290704298e24'
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    if ([ 401 ].includes(response.data.code)) {
      router.push({ path: '/login' })
    }
    return Object.prototype.toString.call(response.data)==='[object Object]' ? response.data : response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
