
<template>
  <div>
    <el-scrollbar class="app-wrapper">
      <template v-if="position === 'left-no'">
        <div class="containers cloumn-flex">
          <navbar></navbar>
          <div class="main-container full">
            <sidebar :isCollapse="isCollapse" class="vertical leftno-wrap" :logo="false"/>
            <div class="main-left main-common flex-full">
              <tabs-view></tabs-view>
              <app-main ref="AppMain" class="main-content"></app-main>
            </div>
          </div>
        </div>
      </template>
      <template v-if="position === 'left'">
        <div class="containers">
          <sidebar :isCollapse="isCollapse" class="vertical" overflowClass="overflowClass" />
          <div class="main-container">
            <navbar :logo="false">
              <i
                :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
                slot="menubtn-left"
                style="font-size: 20px; outline: none;cursor: pointer; margin:0 10px"
                @click="swtichCollapse"
              ></i>
            </navbar>
            <div class="main-left main-common">
              <tabs-view></tabs-view>
              <app-main ref="AppMain" class="main-content"></app-main>
            </div>
          </div>
        </div>
      </template>
      <template v-if="position === 'right'">
        <div class="containers">
          <div class="main-container" :class="{ 'science-blue': theme === 'theme-summer' }">
            <navbar>
              <i
                :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
                slot="menubtn-right"
                style="font-size: 20px; outline: none;cursor: pointer; margin-left: 5px"
                @click="swtichCollapse"
              ></i>
            </navbar>
            <div class="main-left full">
              <div class="container">
                <tabs-view class="border-gray-100 border-r border-solid"></tabs-view>
                <div class="flex-full relative">
                  <app-main ref="AppMain" class="main-content"></app-main>
                </div>
              </div>
              <sidebar :logo="false" :isCollapse="isCollapse" class="vertical" overflowClass="overflowClass right_menu" />
            </div>
          </div>
        </div>
      </template>
      <template v-if="position === 'top'">
        <navbar :breadIsShow="false" class="layout-top">
          <sidebar-item
            target="div"
            v-for="router of staticRoute"
            slot="menulist"
            class="horizontal"
            :key="router.path"
            :item="router"
            :base-path="router.path"
          />
          <el-submenu v-if="menuMoreShow" index="" slot="more">
            <template slot="title">...</template>
            <sidebar-item
              target="div"
              v-for="router of dynamicRoute"
              class="horizontal"
              :key="router.path"
              :item="router"
              :base-path="router.path"
            />
          </el-submenu>
        </navbar>
        <div class="container-top">
          <div class="main-container">
            <div class="main-top main-common">
              <breadcrumb
                style="height: 50px;color: #000;padding-left: 10px"
              ></breadcrumb>
              <tabs-view></tabs-view>
              <app-main ref="AppMain" class="main-content"></app-main>
            </div>
          </div>
        </div>
      </template>
      <template v-if="position === 'top_left'">
        <div class="containers">
          <sidebar-all :isCollapse="isCollapse" class="vertical" />
          <div class="main-container">
            <navbar :logo="false" :showlevel1="true" :breadIsShow="false">
              <i
                :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
                slot="menubtn-left"
                style="font-size: 20px; outline: none;cursor: pointer; margin:0 10px"
                @click="swtichCollapse"
              ></i>
              <sidebar-item-level-1
                slot="menulist"
                class="horizontal"
                v-for="router of staticRoute"
                :key="router.path"
                :item="router"
                :base-path="router.path"
              />
              <el-submenu v-if="menuMoreShow" index="" slot="more">
                <template slot="title">...</template>
                <sidebar-item-level-1
                  class="horizontal"
                  v-for="router of dynamicRoute"
                  :key="router.path"
                  :item="router"
                  :base-path="router.path"
                />
              </el-submenu>
            </navbar>
            <div class="main-left main-common">
              <breadcrumb
                class="top_left_bread"
              ></breadcrumb>
              <tabs-view></tabs-view>
              <app-main ref="AppMain" class="main-content"></app-main>
            </div>
          </div>
        </div>
      </template>
    </el-scrollbar>
    <!-- 右侧布局设置层 -->
    <el-drawer
      title="设置"
      :visible.sync="drawer"
      direction="rtl"
      size="20%"
      custom-class="layout-draw"
    >
      <el-divider content-position="left">主题</el-divider>
      <el-radio-group v-model="theme" class="two-columns">
        <el-radio-button label="science-blue">深空蓝</el-radio-button>
        <el-radio-button label="theme-summer">简约白</el-radio-button>
        <el-radio-button label="sapphire-blue">宝石蓝</el-radio-button>
      </el-radio-group>
      <el-divider content-position="left">布局</el-divider>
      <el-radio-group v-model="position" class="three-columns" @change="changeRadio">
        <el-radio-button label="left-no">自定义</el-radio-button>
        <el-radio-button label="left">左侧</el-radio-button>
        <el-radio-button label="right">右侧</el-radio-button>
        <el-radio-button label="top">上下</el-radio-button>
        <el-radio-button label="top_left">上下+左右</el-radio-button>
      </el-radio-group>
    </el-drawer>
  </div>
</template>
<script>
import Navbar from './Navbar'
import Sidebar from './Sidebar/Sidebar'
import SidebarAll from './Sidebar/Sidebar-all'
import TabsView from './Tabs-view'
import AppMain from './App-main'
import { mapGetters } from 'vuex'
import SidebarItem from './Sidebar/Sidebar-item'
import SidebarItemLevel1 from './Sidebar/Sidebar-item-level1'
import Breadcrumb from './Breadcrumb'
import {addResizeListener, removeResizeListener} from 'element-ui/lib/utils/resize-event'

export default {
  components: {
    Navbar,
    Sidebar,
    SidebarAll,
    TabsView,
    AppMain,
    SidebarItem,
    SidebarItemLevel1,
    Breadcrumb
  },
  computed: {
    ...mapGetters({
      routers: "layout/routers"
    }),
    staticRoute() {
      return this.routers.slice(0,this.sliceLength)
    },
    dynamicRoute() {
      return this.routers.slice(this.sliceLength)
    },
    drawer: {
      get() {
        return this.$store.getters['layout/drawer']
      },
      set(value) {
        this.$store.commit('layout/setDrawer', value)
      }
    },
    theme: {
      get() {
        return this.$store.getters['layout/theme']
      },
      set(value) {
        this.$store.commit('layout/setTheme', value)
      }
    },
    isCollapse: {
      get() {
        return this.$store.getters['layout/isCollapse']
      },
      set(value) {
        this.$store.commit('layout/setIsCollapse', value)
      }
    },
    position: {
      get() {
        return this.$store.getters['layout/position']
      },
      set(value) {
        this.$store.commit('layout/setPosition', value)
        this.$nextTick(_ => {
          addResizeListener(
            document.querySelector("#menu-top-list-resize-id"),
            this.menuResize
          );
        });
      }
    },
    totalMenuLength() {
      let total = 0
      for (let i = 0; i < this.routers.length; i++) {
        if (!this.routers[i].hidden) {
          total++
        }
      }
      return total
    }
  },
  data() {
    return {
      layout: '',
      sliceLength: (() => { // 用于分割字符路由串的位置
        return this.$store.getters['layout/routers'].length
      })(),
      menuMoreShow: false // 是否展示更多
    }
  },
  mounted() {
    addResizeListener(document.querySelector('#menu-top-list-resize-id'), this.menuResize)
  },
  beforeDestroy() {
    removeResizeListener(document.querySelector('#menu-top-list-resize-id'), this.menuResize)
  },
  provide() {
    return {
      layoutTheme: this//方法一：提供祖先组件的实例
    };
  },
  methods: {
    menuResize() {
      const menuWidth = document.querySelector('#menu-top-list-resize-id') && document.querySelector('#menu-top-list-resize-id').getBoundingClientRect().width
      const moreWidth = 80
      const diff = menuWidth - moreWidth
      const count = Math.floor(diff / 150)
      if (count >= this.totalMenuLength) {
        this.menuMoreShow = false
        this.sliceLength = this.routers.length
        return
      }
      let better = -1;
      for (let i = 0; i < this.routers.length; i++) {
        if (!this.routers[i].hidden) {
          if(++better === count) {
            this.menuMoreShow = true
            this.sliceLength = i
            break
          }
        }
      }
    },
    /* 中间商开始 */
    reload(fullPath) {
      this.$refs.AppMain.reload(fullPath)
    },
    removeCache(fullPath) {
      this.$refs.AppMain.removeCache(fullPath)
    },
    removeCacheAll() {
      this.$refs.AppMain.removeCacheAll()
    },
    removeOtherCacheAll(fullPath) {
      this.$refs.AppMain.removeOtherCacheAll(fullPath)
    },
    /* 中间商结束 */
    swtichCollapse() {
      this.isCollapse = !this.isCollapse
    },
    /* 更换布局方式 */
    changeRadio(val) {
      if (val === 'left-no') {
        this.isCollapse = false
      }
    }
  }
}
</script>
<style scoped lang="stylus">
.full
  display: flex
.flex-full
  flex: 1
.relative
  position relative
.container {
  flex: 1
  display: flex
  flex-flow column
}

.main-container
  overflow auto
.top_left_bread
  height: 50px;
  color: #000;
  padding-left: 10px;
  /deep/ .el-breadcrumb__separator
    color: #000;
.app-wrapper
  position absolute
  width 100%
  height 100vh
  /deep/ .el-scrollbar__wrap
    overflow-x hidden
  .containers
    height 100vh
    display flex
    background-color #fefefe
    &.cloumn-flex
      flex-flow: column
    .main-container
      flex 1
    &.flex
      display flex
  .container-top
    height calc(100vh - 56px)
    display flex
    background-color #fefefe
    .main-container
      flex 1
.two-columns{
  width: 100%
  /deep/ .el-radio-button {
    width: 33%
    .el-radio-button__inner {
      width: 100%
    }
  }
}
.three-columns{
  width: 100%
  border-left: 1px solid #DCDFE6;
  /deep/ .el-radio-button {
    width: 33.3%
    .el-radio-button__inner {
      width: 100%
    }
  }
  /deep/ .el-radio-button:first-child .el-radio-button__inner, /deep/ .el-radio-button:last-child .el-radio-button__inner {
    border-left: 0;
    border-radius: 0;
  }
}
.main-left
  height: calc(100vh - 56px)
  &.flex-full
    flex: 1
.main-top {
  height: calc(100vh - 56px)
}
.main-common{
  display: flex;
  flex-flow: column;
  .main-content{
    flex: 1
    overflow: auto
    position: relative;
  }
}
.vertical
  width auto
  height 100%
.vertical
  /deep/ .el-submenu__icon-arrow
    right 10px
.leftno-wrap
  height: calc(100vh - 56px)
/deep/ .el-submenu__icon-arrow
  top 58%
  right 0
/deep/ .el-submenu__title:hover
  background-color transparent
/deep/ .el-menu-vertical-demo:not(.el-menu--collapse)
  min-height unset
  overflow auto
</style>
<style lang="stylus">
.layout-draw .el-drawer__body {
  padding: 0 10px;
}
.layout-draw .el-drawer__header{
  font-size: 18px;
}
.layout-draw .el-radio-button__inner {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
