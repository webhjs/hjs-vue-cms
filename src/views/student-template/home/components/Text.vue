<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-03-08 15:01:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <fragment>
    <p class="content" :class="{ indent: indent,bold: bold }">
      <slot />
    </p>
  </fragment>
</template>
<script>
export default {
  props: {
    indent: {
      type: Boolean,
      default: true
    },
    bold: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="stylus" scoped>
.content
  font-size 16px
  line-height 35px
  letter-spacing 3px
.indent
  text-indent: 2em
.bold
  font-weight bold
</style>
