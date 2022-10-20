/*
 * @Author: your name
 * @Date: 2021-02-23 16:14:08
 * @LastEditTime: 2021-08-23 09:20:41
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\store\modules\setLayout.js
 */
import { saveToLocal, loadFromLocal } from '@/libs/common/local-storage'
const SET_DERAWER = 'setDrawer'
const SET_THEME = 'setTheme'
const SET_POSITION = 'setPosition'
const SET_ROUTERS = 'setRouters'
const SET_ORIGIN_ROUTERS = 'setOriginRouters'
const SET_ISCOLLAPSE = 'setIsCollapse'
const SET_ROLE_NAME = 'setRoleName'

const layout = {
  namespaced: true,
  state: {
    drawer: false,
    theme: (() => {
      return loadFromLocal('theme', 'sapphire-blue')
    })(),
    position: (() => {
      return loadFromLocal('position', 'left')
    })(),
    isCollapse: (() => {
      return JSON.parse(loadFromLocal('isCollapse', 'false'))
    })(),
    originRouters: null,
    routers: null,
    roleName: (() => {
      return loadFromLocal('roleName', '')
    })(),
    bgColorMap: [
      "#e7f7ff",
      "#d9f2e8",
      "#feece1",
      "#d7e4eb",
      "#d6f3ca",
      "#d9f2e8",
      "#e4e4e4",
      "#e7e7ff",
      "#d7e4eb",
      "#feece1",
      "#b5d2e8",
      "#ffd7c3",
      "#d6e5ec",
      "#f9dede",
      "#def3f9",
      "#d8d8d8",
      "#f7ca7e",
      "#f89488",
      "#7cd5cf",
      "#9091ab",
      "#fa8182"
    ]
  },
  mutations: {
    [SET_DERAWER](state, payload) {
      state.drawer = payload
    },
    [SET_THEME](state, payload) {
      saveToLocal('theme', payload)
      state.theme = payload
    },
    [SET_POSITION](state, payload) {
      saveToLocal('position', payload)
      state.position = payload
    },
    [SET_ISCOLLAPSE](state, payload) {
      saveToLocal('isCollapse', String(payload))
      state.isCollapse = payload
    },
    [SET_ROUTERS](state, routers) {
      state.routers = routers
    },
    [SET_ORIGIN_ROUTERS](state, payload) {
      state.originRouters = payload
    },
    [SET_ROLE_NAME](state, payload) {
      saveToLocal('roleName', payload)
      state.roleName = payload
    }
  },
  getters: {
    drawer: state => state.drawer,
    theme: state => state.theme,
    position: state => state.position,
    isCollapse: state => state.isCollapse,
    routers: state => {
      if (Array.isArray(state.originRouters)) {
        if (state.roleName) {
          const find = state.originRouters.find(f => state.roleName == f.rolename)
          if (find) {
            return find.menu
          } else {
            saveToLocal('roleName', '')
            return state.originRouters.length ? state.originRouters : []
          }
        } else {
          return state.originRouters.length ? state.originRouters : []
        }
      } else {
        return state.routers
      }
    },
    bgColorMap: state => state.bgColorMap,
    originRouters: state => state.originRouters
  }
}

export default layout
