/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-29 17:31:42
 * @LastEditors: 金苏
 * @LastEditTime: 2021-10-09 11:32:08
 */
import Login from "@/views/login";
import Layout from "@/libs/layout/Layout";

export const constantRouterMap = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: resolve => require(["@/views/redirect"], resolve)
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: Login,
    meta: {
      title: "登录"
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/",
    // hidden: true,
    component: Layout,
    meta: { icon: "s-home", title: "首页" },
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/student-template/home"),
        meta: { icon: "s-home", title: "首页" }
      }
    ]
  }
];
export const asyncRouterMap = [
  {
    path: "/components",
    alwaysShow: true,
    name: "icon",
    meta: { icon: "brush", title: "组件", roles: ["Lucy"] },
    component: Layout,
    redirect: "/components/component-index",
    children: [
      {
        path: "component-index",
        name: "component-index",
        meta: { icon: "brush", title: "组件列表" },
        component: () => import("@/views/student-template/components/list")
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];
