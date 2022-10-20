/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-29 17:31:42
 * @LastEditors: 金苏
 * @LastEditTime: 2021-10-09 11:32:08
 */
import Layout from "@/libs/layout/Layout";

export const constantRouterMap = [];
export const asyncRouterMap = [
  {
    path: "/student-components",
    alwaysShow: true,
    name: "student-components",
    meta: { icon: "brush", title: "额外组件", roles: ["Lucy"] },
    component: Layout,
    redirect: "/student-components/component-index",
    children: [
      {
        path: "component-index",
        name: "student-component-index",
        meta: { icon: "brush", title: "额外组件列表" },
        component: () => import("@/views/student-template/components/list")
      }
    ]
  },
  {
    path: "/bse-editor",
    alwaysShow: true,
    name: "bse-editor",
    meta: { icon: "brush", title: "编辑器" },
    component: Layout,
    redirect: "/bse-editor/index",
    children: [
      {
        path: "index",
        name: "bse-editor-index",
        meta: { icon: "brush", title: "bs编辑器", keepAlive: false },
        component: () => import("@/views/student-template/bse-editor")
      }
    ]
  }
];
