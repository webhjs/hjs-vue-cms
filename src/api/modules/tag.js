/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-18 16:26:40
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-18 16:27:58
 */
export default {
  add: ["/api/baseTag/add", "post"], // 新增
  list: ["/api/baseTag/query", "post", "params"],  // 查询
  update: ["/api/baseTag/update", "post"],  // 修改 
  delete: ["/api/baseTag/delete", "post", "params"]  // 删除 
};
