/*
 * @name:
 * @Descripttion:
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-02 18:13:44
 */

export default {
  add: ["/api/credential/add", "post"], // 新增

  addEncrypted: ["/api/credential/addEncrypted", "post"], // 加密新增
  
  list: ["/api/credential/list", "post", "params"],  // 查询

  listEncrypted: ["/api/credential/listEncrypted", "post", "params"],  // 加密查询

  update: ["/api/credential/update", "post"],  // 修改
  updateEncrypted: ["/api/credential/updateEncrypted", "post"],  // 加密修改 
  

  delete: ["/api/credential/delete", "post", "params"],  // 删除 
  distinct: ["/api/credential/distinct", "post", "params"], // 凭证别名是否重复
  secret: ["/api/credential/secret", "post", "params"], // 查看密钥

  secretEncrypted: ["/api/credential/secretEncrypted", "post", "params"], // 加密查看密钥

  organall: ["/api/organization/allDrop", "post"], // 机构信息
  companyall: ["/api/baseCompanyInfo/allDrop", "post"], // 厂商信息
  applicationall: ["/api/baseAppInfo/allDrop", "post"], // 应用信息
};
