/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-17 11:28:56
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-17 11:29:45
 */
// 唯一id
function guid() {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
}
export { guid }