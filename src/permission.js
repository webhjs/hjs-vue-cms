/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-26 09:51:46
 */
/*
 * 全局权限检测
 * 包括1、路由的全局守卫
 */
import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // progress bar style
import store from "./store";
import { Message } from 'element-ui';
import { getToken } from "@/libs/common/auth";

import { filterAsyncRoutes } from "@/asyncRouter.js";

/*读取router配置*/
import { routerModules } from "@/router";
import { asyncCommonRouterMap } from "@/router/common";
const { constantRouterMap, asyncRouterMap } = routerModules ? routerModules : { constantRouterMap: [], asyncRouterMap: [] };
/*读取router配置*/

NProgress.configure({ showSpinner: false });

const whitePath = ['/login', '/components/component-index']; // 白名单
// 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // start progress bar
  document.title = to.meta.title || "default";
  if (whitePath.includes(to.path)) {
    if (store.getters['layout/originRouters'] || !whitePath.length) {
      next();
      return;
    }
    const finallyMenus = whitePath.map(m => ({ path: m }))
    const accessRoutes = filterAsyncRoutes(asyncRouterMap.concat(asyncCommonRouterMap), [], finallyMenus);
    console.log(accessRoutes)
    store.commit("layout/setOriginRouters", accessRoutes)
    // 动态添加路由到router内
    router.addRoutes(accessRoutes);
    next({ ...to });
    return
  } // 跳转登录页直接跳转
  if (!getToken()) {
    next(`/login?redirect=${to.path}`);
    NProgress.done();
    return;
  }
  let accountInfo = store.getters['user/accountInfo']
  try {
    accountInfo = accountInfo.id ? accountInfo : await store.dispatch("user/pullUserInfo")
  }  catch (_) {
    Message.warning('拉取用户信息失败')
    next(`/login?redirect=${to.path}`);
    NProgress.done();
    return
  }
  // 保存在store中路由不为空则放行 (如果执行了刷新操作，则 store 里的路由为空，此时需要重新添加路由)
  if (Array.isArray(store.getters['layout/routers']) && accountInfo.id) {
    //放行
    next()
    return;
  }
  if (!accountInfo.id) {
    next(`/login?redirect=${to.path}`);
    NProgress.done();
    return;
  }
  if (accountInfo.id) {
    const accessRoutes = filterAsyncRoutes(asyncRouterMap.concat(asyncCommonRouterMap), [], []); // { path: '', meta: {} }
    store.commit("layout/setOriginRouters", constantRouterMap.concat(accessRoutes))
    // 动态添加路由到router内
    router.addRoutes(accessRoutes);
    next({ ...to }) // hack方法 确保addRoutes已完成
  } else {
    const accessRoutes = filterAsyncRoutes(asyncRouterMap.concat(asyncCommonRouterMap), ["Lucy"]);
    store.commit("layout/setRouters", constantRouterMap.concat(accessRoutes));
    router.addRoutes(accessRoutes);
    next({ ...to }) // hack方法 确保addRoutes已完成
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
