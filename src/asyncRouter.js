/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-30 13:30:47
 * @LastEditors: 金苏
 * @LastEditTime: 2021-05-07 09:46:03
 */
import path from 'path'

//判断当前角色是否有访问权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}
function filterRoutes (routes, roles) { // 过滤角色
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

function filterMenus (routes, menus, parentUrl = '') { // 过滤菜单
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (tmp.children) {
      tmp.children = filterMenus(tmp.children, menus, path.resolve(parentUrl, route.path));
    }
    ((tmp && tmp.children && tmp.children.length) || menus.includes(path.resolve(parentUrl, route.path)) || tmp.name === "404") && res.push(tmp)
  });
  return res;
}

// 递归过滤异步路由表，筛选角色权限路由
export function filterAsyncRoutes(routes, roles, menus) {
  return filterMenus(filterRoutes(routes, roles), menus)
}
