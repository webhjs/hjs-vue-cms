/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-18 10:24:41
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-03 09:26:50
 */
export default {
  add: ["/api/datasource/add", "post"], // 新增
  addEncrypted: ["/api/datasource/addEncrypted", "post"], // 加密新增

  list: ["/api/datasource/list", "post", "params"],  // 查询
  listEncrypted: ["/api/datasource/listEncrypted", "post", "params"],  // 加密查询

  update: ["/api/datasource/update", "post"],  // 修改
  updateEncrypted: ["/api/datasource/updateEncrypted", "post"],  // 加密修改

  getbyid: ["/api/datasource/info", "post", "params"], // 根据ID查询数据信息
  infoEncrypted: ["/api/datasource/infoEncrypted", "post", "params"], // 加密根据ID查询数据信息


  testConnect: ["/api/datasource/testing", "post"], // 测试连接
  testingEncrypted: ["/api/datasource/testingEncrypted", "post"], // 加密测试连接
  
  delete: ["/api/datasource/delete", "post", "params"], // 删除
};