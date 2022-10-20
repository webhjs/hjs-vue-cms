<!--
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-09-27 11:35:03
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\layout\sidebar\sidebar.vue
-->
<template>
  <div class="left-sidebar">
    <el-menu
      class="el-menu-vertical-demo"
      :mode="mode"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :default-active="defaultActive"
      collapse-transition
      router
    >
      <el-menu-item v-if="logo" class="logo-name" index="" style="color: hsla(0,0%,100%,.85);font-weight: bold;font-size: 16px;">
        <img
          src="@/libs/assets/imgs/logo.png"
          alt=""
          width="20px"
          height="20px"
          class="inline"
        />
        <span slot="title"> {{ $t("navbar.title") }}</span>
      </el-menu-item>
      <div :class="overflowClass">
        <sidebar-item
          v-for="router of routers"
          :key="router.path"
          :item="router"
          :base-path="router.path"
        />
      </div>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SidebarItem from "./Sidebar-item";
export default {
  props: {
    mode: {
      type: String,
      default: "vertical"
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    logo: {
      type: Boolean,
      default: true
    },
    overflowClass: {
      type: String,
      default: ''
    }
  },
  name: "SideBar",
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters({
      routers: "layout/routers"
    })
  },
  data() {
    return {
      defaultActive: ""
    };
  },
  watch: {
    $route: {
      handler(route) {
        if (route.path.startsWith("/redirect/")) {
          return;
        }
        this.$nextTick(() => {
          this.defaultActive = this.$router.currentRoute.meta.activeMenu || this.$router.currentRoute.path;
        });
      },
      immediate: true
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log("handleOpen", key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("handleClose", key, keyPath);
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-menu
  height 100%
  border-right: 0;
  background-color var(--light)
.overflowClass
  height: calc(100% - 55px)
  overflow: auto
  /deep/ .el-tooltip
    text-align center
    padding: 0!important
/*隐藏文字*/
/deep/ .el-menu--collapse .el-submenu__title span
  display: none
/deep/ .el-menu--collapse .el-submenu__title .el-submenu__icon-arrow
  display: none;
/*隐藏文字*/
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 256px;
  min-height: 400px;
  overflow: auto;
}
</style>
