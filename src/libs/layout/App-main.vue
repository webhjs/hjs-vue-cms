<!--
 * @name: 
 * @Descripttion: 
 * @Author: Morning
 * @Date: 2021-03-27 13:41:10
 * @LastEditors: 金苏
 * @LastEditTime: 2021-04-20 13:16:09
-->
<template>
  <div class="app-main">
    <!--页面不需要缓存-->
    <transition  name="fade" enter-active-class="animated fadeIn" mode="out-in" appear @after-enter="afterRouterChange">
      <keep-alive>
        <router-view v-if="isReload" :include="keepAliveArr" :key="$route.fullPath" class="absolute w-full h-full" ref="routerView"> </router-view>
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
    // after-enter钩子事件，待子组件插入完毕调用
    afterRouterChange() {
      if (this.$route.meta.keepAlive === false) return;
      // 记录子组件name，用于keepalive
      const childName = this.$refs.routerView.$options.name;
      if (childName && !this.keepAliveArr.includes(childName)) {
        this.keepAliveArr.push(childName);
      }
    }
  }
}
</script>

