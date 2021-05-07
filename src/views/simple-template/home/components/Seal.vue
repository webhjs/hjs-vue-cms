<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-03-07 21:39:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <fragment>
    <div class="seal">
      <div class="date content">
        <slot />
      </div>
    </div>
  </fragment>
</template>
<script>
export default {}
</script>
<style lang="stylus" scoped>
.seal
  height 150px
  display flex
  justify-content flex-end
  align-items flex-end
  .date
    text-align center
.content
  font-size 16px
  line-height 35px
  letter-spacing 3px
</style>
