/*
 * @name:
 * @Descripttion: API 接口
 * @Author: Morning
 * @Date: 2021-03-27 19:06:39
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-06 17:31:26
 */
import request from "@/libs/utils/request";

const modulesFiles = require.context('./modules', true, /\.js$/)
const apiMap = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export function Api(apiPath, data, headers) {
  const [proto, name] = apiPath.split('/')
  const apiMapReal = apiMap[proto]
  const map = {
    post: "data",
    get: "params"
  };
  const param = apiMapReal[name][2] || map[apiMapReal[name][1]]
  const querys = {
    url: apiMapReal[name][0],
    method: apiMapReal[name][1],
    [param]: data
  };
  return request({
    ...querys,
    ...headers
  });
}

// const apiFun = {};

// Object.keys(apiMap).forEach(api => {
//   apiFun[api] = function(data, headers) {
//     return Api(api, data, headers);
//   };
// });

// export { apiFun };
/*
 * @Author: your name
 * @Date: 2021-02-26 13:44:28
 * @LastEditTime: 2021-03-17 18:32:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mandalat.frame\src\utils\htmlToPdf.js
 */
import qs from 'qs'
import store from "@/store";
import { Message } from 'element-ui';
import { loadFromLocal } from "@/libs/common/local-storage";
export default {
  install(Vue) {
    Vue.prototype.api = function (apiPath, data, headers) {
      const [proto, name] = apiPath.split('/')
      const apiMapReal = apiMap[proto]
      const map = {
        post: "data",
        get: "params"
      };
      const param = apiMapReal[name][2] || map[apiMapReal[name][1]]
      const querys = {
        url: apiMapReal[name][0],
        method: apiMapReal[name][1],
        [param]: data,
        paramsSerializer: serializer => { // 参数序列化
          //形式1： ids=1&ids=2&id=3
          // qs.stringify({ids: [1, 2, 3]}, { indices: false })

          //形式2： ids[0]=1&aids1]=2&ids[2]=3
          // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘indices‘})

          //形式3：ids[]=1&ids[]=2&ids[]=3
          // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘brackets‘})

          //形式4： ids=1&ids=2&id=3
          // qs.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘repeat‘}) 
          return ['params'].includes(param) ? qs.stringify(serializer, { indices: false }) : serializer
        }
      };
      return new Promise((resolve, reject) => {
        request({
          ...querys,
          ...headers
        }).then(resp => {
          if (resp.code == 155) { // 刷新token
            console.log('登录过期',resp)
            if (!loadFromLocal("username", "") || !loadFromLocal("password", "")) return
            store.dispatch("user/login", {
              username: loadFromLocal("username", ""),
              password: loadFromLocal("password", "")
            })
              .then(res => {
                if (res.code == 200) {
                  Message.success('刷新成功');
                }
                resolve(res);
              })
              .catch(err => {
                reject(err)
              })
          } else {
            resolve(resp);
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}