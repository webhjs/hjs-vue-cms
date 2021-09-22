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

import { filterAsyncRoutes } from "@/asyncRouter.js";

/*读取router配置*/
import { routerModules } from "@/router";
const { constantRouterMap, asyncRouterMap } = routerModules;
/*读取router配置*/

NProgress.configure({ showSpinner: false });

const whitePath = ["/login"];
// 路由全局前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start(); // start progress bar
  document.title = to.meta.title || "default";
  if (whitePath.includes(to.path)) {
    next();
    return;
  } // 跳转登录页直接跳转
  // 保存在store中路由不为空则放行 (如果执行了刷新操作，则 store 里的路由为空，此时需要重新添加路由)
  if (store.getters['layout/routers'].length) {
    //放行
    next()
    return;
  }
  const res = await store.dispatch("user/pullUserInfo")
  if (!res.name) {
    next(`/login?redirect=${to.path}`);
    return;
  }
  if (store.getters['user/name'] === "Lucy") {
    const accessRoutes = filterAsyncRoutes(asyncRouterMap, ["Lucy"]);
    store.commit("layout/setRouters", constantRouterMap.concat(accessRoutes));
    // 动态添加路由到router内
    router.addRoutes(accessRoutes);
    // console.log(accessRoutes)
    next({ ...to }) // hack方法 确保addRoutes已完成
  } else {
    const accessRoutes = filterAsyncRoutes(asyncRouterMap, []);
    store.commit("layout/setRouters", constantRouterMap.concat(accessRoutes));
    router.addRoutes(accessRoutes);
    next({ ...to }) // hack方法 确保addRoutes已完成
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
