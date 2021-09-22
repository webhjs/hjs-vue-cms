/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-23 14:17:19
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-02 10:48:58
 */
export default {
  add: ["/api/baseDataResource/add", "post"], // 新增
  list: ["/api/baseDataResource/query", "post", "params"],  // 查询
  update: ["/api/baseDataResource/update", "post"],  // 修改 
  delete: ["/api/baseDataResource/delete", "post", "params"],  // 删除
  convertWSDLFile: ["/api/baseDataResource/convertWSDLFile", "post", "params"],  // 提取WSDL文件格式转换成JSON
  convertJsonContext: ["/api/baseDataResource/convertJsonContext", "post", "params"], // 提取JSON内容转换成
  convertXmlPlain: ["/api/baseDataResource/convertXmlPlain", "post", "params"], // 提取Xml内容转换成
}