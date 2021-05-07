/*
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-04-06 10:13:31
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

import { routerFile } from "@/config";

/*读取router配置*/
const modulesFiles = require.context('./modules', true, /\.js$/)
export const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\/\w+\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value
  return modules
}, {})
export const routerModules = modules[routerFile]; // 设置读取路由
/*读取router配置*/

const { constantRouterMap } = routerModules;

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

export default new Router({
  // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
