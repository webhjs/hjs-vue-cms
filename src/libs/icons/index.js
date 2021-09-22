/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-03-28 23:22:38
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-18 16:12:21
 */
import Vue from 'vue'
import IconSvg from '@/components/Icon-svg'

Vue.component('svg-icon', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/) // 参数说明: 读取路径 是否遍历子目录 正则匹配文件
requireAll(req)