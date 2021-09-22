/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-07 16:24:37
 */

export default {
  add: ["/api/constant/add", "post"], // 新增
  list: ["/api/constant/list", "post", "params"],  // 查询
  update: ["/api/constant/update", "post"],  // 修改 
  delete: ["/api/constant/delete", "post", "params"], // 删除
  getbyid: ["/api/constant/values", "post", "params"], // 编辑查询
  updateEnvValue: ["/api/constant/updateEnvValue", "post"], // 编辑查询
};
