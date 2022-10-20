<!--
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-09-30 11:38:39
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\layout\sidebar\sidebar.vue
-->
<template>
  <div class="left-sidebar">
    <el-menu
      ref="currentTopMenu2"
      class="el-menu-vertical-demo"
      :mode="mode"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      collapse-transition
      router
    >
      <el-menu-item class="logo-name title-name" index="" style="color: hsla(0,0%,100%,.85);font-weight: bold;font-size: 0;">
        <img
          src="@/libs/assets/imgs/logo.png"
          class="inline"
          alt=""
          width="20px"
          height="20px"
        />
        <span slot="title" style="font-size: 16px;"> {{ $t("navbar.title") }}</span>
      </el-menu-item>
      <div class="overflowScroll">
        <sidebar-item-all
          v-for="router of metaRouters"
          :key="router.path"
          :level1Route="router"
          :base-path="basePath"
        />
      </div>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import path from 'path'
import SidebarItemAll from './Sidebar-item-all'
export default {
  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    mate: {
      type: Boolean,
      default: false
    }
  },
  name: 'SideBar',
  components: {
    SidebarItemAll
  },
  computed: {
    ...mapGetters({
      routers: "layout/routers"
    }),
    metaRouters() {
      return this.matchRouters
    }
  },
  data() {
    return {
      matchRouters: [],
      basePath: '',
      lastChildren: {}
    }
  },
  mounted() {
    console.log(this.routers)
  },
  watch: {
    '$route': {
      handler(route) {
        if (route.path.startsWith('/redirect/')) {
          return
        }
        this.matchRouters = []
        let tempRouters = []
        const mateArr = route.matched
        this.basePath = mateArr[0].path || '/'
        for (let i = 0; i < this.routers.length; i++) {
          if (this.resolvePath(this.routers[i].path) === mateArr[0].path) {
            tempRouters = this.routers[i].children
            break
          }
        }
        if (this.basePath === '/') {
          for (let i = 0; i < this.routers.length; i++) {
            if (this.routers[i].path === '/') {
              tempRouters = this.routers[i].children
              break
            }
          }
        }
        this.matchRouters = tempRouters
        this.$nextTick(() => {
          this.$refs.currentTopMenu2.activeIndex = mateArr[mateArr.length - 1].meta.activeMenu || mateArr[mateArr.length - 1].path // elementui default-active 不会用感觉有bug 我猜可能是因为我涉及到单个子路由提升到开头
        })
      },
      immediate: true
    }
  },
  methods: {
    onlyOneChildren(node) {
      if (node.length === 1) {
        if (node[0].children) {
          return this.onlyOneChildren(node[0].children)
        } else {
          this.lastChildren = node[0]
          return true
        }
      } else {
        return false
      }
    },
    handleOpen(key, keyPath) {
      console.log('handleOpen', key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('handleClose', key, keyPath)
    },
    resolvePath(routePath) {
      return /^\/.*/.test(routePath) ? routePath : path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-menu
  height 100%
  border-right: 0;
  background-color var(--light)
.overflowScroll
  height: calc(100% - 55px)
  overflow: auto;
</style>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 256px;
  min-height: 400px;
}
</style>
