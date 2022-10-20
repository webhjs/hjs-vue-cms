/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-04-02 09:46:48
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-26 10:56:15
 */
const SET_TABSVIEW = 'SET_TABSVIEW'
const DEL_TABSVIEW = 'DEL_TABSVIEW'
const RETSET_TABSVIEW = 'RETSET_TABSVIEW'
const tabsview = {
  state: {
    visitedTabsView: []
  },
  mutations: {
    [RETSET_TABSVIEW](state, view) {
      // state.visitedTabsView = [{ name: view.meta.title, path: view.path }]
      state.visitedTabsView = view
    },
    [SET_TABSVIEW](state, view) {
      if (state.visitedTabsView.find((n) => n.path === view.path)) {
        return
      }
      const { name, path, fullPath, params, query, meta } = view
      const param = {
        name, path, fullPath, params, query,
        label: meta.title
      }
      state.visitedTabsView.push(param)
    },
    [DEL_TABSVIEW](state, view) {
      for (let [i, v] of state.visitedTabsView.entries()) {
        if (v.path === view.path && v.name === view.name) {
          state.visitedTabsView.splice(i, 1)
        }
      }
    }
  },
  actions: {
    // 添加一个新的tabsView
    addVisitedTabsView({ commit }, view) {
      commit(SET_TABSVIEW, view)
    },
    // 关闭一个tabsView
    delVisitedTabsView({ commit, state }, view) {
      return new Promise((resolve, reject) => {
        commit(DEL_TABSVIEW, view)
        resolve([...state.visitedTabsView])
      })
    },
    // 关闭所有tabsView
    delAllVisitedTabsView({ commit }, view) {
      return new Promise((resolve) => {
        commit(RETSET_TABSVIEW, view)
        resolve(view)
      })
    },
    // 关闭其它tabsView
    delAllVisitedOtherTabsView({ commit, state }, view) {
      return new Promise((resolve) => {
        const newRoutes = state.visitedTabsView.filter(route => {
          return route.path === view.path
        })
        commit(RETSET_TABSVIEW, newRoutes)
        resolve(newRoutes)
      })
    }
  },
  getters: {
    visitedTabsView: state => state.visitedTabsView
  }
}

export default tabsview
