/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-18 11:04:56
 */

export default {
  add: ["/api/baseCompanyInfo/add", "post"], // 新增
  list: ["/api/baseCompanyInfo/query", "post", "params"],  // 查询
  update: ["/api/baseCompanyInfo/update", "post"],  // 修改 
  delete: ["/api/baseCompanyInfo/delete", "post", "params"]  // 删除 
};
