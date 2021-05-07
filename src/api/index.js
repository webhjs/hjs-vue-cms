/*
 * @name:
 * @Descripttion: API 接口
 * @Author: Morning
 * @Date: 2021-03-27 19:06:39
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-26 09:47:30
 */
import request from "@/libs/utils/request";

import login from "./modules/login";

const apiMap = {
  ...login
};

export function Api(name, data, headers) {
  const map = {
    post: "data",
    get: "params"
  };
  const param = apiMap[name][2] || map[apiMap[name][1]]
  const querys = {
    url: apiMap[name][0],
    method: apiMap[name][1],
    [param]: data
  };
  return request({
    ...querys,
    ...headers
  });
}

const apiFun = {};

Object.keys(apiMap).forEach(api => {
  apiFun[api] = function(data, headers) {
    return Api(api, data, headers);
  };
});

export { apiFun };
