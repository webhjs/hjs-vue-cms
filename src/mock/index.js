/*
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-04-06 09:23:56
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\mock\index.js
 */
import Mock from "mockjs";
import * as loginAPI from "./modules/login";
import * as userAPI from "./modules/user";

Mock.setup({
  timeout: "300-600"
});

// 登录相关接口
Mock.mock("/api/auth/login", "post", loginAPI.login);
Mock.mock("/api/login/logout", "post", loginAPI.logout);

Mock.mock("/api/login/test", "post", {
  "code": 155,
  "data": {
    "message": "hellow"
  },
  "msg": ""
});

// 用户信息相关接口
Mock.mock("/api/user/getMyInfo", "get", userAPI.pullUserInfo);

Mock.mock("/api/login/getUserMenuList", "get", {
  "code": 200,
  "data": {
    menus: [] || [{ path: '/home', title: '首页1' }]
  }
});

export default Mock;
