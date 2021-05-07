/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-22 09:20:49
 * @LastEditors: 金苏
 * @LastEditTime: 2021-03-24 10:47:52
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLang } from '@/libs/common/lang'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: getLang() || 'zh',
  messages
})

export default i18n
