import Login from "@/views/login";
import Layout from "@/libs/layout/Layout";

let routerFile = ''
const hash = /.*?#.*?/.test(window.location.href)
if (hash) {
    routerFile = window.location.hash.match(/#\/([\w-]*)\/?/)[1]
} else {
    routerFile = window.location.pathname.match(/\/([\w-]*)\/?/)[1]
}
export const nameSpace = routerFile;

export const constantCommonRouterMap = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    name: 'redirect',
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
  }
]
export const asyncCommonRouterMap = [
    { name: '404', path: "*", redirect: "/404", hidden: true }
]