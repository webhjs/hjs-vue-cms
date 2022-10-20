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
  if (!roles.length) return routes
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
  if (!menus.length) return routes
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
  const routeArr = filterRoutes(routes, roles)
  const itor = (arr, parentUrl = "") => {
    arr.forEach(m => {
      for(let i = 0; i < menus.length; i++) {
        if (path.resolve(parentUrl, m.path) == menus[i].path) {
          m.meta = {
            ...m.meta,
            ...menus[i].meta
          }
          break
        }
      }
      m.children && itor(m.children, path.resolve(parentUrl, m.path))
    })
  }
  itor(routeArr)
  const paths = menus.map(m => m.path)
  return filterMenus(routeArr, paths)
}
