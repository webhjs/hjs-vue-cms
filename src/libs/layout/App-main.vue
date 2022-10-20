<!--
 * @name: 
 * @Descripttion: 
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-24 12:40:50
-->
<template>
  <div class="app-main">
    <!--页面不需要缓存-->
    <transition  name="fade" enter-active-class="animated fadeIn" mode="out-in" appear @after-enter="afterRouterChange">
      <keep-alive :exclude="keepAliveArr">
        <router-view v-if="isReload" :key="$route.fullPath" class="main-warp" ref="routerView"> </router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      desc: '这里是右侧主界面',
      isReload: true,
      keepAliveArr: []
    }
  },
  provide() {
    return {
      appMainTheme: this//方法一：提供祖先组件的实例
    };
  },
  methods: {
    reload(fullPath) {
      if (fullPath) {
        this.removeCache(fullPath)
      } else {
        fullPath = this.$route.fullPath
        this.removeCache(fullPath)
        this.isReload = false
        setTimeout(() => {
          this.isReload = true
        }, 50)
      }
    },
    /*移除缓存的组件*/
    removeCache(fullPath) {
      const cacheRouteInstance = this.$children.find(o => o?.$vnode?.data?.key === fullPath)
      const cache = cacheRouteInstance?.$vnode?.parent.componentInstance?.cache
      const keys = cacheRouteInstance?.$vnode?.parent?.componentInstance?.keys
      if (keys && keys.length) {
        var index = keys.findIndex(v => v.includes(fullPath))
        delete cache[keys[index]]
        keys.splice(index, 1)
      }
      cacheRouteInstance && cacheRouteInstance.$destroy()
    },
    /*移除缓存的组件*/
    removeCacheAll() {
      const cacheRouteInstance = this.$refs.routerView
      const cache = cacheRouteInstance?.$vnode?.parent.componentInstance?.cache
      const keys = cacheRouteInstance?.$vnode?.parent?.componentInstance?.keys
      keys.forEach(key => {
        delete cache[key]
      })
      keys.splice(0,keys.length)
      const length = this.$children.length
      for(let i = length - 1; i >= 0; i--) {
        this.$children[i] && this.$children[i].$destroy()
      }
    },
    /*移除其它缓存的组件*/
    removeOtherCacheAll(pathObj) {
      const cacheRouteInstance = this.$refs.routerView
      const cache = cacheRouteInstance?.$vnode?.parent.componentInstance?.cache
      const keys = cacheRouteInstance?.$vnode?.parent?.componentInstance?.keys
      for(let i = keys.length - 1; i >= 0; i--) {
        if (!keys[i].includes(pathObj.path)) {
          delete cache[keys[i]]
          keys.splice(i, 1)
        }
      }
      const length = this.$children.length
      for(let i = length - 1; i >= 0; i--) {
        if (this.$children[i].$vnode?.data?.key !== pathObj.path) {
          this.$children[i] && this.$children[i].$destroy()
        }
      }
    },
    // after-enter钩子事件，待子组件插入完毕调用
    afterRouterChange() {
      if (this.$route.meta.keepAlive === false) {
        const childName = this.$refs.routerView.$options.name || this.$route.name;
        if (childName && !this.keepAliveArr.includes(childName)) {
          this.keepAliveArr.push(childName);
        }
        return;
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.whitebg  
  overflow auto
  background-color #f2f4f7
  padding: 8px 10px 0
.main-warp
  position absolute
  width 100%
  height 100%
  background #f3f3f3
  padding: 10px
</style>
<style>
.margin12{
  margin-right: 12px
}
</style>

