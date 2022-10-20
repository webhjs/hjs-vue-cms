<!--
 * @Author: your name
 * @Date: 2021-02-25 17:18:04
 * @LastEditTime: 2021-09-30 19:47:37
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \mandalat.frame\src\layout\sidebar\sidebar-item-all.vue
-->
<template>
  <el-menu-item v-if="onlyOneFlag" :index="resolvePath(onlyOneChild.path)">
    <item
      :icon="onlyOneChild.meta.icon"
      :title="onlyOneChild.meta.title"
    ></item>
  </el-menu-item>
  <el-submenu
    v-else-if="level1Route.children && !level1Route.hidden"
    :index="resolvePath(level1Route.path)"
    popper-class="custom-submenu"
  >
    <template slot="title">
      <item
        :icon="level1Route.meta.icon"
        :title="level1Route.meta.title"
      ></item>
    </template>

    <template v-for="child of level1Route.children">
      <template v-if="!child.hidden">
        <sidebar-item-all
          :key="child.path"
          :level1Route="child"
          :base-path="resolvePath(level1Route.path + '/' + child.path)"
          v-if="child.children && child.children.length > 0"
        />
        <el-menu-item
          v-else
          :key="child.path"
          :index="resolvePath(level1Route.path + '/' + child.path)"
        >
          <item
            :icon="child.meta.icon"
            :title="child.meta.title"
          ></item>
        </el-menu-item>
      </template>
    </template>
  </el-submenu>
  <el-menu-item v-else :index="resolvePath(level1Route.path)">
    <item
      :icon="level1Route.meta.icon"
      :title="level1Route.meta.title"
    ></item>
  </el-menu-item>
</template>
<script>
import path from "path";
import Item from "./Item";
export default {
  name: "sidebar-item-all",
  data() {
    return {
      onlyOneChild: null,
      onlyOneFlag: null
    };
  },
  components: {
    Item
  },
  props: {
    // 一级路由对象
    level1Route: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.onlyOneFlag =
      this.level1Route.children &&
      !this.level1Route.hidden &&
      !this.level1Route.alwaysShow &&
      this.onlyOneChildren(this.level1Route.children, this.level1Route) &&
      (!this.onlyOneChild.children || this.onlyOneChild.noShowingChild);
  },
  methods: {
    onlyOneChildren(children, parent) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      });
      switch (showingChildren.length) {
        case 0:
          let tempRoute;
          if (parent.redirect) {
            const temppath = parent.redirect.split("/").pop();
            for (let i = 0; i < children.length; i++) {
              if (children[i].path === temppath) {
                tempRoute = children[i];
                break;
              }
            }
          }
          const tempChild = {
            path: "",
            ...parent,
            noShowingChild: true,
            meta: {
              ...tempRoute.meta,
              ...parent.meta
            }
          };
          this.onlyOneChild = tempChild;
          return true;
          break;
        case 1:
          this.onlyOneChild = showingChildren[0];
          return true;
          break;
      }
      return false;
    },
    resolvePath(routePath) {
      return /^\/.*/.test(routePath)
        ? routePath
        : path.resolve(this.basePath, routePath);
    }
  }
};
</script>
