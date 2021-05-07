/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-29 16:05:12
 * @LastEditors: 金苏
 * @LastEditTime: 2021-03-29 19:19:05
 */
import { getLang, setLang } from '@/libs/common/lang'

const SET_LANG = 'SET_LANG'

const language = {
  state: {
    language: getLang() || 'zh'
  },
  mutations: {
    [SET_LANG](state, language) {
      state.language = language
      setLang(language)
    }
  },
  actions: {
    setLanguage({commit}, language) {
      commit(SET_LANG, language)
    }
  },
  getters: {
    language: state => state.language
  }
}
export default language
