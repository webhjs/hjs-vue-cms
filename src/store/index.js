/*
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-02-23 17:01:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * 自动读取modules文件夹中的vuex模块
 * 不用手动引入和注入
 */

import { requireContext } from '@/libs/utils/custom';
const modules = requireContext(require.context('./modules', true, /\.js$/), 'default')

export default new Vuex.Store({
  modules
})
