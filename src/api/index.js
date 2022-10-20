/*
 * @name:
 * @Descripttion: API 接口
 * @Author: Morning
 * @Date: 2021-03-27 19:06:39
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-06 17:31:26
 */
import request from "@/libs/utils/request";
import { requireContext } from '@/libs/utils/custom';
const apiMap = requireContext(require.context('./modules', true, /\.js$/), 'default')

export function Api(apiPath, data, headers) {
  const [proto, name] = apiPath.split('/')
  const apiMapReal = apiMap[proto]
  const map = {
    post: "data",
    get: "params"
  };
  if (!apiMapReal[name]) throw new Error('接口未定义 "' + proto + '/' + name + '"');
  const param = apiMapReal[name][2] || map[apiMapReal[name][1]]
  const querys = {
    url: apiMapReal[name][0],
    method: apiMapReal[name][1],
    [param]: data
  };
  return new Promise((resolve, reject) => {
    request({
      ...querys,
      ...headers
    }).then(resp => {
      if (resp.code == 200){
        resolve(resp);
      } else {
        Message.error(resp.message || resp.msg);
        reject(resp)
      }
    }).catch(err => {
      Message.error(err);
      reject(err)
    })
  })
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
import { Message } from 'element-ui';
export default {
  install(Vue) {
    Vue.prototype.api = function (apiPath, data, headers) {
      const [proto, name] = apiPath.split('/')
      const apiMapReal = apiMap[proto]
      const map = {
        post: "data",
        get: "params",
        delete: "params",
      };
      if (!apiMapReal[name]) throw new Error('接口未定义 "' + proto + '/' + name + '"');
      const param = apiMapReal[name][2] || map[apiMapReal[name][1]]

      let query = {}
      const isIcludes = (arr) => { // 判断数组中是否只包含get post两个请求
        return Object.keys(arr).filter(m => {
          return ['get', 'post'].includes(m)
        }).length === 2
      }
      if (data && Object.keys(data).length === 2 && isIcludes(data)) {
        query = {
          data: data.post,
          params: qs.stringify(data.get)
        }
      } else {
        query = {
          [param]: data
        }
      }

      const querys = {
        url: apiMapReal[name][0],
        method: apiMapReal[name][1],
        ...query,
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
          if (resp.code == 200){
            resolve(resp);
          } else if (resp.filename) { 
            resolve(resp);
          } else {
            Message.error(resp.message || resp.msg);
            reject(resp)
          }
        }).catch(err => {
          Message.error(err);
          reject(err)
        })
      })
    }
  }
}