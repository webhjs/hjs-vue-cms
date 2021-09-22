/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-25 15:49:58
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-07 14:59:00
 */
export default {
  add: ["/api/baseDataConverter/add", "post"], // 新增
  list: ["/api/baseDataConverter/query", "post", "params"],  // 查询
  update: ["/api/baseDataConverter/update", "post"],  // 修改 
  delete: ["/api/baseDataConverter/delete", "post", "params"], // 删除
  convert : ['/api/baseDataConverter/convert', 'post'], // 根据映射关系生成脚本
  querygroup : ['/api/baseDataResource/queryByGroup', 'post'], // 分组查询资源列表
  queryById : ['/api/baseDataResource/queryById', 'post', "params"], // 根据主键查询资源
  test : ['/api/baseDataConverter/test', 'post'], // 测试脚本
}