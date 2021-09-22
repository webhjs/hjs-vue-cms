/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-19 09:31:51
 */

export default {
  add: ["/api/baseWorkerNode/add", "post"], // 新增
  list: ["/api/baseWorkerNode/queryList", "post", "params"],  // 查询
  update: ["/api/baseWorkerNode/update", "post"],  // 修改 
  delete: ["/api/baseWorkerNode/delete", "post", "params"],  // 删除 
  isOnline: ["/api/baseWorkerNode/isOnline", "post", "params"]  // 上线/下线工作引擎
};
