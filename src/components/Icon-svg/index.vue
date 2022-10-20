<!--
 * @Author: your name
 * @Date: 2021-02-20 16:39:19
 * @LastEditTime: 2021-04-02 14:23:06
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms-master\src\components\icon-svg\index.vue
-->
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
  export default {
    name: 'icon-svg',
    props: {
      src: {
        type: String,
        required: true
      }
    },
    computed: {
      iconName() {
        return `#icon-${this.src}`
      }
    }
  }
</script>

<style scoped lang="stylus">
  .svg-icon {
    width 1.1em
    height 1.1em
    // fill currentColor
    overflow hidden
  }
</style>