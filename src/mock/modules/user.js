/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-02 10:20:57
 */
import { getToken } from "@/libs/common/auth";

/**
 * 用户列表list
 * sex: 1-男；2-女
 * @type {Object}
 */
const userMap = {
  // 键名和token保持一致
  // permissions 是用户的权限
  // 相比于用role来做权限，permissions这样可以定制每一个用户的权限
  // permissions不能为空，最少
  admin: {
    account: "admin",
    token: "admin",
    name: "Admin",
    age: 10,
    sex: 1,
    avatar: "./static/images/avatar/1.jpg",
    permissions: "/excel,/clipboard,/theme,/test",
    type: ["Vue", "小程序"],
    desc: "我是admin账号"
  },
  lucy: {
    account: "lucy",
    token: "lucy",
    name: "Lucy",
    age: 12,
    sex: 2,
    avatar: "./static/images/avatar/1.jpg",
    permissions: "/excel,/theme",
    type: ["Vue"],
    desc: ""
  }
};

function pullUserInfo() {
  console.log('pullUserInfo')
  return getToken() ? userMap[getToken()] : '';
}

export { userMap, pullUserInfo };
