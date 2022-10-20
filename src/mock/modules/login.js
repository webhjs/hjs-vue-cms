/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: Morning
 * @LastEditTime: 2021-03-27 19:07:45
 */

import { userMap } from "./user";

function login(userInfo) {
  let { username } = JSON.parse(userInfo.body);
  return userMap[username];
}

function logout() {
  return {
    code: "200",
    data: "success"
  };
}

export { login, logout };
