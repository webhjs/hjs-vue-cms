<!--
 * @Author: your name
 * @Date: 2021-02-25 16:07:46
 * @LastEditTime: 2021-04-22 23:14:04
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \mandalat.frame\src\layout\sidebar\sidebar-item-level1.vue
-->
<template>
  <div v-if="!item.hidden && item.children || item.alwaysShow"> <!--  && !onlyOneChildren(item.children) :class="[{ 'is-active': $route.path.startsWith(item.path) }]"-->
    <el-menu-item :index="item.path">
      <item :icon="item.meta.icon" :title="item.meta.title"></item>
    </el-menu-item>
  </div>
</template>
<script>
import Item from './Item'
export default {
  name: 'sidebar-item',
  components: {
    Item
  },
  props: {
    // 一级路由对象
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  methods: {
    onlyOneChildren(node) {
      if (node.length === 1) {
        if (node[0].children) {
          return this.onlyOneChildren(node[0].children)
        } else {
          return true
        }
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.active {
  color: white
}
</style>
