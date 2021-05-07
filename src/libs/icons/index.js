/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-28 23:22:38
 * @LastEditors: 金苏
 * @LastEditTime: 2021-03-29 15:23:07
 */
import Vue from 'vue'
import IconSvg from '@/components/Icon-svg'

Vue.component('svg-icon', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
