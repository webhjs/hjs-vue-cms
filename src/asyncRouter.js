/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-30 13:30:47
 * @LastEditors: 金苏
 * @LastEditTime: 2021-05-07 09:46:03
 */
// asyncRouter.js
//判断当前角色是否有访问权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}
// 递归过滤异步路由表，筛选角色权限路由
export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}
