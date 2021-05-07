<!--
 * @Author: your name
 * @Date: 2021-02-25 17:18:04
 * @LastEditTime: 2021-04-25 09:33:55
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \mandalat.frame\src\layout\sidebar\sidebar-item-all.vue
-->
<template>
  <el-menu-item
    v-if="
      item.children &&
      !item.hidden &&
      onlyOneChildren(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChild) &&
      !item.alwaysShow
    "
    :index="resolvePath(onlyOneChild.path)"
  >
    <item
      :icon="onlyOneChild.meta.icon"
      :title="onlyOneChild.meta.title"
    ></item>
  </el-menu-item>
  <el-submenu
    v-else-if="item.children && !item.hidden"
    :index="resolvePath(item.path)"
    popper-class="custom-submenu"
  >
    <template slot="title">
      <item :icon="item.meta.icon" :title="item.meta.title"></item>
    </template>

    <template v-for="child of item.children">
      <template v-if="!child.hidden">
        <sidebar-item-all
          :key="child.path"
          :item="child"
          :base-path="resolvePath(item.path + '/' + child.path)"
          v-if="child.children && child.children.length > 0"
        />
        <el-menu-item v-else :key="child.path" :index="resolvePath(item.path + '/' + child.path)">
          <item :icon="child.meta.icon" :title="child.meta.title"></item>
        </el-menu-item>
      </template>
    </template>
  </el-submenu>
  <el-menu-item v-else :index="resolvePath(item.path)">
    <item
      :icon="item.meta.icon"
      :title="item.meta.title"
    ></item>
  </el-menu-item>
</template>
<script>
import path from 'path'
import Item from './Item'
export default {
  name: 'sidebar-item-all',
  data() {
    return {
      onlyOneChild: null
    }
  },
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
  mounted() {
    console.log(this.basePath)
  },
  methods: {
    onlyOneChildren(children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          this.onlyOneChild = item
          return true
        }
      })
      console.log(showingChildren.length)
      if (showingChildren.length === 1) {
        return true
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = {
          ...parent,
          path: '',
          noShowingChild: true
        }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      return /^\/.*/.test(routePath) ? routePath : path.resolve(this.basePath, routePath)
    }
  }
}
</script>
