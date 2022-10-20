/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-22 17:31:03
 */

export default {
  login: ["/auth/login", "post"],
  userInfo: ["/user/getMyInfo", "get"],
  logout: ["/login/logout", "post"],
  getUserMenuList: ["/login/getUserMenuList", "get"],
  // updatePwd: ["/auth/updatePwd", "post", "params"]
  test: ["/auth/updatePwd", "post", "params"]
};
