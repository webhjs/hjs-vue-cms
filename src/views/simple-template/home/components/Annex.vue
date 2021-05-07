<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-03-08 15:21:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <fragment>
    <el-row class="content">
      <el-col :span="2" class="title">
        <slot name="title" />
      </el-col>
      <el-col :span="22">
        <slot name="list" />
      </el-col>
    </el-row>
  </fragment>
</template>
<script>
export default {}
</script>
<style lang="stylus" scoped>
.content
    font-size 16px
    line-height 35px
    letter-spacing 3px
.title
  text-align right
  padding-right 5px
</style>
