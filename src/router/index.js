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
import path from 'path'

/*读取router配置*/
import { requireContext, Lazy } from '@/libs/utils/custom';
export const modules = requireContext(require.context('./modules', true, /\.js$/))
// 合并路由信息
export const routerModules = Object.values(modules).reduce((pre, cur) => {
  const { asyncRouterMap, constantRouterMap } = cur
  return { 
    asyncRouterMap: pre.asyncRouterMap.concat(asyncRouterMap),
    constantRouterMap: pre.constantRouterMap.concat(constantRouterMap)
  }
}, { asyncRouterMap: [], constantRouterMap: [] })
/*读取router配置*/

const { constantRouterMap } = routerModules ? routerModules : { constantRouterMap: [] };

import { constantCommonRouterMap } from "@/router/common"

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);

class LazyRouter extends Router {
  constructor(option) {
    const { routes } = option
    Array.isArray(routes) && LazyRouter._itorCacheRouterName(routes)
    super(option)
    LazyRouter._setProxyRouter(this)
  }
  
  // 递归插入lazy函数
  static _itorCacheRouterName(routerTreeArr) {
    const itor = (routerTreeArr, _path = '') => {
      routerTreeArr.forEach(ele => {
        const anotherCom = ele.component
        const __path = path.resolve(_path, ele.path)
        ele.component = () => Lazy(anotherCom, ele, __path)
        ele.children && ele.children.length && itor(ele.children, __path)
      });
    }
    itor(routerTreeArr)
  }

  static _setProxyRouter(router = {}) {
    const deepRouterProto = router.__proto__
    const routerProxyPrototype = Object.create(deepRouterProto)
    router.__proto__ = routerProxyPrototype

    ;['addRoute', 'addRoutes'].forEach(method => {
      const originMethod = deepRouterProto[method]
      LazyRouter._def(routerProxyPrototype, method, function() {
        const args = arguments
        switch(method) {
          case 'addRoute':
            Array.isArray(args[1]) && LazyRouter._itorCacheRouterName(args[1])
            break;
          case 'addRoutes':
            Array.isArray(args[0]) && LazyRouter._itorCacheRouterName(args[0])
            break;
        }
        return originMethod.apply(this, args)
      })
    })
  }

  static _def(obj, name, value) {
    Object.defineProperty(obj, name, {
      value: value,
      writable: false, // 修改
      enumerable: false,  // 枚举
      configurable: false, //删除
      // get: () => {},
      // set: () => {}
    })
  }
}



const router = new LazyRouter({
  mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantCommonRouterMap.concat(constantRouterMap)
})

export default router
