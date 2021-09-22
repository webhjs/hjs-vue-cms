/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-18 10:52:28
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-18 11:05:29
 */
export default {
  add: ["/api/baseAppInfo/add", "post"], // 新增
  list: ["/api/baseAppInfo/query", "post", "params"],  // 查询
  update: ["/api/baseAppInfo/update", "post"],  // 修改 
  delete: ["/api/baseAppInfo/delete", "post", "params"]  // 删除 
};