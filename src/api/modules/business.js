/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-18 16:26:40
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-06 16:29:23
 */
export default {
  add: ["/api/api/group/add", "post"], // 新增
  list: ["/api/api/group/list", "post", "params"],  // 查询
  update: ["/api/api/group/update", "post"],  // 修改 
  delete: ["/api/api/group/removeIds", "post", "params"],  // 删除 
  retree: ["/api/api/group/retree", "post"]  // 重构树
};
