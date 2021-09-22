/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-18 10:24:41
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-02 14:06:03
 */
export default {
  distinct: ["/api/environment/distinct", "post", "params"], // 查询运行环境名称是否重复
  selectEnvid: ["/api/environment/all", "post"], // 环境下拉框
  add: ["/api/environment/add", "post"], // 新增
  list: ["/api/environment/list", "post", "params"],  // 查询
  update: ["/api/environment/update", "post"],  // 修改 
  delete: ["/api/environment/delete", "post", "params"], // 删除
  dictList: ["/api/base/dict/list", "post", "params"], // 获取多个字典
};