/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-02 10:20:57
 */

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
    "code": 200,
    "data": {
      "personname": "学生", //真实名
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE2Mzc0OTM1NzAzNjgiLCJ0ZW5hbnRpZCI6IjMxMDAwMDAwMTAwMDEiLCJleHAiOjE2Mzc1MDA3NzAsInVzZXJuYW1lIjoic3R1ZGVudCJ9.ZSlf-Vb4k4bH_JR2gAykQ57FvFXMqv8s_lCZuBrH6_Q", //token
      "userimgurl": "/Path/user/3aa978f2-fadc-4540-9cef-996e760f4d74.png", //用户头像
      "username": "admin", //登录名
      "menus": []
    },
    "msg": ""
  },
  lucy: {
    account: "lucy",
    token: "lucy",
    name: "Lucy",
    age: 12,
    sex: 2,
    avatar: "/static/images/avatar/1.jpg",
    permissions: "/excel,/theme",
    type: ["Vue"],
    desc: ""
  }
};

function pullUserInfo() {
  return {
    "code": 200,
    "data": {
      "id": '1',
      "personname": "学生", //真实名
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE2Mzc0OTM1NzAzNjgiLCJ0ZW5hbnRpZCI6IjMxMDAwMDAwMTAwMDEiLCJleHAiOjE2Mzc1MDA3NzAsInVzZXJuYW1lIjoic3R1ZGVudCJ9.ZSlf-Vb4k4bH_JR2gAykQ57FvFXMqv8s_lCZuBrH6_Q", //token
      "userimgurl": "/Path/user/3aa978f2-fadc-4540-9cef-996e760f4d74.png", //用户头像
      "username": "student", //登录名
      "menus": [ ]
    },
    "msg": ""
  };
}


function getUserMenuList() {
  
}

export { userMap, pullUserInfo, getUserMenuList };
